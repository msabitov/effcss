// types
import {
    IStyleProvider,
    IStyleManager,
    TStyleConfig,
    IStyleProcessor
} from 'types';
// provider deps
import { createProcessor, TStyleMode } from './_provider/process';
import { createManager } from './_provider/manage';
import { COMPONENT_NAME, PREFIX, SETTINGS_ID } from './utils';

/**
 * Get provider styles
 */
const getProviderStyles = () => `${COMPONENT_NAME} {display: contents;}`;

/**
 * Define style provider
 */
export function defineStyleProvider(props?: {
    name?: string;
    config?: {
        params?: object;
        styles?: object;
        ext?: object;
    }
}) {
    customElements.define(props?.name || COMPONENT_NAME, class extends HTMLElement implements IStyleProvider {
        /**
         * Style processor
         */
        processor?: IStyleProcessor; 
        /**
         * Style manager
         */
        manager?: IStyleManager;

        /**
         * Stylesheet sources
         */
        protected _sources = new Map<TStyleConfig, string>();

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
            const { params, styles, ext } = settings;
            const initkey = this.initkey;
            this.processor = createProcessor({
                prefix: this.prefix,
                mode: this.mode,
                initkey,
                params
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
        getSettings = () => {
            const textContent = document?.getElementById(this.settingsId)?.textContent;
            return textContent ? JSON.parse(textContent) : (props?.config || {});
        }

        /**
         * Compile stylesheet
         * @param key - stylesheet key
         * @param config - stylesheet config
         */
        compileStyleSheet = (key: string, config: TStyleConfig) => {
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
        useStyleSheet = (config: TStyleConfig) => {
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
                if (size && this.processor) {
                    diff.keys().forEach((selector) => {
                        const [initSelector, expSelector] = this.processor.expandSelector(key, selector);
                        this.manager?.expandRule(key, initSelector, expSelector);
                    });
                }
                return size;
            }
        }

        /**
         * Process styles
         * @param styles - stylesheets dictionary
         * @param ext - stylesheets extra selectors
         */
        processStyles = (styles?: Record<string, TStyleConfig>, ext?: Record<string, string[]>) => {
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
    })
}
