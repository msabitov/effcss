import type {
    CustomStyles,
    LazyCustomStyles,
    ClassNames,
    ClassNamesResolver,
    LazyClassNames,
    Attributes,
    AttributesResolver,
    LazyAttributes,
    Attribute,
    LazyAttribute,
    ClassName,
    LazyClassName,
    Variable,
    VariableResolver,
    Animation,
    AnimationResolver,
    Container,
    ContainerResolver,
    Layer,
    LayerResolver,
    Font,
    FontResolver,
    Variables,
    VariablesResolvers,
    Animations,
    AnimationsResolvers,
    Containers,
    ContainersResolvers,
    Layers,
    LayersResolvers,
    Fonts,
    FontsResolvers,
    EffCSSStyleSheet,
    EffCSSEvent,
    Generator,
    VariableConfig,
    AnimationConfig,
    ContainerType,
    FontConfig,
    VariableDescription,
    Update,
    StyleSheetType,
    GlobalKey,
    Theme,
    LazyId,
    Id,
    RuleConfig
} from './types';
import { keySymbol, indexSymbol, dictSymbol, LIBRARY } from './constants';

export type {
    CustomStyles,
    ClassNames,
    ClassNamesResolver,
    LazyClassNames,
    Attributes,
    AttributesResolver,
    LazyAttributes,
    Attribute,
    LazyAttribute,
    ClassName,
    LazyClassName,
    Variable,
    VariableResolver,
    Animation,
    AnimationResolver,
    Container,
    ContainerResolver,
    Layer,
    LayerResolver,
    Font,
    FontResolver,
    Variables,
    VariablesResolvers,
    Animations,
    AnimationsResolvers,
    Containers,
    ContainersResolvers,
    Layers,
    LayersResolvers,
    Fonts,
    FontsResolvers,
    Theme,
    Id,
    LazyId,
    EffCSSStyleSheet,
    EffCSSEvent,
    Generator
};

// local types

type RuleWithPreload = 'v' | 'a' | 'l' | 'f' | 'c';
type RuleWithCounter = RuleWithPreload | 's';
type Scope = {
    key: string;
    // name counters
    c: Record<RuleWithCounter, number>;
    // block counters
    b: Record<RuleWithPreload, number>;
    // cssText
    t: Record<RuleWithPreload, string>;
};
type AtRuleParams<T> = {
    name: string;
    config: T;
    stylesheet?: EffCSSStyleSheet | null;
    emit?: Function;
    index?: number;
};
type GetAtRule<T, F, E = object> = (params: AtRuleParams<T>) => { s: string; f: F; e: E };
type Settings = {
    /**
     * Prefix for generated keys
     */
    prefix?: string;
    /**
     * Minify stylesheet selectors
     */
    minify?: boolean;
    /**
     * Emulate browser APIs
     */
    emulate?: boolean;
    /**
     * Enable lazy mode
     */
    lazy?: boolean;
};

// constants

const SEMICOLON = ';';
const DASH = '-';
const DATA_ = 'data-';
const PREFIX = DATA_ + LIBRARY + DASH;
const KEY_ATTR = PREFIX + 'key';
const CTX_ATTR = PREFIX + 'ctx';
const GLOBAL_ATTR = PREFIX + 'global';
const DIVIDER = '_';
const CSS_RULES = 'cssRules';
const ATTRIBUTE = 'attribute';
const ATTRIBUTES = (ATTRIBUTE + 's') as 'attributes';
const ID = 'id';
const CLASSNAME = 'className';
const CLASSNAMES = (CLASSNAME + 's') as 'classNames';
const CUSTOM_STYLES = 'customStyles';
const VARIABLE = 'variable';
const VARIABLES = (VARIABLE + 's') as 'variables';
const VARIABLE_SET = (VARIABLE + '.set') as 'variable.set';
const ANIMATION = 'animation';
const ANIMATIONS = (ANIMATION + 's') as 'animations';
const CONTAINER = 'container';
const CONTAINERS = (CONTAINER + 's') as 'containers';
const FONT = 'font';
const FONTS = (FONT + 's') as 'fonts';
const LAYER = 'layer';
const LAYERS = (LAYER + 's') as 'layers';
const AT_LAYER_ = '@' + LAYER + ' ';
const SHARED = 'shared' as const;
const SELECTOR = 'selector' as const;
const SELECTORS = (SELECTOR + 's') as 'selectors';
const TYPE_ATTRS = { type: ATTRIBUTES } as const;
const TYPE_CLS = { type: CLASSNAMES } as const;
const TYPE_CUSTOM = { type: CUSTOM_STYLES } as const;
const GLOBALS = [LAYERS, VARIABLES, FONTS, ANIMATIONS, SHARED] as const;
const STYLE_ATTRS = GLOBALS.reduce(
    (acc, key) => ({
        ...acc,
        [key]: GLOBAL_ATTR + '="' + key + '"'
    }),
    {} as Record<string, string>
);
const LENGTH = 'length';
const TRANSFORM = 'transform';
const PERCENTAGE = 'percentage';
const NUMBER = 'number';
const SHORT = {
    v: VARIABLES,
    a: ANIMATIONS,
    f: FONTS,
    l: LAYERS,
    s: SHARED
};
const SHORT_SINGLE = {
    v: VARIABLE,
    a: ANIMATION,
    f: FONT,
    l: LAYER,
    c: CONTAINER
} as const;
// utils
const mockGetMethod = () => '';
const mockSetMethod = () => undefined;
const getId = (arg: any) => '#' + arg;
const getCls = (arg: any) => '.' + arg;
const getAttr = (arg: any) => '[' + Object.keys(arg)[0] + ']';
const keyAttr = (val: string) => `${KEY_ATTR}="${val}"`;
const isSymbol = (val: any) => typeof val === 'symbol';
const isObject = (val: any) => val !== null && typeof val === 'object';
const isFunction = (arg: any) => typeof arg === 'function';
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
/**
 * Collect styles
 * @param key - stylesheet key
 * @param value - stylesheet content
 * @param out - collector array
 */
const collect = (key: string, value: unknown, out: string[]): void => {
    const resKey = '' + key;
    if (value === null || value === undefined) return;
    if (Array.isArray(value)) {
        for (let i = 0; i < value.length; i++) collect(resKey, value[i], out);
        return;
    }
    if (isObject(value)) {
        out.push(resKey, '{');
        eachEntry(value, (key, val) => collect(key, val, out));
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
    eachEntry(styles, (key, val) => collect(key, val, out));
    return out.join('');
};

const markStylesheet = (stylesheet: EffCSSStyleSheet, key: string, dict: Record<string, string>) => {
    stylesheet[keySymbol] = key;
    stylesheet[dictSymbol] = dict;
};

const serializeStylesheet = (stylesheet?: EffCSSStyleSheet, attr?: string) => {
    const key = (stylesheet && stylesheet[keySymbol]) || '';
    if (stylesheet && !stylesheet.disabled)
        return `<style${key ? ' ' + keyAttr(key) : ''}${attr ? ' ' + attr : ''}>${[...stylesheet[CSS_RULES]].reduce(
            (acc, rule) => (acc += rule.cssText),
            ''
        )}</style>`;
    return '';
};

const serializeStylesheetMeta = (stylesheet: EffCSSStyleSheet) => {
    const key = stylesheet[keySymbol];
    const dict = stylesheet[dictSymbol];
    if (!stylesheet.disabled && key && dict)
        return `<script type="application/json" ${keyAttr(key)}>${
            Object.keys(dict).length ? JSON.stringify(dict) : ''
        }</script>`;
    return '';
};

const shortSyntax = [
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
].reduce(
    (acc, key) => {
        acc[key] = `"<${key}>"`;
        return acc;
    },
    { '*': '"*"' } as Record<string, string>
);

const replaceRule = (stylesheet: EffCSSStyleSheet, index: number, rule: string): string => {
    stylesheet.deleteRule(index);
    stylesheet.insertRule(rule, index);
    return rule;
};

const token = (key: string, index: number) => `${key}-${toRadix(index)}`;
const tokenUnder = (key: string, index: number) => `${key}_${toRadix(index)}`;
const varName = (key: string, index: number) => '--' + token(key, index);

const variableRule: GetAtRule<VariableConfig, VariableResolver> = ({ name, config, stylesheet, index, emit }) => {
    let descriptor: VariableDescription;
    if (config && typeof config === 'object') descriptor = config;
    else descriptor = { initialValue: config };

    const { syntax = '*', inherits = true } = descriptor;
    let initialValue = descriptor.initialValue;
    const build = () =>
        `@property ${name} {syntax:${shortSyntax[syntax] || syntax};inherits:${inherits};${prepareInitialValue(initialValue)}}`;

    const resolver = ((fallback?: any) => `var(${name}${fallback ? ',' + fallback : ''})`) as VariableResolver;
    (resolver as VariableResolver)[Symbol.toPrimitive] = () => name;

    // local scope — mock accessors
    if (!stylesheet) {
        (resolver as VariableResolver).set = mockSetMethod;
        (resolver as VariableResolver).get = mockGetMethod;
        return {
            s: build(),
            f: resolver,
            e: {}
        };
    }

    // global scope — real accessors via closure
    (resolver as VariableResolver)[indexSymbol] = index!;
    (resolver as VariableResolver).set = (value: any) => {
        initialValue = value;
        const s = build();
        replaceRule(stylesheet, index!, s);
        if (emit) emit({ fn: VARIABLE_SET, css: s, name, value });
    };
    (resolver as VariableResolver).get = () =>
        initialValue === undefined || initialValue === null ? '' : '' + initialValue;
    return {
        s: build(),
        f: resolver,
        e: {}
    };
};

const fontRule: GetAtRule<FontConfig, FontResolver> = ({ name, config }) => {
    const qName = `"${name}"`;
    const {
        src,
        display: fontDisplay,
        stretch: fontStretch,
        style: fontStyle,
        weight: fontWeight,
        variant: fontVariant,
        featureSettings: fontFeatureSettings,
        variationSettings: fontVariationSettings,
        genericName,
        unicodeRange,
        sizeAdjust
    } = config;
    const rule = `@font-face {font-family:${qName};${parseStyles({
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
    })}}`;
    const lastFallback = genericName ? ', ' + genericName : '';
    const resolver = ((...fallbacks: any[]) =>
        qName + (fallbacks?.length ? ', ' + fallbacks.join(', ') : '') + lastFallback) as VariableResolver;
    resolver[Symbol.toPrimitive] = () => qName;
    return {
        s: rule,
        f: resolver,
        e: {}
    };
};

const layerRule: GetAtRule<object, LayerResolver> = ({ name }) => {
    const ruleKey = AT_LAYER_ + name;
    const rule = ruleKey + SEMICOLON;
    const resolver = (() => ruleKey) as LayerResolver;
    resolver[Symbol.toPrimitive] = () => ruleKey;
    return {
        s: rule,
        f: resolver,
        e: {}
    };
};

const containerRule: GetAtRule<ContainerType, ContainerResolver, { type: string }> = ({ name, config }) => {
    const type = config || 'normal';
    const property = name + ` / ${type}`;
    const resolver = (() => property) as ContainerResolver;
    resolver[Symbol.toPrimitive] = () => `@container ${name}`;
    return {
        s: '',
        f: resolver,
        e: { type }
    };
};

const animationRule: GetAtRule<object, AnimationResolver> = ({ name, config }) => {
    const rule = `@keyframes ${name} {${parseStyles(config)}}`;
    const resolver = (() => name) as AnimationResolver;
    resolver[Symbol.toPrimitive] = () => name;
    return {
        s: rule,
        f: resolver,
        e: {}
    };
};

const lazyStringResolver = <T>(gen: () => T) => {
    let resolver: T | undefined;
    const replacer = ((...args: any[]) => {
        if (!resolver) resolver = gen();
        return (resolver as any)(...args);
    }) as T;
    (replacer as any)[Symbol.toPrimitive] = () => {
        if (!resolver) resolver = gen();
        return (resolver as any)[Symbol.toPrimitive]();
    };
    return replacer;
};

const lazyVariableResolver = (gen: () => VariableResolver): VariableResolver => {
    let resolver: VariableResolver | undefined;
    const replacer = ((...args: any[]) => {
        if (!resolver) resolver = gen();
        return (resolver as any)(...args);
    }) as unknown as VariableResolver;
    (replacer as any)[Symbol.toPrimitive] = () => {
        if (!resolver) resolver = gen();
        return (resolver as any)[Symbol.toPrimitive]();
    };
    replacer.set = (value: any) => resolver?.set?.(value);
    replacer.get = () => resolver?.get?.() || '';
    return replacer;
};

const lazyBatch = <T, V>(
    keys: string[],
    entries: () => T,
    make: (entry: () => any) => V = lazyStringResolver
): Record<string, V> => {
    let cached: T | undefined;
    const warm = () => (cached ||= entries());
    return keys.reduce(
        (acc, key) => {
            acc[key] = make(() => (warm() as any)[key]);
            return acc;
        },
        {} as Record<string, V>
    );
};

const getSelectorsProxy = (hash: (key: string) => void, parent: string = '') => {
    const hashed = parent && hash(parent);
    return new Proxy(
        {
            [Symbol.toPrimitive]: () => hashed
        },
        {
            get(target, property, receiver) {
                if (isSymbol(property)) return Reflect.get(target, property, receiver);
                return getSelectorsProxy(hash, parent ? parent + DIVIDER + property : property);
            }
        }
    );
};

const createScope = (key: string): Scope => ({
    key,
    c: {
        v: 0,
        a: 0,
        l: 0,
        f: 0,
        c: 0,
        s: 0
    },
    b: {
        v: 0,
        a: 0,
        l: 0,
        f: 0,
        c: 0
    },
    t: {
        v: '',
        a: '',
        l: '',
        f: '',
        c: ''
    }
});

const getHash = (params: { type: StyleSheetType; minify: boolean; scope: Scope; dict: Record<string, string> }) => {
    const { scope, minify, type, dict } = params;
    const scopeKey = scope.key;
    let add: (key: string) => string;
    let hash: undefined | ((key: string) => string);
    if (type === CLASSNAMES) {
        add = minify
            ? (key: string) => {
                  dict[key] = tokenUnder(scopeKey, scope.c.s++);
                  return dict[key];
              }
            : (key: string) => {
                  dict[key] = scopeKey + '_' + key;
                  scope.c.s++;
                  return dict[key];
              };
        hash = (key: string) => '.' + (dict[key] ?? add(key));
    } else {
        add = minify
            ? (key: string) => {
                  dict[key] = toRadix(scope.c.s++);
                  return dict[key];
              }
            : (key: string) => {
                  dict[key] = key;
                  scope.c.s++;
                  return dict[key];
              };
        const scopeAttr = DATA_ + scopeKey;
        hash = (key: string) => `[${scopeAttr}~="${dict[key] ?? add(key)}"]`;
    }
    return hash;
};

const parseDict = (dict: Record<string, string>, config: object, parent = '') => {
    return Object.entries(config)
        .reduce((acc, [prop, val]) => {
            const currentLevel = parent ? parent + DIVIDER + prop : prop;
            if (isObject(val)) {
                acc.push(dict[currentLevel]);
                const parsed = parseDict(dict, val, currentLevel);
                if (parsed) acc.push(parsed);
            } else if (val !== undefined) acc.push(dict[currentLevel + DIVIDER + val]);
            return acc;
        }, [] as string[])
        .join(' ');
};

const getFromDict =
    (dict: Record<string, string>) =>
    (config: Record<string, true | Record<string, never | boolean | string | number>>) =>
        parseDict(dict, config);

// Style provider

type Creators = {
    variable: (config?: VariableConfig) => VariableResolver;
    variables: <T extends Record<string, VariableConfig>>(config: T) => VariablesResolvers<T>;
    animation: <T extends Record<string, object>>(config: T) => AnimationResolver;
    animations: <T extends Record<string, AnimationConfig>>(config: T) => AnimationsResolvers<T>;
    layer: () => LayerResolver;
    layers: <T extends string>(config: T[]) => LayersResolvers<T>;
    font: Font;
    fonts: <T extends Record<string, FontConfig>>(config: T) => FontsResolvers<T>;
    selectors: (generator: Function, params: { type: StyleSheetType }) => any;
};

class StyleProvider {
    // settings

    protected _lazy = false;
    prefix = 'f';
    minify = true;
    emulate = false;

    get lazy() {
        return this._lazy;
    }
    set lazy(value: boolean) {
        if (value !== this._lazy) {
            this._lazy = value;
            this.make = value ? this.active : this.every;
        }
    }

    // scopes

    // global scope
    protected _gs: Scope;

    // global scope
    get gs(): Scope {
        if (!this._gs) this._gs = this.cs();
        return this._gs;
    }

    scope: Scope | null = null;
    scopeCount = 0;

    // create scope
    cs = (): Scope => {
        const key = this.prefix + toRadix(this.scopeCount++);
        return createScope(key);
    }

    // stylesheets

    // server counters
    protected _sc: Scope['c'] = {
        v: 0,
        a: 0,
        l: 0,
        f: 0,
        s: 0,
        c: 0
    };

    // global stylesheets
    _g: Partial<Record<'v' | 'a' | 'l' | 'f' | 's', EffCSSStyleSheet>> = {};

    protected _serverGlobalCSS: Map<GlobalKey, CSSStyleSheet> | null = null;
    protected _serverCSS: Map<string, CSSStyleSheet> | null = null;
    protected _serverMeta: Map<string, Record<string, string>> | null = null;

    map: Map<any, EffCSSStyleSheet> = new Map<any, EffCSSStyleSheet>();

    // subscribers
    protected _sub: Set<(data: EffCSSEvent) => void> = new Set();
    // hasSubscribers
    _hs: boolean = false;

    emit = (data: EffCSSEvent): void => {
        for (const fn of this._sub) {
            try {
                fn(data);
            } catch {
                /* ignore */
            }
        }
    }

    subscribe = (fn: (data: EffCSSEvent) => void): () => void  => {
        this._sub.add(fn);
        this._hs = !!this._sub.size;
        return () => {
            this._sub.delete(fn);
            this._hs = !!this._sub.size;
        };
    }

    constructor(config?: Settings) {
        if (config) this.configure(config);
    }

    configure = (config: Settings) => {
        if (this.scopeCount > 0) return false;
        const {
            prefix = this.prefix,
            minify = this.minify,
            emulate = this.emulate,
            lazy = this.lazy
        } = config;
        this.prefix = prefix;
        this.minify = minify;
        this.emulate = emulate;
        this.lazy = lazy;
        return true;
    };

    get serverCSS(): Map<string, CSSStyleSheet> {
        if (!this._serverCSS) {
            this._serverCSS = new Map();
            const elements = globalThis.document?.head.querySelectorAll(
                `style[${KEY_ATTR}]`
            ) as NodeListOf<HTMLStyleElement> | null;
            elements?.forEach((el) => {
                const key = el.getAttribute(KEY_ATTR);
                const sheet = el.sheet;
                if (key && sheet) this._serverCSS!.set(key, sheet);
            });
        }
        return this._serverCSS as Map<string, CSSStyleSheet>;
    }

    get serverGlobalCSS(): Map<GlobalKey, EffCSSStyleSheet> {
        if (!this._serverGlobalCSS) {
            this._serverGlobalCSS = new Map();
            const elements = globalThis.document?.head.querySelectorAll(
                `[${GLOBAL_ATTR}][${CTX_ATTR}="${this.prefix}"]`
            ) as NodeListOf<HTMLStyleElement> | null;
            elements?.forEach((el) => {
                const key = el.getAttribute(GLOBAL_ATTR) as GlobalKey;
                const sheet = el.sheet;
                if (key && sheet) this._serverGlobalCSS!.set(key, sheet);
            });
        }
        return this._serverGlobalCSS;
    }

    get serverMeta(): Map<string, Record<string, string>> {
        if (!this._serverMeta) {
            this._serverMeta = new Map();
            const elements = globalThis.document?.head.querySelectorAll(
                `script[${KEY_ATTR}]`
            ) as NodeListOf<HTMLScriptElement> | null;
            elements?.forEach((el) => {
                const key = el.getAttribute(KEY_ATTR);
                const textContent = el.textContent;
                const dict = textContent ? JSON.parse(el.textContent) : {};
                if (key) this._serverMeta!.set(key, dict);
            });
        }
        return this._serverMeta;
    }

    // get global stylesheet
    _gg = (key: 'v' | 'a' | 'l' | 'f' | 's'): EffCSSStyleSheet => {
        if (!this._g[key]) {
            const serverStylesheet = this.serverGlobalCSS.get(SHORT[key]);
            if (serverStylesheet) {
                this._g[key] = serverStylesheet;
                this._sc[key] = serverStylesheet[CSS_RULES].length;
            } else this._g[key] = this.cst();
        }
        return this._g[key];
    }

    get vs(): EffCSSStyleSheet {
        return this._gg('v');
    }

    get as(): EffCSSStyleSheet {
        return this._gg('a');
    }

    get ls(): EffCSSStyleSheet {
        return this._gg('l');
    }

    get fs(): EffCSSStyleSheet {
        return this._gg('f');
    }

    get ss(): EffCSSStyleSheet {
        return this._gg('s');
    }

    // createStyleSheet
    cst = (cssText: string = ''): EffCSSStyleSheet => {
        let stylesheet;
        if (!globalThis.CSSStyleSheet || this.emulate) {
            stylesheet = {
                ownerNode: null,
                disabled: false,
                cssRules: [{ cssText }],

                replaceSync(cssText: string) {
                    this[CSS_RULES] = [
                        {
                            cssText
                        }
                    ];
                },
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
            stylesheet.replaceSync(cssText);
            globalThis.document.adoptedStyleSheets.push(stylesheet);
        }
        return stylesheet as unknown as EffCSSStyleSheet;
    };

    // linkStylesheet
    lst = (resolver: any, stylesheet: EffCSSStyleSheet) => {
        this.map.set(resolver, stylesheet);
        return resolver;
    }

    update: Update = (resolver: any, value: any) => {
        if (this.scope) return;
        if (isFunction(resolver)) resolver.set(value);
        else Object.entries<any>(value).forEach(([key, val]) => resolver[key].set(val));
    };

    // creators

    _rule = ({
        fn,
        result,
        index,
        selector,
        rule
    }: {
        fn: 'id' | 'className' | 'attribute';
        result: any;
        index: number;
        selector: string;
        rule: object;
    }) => {
        const cssText = selector + ` {${parseStyles(rule)}}`;
        const stylesheet = this.ss;
        if (this._sc.s <= index) stylesheet.insertRule(cssText, stylesheet[CSS_RULES].length);
        if (this._hs) this.emit({ fn, css: cssText, result });
        return result;
    };

    lazyRule = <T>({
        fn,
        rule,
        toString
    }: {
        fn: 'id' | 'className' | 'attribute';
        rule: RuleConfig;
        toString: (result: any) => string;
    }) => {
        let result: any;
        const gen = () => (result = this[fn](isFunction(rule) ? (rule as Function)() : rule));
        const replacer = (() => {
            if (result === undefined) return gen();
            return result;
        }) as T;
        (replacer as any)[Symbol.toPrimitive] = () => toString(result ?? gen());
        return replacer;
    };

    id: (rule: object) => string = (rule) => {
        if (this.scope) return '';
        const scope = this.gs;
        const index = scope.c.s++;
        const result = tokenUnder(scope.key, index);
        const selector = getId(result);
        return this._rule({
            fn: ID,
            result,
            index,
            selector,
            rule
        });
    };

    /**
     * Create an anonymous rule with a class selector
     * @param rule - rule content
     */
    className: (rule: object) => string = (rule: object) => {
        if (this.scope) return '';
        const scope = this.gs;
        const index = scope.c.s++;
        const result = tokenUnder(scope.key, index);
        const selector = getCls(result);
        return this._rule({
            fn: CLASSNAME,
            result,
            index,
            selector,
            rule
        });
    };

    /**
     * Create an anonymous rule with an attribute selector
     * @param rule - rule content
     */
    attribute: (rule: object) => object = (rule: object) => {
        if (this.scope) return {};
        const scope = this.gs;
        const index = scope.c.s++;
        const attr = DATA_ + token(scope.key, index);
        const selector = '[' + attr + ']';
        const result = { [attr]: '' };
        return this._rule({
            fn: ATTRIBUTE,
            result,
            index,
            selector,
            rule
        });
    };

    _atRule = <T, F, E = object>({
        key,
        config,
        scope,
        getName = token,
        getRule,
        sideEffects = true
    }: {
        key: RuleWithPreload;
        config: T;
        scope: Scope | null;
        getRule(params: { name: string; config: T; stylesheet?: EffCSSStyleSheet | null; index?: number; emit?: Function; }): {
            s: string;
            f: F;
            e: E;
        };
        getName?: (key: string, index: number) => string;
        sideEffects?: boolean;
    }): F => {
        // local rule
        const ruleScope = scope || this.gs;
        const index = ruleScope.c[key]++;
        const name = getName(ruleScope.key, index);
        if (scope) {
            const { s, f } = getRule({ name, config, stylesheet: null });
            scope.t[key] += s;
            return f;
        }
        // global rule
        const ruleIndex = ruleScope.b[key]++;
        const stylesheet = sideEffects ? this._gg(key as keyof typeof this._g) : null;
        const { s, f, e = {} } = getRule({ name, config, stylesheet, index: ruleIndex, emit: this._hs ? this.emit : undefined });
        if (sideEffects && stylesheet && this._sc[key] <= ruleIndex) stylesheet.insertRule(s, ruleIndex);
        if (this._hs)
            this.emit({ fn: SHORT_SINGLE[key], css: s, name, ...(e as object) } as unknown as EffCSSEvent);
        return f;
    };

    /**
     * Create variable
     * @param config - variable config
     */
    variable = (config?: VariableConfig, scope = this.scope): VariableResolver =>
        this._atRule({
            key: 'v',
            config,
            scope,
            getName: varName,
            getRule: variableRule
        });

    /**
     * Create variables
     * @param config - variables config
     */
    variables = <T extends Record<string, VariableConfig>>(
        config: T,
        initScope = this.scope
    ): VariablesResolvers<T> => {
        // local variables
        let scope = initScope;
        if (scope) {
            const { key: scopeKey, c, t } = scope;
            return Object.entries(config).reduce(
                (acc, [key, val]) => {
                    const index = c.v++;
                    const name = varName(scopeKey, index);
                    const { s, f } = variableRule({ name, config: val, stylesheet: null });
                    t.v += s;
                    acc[key] = f;
                    return acc;
                },
                {} as Record<string, VariableResolver>
            ) as VariablesResolvers<T>;
        }
        // global variables
        scope = this.gs;
        const { key: scopeKey, c, b } = scope;
        const stylesheet = this.vs;
        let fullCSS = '';
        const names: string[] = [];
        const prepare = (val: VariableConfig) => {
            const index = c.v++;
            const ruleIndex = b.v++;
            const name = varName(scopeKey, index);
            const { s, f } = variableRule({ name, config: val, stylesheet, index: ruleIndex, emit: this._hs ? this.emit : undefined });
            if (this._sc.v <= ruleIndex) stylesheet.insertRule(s, ruleIndex);
            return { name, s, f };
        };
        const handlers = Object.entries(config).reduce(
            this._hs
                ? (acc, [key, val]) => {
                      const { name, s, f } = prepare(val);
                      fullCSS += s;
                      names.push(name);
                      acc[key] = f;
                      return acc;
                  }
                : (acc, [key, val]) => {
                      acc[key] = prepare(val).f;
                      return acc;
                  },
            {} as Record<string, VariableResolver>
        ) as VariablesResolvers<T>;
        if (this._hs) this.emit({ fn: VARIABLES, css: fullCSS, names });
        return handlers;
    };

    /**
     * Create animation
     * @param config - animation config
     */
    animation = <T extends Record<string, object>>(config: T, scope = this.scope): AnimationResolver =>
        this._atRule({
            key: 'a',
            config,
            scope,
            getRule: animationRule
        });

    /**
     * Create animations
     * @param config - animation configs
     */
    animations = <T extends Record<string, AnimationConfig>>(
        config: T,
        initScope = this.scope
    ): AnimationsResolvers<T> => {
        // local animations
        let scope = initScope;
        if (scope) {
            const { key: scopeKey, c, t } = scope;
            return Object.entries(config).reduce(
                (acc, [key, val]) => {
                    const index = c.a++;
                    const name = token(scopeKey, index);
                    const { s, f } = animationRule({ name, config: val, stylesheet: null });
                    t.a += s;
                    acc[key] = f;
                    return acc;
                },
                {} as Record<string, AnimationResolver>
            ) as AnimationsResolvers<T>;
        }
        // global animations
        scope = this.gs;
        const stylesheet = this.as;
        let fullCSS = '';
        const names: string[] = [];
        const prepare = (val: AnimationConfig) => {
            const index = scope.c.a++;
            const ruleIndex = scope.b.a++;
            const name = token(scope.key, index);
            const { s, f } = animationRule({ name, config: val, stylesheet, index: ruleIndex });
            if (this._sc.a <= ruleIndex) stylesheet.insertRule(s, ruleIndex);
            return { name, s, f };
        };
        const handlers = Object.entries(config).reduce(
            this._hs
                ? (acc, [key, val]) => {
                      const { name, s, f } = prepare(val);
                      fullCSS += s;
                      names.push(name);
                      acc[key] = f;
                      return acc;
                  }
                : (acc, [key, val]) => {
                      acc[key] = prepare(val).f;
                      return acc;
                  },
            {} as Record<string, AnimationResolver>
        ) as AnimationsResolvers<T>;
        if (this._hs) this.emit({ fn: ANIMATIONS, css: fullCSS, names });
        return handlers;
    };

    /**
     * Create layer
     */
    layer = (scope = this.scope): LayerResolver =>
        this._atRule({
            key: 'l',
            config: {},
            scope,
            getRule: layerRule
        });

    /**
     * Create layers
     * @param config - layers config
     */
    layers = <T extends string>(config: T[], initScope = this.scope): LayersResolvers<T> => {
        // local layers
        let scope = initScope;
        const order: string[] = [];
        if (scope) {
            const { key: scopeKey, c } = scope;
            const resolvers = config.reduce(
                (acc, key) => {
                    const index = c.l++;
                    const name = token(scopeKey, index);
                    order.push(name);
                    const ruleKey = AT_LAYER_ + name;
                    const resolver = (() => ruleKey) as LayerResolver;
                    resolver[Symbol.toPrimitive] = () => ruleKey;
                    acc[key] = resolver;
                    return acc;
                },
                {} as Record<NoInfer<T>, LayerResolver>
            );
            scope.t.l += AT_LAYER_ + order.join(', ') + SEMICOLON;
            scope.b.l++;
            return resolvers;
        }
        // global layers
        scope = this.gs;
        const stylesheet = this.ls;
        const resolvers = config.reduce(
            (acc, key) => {
                const index = scope.c.l++;
                const name = token(scope.key, index);
                order.push(name);
                const ruleKey = AT_LAYER_ + name;
                const resolver = (() => ruleKey) as LayerResolver;
                resolver[Symbol.toPrimitive] = () => ruleKey;
                acc[key] = resolver;
                return acc;
            },
            {} as Record<NoInfer<T>, LayerResolver>
        );
        const declaration = AT_LAYER_ + order.join(', ') + SEMICOLON;
        const declarationIndex = scope.b.l++;
        if (this._sc.l <= declarationIndex) stylesheet.insertRule(declaration, declarationIndex);
        if (this._hs) this.emit({ fn: LAYERS, css: declaration, names: order });
        return resolvers;
    };

    /**
     * Create container
     * @param type - container type
     */
    container: Container = (containerType) =>
        this._atRule({
            key: 'c',
            config: containerType,
            scope: this.scope,
            sideEffects: false,
            getRule: containerRule
        });

    /**
     * Create containers
     * @param config - containers config
     */
    containers = <T extends Record<string, ContainerType>>(config: T): ContainersResolvers<T> => {
        const items: { name: string; type: string }[] = [];
        const scope = this.scope || this.gs;
        const { key: scopeKey, c, t } = scope;
        const callback: (
            acc: Record<string, ContainerResolver>,
            [key, containerType]: [string, ContainerType]
        ) => Record<string, ContainerResolver> =
            this._hs && !this.scope
                ? (acc, [key, type]) => {
                      const index = c.c++;
                      const name = token(scopeKey, index);
                      const { f, e } = containerRule({
                          name,
                          config: type,
                          stylesheet: null
                      });
                      acc[key] = f;
                      items.push({ name, type: e.type });
                      return acc;
                  }
                : (acc, [key, type]) => {
                      const index = c.c++;
                      const name = token(scopeKey, index);
                      const { f } = containerRule({
                          name,
                          config: type,
                          stylesheet: null
                      });
                      acc[key] = f;
                      return acc;
                  };
        const handlers = Object.entries(config).reduce(
            callback,
            {} as Record<string, ContainerResolver>
        ) as ContainersResolvers<T>;
        if (this._hs) this.emit({ fn: CONTAINERS, items, css: '' });
        return handlers;
    };

    /**
     * Create font
     * @param config - font config
     */
    font = (config: FontConfig, scope = this.scope) =>
        this._atRule({
            key: 'f',
            config,
            scope,
            getRule: fontRule
        });

    /**
     * Create fonts
     * @param config - fonts configs
     */
    fonts = <T extends Record<string, FontConfig>>(
        config: T,
        initScope = this.scope
    ): FontsResolvers<T> => {
        // local fonts
        let scope = initScope;
        if (scope) {
            const { key: scopeKey, c, t } = scope;
            return Object.entries(config).reduce(
                (acc, [key, val]) => {
                    const index = c.f++;
                    const name = token(scopeKey, index);
                    const { s, f } = fontRule({ name, config: val, stylesheet: null });
                    t.f += s;
                    acc[key] = f;
                    return acc;
                },
                {} as Record<string, FontResolver>
            ) as FontsResolvers<T>;
        }
        // global fonts
        scope = this.gs;
        const stylesheet = this.fs;
        let fullCSS = '';
        const names: string[] = [];
        const prepare = (config: FontConfig) => {
            const index = scope.c.f++;
            const ruleIndex = scope.b.f++;
            const name = token(scope.key, index);
            const { s, f } = fontRule({ name, config, stylesheet, index: ruleIndex });
            if (this._sc.f <= ruleIndex) stylesheet.insertRule(s, ruleIndex);
            return { name, s, f };
        };
        const handlers = Object.entries(config).reduce(
            this._hs
                ? (acc, [key, val]) => {
                      const { name, s, f } = prepare(val);
                      fullCSS += s;
                      names.push(name);
                      acc[key] = f;
                      return acc;
                  }
                : (acc, [key, val]) => {
                      acc[key] = prepare(val).f;
                      return acc;
                  },
            {} as Record<string, FontResolver>
        ) as FontsResolvers<T>;
        if (this._hs) this.emit({ fn: FONTS, css: fullCSS, names });
        return handlers;
    };

    // resolveStylesheet
    rst = (
        generator: Function,
        {
            type
        }: {
            type: StyleSheetType;
        }
    ) => {
        const minify = this.minify;
        const scope = this.cs();
        const scopeKey = scope.key;
        const serverStyleSheet = this.serverCSS.get(scopeKey);
        let dict: Record<string, string> = {};
        let cssText: string = '';
        let stylesheet: EffCSSStyleSheet;
        if (serverStyleSheet) {
            stylesheet = serverStyleSheet;
            cssText = serverStyleSheet.ownerNode?.textContent || '';
        } else stylesheet = this.cst();

        const serverMeta = this.serverMeta.get(scopeKey);
        // in lazy mode stylesheets must be evaluated again to create all at-rules on demand
        if (serverStyleSheet && serverMeta && !this.lazy) dict = serverMeta;
        else {
            const hash: undefined | ((key: string) => string) =
                type === CUSTOM_STYLES
                    ? undefined
                    : getHash({
                          type,
                          dict,
                          scope,
                          minify
                      });
            const selectors = hash && getSelectorsProxy(hash);
            // save prev
            const prevScope = this.scope;
            // set next
            this.scope = scope;
            try {
                // calc rules inside current scope
                let styleObject: object | undefined;
                // if we have server css for custom styles
                if (type === CUSTOM_STYLES && cssText && !this.lazy) styleObject = undefined;
                else styleObject = generator(selectors);
                // if there are no server CSS
                if (!serverStyleSheet) {
                    cssText = scope.t.f + scope.t.l + scope.t.v + scope.t.a + parseStyles(styleObject);
                    stylesheet.replaceSync(cssText);
                }
            } finally {
                // return prev scope
                this.scope = prevScope;
            }
        }
        markStylesheet(stylesheet, scopeKey, dict);
        if (this._hs) this.emit({ fn: type, css: cssText, key: scopeKey, dict });
        const resolveNames = getFromDict(dict);
        let resolver: Function;
        if (type === CLASSNAMES) resolver = resolveNames;
        else if (type === ATTRIBUTES)
            resolver = (config: Record<string, true | Record<string, string | number | boolean>>) => ({
                [DATA_ + scope.key]: resolveNames(config)
            });
        else resolver = () => null;
        return {
            resolver,
            stylesheet,
            scope
        };
    }

    /**
     * Create stylesheet selectors
     * @param generator - stylesheet generator
     * @param params - stylesheet params
     */
    selectors = (
        generator: Function,
        {
            type
        }: {
            type: StyleSheetType;
        }
    ) => {
        const { resolver, stylesheet } = this.rst(generator, { type });
        return this.lst(resolver, stylesheet);
    }

    lazySelectors = (
        generator: Function,
        {
            type
        }: {
            type: StyleSheetType;
        }
    ) => {
        let selectorsResolver: Function;
        const lazyResolver = (config: object) => {
            if (!selectorsResolver) {
                const { resolver, stylesheet } = this.rst(generator, { type });
                selectorsResolver = resolver;
                this.lst(lazyResolver, stylesheet);
            }
            return selectorsResolver(config);
        };
        return lazyResolver;
    }
    // serialize layers
    protected _sl = (): string => {
        return serializeStylesheet(this._g.l, STYLE_ATTRS[LAYERS] + ` ${CTX_ATTR}="${this.prefix}"`);
    }
    // serialize variables
    protected _sv = (): string => {
        return serializeStylesheet(this._g.v, STYLE_ATTRS[VARIABLES] + ` ${CTX_ATTR}="${this.prefix}"`);
    }
    // serialize animations
    protected _sa = (): string => {
        return serializeStylesheet(this._g.a, STYLE_ATTRS[ANIMATIONS] + ` ${CTX_ATTR}="${this.prefix}"`);
    }
    // serialize shared
    protected _ssh = (): string => {
        return serializeStylesheet(this._g.s, STYLE_ATTRS[SHARED] + ` ${CTX_ATTR}="${this.prefix}"`);
    }
    // serialize fonts
    protected _sf = (): string => {
        return serializeStylesheet(this._g.f, STYLE_ATTRS[FONTS] + ` ${CTX_ATTR}="${this.prefix}"`);
    }

    serialize = (arg?: EffCSSStyleSheet | Function): string => {
        let stylesheet: EffCSSStyleSheet | undefined;
        if (isFunction(arg)) {
            stylesheet = this.map.get(arg);
            // if no stylesheet found
            if (!stylesheet) return '';
        } else stylesheet = arg as EffCSSStyleSheet | undefined;

        if (stylesheet) {
            switch (stylesheet) {
                case this._g.l:
                    return this._sl();
                case this._g.v:
                    return this._sv();
                case this._g.a:
                    return this._sa();
                case this._g.f:
                    return this._sf();
                case this._g.s:
                    return this._ssh();
                default:
                    return serializeStylesheet(stylesheet);
            }
        }
        return [...this.map.values()].reduce(
            (acc, stylesheet) => {
                return (acc += serializeStylesheet(stylesheet));
            },
            this._sl() + this._sv() + this._sf() + this._sa() + this._ssh()
        );
    }

    serializeMeta = (arg?: EffCSSStyleSheet | Function): string => {
        let stylesheet: EffCSSStyleSheet | undefined;
        if (isFunction(arg)) {
            stylesheet = this.map.get(arg);
            // if no stylesheet found
            if (!stylesheet) return '';
        } else stylesheet = arg as EffCSSStyleSheet | undefined;
        if (stylesheet) return serializeStylesheetMeta(stylesheet);
        return [...this.map.values()].reduce((acc, stylesheet) => {
            return (acc += serializeStylesheetMeta(stylesheet));
        }, '' as string);
    }

    // make

    // creators

    every: Creators = {
        [VARIABLE]: this[VARIABLE],
        [VARIABLES]: this[VARIABLES],
        [ANIMATION]: this[ANIMATION],
        [ANIMATIONS]: this[ANIMATIONS],
        [LAYER]: this[LAYER],
        [LAYERS]: this[LAYERS],
        [FONT]: this[FONT],
        [FONTS]: this[FONTS],
        [SELECTORS]: this[SELECTORS]
    };

    active: Creators = {
        [VARIABLE]: (config) => {
            const scope = this.scope;
            return lazyVariableResolver(() => this[VARIABLE](config, scope));
        },
        [VARIABLES]: (config) => {
            const scope = this.scope;
            return lazyBatch(Object.keys(config), () => this[VARIABLES](config, scope), lazyVariableResolver);
        },
        [ANIMATION]: (config) => {
            const scope = this.scope;
            return lazyStringResolver(() => this[ANIMATION](config, scope));
        },
        [ANIMATIONS]: (config) => {
            const scope = this.scope;
            return lazyBatch(Object.keys(config), () => this[ANIMATIONS](config, scope));
        },
        [LAYER]: () => {
            const scope = this.scope;
            return lazyStringResolver(() => this[LAYER](scope));
        },
        [LAYERS]: (config) => {
            const scope = this.scope;
            return lazyBatch(config, () => this[LAYERS](config, scope));
        },
        [FONT]: (config) => {
            const scope = this.scope;
            return lazyStringResolver(() => this[FONT](config, scope));
        },
        [FONTS]: (config) => {
            const scope = this.scope;
            return lazyBatch(Object.keys(config), () => this[FONTS](config, scope));
        },
        [SELECTORS]: this.lazySelectors
    } as Creators;

    make = this.every;
}

// public utils

/**
 * Create a new style generation context
 * @param config - context settings
 */
export const context = (config?: Settings) => {
    const provider = new StyleProvider(config);
    // single
    const variable: Variable = (config) => provider.make[VARIABLE](config);
    const animation: Animation = (config) => provider.make[ANIMATION](config);
    const layer: Layer = () => provider.make[LAYER]();
    const container: Container = (config) => provider[CONTAINER](config);
    const font: Font = (config) => provider.make[FONT](config);
    // multiple
    const variables: Variables = (config) => provider.make[VARIABLES](config);
    const animations: Animations = (config) => provider.make[ANIMATIONS](config);
    const layers: Layers = (config) => provider.make[LAYERS](config);
    const containers: Containers = (config) => provider[CONTAINERS](config);
    const fonts: Fonts = (config) => provider.make[FONTS](config);
    // lazy selectors
    const lazyId: LazyId = (rule) =>
        provider.lazyRule({
            fn: ID,
            rule,
            toString: getId
        });
    const lazyClassName: LazyClassName = (rule) =>
        provider.lazyRule({
            fn: CLASSNAME,
            rule,
            toString: getCls
        });
    const lazyAttribute: LazyAttribute = (rule) =>
        provider.lazyRule({
            fn: ATTRIBUTE,
            rule,
            toString: getAttr
        });
    // non-lazy selectors 
    const id = ((rule) => provider.id(rule)) as Id;
    id.lazy = lazyId;
    const className = ((rule) => provider.className(rule)) as ClassName;
    className.lazy = lazyClassName;
    const attribute = ((rule) => provider.attribute(rule)) as Attribute;
    attribute.lazy = lazyAttribute;
    // lazy stylesheets
    const lazyClassNames: LazyClassNames = (generator) =>
        provider.active.selectors(generator, TYPE_CLS) as ReturnType<ClassNames>;
    const lazyAttributes: LazyAttributes = (generator) =>
        provider.active.selectors(generator, TYPE_ATTRS) as ReturnType<Attributes>;
    const lazyCustomStyles: LazyCustomStyles = (generator) =>
        provider.active.selectors(generator, TYPE_CUSTOM) as ReturnType<CustomStyles>;
    // non-lazy stylesheets
    const classNames = ((generator) => provider.make.selectors(generator, TYPE_CLS)) as ClassNames;
    classNames.lazy = lazyClassNames;
    const attributes = ((generator) => provider.make.selectors(generator, TYPE_ATTRS)) as Attributes;
    attributes.lazy = lazyAttributes;
    const customStyles: CustomStyles = (generator) => provider.make.selectors(generator, TYPE_CUSTOM);
    customStyles.lazy = lazyCustomStyles;
    // special stylesheets
    const stylesheet = (resolver: Function): EffCSSStyleSheet | undefined =>
        resolver && provider.map.get(resolver);
    // advanced handlers
    const update: Update = provider.update;
    const serialize = provider.serialize;
    const serializeMeta = provider.serializeMeta;
    const configure = provider.configure;
    const subscribe = provider.subscribe;
    const theme: Theme = (config) => {
        const { vars, options, initial } = config;
        const varsResolvers = variables(vars);
        const list = Object.keys(options) as (keyof typeof options)[];
        let currentTheme: keyof typeof options | undefined = initial;
        const get = () => currentTheme;
        const set = (name: keyof typeof options) => {
            const themeValues = options[name];
            if (!themeValues) return false;
            Object.entries(themeValues).forEach(([key, value]) => varsResolvers[key].set(value));
            currentTheme = name;
            return true;
        };
        if (currentTheme) set(currentTheme);
        return {
            vars: varsResolvers,
            list,
            get,
            set
        };
    };

    return {
        // single at-rules

        /**
         * Create single variable
         * @param config - variable config
         */
        variable,
        /**
         * Create single animation
         * @param config - animation config
         */
        animation,
        /**
         * Create single layer
         * @param config - layer config
         */
        layer,
        /**
         * Create single container
         * @param config - container config
         */
        container,
        /**
         * Create single font
         * @param config - font config
         */
        font,

        // multiple at-rules

        /**
         * Create multiple variables
         * @param config - variables config
         */
        variables,
        /**
         * Create multiple animations
         * @param config - animations config
         */
        animations,
        /**
         * Create multiple layers
         * @param config - layers config
         */
        layers,
        /**
         * Create multiple containers
         * @param config - containers config
         */
        containers,
        /**
         * Create multiple fonts
         * @param config - fonts config
         */
        fonts,

        // lazy selectors

        /**
         * Create an anonymous rule with a id selector for the first use
         * @param rule - rule content
         */
        lazyId,
        /**
         * Create an anonymous rule with a class selector for the first use
         * @param rule - rule content
         */
        lazyClassName,
        /**
         * Create an anonymous rule with an attribute selector for the first use
         * @param rule - rule content
         */
        lazyAttribute,

        // non-lazy selectors

        /**
         * Create an anonymous rule with a id selector
         * @param rule - rule content
         */
        id,
        /**
         * Create an anonymous rule with a class selector
         * @param rule - rule content
         */
        className,
        /**
         * Create an anonymous rule with an attribute selector
         * @param rule - rule content
         */
        attribute,

        // lazy stylesheets

        /**
         * Create a lazy stylesheet with class selectors
         * @param generator - stylesheet generator
         */
        lazyClassNames,
        /**
         * Create a lazy stylesheet with attribute selectors
         * @param generator - stylesheet generator
         */
        lazyAttributes,
        /**
         * Create a lazy custom stylesheet
         * @param generator - stylesheet generator
         */
        lazyCustomStyles,

        // non-lazy stylesheets

        /**
         * Create a stylesheet with class selectors
         * @param generator - stylesheet generator
         */
        classNames,
        /**
         * Create a stylesheet with attribute selectors
         * @param generator - stylesheet generator
         */
        attributes,
        /**
         * Create a custom stylesheet
         * @param generator - stylesheet generator
         */
        customStyles,

        // special stylesheets

        /**
         * Get a stylesheet via resolver
         * @param resolver - stylesheet resolver
         */
        stylesheet,
        /**
         * Get the variables stylesheet
         */
        variablesStylesheet: () => provider.vs,
        /**
         * Get the animations stylesheet
         */
        animationsStylesheet: () => provider.as,
        /**
         * Get the layers stylesheet
         */
        layersStylesheet: () => provider.ls,
        /**
         * Get the shared stylesheet
         */
        sharedStylesheet: () => provider.ss,
        /**
         * Get the fonts stylesheet
         */
        fontsStylesheet: () => provider.fs,

        // advanced handlers

        /**
         * Update variable/variables
         * @param arg - source variable/variables
         * @param value - next value
         */
        update,
        /**
         * Serialize specified or all stylesheets
         * @param arg - concrete stylesheet or selectors resolver
         */
        serialize,
        /**
         * Serialize metadata of specified or all stylesheets
         * @param arg - concrete stylesheet or selectors resolver
         */
        serializeMeta,
        /**
         * Configure CSS generation
         * @param config - generation config
         */
        configure,
        /**
         * Subscribe to CSS generation events
         * @param fn - callback receiving EffCSSEvent
         * @returns unsubscribe function
         */
        subscribe,
        /**
         * Create theme
         * @param config - theme config
         */
        theme
    }
};

export const {
    // single at-rules
    variable,
    animation,
    layer,
    container,
    font,
    // multiple at-rules
    variables,
    animations,
    layers,
    containers,
    fonts,
    // lazy selectors 
    lazyId,
    lazyClassName,
    lazyAttribute,
    // non-lazy selectors
    id,
    className,
    attribute,
    // lazy stylesheets
    lazyClassNames,
    lazyAttributes,
    lazyCustomStyles,
    // non-lazy stylesheets
    classNames,
    attributes,
    customStyles,
    // special stylesheets
    stylesheet,
    variablesStylesheet,
    animationsStylesheet,
    layersStylesheet,
    sharedStylesheet,
    fontsStylesheet,
    // advanced handlers
    update,
    serialize,
    serializeMeta,
    configure,
    subscribe,
    theme,
} = context();
