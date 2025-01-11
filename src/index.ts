// types
import {
    IStyleProvider,
    IStyleManager,
    TStyleConfig
} from 'types';
// provider deps
import { Processor } from './_provider/process';
import { Manager } from './_provider/manage';
import { COMPONENT_NAME, getProviderStyles, SETTINGS_ID } from './utils';

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
        processor?: Processor; 
        /**
         * Style manager
         */
        manager?: IStyleManager;
        /**
         * Settings element id
         */
        get settingsId() {
            return this.getAttribute('settingsid') || SETTINGS_ID;
        }
    
        constructor() {
            super();
        }
    
        connectedCallback() {
            const settings = this.getSettings();
            const { params, styles, ext } = settings;
            this.processor = new Processor({
                prefix: this.getAttribute('prefix') || undefined,
                mode: this.getAttribute('mode') || undefined,
                params
            });
            this.manager = new Manager({
                init: getProviderStyles() + this.processor.baseStyles
            });
            this.processStyles(styles, ext);
            if (this.getAttribute('isolated') === null) this.manager.registerNode(document);
        }
    
        /**
         * Get component settings
         */
        getSettings = () => {
            const textContent = document?.getElementById(this.settingsId)?.textContent;
            return textContent ? JSON.parse(textContent) : (props?.config || {});
        }
    
        compileStyleSheet = (key: string, config: TStyleConfig) => {
            const styleString = this.processor?.compile(
                key,
                config
            );
            if (styleString) {
                return this.manager?.pack(key, styleString);
            }
        }
    
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
