
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
        Record<string, Record<string, string>>
    >;
    /**
     * Keys interpolation dictionary
     * @description
     * Dictionary with primitive type values.
     * In interpolation expressions, these values will have an advantage over the global ones.
     */
    k?: Record<string, string>;
    /**
     * Values interpolation dictionary
     * @description
     * Dictionary with object type values. Each object is a mini dictionary of grouped variant values.
     * In interpolation expressions, these values will have an advantage over the global ones.
     */
    v?: Record<string, Record<string, string | number>>;
    /**
     * Stylesheet content
     * @description
     * This object will be compiled to CSSStylesheet string content.
     * The conversion rules are defined by the {@link IStyleProcessor | style processor}.
     */
    c: object;
};

/**
 * Style target
 */
export type TStyleTarget = string | TStyleSheetConfig;

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
    units?: Record<string, string>;
    /**
     * Global keys
     */
    keys?: Record<string, string>;
    /**
     * Global sets of keys
     */
    sets?: Record<string, Record<string, string | number>>;
    /**
     * Media queries breakpoints
     */
    mediaBP?: Record<string, string>;
    /**
     * Container queries breakpoints
     */
    containerBP?: Record<string, string>;
}

/**
 * Provider initial content
 */
export type TProviderInitContent = Record<string, TStyleSheetConfig>;

/**
 * Style manager
 * @description
 * Manages CSS stylesheets.
 */
export interface IStyleManager {
    /**
     * Get stylesheet by key
     * @param key - stylesheet key
     * @returns CSS stylesheet if found with this key, otherwise `undefined`
     */
    get(key?: string): CSSStyleSheet | undefined;
    /**
     * Get all stylesheets
     * @returns CSS stylesheet dicitonary
     */
    getAll(): Record<string, CSSStyleSheet>;
    /**
     * Add stylesheet
     * @param key - stylesheet key
     * @param stylesheet - {@link https://developer.mozilla.org/en-US/docs/Web/API/CSSStyleSheet | CSSStylesheet} instance
     * @returns `true` if stylesheet is added, otherwise `undefined`
     */
    add(key: string, stylesheet: CSSStyleSheet): true | void;
    /**
     * Remove stylesheet
     * @param key - stylesheet key
     * @returns `true` if stylesheet is removed, otherwise `undefined`
     */
    remove(key: string): true | void;
    /**
     * Remove all stylesheets
     */
    removeAll(): void;
    /**
     * Pack styles into CSSStyleSheet and add it into stylesheet dictionary
     * @param key - stylesheet key
     * @param styles - stylesheet content string
     * @returns `true` if stylesheet is packed, otherwise `undefined`
     * @example
     * ```ts
     * getProvider().manager.pack('card', '.card{width: auto;height:100%};.card__header{display:flex;height:5rem;}');
     * ```
     */
    pack(key: string, styles: string): boolean | void;
    /**
     * Check if stylesheet exist
     * @param key - stylesheet key
     * @returns boolean flag
     */
    has(key?: string): boolean;
    /**
     * Switch stylesheet on
     * @param key - stylesheet key
     */
    on(key?: string): boolean | undefined;
    /**
     * Switch stylesheet off
     * @param key - stylesheet key
     */
    off(key?: string): boolean | undefined;
    /**
     * Apply stylesheets to style consumer
     * @param consumer - {@link TStyleConsumer | style consumer}
     * @description
     * Explicitly applies the current style sheets to the consumer.
     * You usually don't need to call this method, as the manager automatically updates the styles of registered consumers.
     * @see {@link IStyleManager.registerNode}
     */
    apply(consumer: TStyleConsumer): void;
    /**
     * Register style consumer
     * @param consumer - {@link TStyleConsumer | style consumer}
     * @description
     * A registered consumer will automatically receive up-to-date styles when they are added, modified, or deleted.
     * If the style provider does not contain the `isolated` {@link IStyleProviderParams.isolated | attribute}, the current document will be automatically registered.
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
    /**
     * Modifier value condition
     * @description
     * Usually a pseudo state, a pseudo element or some query (`@container`, `@media`).
     */
    s?: string;
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
) => (
    /**
     * {@link https://en.bem.info/methodology/key-concepts/#element | Element}
     */
    e?: string
) => (
    /**
     * {@link https://en.bem.info/methodology/key-concepts/#modifier | Modifiers}
     */
    m?: string | object
) => Record<string, string>;

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
    getConfigs(): Record<string, TStyleSheetConfig>;
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
     * Use stylesheet
     * @param config - stylesheet config
     * @returns {@link IStyleResolver.attr | attribute resolver}
     * @description
     * The method allows to use stylesheet without having its key.
     * It returns {@link IStyleResolver.attr | attribute resolver}, that can create BEM selectors for config passed.
     */
    use(config: TStyleSheetConfig, key?: string): ReturnType<TResolveAttr>;
    /**
     * Use public stylesheet configs
     * @param configs - stylesheet configs
     */
    usePublic(configs: Record<string, TStyleSheetConfig>): Record<string, ReturnType<TResolveAttr>>;
    /**
     * Use private stylesheet configs
     * @param configs - stylesheet configs
     */
    usePrivate(configs: TStyleSheetConfig[]): ReturnType<TResolveAttr>[];
    /**
     * Resolve stylesheet
     * @param key - stylesheet key
     * @returns BEM attribute resolver for stylesheet
     */
    resolve(key?: string): ReturnType<TResolveAttr>;
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
    get(target?: TStyleTarget): CSSStyleSheet | undefined;
    /**
     * Switch stylesheet on
     * @param target - target stylesheet config or key
     */
    on(target?: TStyleTarget): boolean | undefined;
    /**
     * Switch stylesheet off
     * @param target - target stylesheet config or key
     */
    off(target?: TStyleTarget): boolean | undefined;
    /**
     * Get many CSS stylesheets
     * @param target - target stylesheet configs and/or keys
     */
    getMany(targets?: TStyleTarget[]): (CSSStyleSheet | undefined)[];
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
};

/**
 * Style consumer node
 * @description
 * It can be registered via {@link IStyleManager.registerNode | `StyleManager.registerNode`} method.
 */
export type TStyleConsumer = { adoptedStyleSheets: CSSStyleSheet[] };
