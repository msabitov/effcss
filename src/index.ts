// types
import {
    IStyleProvider,
    IStyleManager,
    TStyleSheetConfig,
    IStyleProcessor,
    TProviderSettings,
    TProviderInitContent,
    TStyleMode,
    IStyleResolver,
    IStyleCollector,
    TStyleTarget,
    TResolveAttr
} from './types';
// provider
import { createProcessor } from './_provider/process';
import { createManager } from './_provider/manage';
// constants
import {
    PROVIDER_TAG_NAME, PREFIX,
    SETTINGS_SCRIPT_ID,
    STYLES_SCRIPT_CLS,
    keys as defaultKeys,
    sets as defaultSets,
    themes as defaultThemes,
    rootStyle as defaultRootStyle,
    units as defaultUnits,
    mediaBP as defaultMediaBP,
    containerBP as defaultContainerBP,
} from './constants';
import { createCollector, createResolver } from './utils/common';

const doc = globalThis.document;
const isJSON = (script?: HTMLScriptElement & {effcss: object;}) => script?.getAttribute('type') === 'application/json'

/**
 * Define style provider custom element
 */
export function defineProvider(props: {
    /**
     * Element name
     * @defaultValue style-provider
     */
    name?: string;
    /**
     * Initial styles
     */
    styles?: TProviderInitContent;
    /**
     * Provider config
     * @description
     * Will be used for initial stylesheets generation
     */
    settings?: TProviderSettings;
} = {}): boolean {
    const {
        name = PROVIDER_TAG_NAME,
        styles = {},
        settings = {}
    } = props;

    const custom = globalThis.customElements;
    if (custom?.get(name)) return false;
    else {
        custom.define(name, class extends HTMLElement implements IStyleProvider {
            // properties

            /**
             * Initial stylesheet config
             */
            protected _mainConfig: TStyleSheetConfig;
            /**
             * Theme variables
             */
            protected _themeVariables: Record<string, Record<string, string | number>>;
            protected _dict: {
                sets: Record<string, Record<string, string | number>>;
                keys: Record<string, string | number>;
            };
            /**
             * Style processor
             */
            protected _processor: IStyleProcessor;
            /**
             * Style manager
             */
            protected _manager: IStyleManager;
            /**
             * Selector resolver
             */
            protected _resolver: IStyleResolver;
            /**
             * Stylesheets collection
             */
            protected _collector: IStyleCollector;

            // computed

            /**
             * Prefix for keyframes and variables
             */
            get prefix() {
                return this.getAttribute('prefix') || PREFIX;
            }
            /**
             * Selector generation mode
             */
            get mode(): TStyleMode {
                return (this.getAttribute('mode') || 'a') as TStyleMode;
            }
            /**
             * Dont register document as dependent
             */
            get isolated() {
                return this.getAttribute('isolated') !== null;
            }
            /**
             * Use settings script as styles from server-side rendering
             */
            get hydrate() {
                return this.getAttribute('hydrate') !== null;
            }
            /**
             * Settings script selector
             */
            get _settingsSelector() {
                return '#' + (this.getAttribute('settingsid') || SETTINGS_SCRIPT_ID);
            }
            /**
             * Initial style script selector
             */
            get _initSelector() {
                return '.' + (this.getAttribute('initcls') || STYLES_SCRIPT_CLS);
            }

            /**
             * Get component settings
             */
            get settingsContent(): TProviderSettings {
                const script = doc?.querySelector(this._settingsSelector) as HTMLScriptElement & {effcss: TProviderSettings;};
                let content;
                if (isJSON(script)) content = script?.textContent && JSON.parse(script?.textContent);
                else if (script) content = script?.effcss;
                else content = settings;
                return content || {};
            }

            /**
             * Get init style configs
             */
            get initContent(): TProviderInitContent {
                const initScripts = doc.querySelectorAll(this._initSelector) as NodeListOf<HTMLScriptElement & {effcss: Record<string, TStyleSheetConfig>;}>;
                let content: Record<string, TStyleSheetConfig> = styles || {};
                initScripts.forEach((script) => {
                    let scriptContent: Record<string, TStyleSheetConfig>;
                    if (isJSON(script)) scriptContent = script?.textContent && JSON.parse(script?.textContent);
                    else scriptContent = script?.effcss;
                    content = {...content, ...(scriptContent || {})};
                });
                return content;
            }

            /**
             * Get collected style configs
             */
            get configs(): ReturnType<IStyleCollector['getConfigs']> {
                return this._collector.getConfigs();
            }

            constructor() {
                super();
            }

            protected _setState = () => {
                const {
                    units, keys, sets,
                    mediaBP = defaultMediaBP, containerBP = defaultContainerBP,
                    rootStyle = defaultRootStyle, themes = defaultThemes
                } = this.settingsContent;

                // merged values
                const settingsUnits = {...defaultUnits, ...(units || {})};
                const settingsKeys = {...defaultKeys, ...(keys || {})};
                const settingsSets = {...defaultSets };
                if (sets) Object.entries(sets).forEach(([setKey, setVal]) => settingsSets[setKey] = {...setVal});
                const themeEntries = Object.entries(themes);

                // apply units
                if (settingsUnits) {
                    for (const itemKey in settingsUnits) {
                        settingsSets[itemKey] = settingsSets[itemKey] && Object.fromEntries(
                            Object.entries(settingsSets[itemKey]).map(([k, v]) => [k, settingsUnits[itemKey].replace('{1}', '' + v)])
                        );
                    }
                }

                // apply media breakpoints
                if (mediaBP) {
                    Object.entries(mediaBP).forEach(([key, val]) => {
                        settingsKeys[`min_${key}_`] = `@media (min-width:${val})`;
                        settingsKeys[`max_${key}_`] = `@media (max-width:${val})`;
                    });
                }

                // apply container breakpoints
                if (containerBP) {
                    Object.entries(containerBP).forEach(([key, val]) => {
                        settingsKeys[`cmin_${key}_`] = `@container (min-width:${val})`;
                        settingsKeys[`cmax_${key}_`] = `@container (max-width:${val})`;
                    });
                }

                const rootVars: Record<string, string | number> = {};
                const themeVars: Record<string, Record<string, string | number>> = {};

                // create vars for themes
                if (themes && settingsSets) {
                    themeEntries.forEach(([themeKey, themeVal]) => {
                        const themeSets: Record<string, string | number> = {};
                        Object.entries(themeVal).forEach(([setKey, setVal]) => {
                            // set value loop
                            Object.entries(setVal).forEach(([variantKey, variantVal]) => {
                                // global vars should have name prefix
                                const varName = this._resolver.varName(this.prefix, setKey, variantKey);
                                if (settingsUnits[setKey]) themeSets[varName] = settingsUnits[setKey].replace('{1}', '' + variantVal);
                                else themeSets[varName] = variantVal;
                                // create root variables
                                if (!rootVars[varName]) {
                                    rootVars[varName] = settingsSets[setKey]?.[variantKey] || 'unset';
                                    if (!settingsSets[setKey]) settingsSets[setKey] = {};
                                    settingsSets[setKey][variantKey] = `var(${varName})`;
                                }
                            })
                            
                        })
                        themeVars[themeKey] = themeSets;
                    })
                };

                // save dictionaries
                this._dict = {
                    sets: settingsSets, keys: settingsKeys
                };
                // save init stylesheet config
                this._mainConfig = {
                    c: {
                        [name]: {
                            display: 'contents'
                        },
                        _theme: themeVars,
                        $$: Object.assign(rootVars, rootStyle),
                        ...(themeVars?.dark ? {
                            $$dark: {
                                $$: themeVars.dark
                            }} : {}),
                        ...(themeVars?.light ? {
                            $$light: {
                                $$: themeVars.light
                            }} : {}),
                    }
                };
            }

            connectedCallback() {
                // prepare resolver
                this._resolver = createResolver({
                    mode: this.mode,
                });
                // init state
                this._setState();
                const initContent = this.initContent;
                const prefix = this.prefix;
                // prepare collector
                this._collector = createCollector({
                    hydrate: this.hydrate,
                    prefix,
                    initContent
                });
                // prepare processor
                this._processor = createProcessor({
                    sets: this._dict.sets, keys: this._dict.keys, resolver: this._resolver
                });
                // prepare manager
                this._manager = createManager();
                // use main config
                this.use(this._mainConfig);
                // process init content
                this.usePublic(initContent);
                // register document
                if (doc && !this.isolated) this._manager.registerNode(doc);
            }

            // public methods

            /**
             * Use stylesheet config
             * @param config - stylesheet config
             * @returns BEM resolver
             */
            use = (config: TStyleSheetConfig, key?: string) => {
                let k = this._collector.use(config, key);
                if (this._manager && !this._manager.has(key)) this._manager.pack(k, this.css(
                    config,
                    k
                ));
                return this.resolve(k);
            }

            /**
             * Alter stylesheet with merged config
             * @param target - target stylesheet config or key
             * @param next - next stylesheet config, that will be merged with previous
             * @description Be carefull, it mutates the contents of the original config, but not its ref.
             */
            alter = (target: TStyleTarget, next: TStyleSheetConfig) => {
                let key;
                if (typeof target === 'string') key = target;
                else key = this._collector.getKey(target);
                if (key) {
                    const config = this._collector.mutate(key, next);
                    this._manager.replace(key, this.css(
                        config,
                        key
                    ));
                }
                return this.resolve(key);
            }

            /**
             * Use public stylesheet configs
             * @param configs - stylesheet configs
             */
            usePublic: IStyleProvider['usePublic'] = (styles) => {
                return Object.fromEntries(Object.entries(styles).map(([key, config]) => {
                    return [key, this.use(config, key)];
                }));
            }

            /**
             * Use private stylesheet configs
             * @param configs - stylesheet configs
             */
            usePrivate: IStyleProvider['usePrivate'] = (styles) => {
                return styles.map((config) => {
                    return this.use(config);
                });
            }

            /**
             * Prepare CSS from config
             * @param config - stylesheet config
             * @param key - stylesheet key
             */
            css = (config: TStyleSheetConfig, key: string) => {
                return this._processor?.compile(
                    key,
                    config
                );
            }

            /**
             * Check if stylesheet is on
             * @param param - stylesheet config or key
             */
            status = (param: TStyleTarget) => {
                let source;
                if (typeof param === 'string') source = param;
                else source = this._collector.getKey(param);
                return !!source && this._manager.status(source);
            }

            /**
             * Switch stylesheet on
             * @param param - stylesheet config or key
             */
            on = (param: TStyleTarget) => {
                let source;
                if (typeof param === 'string') source = param;
                else source = this._collector.getKey(param);
                return source ? this._manager.on(source) : undefined;
            }

            /**
             * Switch stylesheet off
             * @param param - stylesheet config or key
             */
            off = (param: TStyleTarget) => {
                let source;
                if (typeof param === 'string') source = param;
                else source = this._collector.getKey(param);
                return source ? this._manager.off(source) : undefined;
            }

            /**
             * Get stylesheet
             * @param target - stylesheet config or key
             */
            get = (target: TStyleTarget = this._mainConfig) => {
                let resTarget;
                if (typeof target === 'object') resTarget = this._collector.getKey(target);
                else resTarget = target;
                return this._manager.get(resTarget);
            }

            /**
             * Get stylesheets
             * @param targets - stylesheet configs or keys
             */
            getMany = (targets: TStyleTarget[] = this._collector.getKeys()) => {
                return targets.map((target) => this.get(target));
            }

            /**
             * Resolve styles
             * @param key - stylesheet key
             */
            resolve = (key?: string): ReturnType<TResolveAttr> => this._resolver.attr(key || this._collector.getKey(this._mainConfig));
        });
        return true;
    }
}
