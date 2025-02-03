// types
import {
    IStyleProvider,
    IStyleManager,
    TStyleSheetConfig,
    IStyleProcessor,
    IStyleConfig,
    TStyleMode
} from './types';
// provider
import { createProcessor } from './_provider/process';
import { createManager } from './_provider/manage';
// utils
import { COMPONENT_NAME, PREFIX, SETTINGS_ID } from './utils';

/**
 * Get provider styles
 */
const getProviderStyles = () => `${COMPONENT_NAME} {display: contents;}`;

/**
 * Create {@link IStyleProcessor | style processor}
 */
export const createStyleProcessor = createProcessor;

/**
 * Create {@link IStyleManager | style manager}
 */
export const createStyleManager = createManager;

/**
 * Define style provider as custom element
 */
export function defineStyleProvider(props?: {
    /**
     * Element name
     * @defaultValue style-provider
     */
    name?: string;
    /**
     * Style config
     * @description
     * Will be used for initial stylesheets generation
     */
    config?: IStyleConfig;
}) {
    customElements.define(props?.name || COMPONENT_NAME, class extends HTMLElement implements IStyleProvider {
        /**
         * Style processor
         */
        processor: IStyleProcessor;
        /**
         * Style manager
         */
        manager: IStyleManager;

        /**
         * Stylesheet sources
         */
        protected _sources = new Map<TStyleSheetConfig, string>();

        /**
         * Settings element id
         */
        get settingsId() {
            return this.getAttribute('settingsid') || SETTINGS_ID;
        }

        /**
         * Prefix for keyframes and variables
         */
        get prefix() {
            return this.getAttribute('prefix') || PREFIX;
        }

        /**
         * BEM generation mode
         */
        get mode() {
            return this.getAttribute('mode') as TStyleMode;
        }

        /**
         * Dont register document as dependent
         */
        get isolated() {
            return this.getAttribute('isolated');
        }

        /**
         * Initializer stylesheet key
         */
        get initkey() {
            return this.getAttribute('initkey') ?? 'init';
        }
    
        constructor() {
            super();
        }
    
        connectedCallback() {
            const settings = this.getSettings();
            const { params, styles, ext, units } = settings;
            const initkey = this.initkey;
            this.processor = createProcessor({
                prefix: this.prefix,
                mode: this.mode,
                initkey,
                params,
                units
            });
            this.manager = createManager(initkey ? {
                [initkey]: getProviderStyles() + this.processor.baseStyles
            } : {});
            this.processStyles(styles, ext);
            if (this.isolated === null) this.manager.registerNode(document);
        }
    
        /**
         * Get component settings
         */
        getSettings = (): IStyleConfig => {
            const textContent = document?.getElementById(this.settingsId)?.textContent;
            return textContent ? JSON.parse(textContent) : (props?.config || {});
        }

        /**
         * Compile stylesheet
         * @param key - stylesheet key
         * @param config - stylesheet config
         */
        compileStyleSheet = (key: string, config: TStyleSheetConfig) => {
            const styleString = this.processor?.compile(
                key,
                config
            );
            if (styleString && this.manager?.pack(key, styleString)) {
                this._sources.set(config, key)
                return true;
            }
        }

        /**
         * Use stylesheet
         * @param config - stylesheet config
         * @returns BEM resolver
         */
        useStyleSheet = (config: TStyleSheetConfig) => {
            let key = this._sources.get(config);
            if (!key) {
                key = this.prefix + this._sources.size.toString(36);
                this.compileStyleSheet(key, config) && key;
            };
            return this.processor?.bem.attr(key);
        }

        /**
         * Expand stylesheet
         * @param key - stylesheet key
         * @param selectors - expanded selectors
         */
        expandStyleSheet = (key: string, selectors: string[]) => {
            const expanded = this.manager?.getExpandedSelectors(key);
            if (this.processor && expanded) {
                const next = new Set(selectors);
                const diff = next.difference(expanded);
                const size = diff.size;
                if (size && this.processor.expandSelector) {
                    const expand = this.processor.expandSelector;
                    diff.keys().forEach((selector) => {
                        const [initSelector, expSelector] = expand(key, selector);
                        this.manager.expandRule(key, initSelector, expSelector);
                    });
                    return size;
                }
            }
        }

        /**
         * Process styles
         * @param styles - stylesheets dictionary
         * @param ext - stylesheets extra selectors
         */
        processStyles = (styles?: Record<string, TStyleSheetConfig>, ext?: Record<string, string[]>) => {
            if (styles) {
                for (let key in styles) {
                    const styleConfig = styles[key];
                    this.compileStyleSheet(key, styleConfig);
                }
            }
            if (ext) {
                for (let key in ext) {
                    const extConfig = ext[key];
                    this.expandStyleSheet(key, extConfig);
                }
            }
            return true;
        }

        /**
         * Resolve styles
         * @param key - stylesheet key
         */
        resolveStyleSheet = (key: string) => {
            return this.processor.bem.attr(key);
        }
    })
}
