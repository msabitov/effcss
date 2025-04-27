import { PROVIDER_TAG_NAME } from '../constants';
import {
    IStyleDispatcher, IStyleProvider,
    TStyleSheetConfig, TStyleTarget
} from '../types';

/**
 * Get style provider component
 * @param root - style provider scope
 * @description
 * Use this function to get the first provider element found in the document
 * @see {@link IStyleProvider}
 */
export const getProvider = (root = window.document, tag = window.__EFFCSS_PARAMS__?.name || PROVIDER_TAG_NAME): IStyleProvider => root?.getElementsByTagName(tag)?.[0] as unknown as IStyleProvider;

/**
 * Use stylesheet
 * @param config - stylesheet config
 * @param provider - style provider
 * @see {@link IStyleProvider}
 */
export const useStyleSheet = (config: TStyleSheetConfig, key?: string, provider: IStyleProvider = getProvider()) => provider.use(config, key);

/**
 * Use public stylehseet configs
 * @param styles - stylesheet configs
 * @param provider - style provider
 * @see {@link IStyleProvider}
 */
export const usePublicStyleSheets = (
    styles: Parameters<IStyleProvider['usePublic']>[0],
    provider: IStyleProvider = getProvider()
) => provider?.usePublic(styles);

/**
 * Use private stylehseet configs
 * @param styles - stylesheet configs
 * @param provider - style provider
 * @see {@link IStyleProvider}
 */
export const usePrivateStyleSheets = (
    styles: Parameters<IStyleProvider['usePrivate']>[0],
    provider: IStyleProvider = getProvider()
) => provider?.usePrivate(styles);

/**
 * Resolve stylesheet
 * @param key stylesheet key
 * @param provider - style provider
 * @see {@link IStyleProvider}
 */
export const resolveStyleSheet = (key?: string, provider: IStyleProvider = getProvider()) => provider.resolve(key);

/**
 * Get stylesheet from provider
 * @param key - stylesheet key
 * @param provider - style provider
 * @see {@link IStyleProvider}
 */
export const getStyleSheet = (
    key?: TStyleTarget, provider: IStyleProvider = getProvider()
) => provider?.get(key);

/**
 * Get stylesheet from provider
 * @param key - stylesheet key
 * @param provider - style provider
 * @see {@link IStyleProvider}
 */
export const getManyStyleSheets = (
    key?: TStyleTarget[],
    provider: IStyleProvider = getProvider()
) => provider?.getMany(key);

/**
 * Stringify stylesheet
 * @param key - stylesheet key
 * @param provider - style provider
 * @see {@link IStyleProvider}
 */
export const stringifyOne = (
    key?: TStyleTarget, provider: IStyleProvider = getProvider()
) => [...(getStyleSheet(key, provider)?.cssRules || [])].map((rule) => rule.cssText).join('');

/**
 * Stringify stylesheet
 * @param key - stylesheet key
 * @param provider - style provider
 * @see {@link IStyleProvider}
 */
export const stringifyMany = (key?: TStyleTarget[], provider: IStyleProvider = getProvider()) => [...(getManyStyleSheets(key, provider) || [])].reduce((acc, item) => acc + [...(item?.cssRules || [])].map((rule) => rule.cssText).join(''), '');

/**
 * Get rules count for stylesheet
 * @param key - stylesheet key
 * @param provider - style provider
 * @see {@link IStyleProvider}
 */
export const measureOne = (key: string, provider: IStyleProvider = getProvider()): number => {
    function getCount(cssRules?: CSSRuleList): number {
        if (!cssRules) return 0;
        return cssRules.length + [...cssRules].reduce((acc, rule) => {
            const rules = rule?.cssRules as (CSSRuleList | undefined);
            return acc + getCount(rules);
        }, 0);
    }
    return getCount(getStyleSheet(key, provider)?.cssRules);
}

/**
 * Get rules count for stylesheet
 * @param key - stylesheet key
 * @param provider - style provider
 * @see {@link IStyleProvider}
 */
export const measureMany = (keys: string[], provider: IStyleProvider = getProvider()): number => keys.reduce((
    acc, key
) => acc + measureOne(key, provider), 0);

interface IStyleDispatcherParams {
    root?: Document;
    tag?: string;
}

/**
 * Basic class for manipulating stylesheets
 */
class StyleDispatcher implements IStyleDispatcher {
    /**
     * Style provider
     */
    protected _provider: IStyleProvider;

    constructor(params?: IStyleDispatcherParams) {
        const { root, tag } = (params || {});
        this._provider = getProvider(root, tag);
    }

    /**
     * Use stylesheet
     * @param config - stylesheet config
     * @see {@link IStyleProvider}
     */
    use: IStyleProvider['use'] = (...args) => this._provider.use(...args);

    /**
     * Use public stylesheet configs
     * @param styles - stylesheet configs
     * @see {@link IStyleProvider}
     */
    usePublic: IStyleProvider['usePublic'] = (styles) => this._provider.usePublic(styles);

    /**
     * Use private stylesheet configs
     * @param styles - stylesheet configs
     * @see {@link IStyleProvider}
     */
    usePrivate: IStyleProvider['usePrivate'] = (styles) => this._provider.usePrivate(styles);

    /**
     * Resolve stylesheet
     * @param key - stylesheet key
     * @see {@link IStyleProvider}
     */
    resolve: IStyleProvider['resolve'] = (target) => this._provider.resolve(target);
}

/**
 * Create style dispatcher
 * @param params - dispatcher params
 */
export function createDispatcher(params?: IStyleDispatcherParams) {
    return new StyleDispatcher(params);
}
