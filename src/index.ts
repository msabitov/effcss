declare global {
    namespace EffCSS {
        /**
         * CSS properties
         */
        interface Properties {}
        /**
         * Style rule
         */
        interface Rule extends Properties {
            [key: string]: Rule | string | number | undefined | string[];
        }
        /**
         * Complex styles
         */
        type Styles = {
            [key: string]: Rule | Rule[] | '';
        };
    }
}
type ToPrimitive = { [key in typeof Symbol.toPrimitive]: () => string };
type StringResolver = string & (() => string) & ToPrimitive;
type SelectorResolver = string & ((...modifiers: string[]) => string) & ToPrimitive;
type EffCSSStyleSheet = {
    disabled: boolean;
    cssRules: Iterable<{ cssText: string }> & { length: number } & { [index: number]: { cssText: string } };
    insertRule(rule: string, index: number): number;
    deleteRule(index: number): void;
    ownerNode: CSSStyleSheet['ownerNode'];
};
type Settings = {
    /**
     * Unique context key
     * @description
     * Must start with a letter
     */
    key: string;
};
type Rule = EffCSS.Rule | (() => EffCSS.Rule);
type Selector = (rule: Rule) => SelectorResolver;
// layers
type LayersResolvers<T extends string> = Record<NoInfer<T>, StringResolver>;
// font
type FontConfig = {
    /**
     * References to font resources
     */
    src: string;
    /**
     * Font-display
     */
    display?: string;
    /**
     * Font-stretch
     */
    stretch?: string;
    /**
     * Font-style
     */
    style?: string;
    /**
     * Font-weight
     */
    weight?: string | number;
    /**
     * Font-variant
     */
    variant?: string;
    /**
     * Font-feature-settings
     */
    featureSettings?: string;
    /**
     * Font-variation-settings
     */
    variationSettings?: string;
    /**
     * Unicode-range
     */
    unicodeRange?: string;
    /**
     * Size-adjust
     */
    sizeAdjust?: string;
};
type FontResolver = string & ((...fallbacks: any[]) => string) & ToPrimitive;
// container
type ContainerType =
    | ''
    | 'normal'
    | 'inline-size'
    | 'size'
    | 'anchored'
    | 'scroll-state'
    | 'inline-size scroll-state'
    | 'size scroll-state';
// variable
type VariableDescription = {
    syntax?: string;
    inherits?: boolean;
    initialValue?: string | number | boolean | null;
};
type VariableConfig = string | number | boolean | VariableDescription;
type VariableResolver<T = any> = string &
    ((fallback?: any) => string) &
    ToPrimitive & {
        set(nextValue: T | ((prev: T) => T)): void;
        get(): T;
    };
// theme
type ThemeVars<T extends Record<string, VariableConfig>> = {
    [key in keyof T]: VariableResolver;
};

// public types

/**
 * Create id
 * @param rule - rule content or content resolver function
 * @returns Unique id token resolver
 */
export type Id = Selector;
/**
 * Create classname
 * @param rule - rule content or content resolver function
 * @returns Unique classname token resolver
 */
export type ClassName = Selector;
/**
 * Create variable (custom property)
 * @param description - variable config or value
 * @returns Unique variable token resolver
 */
export type Variable = <T extends VariableConfig = VariableConfig>(
    description?: T
) => VariableResolver<T extends string ? string : T>;
/**
 * Create animation (@keyframes)
 * @param description - keyframes config or config resolver function
 * @returns Unique keyframes token resolver
 */
export type Animation = <T extends Record<string, object>>(description: T | (() => T)) => StringResolver;
/**
 * Create container (@container)
 * @param type - container type
 * @returns Unique container token resolver
 */
export type Container = (type?: ContainerType) => StringResolver;
/**
 * Create font (@font-face)
 * @param descriptors - font config
 * @returns Unique font-family token resolver
 */
export type Font = (descriptors: FontConfig) => FontResolver;
/**
 * Create layers (@layer)
 * @param description - layer names in order of priority
 * @returns Object of layer token resolvers
 */
export type Layers = <T extends string>(description: T[]) => LayersResolvers<T>;
/**
 * Create arbitrary styles
 * @param content - styles object
 * @returns Styles activation function
 */
export type Style = (content: EffCSS.Styles | (() => EffCSS.Styles)) => StringResolver;
/**
 * Create theme
 * @param config - theme variables and presets
 * @returns Theme controller with `vars`, `list`, `get` and `set` methods
 */
export type Theme = <
    TVars extends Record<string, VariableConfig>,
    TOptions extends Record<string, Record<keyof TVars, string | number | boolean>>
>(config: {
    vars: TVars;
    options: TOptions;
    initial?: keyof TOptions;
}) => {
    /**
     * Theme variables
     */
    vars: ThemeVars<TVars>;
    /**
     * Theme options list
     */
    list: (keyof TOptions)[];
    /**
     * Get current theme name
     */
    get(): keyof TOptions | undefined;
    /**
     * Set next theme name
     */
    set(name: keyof TOptions): boolean;
};
/**
 * Isolated style generation context
 * @description
 * Owns unique key, counters and stylesheets
 */
export type Context = {
    // at-rules

    /**
     * Create variable (custom property)
     * @param description - variable config or value
     * @returns Unique variable token resolver
     */
    variable: Variable;
    /**
     * Create animation (@keyframes)
     * @param description - keyframes config or config resolver function
     * @returns Unique keyframes token resolver
     */
    animation: Animation;
    /**
     * Create container (@container)
     * @param type - container type
     * @returns Unique container token resolver
     */
    container: Container;
    /**
     * Create font (@font-face)
     * @param descriptors - font config
     * @returns Unique font-family token resolver
     */
    font: Font;
    /**
     * Create layers (@layer)
     * @param config - layer names in order of priority
     * @returns Object of layer token resolvers
     */
    layers: Layers;

    // selectors

    /**
     * Create id
     * @param rule - rule content or content resolver function
     * @returns Unique id token resolver
     */
    id: Id;
    /**
     * Create classname
     * @param rule - rule content or content resolver function
     * @returns Unique classname token resolver
     */
    className: ClassName;

    // complex styles

    /**
     * Create arbitrary styles
     * @param content - styles object
     * @returns Styles activation function
     */
    style: Style;
    /**
     * Create theme
     * @param config - theme variables and presets
     * @returns Theme controller with `vars`, `list`, `get` and `set` methods
     */
    theme: Theme;

    // advanced utils

    /**
     * Serialize all generated styles into `<style>` tags string
     */
    serialize: () => string;
    /**
     * Get the actual config of the context
     */
    getConfig: () => Settings;
    /**
     * Permanently destroy the context
     */
    dispose: () => void;
    /**
     * Clear all styles and reset counters
     */
    clear: () => void;
    /**
     * Dispose logic for the `using`/`Symbol.dispose`
     */
    [Symbol.dispose]: () => void;
};

// constants
const T_LAYER = 0;
const T_FONT = 1;
const T_VARIABLE = 2;
const T_ANIMATION = 3;
const T_CONTAINER = 4;
const T_ID = 5;
const T_CLASS = 6;
const T_CUSTOM = 7;
const T_ORDER = [T_LAYER, T_FONT, T_VARIABLE, T_ANIMATION, T_CONTAINER, T_ID, T_CLASS, T_CUSTOM];
const T_MIN = T_ORDER[0];
const T_MAX = T_ORDER[T_ORDER.length - 1];
const SELECTOR_PREFIX = {
    [T_ID]: '#',
    [T_CLASS]: '.'
};
const LIBRARY = 'effcss';
const DEFAULT_KEY = 'f';
const SEMICOLON = ';';
const DASH = '-';
const DATA_ = 'data-';
const PREFIX = DATA_ + LIBRARY + DASH;
const KEY_ATTR = PREFIX + 'key';
const COUNT_ATTR = PREFIX + 'count';
const CSS_RULES = 'cssRules';
const AT_LAYER_ = '@layer ';
const LENGTH = 'length';
const TRANSFORM = 'transform';
const PERCENTAGE = 'percentage';
const NUMBER = 'number';
const DEF_COUNTERS = {
    [T_LAYER]: 0,
    [T_FONT]: 0,
    [T_VARIABLE]: 0,
    [T_ANIMATION]: 0,
    [T_CONTAINER]: 0,
    [T_ID]: 0,
    [T_CLASS]: 0,
    [T_CUSTOM]: 0
} as Record<number, number>;
/**
 * Short syntax names for custom properties
 */
const SHORT_SYNTAX = [
    'angle',
    'color',
    'custom-ident',
    'image',
    'integer',
    LENGTH,
    LENGTH + DASH + PERCENTAGE,
    NUMBER,
    PERCENTAGE,
    'resolution',
    'string',
    'time',
    TRANSFORM + '-function',
    TRANSFORM + '-list',
    'url'
];
// derived value and utils
const isObject = (val: any) => val !== null && typeof val === 'object';
const tokenPrefix = (key: string, type: number) => `${key}_${type}-`;
const kebabCache = new Map<string, string>();
const kebabCase = (str: string): string => {
    let k = kebabCache.get(str);
    if (!k) {
        k = str.replace(/[A-Z]/g, (v) => DASH + v.toLowerCase());
        kebabCache.set(str, k);
    }
    return k;
};
const propVal = (prop: string, val: any) => `${kebabCase(prop)}:${'' + val};`;
const toRadix = (num: number) => num.toString(36);
const eachEntry = (obj: object, cb: (key: string, val: any) => any) =>
    Object.entries(obj).forEach(([key, val]) => cb(key, val));
const prepareInitialValue = (arg: any) => (arg !== null && arg !== undefined ? `initial-value:${arg};` : '');
const collectStyles = (key: string, value: unknown, out: string[]): void => {
    const resKey = '' + key;
    if (value === null || value === undefined) return;
    if (Array.isArray(value)) {
        for (let i = 0; i < value.length; i++) collectStyles(resKey, value[i], out);
        return;
    }
    if (isObject(value)) {
        out.push(resKey, '{');
        eachEntry(value, (key, val) => collectStyles(key, val, out));
        out.push('}');
        return;
    }
    if (value === '') {
        out.push(resKey, SEMICOLON);
        return;
    }
    out.push(propVal(resKey, value));
};
const parseStyles = (styles: object = {}): string => {
    const out: string[] = [];
    eachEntry(styles, (key, val) => collectStyles(key, val, out));
    return out.join('');
};
// top-level style may create several rules
const parseTopStyle = (styles: object = {}): string[] => {
    const rules: string[] = [];
    eachEntry(styles, (key, val) => {
        // an array of objects at the top level yields several rules with the same key
        if (Array.isArray(val) && val.some((v) => isObject(v))) {
            for (const v of val) {
                const out: string[] = [];
                collectStyles(key, v, out);
                rules.push(out.join(''));
            }
            return;
        }
        const out: string[] = [];
        collectStyles(key, val, out);
        rules.push(out.join(''));
    });
    return rules;
};
const shortSyntax = (syntax: string): string =>
    syntax === '*'
        ? '"*"'
        : SHORT_SYNTAX.includes(syntax)
          ? `"<${syntax}>"`
          : !syntax.startsWith('"')
            ? `"${syntax}"`
            : syntax;
const replaceRule = (stylesheet: EffCSSStyleSheet, index: number, rule: string): string => {
    stylesheet.deleteRule(index);
    stylesheet.insertRule(rule, index);
    return rule;
};
const getTokenRegex = (key: string) => new RegExp(key + '_' + `[${T_MIN}-${T_MAX}]-[0-9a-z]+`, 'g');
/**
 * Check CSS for side effects at the module level
 * @param provider - style provider
 * @param cssContent - serialized css content to inspect
 * @param kind - kind of the inspected content
 */
const checkForSideEffects = (provider: StyleProvider, cssContent: string, kind: string): void => {
    const checkResult = cssContent.match(provider.keyGuard);
    if (checkResult)
        throw new TypeError(
            `${LIBRARY}: The ${kind} contains a token (${checkResult[0]}) ` +
                `and, consequently, triggers side effects at the module level. ` +
                `Use the function form to keep styles lazy.`
        );
};

// Style provider

class StyleProvider {
    // registry of live contexts refs
    static ctxRegistry: Record<string, WeakRef<Context>> = {};
    // context key
    key = DEFAULT_KEY;
    // guard regexp for key
    keyGuard: RegExp = getTokenRegex(DEFAULT_KEY);
    // selector tokens replacers
    replacers = {
        in: {
            id: tokenPrefix(DEFAULT_KEY, T_ID),
            cls: tokenPrefix(DEFAULT_KEY, T_CLASS)
        },
        out: {
            id: SELECTOR_PREFIX[T_ID] + tokenPrefix(DEFAULT_KEY, T_ID),
            cls: SELECTOR_PREFIX[T_CLASS] + tokenPrefix(DEFAULT_KEY, T_CLASS)
        }
    };
    // if context disposed
    disposed = false;
    // server rules counters
    ssr: Record<number, number> = { ...DEF_COUNTERS };
    // client rules counters
    counters: Record<number, number> = { ...DEF_COUNTERS };
    // global stylesheets
    stylesheets: Partial<Record<number, EffCSSStyleSheet>> = {};

    // methods

    /**
     * Increment counter
     * @param type - counter type
     */
    inc = (type: number) => {
        return this.counters[type]++;
    };

    /**
     * Create token
     * @param type - token type
     * @param counter - token counter
     */
    token = (type: number, counter: number = this.inc(type)) => `${this.key}_${type}-${toRadix(counter)}`;

    /**
     * Replace all selector tokens with correct prefixes
     */
    replaceSelectors = (cssText: string): string => {
        return cssText
            .replaceAll(this.replacers.in.id, this.replacers.out.id)
            .replaceAll(this.replacers.in.cls, this.replacers.out.cls);
    };

    /**
     * Insert rule
     * @param type - counter type
     */
    insert = (type: number, cssText: string) => {
        const stylesheet = this.getStyleSheet(type);
        if (this.counters[type] > this.ssr[type]) {
            stylesheet.insertRule(this.replaceSelectors(cssText), stylesheet[CSS_RULES].length);
        }
    };

    /**
     * Clear context
     */
    clear = () => {
        const doc = globalThis.document;
        const adopted = doc?.adoptedStyleSheets;
        T_ORDER.forEach((type) => {
            const stylesheet = this.stylesheets[type];
            if (stylesheet) {
                // remove constructable from adoptedStyleSheets
                if (adopted) {
                    const idx = adopted.indexOf(stylesheet as CSSStyleSheet);
                    if (idx !== -1) adopted.splice(idx, 1);
                }
                // remove the owning <style> element, if exists
                const owner = stylesheet.ownerNode as HTMLElement | null;
                if (owner?.parentNode) owner.parentNode.removeChild(owner);
                delete this.stylesheets[type];
            }
        });
        this.counters = { ...DEF_COUNTERS };
        this.ssr = { ...DEF_COUNTERS };
    };

    /**
     * Permanently destroy the context
     */
    dispose = () => {
        if (this.disposed) return;
        this.disposed = true;
        this.clear();
    };

    /**
     * Get the stylesheet via a type
     */
    getStyleSheet = (type: number) => {
        let stylesheet = this.stylesheets[type];
        if (!stylesheet) {
            if (this.disposed) throw Error(`${LIBRARY}: context was already disposed.`);
            const value = this.key + DASH + type;
            const element = globalThis.document?.head.querySelector(
                `[${KEY_ATTR}="${value}"]`
            ) as null | HTMLStyleElement;
            stylesheet = element?.sheet as unknown as EffCSSStyleSheet;
            if (stylesheet) this.ssr[type] = Number(element?.getAttribute(COUNT_ATTR));
            else stylesheet = this.createStyleSheet();
            this.stylesheets[type] = stylesheet;
        }
        return stylesheet;
    };

    /**
     * Create stylesheet
     */
    createStyleSheet = (): EffCSSStyleSheet => {
        let stylesheet;
        if (!globalThis.CSSStyleSheet) {
            stylesheet = {
                ownerNode: null,
                disabled: false,
                [CSS_RULES]: [{ cssText: '' }],
                insertRule(cssText: string, index: number) {
                    this[CSS_RULES].splice(index, 0, {
                        cssText
                    });
                    return index;
                },
                deleteRule(index: number) {
                    this[CSS_RULES].splice(index, 1);
                }
            };
        } else {
            stylesheet = new globalThis.CSSStyleSheet();
            globalThis.document.adoptedStyleSheets.push(stylesheet);
        }
        return stylesheet as unknown as EffCSSStyleSheet;
    };
}

// top-level private functions

/**
 * Apply settings to a provider
 */
const validateKey = (key: string): void => {
    // key must start with a letter (CSS identifier requirement)
    if (!/^[a-zA-Z][a-zA-Z0-9_-]*$/.test(key))
        throw new TypeError(
            `${LIBRARY}: invalid key "${key}". Key must start with a letter and contain only letters, digits, '_' or '-'.`
        );
};

const configureProvider = (provider: StyleProvider, config: Settings) => {
    const { key = provider.key } = config;
    validateKey(key);
    // key may be claimed by the global provider or by an existing context
    if (
        (globalProvider && globalProvider !== provider && globalProvider.key === key) ||
        key in StyleProvider.ctxRegistry
    )
        throw new Error(`${LIBRARY}: key "${key}" is already in use by another context.`);
    const prefixForId = tokenPrefix(key, T_ID);
    const prefixForClass = tokenPrefix(key, T_CLASS);
    provider.key = key;
    provider.replacers = {
        in: {
            id: prefixForId,
            cls: prefixForClass
        },
        out: {
            id: SELECTOR_PREFIX[T_ID] + prefixForId,
            cls: SELECTOR_PREFIX[T_CLASS] + prefixForClass
        }
    };
    provider.keyGuard = getTokenRegex(provider.key);
    return true;
};

/**
 * Lazy at-rule creator
 */
const atRule = <F>(
    create: () => {
        call: (...args: any[]) => string;
        str?: string;
        set?: (value: any) => void;
        get?: () => string;
    },
    opts: { set?: boolean; get?: boolean } = {}
): F => {
    let state: ReturnType<typeof create> | null = null;
    const getState = () => state ?? (state = create());
    const wrapper = ((...args: any[]) => getState().call(...args)) as F &
        ((...args: any[]) => string) & {
            [Symbol.toPrimitive]: () => string;
        };
    wrapper[Symbol.toPrimitive] = () => (state ? (state.str ?? state.call()) : (getState().str ?? getState().call()));
    if (opts.set)
        (wrapper as any).set = (value: any) => {
            if (state) state.set!(value);
        };
    if (opts.get) (wrapper as any).get = () => (state ? state.get!() : '');
    return wrapper;
};

/**
 * Lazy selector rule creator
 */
const createSelector = (
    provider: StyleProvider,
    { rule, type }: { type: typeof T_ID | typeof T_CLASS; rule: object }
) => {
    let cssResolver: Function;
    if (typeof rule !== 'function') {
        const cssContent = parseStyles(rule);
        // guard: rule must not contain effcss tokens (module side-effects)
        checkForSideEffects(provider, cssContent, 'rule');
        cssResolver = () => cssContent;
    } else {
        cssResolver = () => parseStyles(rule());
    }
    // cache tokens per modifier
    const modCache = {} as Record<string, string>;
    const realize = (...modifiers: string[]) => {
        const key = modifiers.join('');
        const cached = modCache[key];
        if (cached) return cached;
        const token = provider.token(type);
        // at-rule modifiers wrap the rule at a different nesting level;
        // the rest are appended to the selector
        const atRules = modifiers.filter((m) => m.trimStart().startsWith('@'));
        const selectors = modifiers.filter((m) => !m.trimStart().startsWith('@'));
        let rule = token + selectors.join('') + ` {${cssResolver()}}`;
        for (let i = atRules.length - 1; i >= 0; i--) rule = `${atRules[i]} {${rule}}`;
        provider.insert(type, rule);
        modCache[key] = token;
        return token;
    };

    const ruleResolver = ((...modifiers: string[]) => realize(...modifiers)) as ((...modifiers: string[]) => string) &
        ToPrimitive;
    ruleResolver[Symbol.toPrimitive] = () => realize('');

    return ruleResolver;
};

const createVariable =
    (provider: StyleProvider): Variable =>
    (config?: VariableConfig) =>
        atRule<VariableResolver>(
            () => {
                const name = provider.token(T_VARIABLE);
                const cssName = '--' + name;
                const stylesheet = provider.getStyleSheet(T_VARIABLE);
                const ruleIndex = stylesheet[CSS_RULES].length;
                let description: VariableDescription;
                if (config && typeof config === 'object') description = config;
                else description = { initialValue: config };
                const { syntax = '*', inherits = true } = description;
                let initialValue = description.initialValue;
                const realize = () =>
                    `@property ${cssName} {syntax:${shortSyntax(syntax)};inherits:${inherits};${prepareInitialValue(
                        initialValue
                    )}}`;
                provider.insert(T_VARIABLE, realize());
                return {
                    str: cssName,
                    call: (fallback?: any) => `var(${cssName}${fallback ? ',' + fallback : ''})`,
                    set: (value: any) => {
                        const next = typeof value === 'function' ? value(initialValue) : value;
                        initialValue = next;
                        replaceRule(stylesheet, ruleIndex, realize());
                    },
                    get: () => (initialValue === undefined || initialValue === null ? '' : '' + initialValue)
                };
            },
            { set: true, get: true }
        );

const createAnimation =
    (provider: StyleProvider): Animation =>
    <T extends Record<string, object>>(config: T | (() => T)): StringResolver => {
        // guard: object form must not contain effcss tokens (module side-effects).
        // The check runs at creation time so broken code is never assembled.
        if (typeof config !== 'function') {
            checkForSideEffects(provider, parseStyles(config), 'keyframes config');
        }
        return atRule<StringResolver>(() => {
            const name = provider.token(T_ANIMATION);
            const cssText = typeof config === 'function' ? parseStyles(config()) : parseStyles(config);
            provider.insert(T_ANIMATION, `@keyframes ${name} {${cssText}}`);
            const call = () => name;
            return { call };
        });
    };

const createLayers =
    (provider: StyleProvider): Layers =>
    <T extends string>(config: T[]): LayersResolvers<T> => {
        const names = config.map(() => provider.token(T_LAYER));
        const declaration = AT_LAYER_ + names.join(', ') + SEMICOLON;
        let realized = false;
        const resolvers = config.reduce(
            (acc, key, i) => {
                const resolver = atRule<StringResolver>(() => {
                    if (!realized) {
                        realized = true;
                        provider.insert(T_LAYER, declaration);
                    }
                    const name = names[i];
                    const call = () => AT_LAYER_ + name;
                    return { call };
                });
                acc[key] = resolver;
                return acc;
            },
            {} as Record<NoInfer<T>, StringResolver>
        );
        return resolvers;
    };

const createContainer =
    (provider: StyleProvider): Container =>
    (containerType) =>
        atRule<StringResolver>(() => {
            const name = provider.token(T_CONTAINER);
            const type = containerType || 'normal';
            const call = () => name + ` / ${type}`;
            const str = `@container ${name}`;
            return { call, str };
        });

const createFont =
    (provider: StyleProvider): Font =>
    (config) =>
        atRule<FontResolver>(() => {
            const name = provider.token(T_FONT);
            const {
                src,
                display: fontDisplay,
                stretch: fontStretch,
                style: fontStyle,
                weight: fontWeight,
                variant: fontVariant,
                featureSettings: fontFeatureSettings,
                variationSettings: fontVariationSettings,
                unicodeRange,
                sizeAdjust
            } = config;
            provider.insert(
                T_FONT,
                `@font-face {font-family:${name};${parseStyles({
                    src,
                    fontDisplay,
                    fontStretch,
                    fontStyle,
                    fontWeight,
                    fontVariant,
                    fontFeatureSettings,
                    fontVariationSettings,
                    unicodeRange,
                    sizeAdjust
                })}}`
            );
            const call = (...fallbacks: any[]) => name + (fallbacks?.length ? ', ' + fallbacks.join(', ') : '');
            return { call };
        });

const createStyle =
    (provider: StyleProvider): Style =>
    (rule) => {
        let realized = false;
        let cssRules: string[];
        if (typeof rule === 'function') cssRules = parseTopStyle(rule());
        else {
            cssRules = parseTopStyle(rule);
            // guard: object form must not contain effcss tokens (module side-effects)
            checkForSideEffects(provider, cssRules.join(''), 'style config');
        }
        const realize = () => {
            if (realized) return;
            realized = true;
            provider.inc(T_CUSTOM);
            cssRules.forEach((rule) => provider.insert(T_CUSTOM, rule));
        };
        const resolver = (() => {
            realize();
            return '';
        }) as StringResolver;
        resolver[Symbol.toPrimitive] = () => {
            realize();
            return '';
        };
        return resolver;
    };

const createId = (provider: StyleProvider): Id =>
    ((rule: Rule) => createSelector(provider, { type: T_ID, rule })) as unknown as Id;

const createClassName = (provider: StyleProvider): ClassName =>
    ((rule: Rule) => createSelector(provider, { type: T_CLASS, rule })) as unknown as ClassName;

const createSerialize =
    (provider: StyleProvider): (() => string) =>
    (): string =>
        (Object.entries(provider.stylesheets) as unknown as [number, EffCSSStyleSheet | undefined][]).reduce(
            (acc, [type, stylesheet]) => {
                if (stylesheet && !stylesheet.disabled) {
                    const key = provider.key + DASH + type;
                    return (
                        acc +
                        `<style ${KEY_ATTR}="${key}" ${COUNT_ATTR}="${provider.counters[type]}">${[
                            ...stylesheet[CSS_RULES]
                        ].reduce((acc, rule) => acc + rule.cssText, '')}</style>`
                    );
                }
                return acc;
            },
            ''
        );

const createTheme =
    (provider: StyleProvider): Theme =>
    (config) => {
        const variable = createVariable(provider);
        const { vars, options, initial } = config;
        let currentTheme: keyof typeof options | undefined = initial;
        // shared closure state per variable: { resolver } is null until materialized
        const store = {} as Record<string, VariableResolver | null>;
        const varsResolvers = Object.entries(vars).reduce(
            (acc, [key, val]) => {
                store[key] = null;
                // lazy wrapper: creates the underlying variable() with the initialValue
                // taken from the *current* theme at the moment of materialization
                const getResolver = (): VariableResolver => {
                    if (!store[key]) {
                        const themeVal = currentTheme ? options[currentTheme][key] : undefined;
                        const base = val && typeof val === 'object' ? val : { initialValue: val };
                        store[key] = variable(
                            themeVal !== undefined ? { ...base, initialValue: themeVal } : (val as any)
                        );
                    }
                    return store[key];
                };
                const wrapper = ((...args: any[]) => getResolver()(...args)) as VariableResolver;
                wrapper[Symbol.toPrimitive] = () => '' + getResolver();
                wrapper.set = (value: any) => getResolver().set(value);
                wrapper.get = () => (store[key] ? store[key].get() : '');
                acc[key] = wrapper;
                return acc;
            },
            {} as Record<string, VariableResolver>
        ) as any;
        const list = Object.keys(options) as (keyof typeof options)[];
        const get = () => currentTheme;
        const set = (name: keyof typeof options) => {
            // switch theme by name (apply all theme variables)
            const themeValues = options[name];
            if (!themeValues) return false;
            currentTheme = name;
            // apply to already-existing variables
            Object.entries(themeValues).forEach(([key, value]) => {
                if (store[key]) store[key].set(value);
            });
            return true;
        };
        return {
            vars: varsResolvers,
            list,
            get,
            set
        };
    };

// global lazy context

let globalConfig: Settings = { key: DEFAULT_KEY };
let globalProvider: StyleProvider | undefined;
const getGlobalProvider = () => {
    if (!globalProvider) {
        globalProvider = new StyleProvider();
        configureProvider(globalProvider, globalConfig);
    }
    return globalProvider;
};

// public utils

// selectors

/**
 * Create id
 * @param rule - rule content
 * @returns Unique id token
 * @example
 * const badge = id({ backgroundColor: 'red' });
 * badge(); // f_5-0
 * '' + badge; // f_5-0
 * badge(':hover) // f_5-1 - new token with modifier state
 */
export const id: Id = (config) => createId(getGlobalProvider())(config);
/**
 * Create classname
 * @param rule - rule content
 * @returns Unique classname token
 * @example
 * const btn = className({ color: 'white' });
 * btn(); // f_6-0
 * '' + btn; // f_6-0
 * btn(':hover) // f_6-1 - new token with modifier state
 */
export const className: ClassName = (config) => createClassName(getGlobalProvider())(config);

// at-rules

/**
 * Create variable (custom property)
 * @param config - variable config or value
 * @returns Unique variable token resolver
 * @example
 * const accent = variable('#eff');
 * '' + accent; // --f_2-0
 * accent(); // var(--f_2-0)
 * accent('green'); // var(--f_2-0, green)
 */
export const variable: Variable = (config) => createVariable(getGlobalProvider())(config);
/**
 * Create animation (@keyframes)
 * @param config - keyframes config
 * @returns Unique keyframes token resolver
 * @example
 * const spin = animation({ from: { transform: 'rotate(0)' }, to: { transform: 'rotate(360deg)' } });
 * spin(); // f_3-0
 * '' + spin; // f_3-0
 */
export const animation: Animation = (config) => createAnimation(getGlobalProvider())(config);
/**
 * Create container (@container)
 * @param type - container type
 * @returns Unique container token resolver
 * @example
 * const card = container('inline-size');
 * '' + card; // '@container f_4-0'
 * card(); // f_4-0 / inline-size
 */
export const container: Container = (config) => createContainer(getGlobalProvider())(config);
/**
 * Create font (@font-face)
 * @param config - font config
 * @returns Unique font-family resolver
 * @example
 * const Inter = font({ src: "url('/inter.woff2')" });
 * Inter(); // f_1-0
 * '' + Inter; // f_1-0
 */
export const font: Font = (config) => createFont(getGlobalProvider())(config);
/**
 * Create layers (@layer)
 * @param config - layer names in order of priority
 * @returns Object of layer token resolvers
 * @example
 * const myLayers = layers(['reset', 'base']);
 * myLayers.reset(); // '@layer f_0-0'
 * '' + myLayers.reset; // '@layer f_0-0'
 */
export const layers: Layers = (config) => createLayers(getGlobalProvider())(config);

// complex styles

/**
 * Create arbitrary styles
 * @param content - styles object
 * @returns Styles activation function
 * @example
 * const custom = style({ body: { margin: 0 } });
 * custom(); // '' (styles are injected)
 */
export const style: Style = (config) => createStyle(getGlobalProvider())(config);
/**
 * Create theme
 * @param config - theme variables and presets
 * @returns Theme controller with `vars`, `list`, `get` and `set`
 * @example
 * const t = theme({ vars: { bg: '#fff' }, options: { dark: { bg: '#111' } }, initial: 'light' });
 * t.get(); // light
 * t.set('dark'); // true
 */
export const theme: Theme = (config) => createTheme(getGlobalProvider())(config);

// advanced utils

/**
 * Serialize all generated styles into `<style>` tags
 * @returns string with style tags
 * @example
 * serialize(); // <style data-effcss-key="f-6" data-effcss-count="1">...</style>
 */
export const serialize = () => (globalProvider ? createSerialize(globalProvider)() : '');
/**
 * Remove all generated styles and reset counters
 * @example
 * clear();
 */
export const clear = () => globalProvider?.clear();
/**
 * Set the global context config before the first usage
 * @param config - context settings
 * @returns true if applied, false if the provider already used
 * @example
 * setConfig({ key: 'app' });
 */
export const setConfig = (config: Settings) => {
    if (globalProvider) return false;
    validateKey(config.key);
    globalConfig = config;
    return true;
};
/**
 * Get the actual global provider's config
 * @returns the global provider's config
 * @example
 * getConfig(); // { key: 'app' }
 */
export const getConfig = (): Settings => (globalProvider ? { key: globalProvider.key } : globalConfig);
/**
 * Create a new isolated style generation context.
 * The key allows to prevent conflicts within the same HTML document
 * @param config - context settings
 * @returns an isolated {@link Context}
 * @example
 * const ctx = context({ key: 'app' });
 * ctx.className({ color: 'red' }); // f_6-0
 */
export const context = (config: Settings): Context => {
    const provider = new StyleProvider();
    configureProvider(provider, config);
    // dispose removes the reference from the registry
    const dispose = () => {
        delete StyleProvider.ctxRegistry[provider.key];
        provider.dispose();
    };
    const ctx: Context = {
        // at-rules
        variable: createVariable(provider),
        animation: createAnimation(provider),
        container: createContainer(provider),
        font: createFont(provider),
        layers: createLayers(provider),
        // selectors
        id: createId(provider),
        className: createClassName(provider),
        // complex styles
        style: createStyle(provider),
        theme: createTheme(provider),
        // advanced utils
        serialize: createSerialize(provider),
        getConfig: () => ({ key: provider.key }),
        clear: provider.clear,
        dispose,
        [Symbol.dispose]: dispose
    };
    StyleProvider.ctxRegistry[provider.key] = new WeakRef(ctx);
    return ctx;
};

/**
 * Get all active local contexts (created via `context()`)
 * @returns object of live {@link Context} objects keyed by context key
 * @example
 * const ctx = context({ key: 'app' });
 * getContexts(); // { app: ctx }
 */
export const getContexts = (): Record<string, Context> =>
    Object.entries(StyleProvider.ctxRegistry).reduce(
        (acc, [key, ref]) => {
            const ctx = ref.deref();
            if (ctx) acc[key] = ctx;
            return acc;
        },
        {} as Record<string, Context>
    );
