import { IStyleConfig, IStyleDispatcher, IStyleProvider, TStyleSheetConfig } from './types';

/**
 * Prefix which will be used for autogenerated
 * - variable names;
 * - keyframes names;
 * - stylesheet keys.
 */
export const PREFIX = 'eff';

/**
 * Id for special script element,
 * which contains initial style config
 */
export const SETTINGS_ID = 'effcss';

/**
 * Name of the custom style provider element
 */
export const COMPONENT_NAME = 'style-provider';

/**
 * Create settings script element
 * @param settings - settings object
 * @param params - params for settings element
 * @see {@link IStyleConfig}
 */
export const createSettingsElement = (settings: IStyleConfig, params?: {
    /**
     * Settings element id
     * @defaultValue
     * @see {@link SETTINGS_ID}
     */
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
 * @param settings - settings object
 * @param params - params for settings element
 * @see {@link IStyleConfig}
 */
export const createSettingsHTML = (settings: IStyleConfig, params?: {
    /**
     * Settings element id
     * @defaultValue
     * @see {@link SETTINGS_ID}
     */
    id: string;
}): string => {
    const content = JSON.stringify(settings);
    const id = params?.id || SETTINGS_ID;
    return `<script id="${id}" type="application/json">${content}</script>`;
}

/**
 * Get style provider component
 * @param root - style provider scope
 * @description
 * Use this function to get the first provider element found in the document
 * @see {@link IStyleProvider}
 */
export const getProvider = (root = document): IStyleProvider => root.getElementsByTagName('style-provider')?.[0] as unknown as IStyleProvider;

/**
 * Compile stylesheet
 * @param key - stylesheet key
 * @param config - stylesheet config
 * @param provider - style provider
 * @see {@link IStyleProvider}
 */
export const compileStyleSheet = (key: string, config: TStyleSheetConfig, provider: IStyleProvider = getProvider()) => provider.compileStyleSheet(key, config);

/**
 * Use stylesheet
 * @param config - stylesheet config
 * @param provider - style provider
 * @see {@link IStyleProvider}
 */
export const useStyleSheet = (config: TStyleSheetConfig, provider: IStyleProvider = getProvider()) => provider.useStyleSheet(config);

/**
 * Expand stylesheet
 * @param key - stylesheet key
 * @param config - stylesheet config
 * @param provider - style provider
 * @see {@link IStyleProvider}
 */
export const expandStyleSheet = (key: string, config: string[], provider: IStyleProvider = getProvider()) => provider.expandStyleSheet(key, config);

/**
 * Process styles
 * @param styles - stylesheet dictionary
 * @param ext - extra rules config
 * @param provider - style provider
 * @see {@link IStyleProvider}
 */
export const processStyles = (
    styles?: Record<string, TStyleSheetConfig>,
    ext?: Record<string, string[]>,
    provider: IStyleProvider = getProvider()) => provider.processStyles(styles, ext);

/**
 * Get stylesheet from provider
 * @param key - stylesheet key
 * @param provider - style provider
 * @see {@link IStyleProvider}
 */
export const getStyleSheet = (key: string, provider: IStyleProvider = getProvider()) => provider?.manager?.get(key);

/**
 * Add stylesheet to provider
 * @param key - stylesheet key
 * @param provider - style provider
 * @see {@link IStyleProvider}
 */
export const addStyleSheet = (key: string, stylesheet: CSSStyleSheet, provider: IStyleProvider = getProvider()) => provider?.manager?.add(key, stylesheet);

/**
 * Remove stylesheet from provider
 * @param key - stylesheet key
 * @param provider - style provider
 * @see {@link IStyleProvider}
 */
export const removeStyleSheet = (key: string, provider: IStyleProvider = getProvider()) => provider?.manager?.remove(key);

/**
 * Stringify stylesheet
 * @param key - stylesheet key
 * @param provider - style provider
 * @see {@link IStyleProvider}
 */
export const stringifyStyleSheet = (key: string, provider: IStyleProvider = getProvider()) => [...(getStyleSheet(key, provider)?.cssRules || [])].map((rule) => rule.cssText).join('');

/**
 * Get all stylesheets
 * @param provider - style provider
 * @see {@link IStyleProvider}
 */
export const stringifyAllStyles = (provider: IStyleProvider = getProvider()) => Object.keys(provider?.manager?.getAll() || {}).map((key) => stringifyStyleSheet(key, provider)).join('');

/**
 * Get rules count for stylesheet
 * @param key - stylesheet key
 * @param provider - style provider
 * @see {@link IStyleProvider}
 */
export const getRulesCount = (key: string, provider: IStyleProvider = getProvider()): number => getStyleSheet(key, provider)?.cssRules?.length || 0;

/**
 * Get total rules count
 * @param provider - style provider
 * @see {@link IStyleProvider}
 */
export const getTotalRulesCount = (provider: IStyleProvider = getProvider()) =>
    Object.keys(provider?.manager?.getAll() || {}).reduce((acc, key) => acc + getRulesCount(key, provider), 0);

/**
 * Change object [Symbol.toPrimitive] method
 * @param params - object which should be able to convert to a string
 */
export const convertable = (params: Record<string | typeof Symbol.toPrimitive, string | number | Function>) => {
    params[Symbol.toPrimitive] = function(){ return Object.entries(this).map((val) => val.join('-')).join(' ')};
    return params;
}

/**
 * Basic class for manipulating stylesheets
 */
export class StyleDispatcher implements IStyleDispatcher {
    /**
     * Dispatcher root element
     * @description
     * Scope where style provider will be searched for
     */
    root: Document = document;

    /**
     * Style provider
     */
    provider: IStyleProvider;

    construstor(root?: Document) {
        if (root) this.root = root;
        this.provider = getProvider(this.root);
    }

    /**
     * Use stylesheet
     * @param config - stylesheet config
     * @see {@link useStyleSheet}
     */
    use = (config: TStyleSheetConfig) => useStyleSheet(config, this.provider);

    /**
     * Compile stylesheet
     * @param key - stylesheet key
     * @param config - stylesheet config
     * @see {@link compileStyleSheet}
     */
    compile = (key: string, config: TStyleSheetConfig) => compileStyleSheet(key, config, this.provider);

    /**
     * Expand stylesheet
     * @param key - stylesheet key
     * @param config - stylesheet config
     * @see {@link expandStyleSheet}
     */
    expand = (key: string, config: string[]) => expandStyleSheet(key, config, this.provider);

    /**
     * Process styles
     * @param styles - stylesheet dictionary
     * @param ext - stylesheet extra rules
     * @see {@link processStyles}
     */
    process = (
        styles?: Record<string, TStyleSheetConfig>,
        ext?: Record<string, string[]>
    ) => processStyles(styles, ext, this.provider);
}
