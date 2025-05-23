type TOptBool = boolean | undefined;
type TOptSheet = CSSStyleSheet | undefined;
type TStrDict = Record<string, string>;
type TDict = Record<string, string | number>;
type TMetaDict = Record<string, TDict>;

/**
 * Stylesheet config
 * @description
 * Contains descriptions of rules, variables, keyframes, and interpolation dictionaries used within the stylesheet.
 */
export type TStyleSheetConfig = {
    /**
     * CSS variables
     * @see {@link TVariable}
     */
    _?: Record<
        string,
        TVariable
    >;
    /**
     * Keyframes
     * @see {@link https://developer.mozilla.org/en-US/docs/Web/CSS/@keyframes}
     */
    kf?: Record<
        string,
        TMetaDict
    >;
    /**
     * Keys dictionary
     * @description
     * Dictionary with primitive type values.
     * In interpolation expressions, these values will have an advantage over the global ones.
     */
    k?: TStrDict;
    /**
     * Values dictionary
     * @description
     * Dictionary with object values.
     * In interpolation expressions, these values will have an advantage over the global ones.
     */
    v?: TMetaDict;
    /**
     * Stylesheet content
     * @description
     * This object will be compiled to CSSStylesheet string content.
     * The conversion rules are defined by the {@link IStyleProcessor | style processor}.
     */
    c: object;
};

/**
 * Dictionary of stylesheet configs
 */
export type TConfigDict = Record<string, TStyleSheetConfig>;
/**
 * Array of stylesheet configs
 */
export type TConfigArray = TStyleSheetConfig[];

/**
 * Style target
 */
export type TStyleTarget = string | TStyleSheetConfig;

export type TOneOrManyTargets = TStyleTarget | TStyleTarget[];

/**
 * Provider settings
 */
export type TProviderSettings = {
    /**
     * Style themes
     */
    themes?: TThemes;
    /**
     * Root styles
     */
    rootStyle?: object;
    /**
     * Global params units
     */
    units?: TStrDict;
    /**
     * Global keys
     */
    keys?: TStrDict;
    /**
     * Global sets of keys
     */
    sets?: TMetaDict;
    /**
     * Media queries breakpoints
     */
    mediaBP?: TStrDict;
    /**
     * Container queries breakpoints
     */
    containerBP?: TStrDict;
}

/**
 * Provider initial content
 */
export type TProviderInitContent = TConfigDict;

/**
 * Style manager
 * @description
 * Manages CSS stylesheets.
 */
export interface IStyleManager {
    /**
     * Get stylesheet by key
     * @param key - stylesheet key
     */
    get(key?: string): TOptSheet;
    /**
     * Get index of stylesheet
     * @param styleSheet - CSS stylesheet
     */
    getIndex(styleSheet: CSSStyleSheet): number;
    /**
     * Get all stylesheets dictionary
     */
    getAll(): Record<string, CSSStyleSheet>;
    /**
     * Add stylesheet
     * @param key - stylesheet key
     * @param stylesheet - {@link https://developer.mozilla.org/en-US/docs/Web/API/CSSStyleSheet | CSSStylesheet} instance
     * @returns `true` if stylesheet is added
     */
    add(key: string, stylesheet: CSSStyleSheet): TOptBool;
    /**
     * Replace stylesheet content
     * @param key - stylesheet key
     * @param styles - stylesheet content string
     * @returns `true` if stylesheet is replaced
     */
    replace(key: string, styles: string): TOptBool;
    /**
     * Remove stylesheet
     * @param key - stylesheet key
     * @returns `true` if stylesheet is removed
     */
    remove(key: string): TOptBool;
    /**
     * Remove all stylesheets
     */
    removeAll(): void;
    /**
     * Pack styles into CSSStyleSheet and add it into stylesheet dictionary
     * @param key - stylesheet key
     * @param styles - stylesheet content string
     * @returns `true` if stylesheet is packed
     * @example
     * ```ts
     * getProvider().manager.pack('card', '.card{width: auto;height:100%};.card__header{display:flex;height:5rem;}');
     * ```
     */
    pack(key: string, styles: string): TOptBool;
    /**
     * Check if stylesheet exist
     * @param key - stylesheet key
     */
    has(key?: string): boolean;
    /**
     * Is stylesheet on
     * @param key - stylesheet key
     */
    status(key?: string): boolean;
    /**
     * Switch stylesheet on
     * @param key - stylesheet key
     */
    on(key?: string | (string | undefined)[]): TOptBool;
    /**
     * Switch stylesheet off
     * @param key - stylesheet key
     */
    off(key?: string | (string | undefined)[]): TOptBool;
    /**
     * Apply stylesheets to style consumer
     * @param consumer - {@link TStyleConsumer | style consumer}
     * @description
     * Explicitly applies the current style sheets to the consumer.
     * You usually don't need to call this method, as the manager automatically updates the styles of registered consumers.
     */
    apply(consumer: TStyleConsumer): void;
    /**
     * Register style consumer
     * @param consumer - {@link TStyleConsumer | style consumer}
     * @description
     * A registered consumer will automatically receive up-to-date styles when they are added, modified, or deleted.
     * If the style provider does not contain the `isolated`, the current document will be automatically registered.
     */
    registerNode(consumer: TStyleConsumer): void;
    /**
     * Unregister style consumer
     * @param consumer - {@link TStyleConsumer | style consumer}
     */
    unregisterNode(consumer: TStyleConsumer): void;
    /**
     * Apply style changes to dependent nodes
     * @description
     * You usually don't need to use this method.
     * If you update the stylesheets through the style provider's methods,
     * it will automatically apply them to all consumers.
     * @see {@link IStyleProvider}
     */
    notify(): void;
}

/**
 * BEM selector resolver
 * @description
 * Creates a selector from the passed parts.
 * @returns BEM selector string
 */
export type TResolveSelector = (params: {
    /**
     * {@link https://en.bem.info/methodology/key-concepts/#block | Block}
     */
    b: string;
    /**
     * {@link https://en.bem.info/methodology/key-concepts/#element | Element}
     */
    e?: string;
    /**
     * {@link https://en.bem.info/methodology/key-concepts/#modifier | Modifier}
     */
    m?: string;
    /**
     * {@link https://en.bem.info/methodology/key-concepts/#modifier | Modifier value}
     */
    mv?: string;
}) => string;

/**
 * BEM attribute resolver
 * @description
 * Creates an object containing target attribute with its value.
 * The object content depends on the value of the style provider's `mode` {@link IStyleProviderParams.mode | attribute}.
 * @returns object containing target attribute with its value.
 */
export type TResolveAttr = (
    /**
     * {@link https://en.bem.info/methodology/key-concepts/#block | Block}
     */
    b?: string
) => <E extends string>(
    /**
     * {@link https://en.bem.info/methodology/key-concepts/#element | Element}
     */
    e?: E
) => <M extends Record<string, Record<string, string | number | TOptBool | null>>>(
    /**
     * {@link https://en.bem.info/methodology/key-concepts/#modifier | Modifiers}
     */
    m?: string | Partial<M[NoInfer<E>]>
) => TStrDict;

/**
 * Resolved attributes object
 */
type TResolvedAttr = ReturnType<TResolveAttr>;

/**
 * Style resolver
 * @description
 * Resolves stylesheets' selectors/attributes/identifiers
 */
export interface IStyleResolver {
    /**
     * Selector resolver
     */
    selector: TResolveSelector;
    /**
     * Attribute resolver
     */
    attr: TResolveAttr;
    /**
     * Var name resolver
     */
    varName: (...parts: (string | number)[]) => string;
    /**
     * Keyframes name resolver
     */
    kfName: (...parts: (string | number)[]) => string;
}

/**
 * Stylesheet resolver getter
 */
export type TCreateResolver = (params?: {
    mode?: TStyleMode | null;
}) => IStyleResolver;

/**
 * Style processor
 * @description
 * Converts stylesheet config to CSSStylesheet string content.
 */
export interface IStyleProcessor {
    /**
     * Compile style config to CSS stylesheet text content
     * @param b - block key
     * @param config - stylesheet config
     */
    compile(b: string, config: TStyleSheetConfig): string;
}

/**
 * Style collector
 * @description
 * Collects stylesheet configs and maps them with keys
 */
export interface IStyleCollector {
    /**
     * Collect config
     * @param config - stylesheet config
     * @param key - stylesheet key
     */
    use(config: TStyleSheetConfig, key?: string): string;
    /**
     * Mutates original stylesheet config with new content
     * @param key - stylesheet key
     * @param nextConfig - new stylesheet config
     */
    mutate(key: string, nextConfig: TStyleSheetConfig): TStyleSheetConfig;
    /**
     * Get key of collected config
     * @param config - stylesheet config
     */
    getKey(config: TStyleSheetConfig): string | undefined;
    /**
     * Get all collected keys
     */
    getKeys(): string[];
    /**
     * Get all collected configs
     */
    getConfigs(): TConfigDict;
}

/**
 * Style provider
 * @description
 * Basic interface for style provider component.
 */
export interface IStyleProvider {
    /**
     * Provider initial content
     */
    initContent: TProviderInitContent;
    /**
     * Provider settings
     */
    settingsContent: TProviderSettings;
    /**
     * All collected stylesheet configs
     */
    configs: TConfigDict;
    /**
     * Use stylesheet
     * @param config - stylesheet config
     * @returns {@link IStyleResolver.attr | attribute resolver}
     * @description
     * The method allows to use stylesheet without having its key.
     * It returns {@link IStyleResolver.attr | attribute resolver}, that can create BEM selectors for config passed.
     */
    use(config: TStyleSheetConfig, key?: string): TResolvedAttr;
    /**
     * Alter stylesheet with merged config
     * @param target - target stylesheet config or key
     * @param nextConfig - next stylesheet config, that will be merged with previous
     */
    alter(target: TStyleTarget, nextConfig: TStyleSheetConfig): TResolvedAttr;
    /**
     * Use public stylesheet configs
     * @param configs - stylesheet configs
     */
    usePublic(configs: TConfigDict): Record<string, TResolvedAttr>;
    /**
     * Use private stylesheet configs
     * @param configs - stylesheet configs
     */
    usePrivate(configs: TConfigArray): TResolvedAttr[];
    /**
     * Resolve stylesheet
     * @param key - stylesheet key
     * @returns BEM attribute resolver for stylesheet
     */
    resolve(key?: string): TResolvedAttr;
    /**
     * Prepare CSS from config
     * @param config - stylesheet config
     * @param key - stylesheet key
     */
    css(config: TStyleSheetConfig, key: string): string;
    /**
     * Get CSS stylesheet
     * @param target - target stylesheet config or key
     */
    get(target?: TStyleTarget): TOptSheet;
    /**
     * Switch stylesheet/stylesheets on
     * @param target - target stylesheet config or key
     */
    on(target?: TOneOrManyTargets): TOptBool;
    /**
     * Switch stylesheet/stylesheets off
     * @param target - target stylesheet config or key
     */
    off(target?: TOneOrManyTargets): TOptBool;
    /**
     * Check if stylesheet is on
     * @param target - target stylesheet config or key
     */
    status(target?: TStyleTarget): TOptBool;
    /**
     * Get many CSS stylesheets
     * @param target - target stylesheet configs and/or keys
     */
    getMany(targets?: TStyleTarget[]): TOptSheet[];
    /**
     * Subscribe to style changes
     * @param consumer - styles consumer
     */
    subscribe(consumer: TStyleConsumer): void;
    /**
     * Unsubscribe from styles changes
     * @param consumer - styles consumer
     */
    unsubscribe(consumer: TStyleConsumer): void;
}

/**
 * Style dispatcher
 * @description
 * Dispatches style operations to provider
 */
export interface IStyleDispatcher {
    /**
     * Use stylesheet
     * @see {@link IStyleProvider.use}
     */
    use: IStyleProvider['use'];
    /**
     * Use public stylesheet configs
     * @see {@link IStyleProvider.usePublic}
     */
    usePublic: IStyleProvider['usePublic'];
    /**
     * Use private stylesheet configs
     * @see {@link IStyleProvider.usePrivate}
     */
    usePrivate: IStyleProvider['usePrivate'];
    /**
     * Resolve stylesheet
     * @see {@link IStyleProvider.resolve}
     */
    resolve: IStyleProvider['resolve'];
}

/**
 * Variable type
 * @description
 * `c` - oklch color variable,
 * otherwise simple CSS variable.
 */
export type TVariableType = 'c' | undefined;

/**
 * CSS variable
 * @description
 * Specifies variable format in {@link TStyleSheetConfig | stylesheet config}.
 * Extends {@link https://developer.mozilla.org/en-US/docs/Web/CSS/@property | `@property` rule}.
 */
export type TVariable = {
    /**
     * {@link https://developer.mozilla.org/en-US/docs/Web/CSS/@property/syntax | Syntax}
     */
    syn?: string;
    /**
     * {@link https://developer.mozilla.org/en-US/docs/Web/CSS/@property/initial-value | Initial value}
     */
    ini?: number | string;
    /**
     * {@link https://developer.mozilla.org/en-US/docs/Web/CSS/@property/inherits | Inherits}
     */
    inh?: boolean;
    /**
     * {@link TVariableType | Type}
     */
    typ?: unknown;
    /**
     * Create service variables
     * @description
     * If this variable type use service variables,
     * it will declare them.
     */
    all?: boolean;
};

/**
 * Style themes
 */
export type TThemes = Record<string, Record<string, Record<string, string | number>>>;

/**
 * Style generation mode for {@link IStyleResolver | BEM selectors}
 * @description
 * `a` - attributes
 * `c` - classes
 */
export type TStyleMode = 'a' | 'c';

/**
 * Style provider attributes
 * @description
 * Attributes that can be set on a provider component.
 */
export interface IStyleProviderParams {
    /**
     * Settings script selector
     * @description
     * Allows to read the initial settings from a separate element script.
     * If not specified, `effcss` is used.
     */
    settingsid?: string;
    /**
     * Initial content script selector
     */
    initcls?: string;
    /**
     * Prefix
     * @description
     * Allows to prefix scoped keys with special string.
     * If not specified, `eff` is used.
     */
    prefix?: string | null;
    /**
     * Style generation mode for BEM-selectors
     * @description
     * It only affects the generation of BEM selectors.
     * @see {@link TStyleMode}
     */
    mode?: TStyleMode | null;
    /**
     * Isolated provider
     * @description
     * If specified, provider won`t register document as dependent node
     */
    isolated?: '' | null;
    /**
     * Hydrate initial stylesheets
     */
    hydrate?: '' | null;
    /**
     * Custom event name that fires when styles changes
     * @description
     * Allows you to subscribe to a style change event in the DOM.
     * If not specified, `effcsschanges` is used.
     */
    eventname?: string | null;
};

/**
 * Style consumer node
 * @description
 * It can be registered via {@link IStyleManager.registerNode | `StyleManager.registerNode`} method.
 */
export type TStyleConsumer = { adoptedStyleSheets: CSSStyleSheet[] };

/**
 * Props to define style provider
 */
export interface IDefineProviderProps {
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
}

declare global {
    interface Window {
        __EFFCSS_PARAMS__: IDefineProviderProps;
    }
}
