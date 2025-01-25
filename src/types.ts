/**
 * Style config
 * @description
 * Config which is used as initial settings for the {@link IStyleProvider | style provider}.
 */
export interface IStyleConfig {
    /**
     * Global params
     */
    params?: TDisplayModeValues;
    /**
     * Stylesheets` configs
     */
    styles?: Record<string, TStyleSheetConfig>;
    /**
     * Stylesheets` extra rules
     */
    ext?: Record<string, string[]>;
}

/**
 * Style manager
 * @description
 * Class that manages CSS stylesheets. 
 * You usually don't need to use it directly, as it is contained in the {@link IStyleProvider.manager | style provider}.
 */
export interface IStyleManager {
    /**
     * Get stylesheet by key
     * @param key - stylesheet key
     * @returns CSS stylesheet if found with this key, otherwise `undefined`
     */
    get(key: string): CSSStyleSheet | undefined;
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
     * Caches CSS rules in the special dictionary so that they can be expanded.
     * @param key - stylesheet key
     * @param styleSheet - {@link https://developer.mozilla.org/en-US/docs/Web/API/CSSStyleSheet | CSSStylesheet} instance
     */
    cacheRules: (key: string, stylesheet: CSSStyleSheet) => void;
    /**
     * Get expanded selectors by stylesheet key
     * @param key - stylesheet key
     * @returns expanded selectors Set
     */
    getExpandedSelectors: (key: string) => Set<string>;
    /**
     * Expand existing CSS rule
     * @param key - stylesheet key
     * @param init - initial selector
     * @param exp - expanded selector
     * @returns `true` if rule is expanded, otherwise `undefined`
     */
    expandRule: (key: string, init: string, exp: string) => true | void;
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
     * @example
     * ```ts
     * // register web component shadow root as consumer
     * const shadow = this.attachShadow({mode: 'open'});
     * getProvider().manager.registerNode(shadow);
     * ```
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
type TGetBEMSelector = (params: {
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
type TGetBEMAttr = (
    /**
     * {@link https://en.bem.info/methodology/key-concepts/#block | Block}
     */
    b: string
) => (
    /**
     * {@link https://en.bem.info/methodology/key-concepts/#element | Element}
     */
    e?: string
) => (
    /**
     * {@link https://en.bem.info/methodology/key-concepts/#modifier | Modifiers}
     */
    m?: string
) => Record<string, string>;

/**
 * {@link BEM | https://en.bem.info/methodology/} resolver
 * @description
 * Resolver object allows to create selectors/attribute by passed parts.
 */
export interface IBEMResolver {
    /**
     * Selector resolver
     */
    selector: TGetBEMSelector;
    /**
     * Attribute resolver
     */
    attr: TGetBEMAttr;
}

/**
 * Style processor
 * @description
 * Class that converts style object to CSSStylesheet string content
 * You usually don't need to use it directly, as it is contained in the {@link IStyleProvider.processor | style provider}.
 */
export interface IStyleProcessor {
    /**
     * Base styles
     * @description
     * Contains base styles created in the constructor that define global variables and display modes.
     */
    baseStyles: string;
    /**
     * BEM resolver
     * @description
     * Allows to get BEM selectors/attributes by passed parts
     */
    bem: IBEMResolver;
    /**
     * Create expanded selector with state
     * @param b
     * @param selector
     */
    expandSelector(b: string, selector: string): [string, string];
    /**
     * Compile style config to CSS stylesheet text content
     * @param b - block key
     * @param config - stylesheet config
     */
    compile(b: string, config: TStyleSheetConfig): string;
}

/**
 * Style provider
 * @description
 * Basic interface for style provider component.
 */
export interface IStyleProvider {
    /**
     * {@link IStyleManager | Style manager}
     */
    manager?: IStyleManager;
    /**
     * {@link IStyleProcessor | Style processor}
     */
    processor?: IStyleProcessor;

    /**
     * Use stylesheet
     * @param config - stylesheet config
     * @returns {@link IBEMResolver.attr | attribute resolver}
     * @description
     * The method allows to use stylesheet without having its key.
     * It returns {@link IBEMResolver.attr | attribute resolver}, that can create BEM selectors for config passed.
     */
    useStyleSheet(config: TStyleSheetConfig): ReturnType<IBEMResolver['attr']> | void;

    /**
     * Compile stylesheet
     * @key - stylesheet key
     * @config - stylesheet config
     * @returns `true` if stylesheet compiled, otherwise `undefined`
     */
    compileStyleSheet(key: string, config: TStyleSheetConfig): boolean | void;

    /**
     * Expand stylesheet
     * @param key - stylesheet key
     * @param selectors - stylesheet extra selectors
     * @returns processed rules count if stylesheet expanded, otherwise `undefined`
     */
    expandStyleSheet(key: string, selectors: string[]): number | undefined;

    /**
     * Process configs
     * @param styles - stylesheet dictionary
     * @param ext - extra rules dictionary
     */
    processStyles(styles?: Record<string, TStyleSheetConfig>, ext?: Record<string, string[]>): void;
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
 * Display mode values
 * @description
 * The display mode allows you to override global values.
 * The required mode is root.
 * Other display modes can only override values from `root`, but not set their own.
 */
export type TDisplayModeValues = Record<string, Record<string, Record<string, string | number>>>;

/**
 * Style generation mode for {@link IBEMResolver | BEM selectors}
 * @description
 * `a` - attributes
 * `c` - classes
 */
export type TStyleMode = 'a' | 'c';

/**
 * Style provider attributes
 * @description
 * Attributes that can be set on a component.
 */
export interface IStyleProviderParams {
    /**
     * Settings script element id
     * @description
     * Allows to read the initial settings from a separate element script.
     * If not specified, `effcss` is used.
     */
    settingsid?: string;
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
    isolated?: string | null;
    /**
     * Initializer stylesheet key
     * @description
     * It value controls initializer stylesheet:
     * - if it is equals '', the stylesheet will be omitted;
     * - if it is not specified, the stylesheet will be generated with default `initkey`;
     * - if it is specified as no-empty string, the stylesheet will be generated with specified key.
     */
    initkey?: string | null;
};

/**
 * Style consumer node
 * @description
 * It can be registered via {@link IStyleManager.registerNode | `StyleManager.registerNode`} method.
 */
export type TStyleConsumer = { adoptedStyleSheets: CSSStyleSheet[] };
