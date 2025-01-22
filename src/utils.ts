import { IStyleProvider, TStyleConfig } from "types";

export const PREFIX = 'eff';
export const SETTINGS_ID = 'effcss';
export const COMPONENT_NAME = 'style-provider';

/**
 * Create settings script element
 * @param settings
 * @param params
 */
export const createSettingsElement = (settings: object, params?: {
    id: string;
}): Node => {
    const content = JSON.stringify(settings);
    const id = params?.id || SETTINGS_ID;
    const element = document.createElement('script');
    element.id = id;
    element.type = 'application/json';
    element.innerHTML = content;
    return element;
}

/**
 * Create settings HTML string
 * @param settings
 * @param params
 */
export const createSettingsHTML = (settings: object, params?: {
    id: string;
}): string => {
    const content = JSON.stringify(settings);
    const id = params?.id || SETTINGS_ID;
    return `<script id="${id}" type="application/json">${content}</script>`;
}

/**
 * Get provider component
 */
export const getProvider = (root = document): IStyleProvider => root.getElementsByTagName('style-provider')?.[0] as IStyleProvider;

/**
 * Compile stylesheet
 * @param key - stylesheet key
 * @param config - stylesheet config
 * @param provider - style provider
 */
export const compileStyleSheet = (key: string, config: TStyleConfig, provider: IStyleProvider = getProvider()) => provider.compileStyleSheet(key, config);

/**
 * Use stylesheet
 * @param config - stylesheet config
 * @param provider - style provider
 */
export const useStyleSheet = (config: TStyleConfig, provider: IStyleProvider = getProvider()) => provider.useStyleSheet(config);

/**
 * Expand stylesheet
 * @param key - stylesheet key
 * @param config - stylesheet config
 * @param provider - style provider
 */
export const expandStyleSheet = (key: string, config: string[], provider: IStyleProvider = getProvider()) => provider.expandStyleSheet(key, config);

/**
 * Process styles
 * @param styles - styles config
 * @param ext - ext config
 */
export const processStyles = (
    styles?: Record<string, TStyleConfig>,
    ext?: Record<string, string[]>,
    provider: IStyleProvider = getProvider()) => provider.processStyles(styles, ext);

/**
 * Get stylesheet from provider
 * @param key
 */
export const getStyleSheet = (key: string, provider: IStyleProvider = getProvider()) => provider?.manager?.get(key);

/**
 * Add stylesheet to provider
 * @param key
 */
export const addStyleSheet = (key: string, stylesheet: CSSStyleSheet, provider: IStyleProvider = getProvider()) => provider?.manager?.add(key, stylesheet);

/**
 * Remove stylesheet from provider
 * @param key
 */
export const removeStyleSheet = (key: string, provider: IStyleProvider = getProvider()) => provider?.manager?.remove(key);

/**
 * Stringify stylesheet
 * @param key
 * @param provider
 */
export const stringifyStyleSheet = (key: string, provider: IStyleProvider = getProvider()) => [...(getStyleSheet(key, provider)?.cssRules || [])].map((rule) => rule.cssText).join('');

/**
 * Get all stylesheets
 * @param key
 */
export const stringifyAllStyles = (provider: IStyleProvider = getProvider()) => Object.keys(provider?.manager?.getAll() || {}).map((key) => stringifyStyleSheet(key, provider)).join('');

/**
 * Get rules count for stylesheet
 * @param key
 * @param provider
 */
export const getRulesCount = (key: string, provider: IStyleProvider = getProvider()): number => getStyleSheet(key, provider)?.cssRules?.length || 0;

/**
 * Get total rules count
 * @param provider
 */
export const getTotalRulesCount = (provider: IStyleProvider = getProvider()) =>
    Object.keys(provider?.manager?.getAll() || {}).reduce((acc, key) => acc + getRulesCount(key, provider), 0);

export class StyleDispatcher {
    root: Document = document;
    provider?: IStyleProvider;

    construstor(root?: Document) {
        if (root) this.root = root;
        this.provider = getProvider(this.root);
    }

    use = (config: TStyleConfig) => useStyleSheet(config, this.provider);
    compile = (key: string, config: TStyleConfig) => compileStyleSheet(key, config, this.provider);
    expand = (key: string, config: string[]) => expandStyleSheet(key, config, this.provider);
    process = (
        styles?: Record<string, TStyleConfig>,
        ext?: Record<string, string[]>
    ) => processStyles(styles, ext, this.provider);
}
