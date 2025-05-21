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
    TResolveAttr,
    TStyleConsumer,
    IDefineProviderProps,
    TConfigDict,
    TOneOrManyTargets
} from './types';
// provider
import { createProcessor } from './_provider/process';
import { createManager } from './_provider/manage';
// constants
import {
    PROVIDER_TAG_NAME, PREFIX,
    SETTINGS_SCRIPT_ID,
    STYLES_SCRIPT_CLS,
    EVENT_NAME,
    keys as defaultKeys,
    sets as defaultSets,
    themes as defaultThemes,
    rootStyle as defaultRootStyle,
    units as defaultUnits,
    mediaBP as defaultMediaBP,
    containerBP as defaultContainerBP,
} from './constants';
import { createCollector, createResolver } from './utils/common';

const objectEntries = Object.entries;
const isJSON = (script?: HTMLScriptElement & {effcss: object;}) => script?.getAttribute('type') === 'application/json'
const toArray = (params: TOneOrManyTargets) => Array.isArray(params) ? params : [params];

/**
 * Define style provider custom element
 */
export function defineProvider(props: IDefineProviderProps = {}): boolean {
    const {
        name = PROVIDER_TAG_NAME,
        styles = {},
        settings = {}
    } = props;
    const doc = window.document;
    const custom = window.customElements;
    if (custom?.get(name)) return false;
    else {
        custom.define(name, class extends HTMLElement implements IStyleProvider {
            // properties

            /**
             * Initial stylesheet config
             */
            protected _mc: TStyleSheetConfig;
            /**
             * Dictionary
             */
            protected _d: {
                sets: Record<string, Record<string, string | number>>;
                keys: Record<string, string | number>;
            };
            /**
             * Style processor
             */
            protected _p: IStyleProcessor;
            /**
             * Style manager
             */
            protected _m: IStyleManager;
            /**
             * Selector resolver
             */
            protected _r: IStyleResolver;
            /**
             * Stylesheets collection
             */
            protected _c: IStyleCollector;
            /**
             * Notifier
             */
            protected _n: TStyleConsumer;

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
             * Prefix for keyframes and variables
             */
            get eventName() {
                return this.getAttribute('eventname') || EVENT_NAME;
            }

            /**
             * Get component settings
             */
            get settingsContent(): TProviderSettings {
                const script = doc?.querySelector('#' + (this.getAttribute('settingsid') || SETTINGS_SCRIPT_ID)) as HTMLScriptElement & {effcss: TProviderSettings;};
                let content;
                if (isJSON(script)) content = JSON.parse(script?.textContent || '{}');
                else if (script) content = script?.effcss;
                else content = settings;
                return content || {};
            }

            /**
             * Get init style configs
             */
            get initContent(): TProviderInitContent {
                const initScripts = doc.querySelectorAll('.' + (this.getAttribute('initcls') || STYLES_SCRIPT_CLS)) as NodeListOf<HTMLScriptElement & {effcss: TConfigDict;}>;
                let content: TConfigDict = styles || {};
                initScripts.forEach((script) => {
                    let scriptContent: TConfigDict;
                    if (isJSON(script)) scriptContent = JSON.parse(script?.textContent || '{}');
                    else scriptContent = script?.effcss;
                    content = {...content, ...(scriptContent || {})};
                });
                return content;
            }

            /**
             * Get collected style configs
             */
            get configs(): TConfigDict {
                return this._c.getConfigs();
            }

            protected _setState = () => {
                const {
                    units = {}, keys = {}, sets,
                    mediaBP = defaultMediaBP, containerBP = defaultContainerBP,
                    rootStyle = defaultRootStyle, themes = defaultThemes
                } = this.settingsContent;

                // merged values
                const settingsUnits = {...defaultUnits, ...units};
                const settingsKeys = {...defaultKeys, ...keys};
                const settingsSets = {...defaultSets };
                if (sets) objectEntries(sets).forEach(([setKey, setVal]) => settingsSets[setKey] = {...setVal});
                const themeEntries = objectEntries(themes);

                // apply units
                if (settingsUnits) {
                    for (const itemKey in settingsUnits) {
                        settingsSets[itemKey] = settingsSets[itemKey] && Object.fromEntries(
                            objectEntries(settingsSets[itemKey]).map(([k, v]) => [k, settingsUnits[itemKey].replace('{1}', '' + v)])
                        );
                    }
                }

                // apply media breakpoints
                if (mediaBP) {
                    objectEntries(mediaBP).forEach(([key, val]) => {
                        settingsKeys[`min_${key}_`] = `@media (min-width:${val})`;
                        settingsKeys[`max_${key}_`] = `@media (max-width:${val})`;
                    });
                }

                // apply container breakpoints
                if (containerBP) {
                    objectEntries(containerBP).forEach(([key, val]) => {
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
                        objectEntries(themeVal).forEach(([setKey, setVal]) => {
                            // set value loop
                            objectEntries(setVal).forEach(([variantKey, variantVal]) => {
                                // global vars should have name prefix
                                const varName = this._r.varName(this.prefix, setKey, variantKey);
                                if (settingsUnits[setKey]) themeSets[varName] = settingsUnits[setKey].replace('{1}', '' + variantVal);
                                else themeSets[varName] = variantVal as string | number;
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
                this._d = {
                    sets: settingsSets, keys: settingsKeys
                };
                // save init stylesheet config
                this._mc = {
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

            protected _res = (param: TStyleTarget) => typeof param === 'string' ? param : this._c.getKey(param);

            connectedCallback() {
                // prepare resolver
                this._r = createResolver({
                    mode: this.mode,
                });
                // init state
                this._setState();
                const initContent = this.initContent;
                const prefix = this.prefix;
                // prepare collector
                this._c = createCollector({
                    hydrate: this.hydrate,
                    prefix,
                    initContent
                });
                // prepare processor
                this._p = createProcessor({
                    sets: this._d.sets, keys: this._d.keys, resolver: this._r
                });
                // prepare manager
                this._m = createManager();
                const dispatchEvent = (styles: CSSStyleSheet[]) => this.dispatchEvent(
                    new CustomEvent(this.eventName, {
                        detail: { styles },
                        bubbles: true
                    })
                );
                this._n = {
                    set adoptedStyleSheets(styles: CSSStyleSheet[]) {
                        dispatchEvent(styles);
                    }
                };
                // register notifier
                this.subscribe(this._n);
                // use main config
                this.use(this._mc);
                // process init content
                this.usePublic(initContent);
                // register document
                if (doc && !this.isolated) this._m.registerNode(doc);
            }

            // public methods

            /**
             * Use stylesheet config
             * @param config - stylesheet config
             * @returns BEM resolver
             */
            use = (config: TStyleSheetConfig, key?: string) => {
                let k = this._c.use(config, key);
                if (this._m && !this._m.has(key)) this._m.pack(k, this.css(
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
                const key = this._res(target);
                if (key) {
                    const config = this._c.mutate(key, next);
                    this._m.replace(key, this.css(
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
            usePublic: IStyleProvider['usePublic'] = (styles) => Object.fromEntries(
                objectEntries(styles).map(([key, config]) => ([key, this.use(config, key)]))
            );

            /**
             * Use private stylesheet configs
             * @param configs - stylesheet configs
             */
            usePrivate: IStyleProvider['usePrivate'] = (styles) => styles.map((config) => this.use(config));

            /**
             * Prepare CSS from config
             * @param config - stylesheet config
             * @param key - stylesheet key
             */
            css = (config: TStyleSheetConfig, key: string) => this._p?.compile(
                key,
                config
            );

            /**
             * Check if stylesheet is on
             * @param target - stylesheet config or key
             */
            status = (target: TStyleTarget) => {
                const source = this._res(target);
                return !!source && this._m.status(source);
            }

            /**
             * Switch stylesheet on
             * @param param - stylesheet config or key
             */
            on = (params: TOneOrManyTargets) => this._m.on(toArray(params).map(this._res));

            /**
             * Switch stylesheet off
             * @param param - stylesheet config or key
             */
            off = (params: TOneOrManyTargets) => this._m.off(toArray(params).map(this._res));

            /**
             * Get stylesheet
             * @param target - stylesheet config or key
             */
            get = (target: TStyleTarget = this._mc) => this._m.get(this._res(target));

            /**
             * Get stylesheets
             * @param targets - stylesheet configs or keys
             */
            getMany = (targets: TStyleTarget[] = this._c.getKeys()) => targets.map((target) => this.get(target));

            /**
             * Resolve styles
             * @param key - stylesheet key
             */
            resolve = (key?: string): ReturnType<TResolveAttr> => this._r.attr(key || this._c.getKey(this._mc));

            /**
             * Subscribe to style changes
             * @param consumer - styles consumer
             */
            subscribe = (consumer: TStyleConsumer) => this._m.registerNode(consumer);

            /**
             * Unsubscribe from styles changes
             * @param consumer - styles consumer
             */
            unsubscribe = (consumer: TStyleConsumer) => this._m.unregisterNode(consumer);
        });
        window.__EFFCSS_PARAMS__ = {
            name,
            styles,
            settings
        };
        return true;
    }
}
