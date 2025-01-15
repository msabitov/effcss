/**
 * Style manager
 * @description
 * Class that manage CSSStylesheets
 */
export interface IStyleManager {
    /**
     * Get stylesheet
     * @param key - stylesheet key
     */
    get(key: string): CSSStyleSheet | undefined;
    /**
     * Get all stylesheets
     */
    getAll(): Record<string, CSSStyleSheet>;
    /**
     * Add stylesheet
     * @param key - stylesheet key
     * @param stylesheet - CSSStylesheet instance
     */
    add(key: string, stylesheet: CSSStyleSheet): true | void;
    /**
     * Remove sheet
     * @param key - stylesheet key
     */
    remove(key: string): true | void;
    /**
     * Remove all stylesheets
     */
    removeAll(): void;
    /**
     * Pack styles into CSSStyleSheet
     * @param key - stylesheet key
     * @param styles - stylesheet content
     */
    pack(key: string, styles: string): boolean | void;
    /**
     * Cache computed CSS rules
     * @param key
     * @param styleSheet
     */
    cacheRules: (key: string, stylesheet: CSSStyleSheet) => void;
    /**
     * Get expanded selectors
     * @param key
     */
    getExpandedSelectors: (key: string) => Set<string>;
    /**
     * Expand existing CSS rule
     * @param key - stylesheet key
     * @param init - initial selector
     * @param exp - expanded selector
     */
    expandRule: (key: string, init: string, exp: string) => true | void;
    /**
     * Apply stylesheets to node
     * @param root
     */
    apply(root: { adoptedStyleSheets: CSSStyleSheet[] }): void;
    /**
     * Register dependent node
     * @param node
     */
    registerNode(node: { adoptedStyleSheets: CSSStyleSheet[] }): void;
    /**
     * Unregister dependent node
     * @param node
     */
    unregisterNode(node: { adoptedStyleSheets: CSSStyleSheet[] }): void;
    /**
     * Apply style changes to dependent nodes
     */
    notify(): void;
}

/**
 * Style processor
 * @description
 * Class that compiles style object to CSSStylesheet string content
 */
export interface IStyleProcessor {
    /**
     * Basic styles
     */
    baseStyles: string;
    /**
     * Create expanded selector with state
     * @param b
     * @param selector
     */
    expandSelector(b: string, selector: string): [string, string];
    /**
     * Compile style config to CSS stylesheet text content
     * @param b - block key
     * @param styleConfig - style config
     */
    compile(b: string, styleConfig: TStyleConfig): string;
}

export interface IStyleProvider extends HTMLElement {
    manager?: IStyleManager;
    processor?: IStyleProcessor;

    /**
     * Compile sheet
     */
    compileStyleSheet(key: string, config: TStyleConfig): boolean | void;

    /**
     * Expand stylesheet
     * @param key
     * @param selectors 
     */
    expandStyleSheet(key: string, selectors: string[]): number | undefined;

    /**
     * Process configs
     * @param styles
     * @param ext
     */
    processStyles(styles?: Record<string, TStyleConfig>, ext?: Record<string, string[]>): void;
}

/**
 * Variable type
 */
export type TVariable = {
    syn?: string;
    ini?: number | string;
    inh?: boolean;
    typ?: unknown;
} | {
    syn?: string;
    ini?: number | string;
    inh?: boolean;
    typ: 'c';
    all?: boolean;
};

/**
 * Style config
 */
export type TStyleConfig = {
    /**
     * CSS variables config
     */
    _?: Record<
        string,
        TVariable
    >;
    /**
     * Keyframes
     */
    kf?: Record<
        string,
        Record<string, Record<string, string>>
    >;
    /**
     * Keys dictionary
     * @description
     */
    k?: Record<string, string>;
    /**
     * Values dictionary
     * @description
     */
    v?: Record<string, Record<string, string | number>>;
    /**
     * Style config object
     * @description
     * Config to be compiled to CSSStylesheet string content
     */
    c: Record<string, Record<string, string | number> | string>;
};

type TVariants = Record<string | number, string | number>;

export interface IValues {
    // color values

    /**
     * lightness
     */
    lig: TVariants;
    /**
     * hue
     */
    hue: TVariants;
    /**
     * chroma
     */
    chr: TVariants;
    /**
     * alpha
     */
    alp: TVariants;

    // duration values

    /**
     * Time
     */
    time: TVariants;
    /**
     * Iteration-count coefficients
     */
    ic: TVariants;

    // font values

    /**
     * font-family
     */
    ff: TVariants;
    /**
     * Font-weight
     */
    fwg: TVariants;
    /**
     * Font-size coefficients
     */
    fsz: TVariants;

    // size values
    /**
     * Root font-size
     */
    rem: TVariants;
    /**
     * Breakpoints
     */
    bp: TVariants;
    /**
     * Spacing
     */
    sp: TVariants;
    /**
     * Size
     */
    sz: TVariants;
    /**
     * Universal size units
     */
    szu: TVariants;
    /**
     * Thickness
     */
    th: TVariants;
    /**
     * Radius
     */
    rad: TVariants;

    // base

    /**
     * relative values
     */
    coef: TVariants;
    /**
     * Ratio coefficients
     */
    rat: TVariants;
    /**
     * Fractions (between 0 and 1)
     */
    fr: TVariants;
    /**
     * Opacity
     */
    o: TVariants;
    /**
     * Z-index coefficients
     */
    zi: TVariants;
    /**
     * Letter-spacing coefficients
     */
    lsp: TVariants;
    /**
     * Line-height coefficients
     */
    lh: TVariants;

    // viewport values

    /**
     * Viewport units
     */
    vu: TVariants;
    /**
     * Viewport width
     */
    vw: TVariants;
    /**
     * Viewport height
     */
    vh: TVariants;
    /**
     * Viewport min size
     */
    vmin: TVariants;
    /**
     * Viewport max size
     */
    vmax: TVariants;

    // container values

    /**
     * Container query units
     */
    cqu: TVariants;
    /**
     * Container query block size
     */
    cqb: TVariants;
    /**
     * Container query inline size
     */
    cqi: TVariants;
    /**
     * Container query min size
     */
    cqmin: TVariants;
    /**
     * Container query max size
     */
    cqmax: TVariants;

    // transform values

    /**
     * Perspective coefficients
     */
    pers: TVariants;
    /**
     * Zoom coefficients
     */
    zm: TVariants;
    /**
     * Rotate coefficients
     */
    rot: TVariants;
    /**
     * Skew coefficients
     */
    sk: TVariants;
    /**
     * Translate coefficients
     */
    tr: TVariants;
    /**
     * Scale coefficients
     */
    sc: TVariants;
    /**
     * Inset
     */
    ins: TVariants;

    // Flex values

    /**
     * Flex-grow
     */
    fg: TVariants;
    /**
     * Flex-shrink
     */
    fs: TVariants;
    /**
     * Flex-basis
     */
    fb: TVariants;
    /**
     * Flex-order
     */
    fo: TVariants;

    // grid

    /**
     * Grid row amount
     */
    ra: TVariants;
    /**
     * Grid column amount
     */
    co: TVariants;
    /**
     * Grid row offset
     */
    ro: TVariants;
    /**
     * Grid column offset
     */
    ca: TVariants;
};

export type TModeValues = Record<string, Record<string, Record<string, string | number>>>;

/**
 * Attributes of style provider web component
 */
export interface IStyleProviderParams {
    /**
     * Settings script element id 
     */
    settingsid?: string;
    /**
     * CSS var prefix
     */
    prefix?: string | null;
    /**
     * Style generation mode
     * @description
     * `a` - data-attributes, `c` - classes
     */
    mode?: 'a' | 'c' | null;
    /**
     * If provider shoudn`t register document as dependent node
     */
    isolated?: string | null;
};

export type TStyleConsumer = { adoptedStyleSheets: CSSStyleSheet[] };
