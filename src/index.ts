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
    index?: number;
};
type GetAtRule<T, F, E = object> = (params: AtRuleParams<T>) => { s: string; f: F; e: E };

// constants

const SEMICOLON = ';';
const DASH = '-';
const DATA_ = 'data-';
const PREFIX = DATA_ + LIBRARY + DASH;
const KEY_ATTR = PREFIX + 'key';
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

const variableRule: GetAtRule<VariableConfig, VariableResolver> = ({ name, config, stylesheet, index }) => {
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
        if (StyleProvider._hs) StyleProvider.emit({ fn: VARIABLE_SET, css: s, name, value });
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

const getHash = (params: { type: StyleSheetType; scope: Scope; dict: Record<string, string> }) => {
    const { scope, type, dict } = params;
    const scopeKey = scope.key;
    let add: (key: string) => string;
    let hash: undefined | ((key: string) => string);
    if (type === CLASSNAMES) {
        add = StyleProvider.minify
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
        add = StyleProvider.minify
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

    protected static _lazy = false;
    static prefix = 'f';
    static minify = true;
    static emulate = false;

    static get lazy() {
        return StyleProvider._lazy;
    }
    static set lazy(value: boolean) {
        if (value !== StyleProvider._lazy) {
            StyleProvider._lazy = value;
            StyleProvider.make = value ? StyleProvider.active : StyleProvider.every;
        }
    }

    // scopes

    // global scope
    protected static _gs: Scope;

    // global scope
    static get gs(): Scope {
        if (!StyleProvider._gs) StyleProvider._gs = StyleProvider.cs();
        return StyleProvider._gs;
    }

    static scope: Scope | null = null;
    static scopeCount = 0;

    // create scope
    static cs(): Scope {
        const key = StyleProvider.prefix + toRadix(StyleProvider.scopeCount++);
        return createScope(key);
    }

    // stylesheets

    // server counters
    protected static _sc: Scope['c'] = {
        v: 0,
        a: 0,
        l: 0,
        f: 0,
        s: 0,
        c: 0
    };

    // global stylesheets
    static _g: Partial<Record<'v' | 'a' | 'l' | 'f' | 's', EffCSSStyleSheet>> = {};

    protected static _serverGlobalCSS: Map<GlobalKey, CSSStyleSheet> | null = null;
    protected static _serverCSS: Map<string, CSSStyleSheet> | null = null;
    protected static _serverMeta: Map<string, Record<string, string>> | null = null;

    static map: Map<any, EffCSSStyleSheet> = new Map<any, EffCSSStyleSheet>();

    // subscribers
    protected static _sub: Set<(data: EffCSSEvent) => void> = new Set();
    // hasSubscribers
    static _hs: boolean = false;

    static emit(data: EffCSSEvent): void {
        for (const fn of StyleProvider._sub) {
            try {
                fn(data);
            } catch {
                /* ignore */
            }
        }
    }

    static subscribe(fn: (data: EffCSSEvent) => void): () => void {
        StyleProvider._sub.add(fn);
        StyleProvider._hs = !!StyleProvider._sub.size;
        return () => {
            StyleProvider._sub.delete(fn);
            StyleProvider._hs = !!StyleProvider._sub.size;
        };
    }

    static get serverCSS(): Map<string, CSSStyleSheet> {
        if (!StyleProvider._serverCSS) {
            StyleProvider._serverCSS = new Map();
            const elements = globalThis.document?.head.querySelectorAll(
                `style[${KEY_ATTR}]`
            ) as NodeListOf<HTMLStyleElement> | null;
            elements?.forEach((el) => {
                const key = el.getAttribute(KEY_ATTR);
                const sheet = el.sheet;
                if (key && sheet) StyleProvider._serverCSS!.set(key, sheet);
            });
        }
        return StyleProvider._serverCSS as Map<string, CSSStyleSheet>;
    }

    static get serverGlobalCSS(): Map<GlobalKey, EffCSSStyleSheet> {
        if (!StyleProvider._serverGlobalCSS) {
            StyleProvider._serverGlobalCSS = new Map();
            const elements = globalThis.document?.head.querySelectorAll(
                `[${GLOBAL_ATTR}]`
            ) as NodeListOf<HTMLStyleElement> | null;
            elements?.forEach((el) => {
                const key = el.getAttribute(GLOBAL_ATTR) as GlobalKey;
                const sheet = el.sheet;
                if (key && sheet) StyleProvider._serverGlobalCSS!.set(key, sheet);
            });
        }
        return StyleProvider._serverGlobalCSS;
    }

    static get serverMeta(): Map<string, Record<string, string>> {
        if (!StyleProvider._serverMeta) {
            StyleProvider._serverMeta = new Map();
            const elements = globalThis.document?.head.querySelectorAll(
                `script[${KEY_ATTR}]`
            ) as NodeListOf<HTMLScriptElement> | null;
            elements?.forEach((el) => {
                const key = el.getAttribute(KEY_ATTR);
                const textContent = el.textContent;
                const dict = textContent ? JSON.parse(el.textContent) : {};
                if (key) StyleProvider._serverMeta!.set(key, dict);
            });
        }
        return StyleProvider._serverMeta;
    }

    // get global stylesheet
    static _gg(key: 'v' | 'a' | 'l' | 'f' | 's'): EffCSSStyleSheet {
        if (!StyleProvider._g[key]) {
            const serverStylesheet = StyleProvider.serverGlobalCSS.get(SHORT[key]);
            if (serverStylesheet) {
                StyleProvider._g[key] = serverStylesheet;
                StyleProvider._sc[key] = serverStylesheet[CSS_RULES].length;
            } else StyleProvider._g[key] = StyleProvider.cst();
        }
        return StyleProvider._g[key];
    }

    static get vs(): EffCSSStyleSheet {
        return StyleProvider._gg('v');
    }

    static get as(): EffCSSStyleSheet {
        return StyleProvider._gg('a');
    }

    static get ls(): EffCSSStyleSheet {
        return StyleProvider._gg('l');
    }

    static get fs(): EffCSSStyleSheet {
        return StyleProvider._gg('f');
    }

    static get ss(): EffCSSStyleSheet {
        return StyleProvider._gg('s');
    }

    // createStyleSheet
    static cst = (cssText: string = ''): EffCSSStyleSheet => {
        let stylesheet;
        if (!globalThis.CSSStyleSheet || StyleProvider.emulate) {
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
    static lst(resolver: any, stylesheet: EffCSSStyleSheet) {
        StyleProvider.map.set(resolver, stylesheet);
        return resolver;
    }

    static update: Update = (resolver: any, value: any) => {
        if (StyleProvider.scope) return;
        if (isFunction(resolver)) resolver.set(value);
        else Object.entries<any>(value).forEach(([key, val]) => resolver[key].set(val));
    };

    // creators

    static _rule = ({
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
        const stylesheet = StyleProvider.ss;
        if (StyleProvider._sc.s <= index) stylesheet.insertRule(cssText, stylesheet[CSS_RULES].length);
        if (StyleProvider._hs) StyleProvider.emit({ fn, css: cssText, result });
        return result;
    };

    static _lazyRule = <T>({
        fn,
        rule,
        toString
    }: {
        fn: 'id' | 'className' | 'attribute';
        rule: RuleConfig;
        toString: (result: any) => string;
    }) => {
        let result: any;
        const gen = () => (result = StyleProvider[fn](isFunction(rule) ? (rule as Function)() : rule));
        const replacer = (() => {
            if (result === undefined) return gen();
            return result;
        }) as T;
        (replacer as any)[Symbol.toPrimitive] = () => toString(result ?? gen());
        return replacer;
    };

    static id: (rule: object) => string = (rule) => {
        if (StyleProvider.scope) return '';
        const scope = StyleProvider.gs;
        const index = scope.c.s++;
        const result = tokenUnder(scope.key, index);
        const selector = getId(result);
        return StyleProvider._rule({
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
    static className: (rule: object) => string = (rule: object) => {
        if (StyleProvider.scope) return '';
        const scope = StyleProvider.gs;
        const index = scope.c.s++;
        const result = tokenUnder(scope.key, index);
        const selector = getCls(result);
        return StyleProvider._rule({
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
    static attribute: (rule: object) => object = (rule: object) => {
        if (StyleProvider.scope) return {};
        const scope = StyleProvider.gs;
        const index = scope.c.s++;
        const attr = DATA_ + token(scope.key, index);
        const selector = '[' + attr + ']';
        const result = { [attr]: '' };
        return StyleProvider._rule({
            fn: ATTRIBUTE,
            result,
            index,
            selector,
            rule
        });
    };

    static _atRule = <T, F, E = object>({
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
        getRule(params: { name: string; config: T; stylesheet?: EffCSSStyleSheet | null; index?: number }): {
            s: string;
            f: F;
            e: E;
        };
        getName?: (key: string, index: number) => string;
        sideEffects?: boolean;
    }): F => {
        // local rule
        const ruleScope = scope || StyleProvider.gs;
        const index = ruleScope.c[key]++;
        const name = getName(ruleScope.key, index);
        if (scope) {
            const { s, f } = getRule({ name, config, stylesheet: null });
            scope.t[key] += s;
            return f;
        }
        // global rule
        const ruleIndex = ruleScope.b[key]++;
        const stylesheet = sideEffects ? StyleProvider._gg(key as keyof typeof StyleProvider._g) : null;
        const { s, f, e = {} } = getRule({ name, config, stylesheet, index: ruleIndex });
        if (sideEffects && stylesheet && StyleProvider._sc[key] <= ruleIndex) stylesheet.insertRule(s, ruleIndex);
        if (StyleProvider._hs)
            StyleProvider.emit({ fn: SHORT_SINGLE[key], css: s, name, ...(e as object) } as unknown as EffCSSEvent);
        return f;
    };

    /**
     * Create variable
     * @param config - variable config
     */
    static variable = (config?: VariableConfig, scope = StyleProvider.scope): VariableResolver =>
        StyleProvider._atRule({
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
    static variables = <T extends Record<string, VariableConfig>>(
        config: T,
        initScope = StyleProvider.scope
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
        scope = StyleProvider.gs;
        const { key: scopeKey, c, b } = scope;
        const stylesheet = StyleProvider.vs;
        let fullCSS = '';
        const names: string[] = [];
        const prepare = (val: VariableConfig) => {
            const index = c.v++;
            const ruleIndex = b.v++;
            const name = varName(scopeKey, index);
            const { s, f } = variableRule({ name, config: val, stylesheet, index: ruleIndex });
            if (StyleProvider._sc.v <= ruleIndex) stylesheet.insertRule(s, ruleIndex);
            return { name, s, f };
        };
        const handlers = Object.entries(config).reduce(
            StyleProvider._hs
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
        if (StyleProvider._hs) StyleProvider.emit({ fn: VARIABLES, css: fullCSS, names });
        return handlers;
    };

    /**
     * Create animation
     * @param config - animation config
     */
    static animation = <T extends Record<string, object>>(config: T, scope = StyleProvider.scope): AnimationResolver =>
        StyleProvider._atRule({
            key: 'a',
            config,
            scope,
            getRule: animationRule
        });

    /**
     * Create animations
     * @param config - animation configs
     */
    static animations = <T extends Record<string, AnimationConfig>>(
        config: T,
        initScope = StyleProvider.scope
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
        scope = StyleProvider.gs;
        const stylesheet = StyleProvider.as;
        let fullCSS = '';
        const names: string[] = [];
        const prepare = (val: AnimationConfig) => {
            const index = scope.c.a++;
            const ruleIndex = scope.b.a++;
            const name = token(scope.key, index);
            const { s, f } = animationRule({ name, config: val, stylesheet, index: ruleIndex });
            if (StyleProvider._sc.a <= ruleIndex) stylesheet.insertRule(s, ruleIndex);
            return { name, s, f };
        };
        const handlers = Object.entries(config).reduce(
            StyleProvider._hs
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
        if (StyleProvider._hs) StyleProvider.emit({ fn: ANIMATIONS, css: fullCSS, names });
        return handlers;
    };

    /**
     * Create layer
     */
    static layer = (scope = StyleProvider.scope): LayerResolver =>
        StyleProvider._atRule({
            key: 'l',
            config: {},
            scope,
            getRule: layerRule
        });

    /**
     * Create layers
     * @param config - layers config
     */
    static layers = <T extends string>(config: T[], initScope = StyleProvider.scope): LayersResolvers<T> => {
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
        scope = StyleProvider.gs;
        const stylesheet = StyleProvider.ls;
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
        if (StyleProvider._sc.l <= declarationIndex) stylesheet.insertRule(declaration, declarationIndex);
        if (StyleProvider._hs) StyleProvider.emit({ fn: LAYERS, css: declaration, names: order });
        return resolvers;
    };

    /**
     * Create container
     * @param type - container type
     */
    static container: Container = (containerType) =>
        StyleProvider._atRule({
            key: 'c',
            config: containerType,
            scope: StyleProvider.scope,
            sideEffects: false,
            getRule: containerRule
        });

    /**
     * Create containers
     * @param config - containers config
     */
    static containers = <T extends Record<string, ContainerType>>(config: T): ContainersResolvers<T> => {
        const items: { name: string; type: string }[] = [];
        const scope = StyleProvider.scope || StyleProvider.gs;
        const { key: scopeKey, c, t } = scope;
        const callback: (
            acc: Record<string, ContainerResolver>,
            [key, containerType]: [string, ContainerType]
        ) => Record<string, ContainerResolver> =
            StyleProvider._hs && !StyleProvider.scope
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
        if (StyleProvider._hs) StyleProvider.emit({ fn: CONTAINERS, items, css: '' });
        return handlers;
    };

    /**
     * Create font
     * @param config - font config
     */
    static font = (config: FontConfig, scope = StyleProvider.scope) =>
        StyleProvider._atRule({
            key: 'f',
            config,
            scope,
            getRule: fontRule
        });

    /**
     * Create fonts
     * @param config - fonts configs
     */
    static fonts = <T extends Record<string, FontConfig>>(
        config: T,
        initScope = StyleProvider.scope
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
        scope = StyleProvider.gs;
        const stylesheet = StyleProvider.fs;
        let fullCSS = '';
        const names: string[] = [];
        const prepare = (config: FontConfig) => {
            const index = scope.c.f++;
            const ruleIndex = scope.b.f++;
            const name = token(scope.key, index);
            const { s, f } = fontRule({ name, config, stylesheet, index: ruleIndex });
            if (StyleProvider._sc.f <= ruleIndex) stylesheet.insertRule(s, ruleIndex);
            return { name, s, f };
        };
        const handlers = Object.entries(config).reduce(
            StyleProvider._hs
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
        if (StyleProvider._hs) StyleProvider.emit({ fn: FONTS, css: fullCSS, names });
        return handlers;
    };

    // resolveStylesheet
    static rst(
        generator: Function,
        {
            type
        }: {
            type: StyleSheetType;
        }
    ) {
        const scope = StyleProvider.cs();
        const scopeKey = scope.key;
        const serverStyleSheet = StyleProvider.serverCSS.get(scopeKey);
        let dict: Record<string, string> = {};
        let cssText: string = '';
        let stylesheet: EffCSSStyleSheet;
        if (serverStyleSheet) {
            stylesheet = serverStyleSheet;
            cssText = serverStyleSheet.ownerNode?.textContent || '';
        } else stylesheet = StyleProvider.cst();

        const serverMeta = StyleProvider.serverMeta.get(scopeKey);
        // in lazy mode stylesheets must be evaluated again to create all at-rules on demand
        if (serverStyleSheet && serverMeta && !StyleProvider.lazy) dict = serverMeta;
        else {
            const hash: undefined | ((key: string) => string) =
                type === CUSTOM_STYLES
                    ? undefined
                    : getHash({
                          type,
                          dict,
                          scope
                      });
            const selectors = hash && getSelectorsProxy(hash);
            // save prev
            const prevScope = StyleProvider.scope;
            // set next
            StyleProvider.scope = scope;
            try {
                // calc rules inside current scope
                let styleObject: object | undefined;
                // if we have server css for custom styles
                if (type === CUSTOM_STYLES && cssText && !StyleProvider.lazy) styleObject = undefined;
                else styleObject = generator(selectors);
                // if there are no server CSS
                if (!serverStyleSheet) {
                    cssText = scope.t.f + scope.t.l + scope.t.v + scope.t.a + parseStyles(styleObject);
                    stylesheet.replaceSync(cssText);
                }
            } finally {
                // return prev scope
                StyleProvider.scope = prevScope;
            }
        }
        markStylesheet(stylesheet, scopeKey, dict);
        if (StyleProvider._hs) StyleProvider.emit({ fn: type, css: cssText, key: scopeKey, dict });
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
    static selectors(
        generator: Function,
        {
            type
        }: {
            type: StyleSheetType;
        }
    ) {
        const { resolver, stylesheet } = StyleProvider.rst(generator, { type });
        return StyleProvider.lst(resolver, stylesheet);
    }

    static lazySelectors(
        generator: Function,
        {
            type
        }: {
            type: StyleSheetType;
        }
    ) {
        let selectorsResolver: Function;
        const lazyResolver = (config: object) => {
            if (!selectorsResolver) {
                const { resolver, stylesheet } = StyleProvider.rst(generator, { type });
                selectorsResolver = resolver;
                StyleProvider.lst(lazyResolver, stylesheet);
            }
            return selectorsResolver(config);
        };
        return lazyResolver;
    }
    // serialize layers
    protected static _sl(): string {
        return serializeStylesheet(StyleProvider._g.l, STYLE_ATTRS[LAYERS]);
    }
    // serialize variables
    protected static _sv(): string {
        return serializeStylesheet(StyleProvider._g.v, STYLE_ATTRS[VARIABLES]);
    }
    // serialize animations
    protected static _sa(): string {
        return serializeStylesheet(StyleProvider._g.a, STYLE_ATTRS[ANIMATIONS]);
    }
    // serialize shared
    protected static _ssh(): string {
        return serializeStylesheet(StyleProvider._g.s, STYLE_ATTRS[SHARED]);
    }
    // serialize fonts
    protected static _sf(): string {
        return serializeStylesheet(StyleProvider._g.f, STYLE_ATTRS[FONTS]);
    }

    static serialize(arg?: EffCSSStyleSheet | Function): string {
        let stylesheet: EffCSSStyleSheet | undefined;
        if (isFunction(arg)) {
            stylesheet = StyleProvider.map.get(arg);
            // if no stylesheet found
            if (!stylesheet) return '';
        } else stylesheet = arg as EffCSSStyleSheet | undefined;

        if (stylesheet) {
            switch (stylesheet) {
                case StyleProvider._g.l:
                    return StyleProvider._sl();
                case StyleProvider._g.v:
                    return StyleProvider._sv();
                case StyleProvider._g.a:
                    return StyleProvider._sa();
                case StyleProvider._g.f:
                    return StyleProvider._sf();
                case StyleProvider._g.s:
                    return StyleProvider._ssh();
                default:
                    return serializeStylesheet(stylesheet);
            }
        }
        return [...StyleProvider.map.values()].reduce(
            (acc, stylesheet) => {
                return (acc += serializeStylesheet(stylesheet));
            },
            StyleProvider._sl() + StyleProvider._sv() + StyleProvider._sf() + StyleProvider._sa() + StyleProvider._ssh()
        );
    }

    static serializeMeta(arg?: EffCSSStyleSheet | Function): string {
        let stylesheet: EffCSSStyleSheet | undefined;
        if (isFunction(arg)) {
            stylesheet = StyleProvider.map.get(arg);
            // if no stylesheet found
            if (!stylesheet) return '';
        } else stylesheet = arg as EffCSSStyleSheet | undefined;
        if (stylesheet) return serializeStylesheetMeta(stylesheet);
        return [...StyleProvider.map.values()].reduce((acc, stylesheet) => {
            return (acc += serializeStylesheetMeta(stylesheet));
        }, '' as string);
    }

    // make

    // creators

    static every: Creators = {
        [VARIABLE]: StyleProvider[VARIABLE],
        [VARIABLES]: StyleProvider[VARIABLES],
        [ANIMATION]: StyleProvider[ANIMATION],
        [ANIMATIONS]: StyleProvider[ANIMATIONS],
        [LAYER]: StyleProvider[LAYER],
        [LAYERS]: StyleProvider[LAYERS],
        [FONT]: StyleProvider[FONT],
        [FONTS]: StyleProvider[FONTS],
        [SELECTORS]: StyleProvider[SELECTORS]
    };

    static active: Creators = {
        [VARIABLE]: (config) => {
            const scope = StyleProvider.scope;
            return lazyVariableResolver(() => StyleProvider[VARIABLE](config, scope));
        },
        [VARIABLES]: (config) => {
            const scope = StyleProvider.scope;
            return lazyBatch(Object.keys(config), () => StyleProvider[VARIABLES](config, scope), lazyVariableResolver);
        },
        [ANIMATION]: (config) => {
            const scope = StyleProvider.scope;
            return lazyStringResolver(() => StyleProvider[ANIMATION](config, scope));
        },
        [ANIMATIONS]: (config) => {
            const scope = StyleProvider.scope;
            return lazyBatch(Object.keys(config), () => StyleProvider[ANIMATIONS](config, scope));
        },
        [LAYER]: () => {
            const scope = StyleProvider.scope;
            return lazyStringResolver(() => StyleProvider[LAYER](scope));
        },
        [LAYERS]: (config) => {
            const scope = StyleProvider.scope;
            return lazyBatch(config, () => StyleProvider[LAYERS](config, scope));
        },
        [FONT]: (config) => {
            const scope = StyleProvider.scope;
            return lazyStringResolver(() => StyleProvider[FONT](config, scope));
        },
        [FONTS]: (config) => {
            const scope = StyleProvider.scope;
            return lazyBatch(Object.keys(config), () => StyleProvider[FONTS](config, scope));
        },
        [SELECTORS]: StyleProvider.lazySelectors
    } as Creators;

    static make = StyleProvider.every;
}

// public utils

// single

/**
 * Create single variable
 * @param config - variable config
 */
export const variable: Variable = (config) => StyleProvider.make[VARIABLE](config);

/**
 * Create single animation
 * @param config - animation config
 */
export const animation: Animation = (config) => StyleProvider.make[ANIMATION](config);

/**
 * Create single layer
 * @param config - layer config
 */
export const layer: Layer = () => StyleProvider.make[LAYER]();

/**
 * Create single container
 * @param config - container config
 */
export const container: Container = (config) => StyleProvider[CONTAINER](config);

/**
 * Create single font
 * @param config - font config
 */
export const font: Font = (config) => StyleProvider.make[FONT](config);

// multiple

/**
 * Create multiple variables
 * @param config - variables config
 */
export const variables: Variables = (config) => StyleProvider.make[VARIABLES](config);

/**
 * Create multiple animations
 * @param config - animations config
 */
export const animations: Animations = (config) => StyleProvider.make[ANIMATIONS](config);

/**
 * Create multiple layers
 * @param config - layers config
 */
export const layers: Layers = (config) => StyleProvider.make[LAYERS](config);

/**
 * Create multiple containers
 * @param config - containers config
 */
export const containers: Containers = (config) => StyleProvider[CONTAINERS](config);

/**
 * Create multiple fonts
 * @param config - fonts config
 */
export const fonts: Fonts = (config) => StyleProvider.make[FONTS](config);

// selectors

// lazy

/**
 * Create an anonymous rule with a id selector for the first use
 * @param rule - rule content
 */
export const lazyId: LazyId = (rule) =>
    StyleProvider._lazyRule({
        fn: ID,
        rule,
        toString: getId
    });

/**
 * Create an anonymous rule with a class selector for the first use
 * @param rule - rule content
 */
export const lazyClassName: LazyClassName = (rule) =>
    StyleProvider._lazyRule({
        fn: CLASSNAME,
        rule,
        toString: getCls
    });

/**
 * Create an anonymous rule with an attribute selector for the first use
 * @param rule - rule content
 */
export const lazyAttribute: LazyAttribute = (rule) =>
    StyleProvider._lazyRule({
        fn: ATTRIBUTE,
        rule,
        toString: getAttr
    });

// base

/**
 * Create an anonymous rule with a id selector
 * @param rule - rule content
 */
export const id = ((rule) => StyleProvider.id(rule)) as Id;
id.lazy = lazyId;

/**
 * Create an anonymous rule with a class selector
 * @param rule - rule content
 */
export const className = ((rule) => StyleProvider.className(rule)) as ClassName;
className.lazy = lazyClassName;

/**
 * Create an anonymous rule with an attribute selector
 * @param rule - rule content
 */
export const attribute = ((rule) => StyleProvider.attribute(rule)) as Attribute;
attribute.lazy = lazyAttribute;

// multiple

// lazy

/**
 * Create a lazy stylesheet with class selectors
 * @param generator - stylesheet generator
 */
export const lazyClassNames: LazyClassNames = (generator) =>
    StyleProvider.active.selectors(generator, TYPE_CLS) as ReturnType<ClassNames>;

/**
 * Create a lazy stylesheet with attribute selectors
 * @param generator - stylesheet generator
 */
export const lazyAttributes: LazyAttributes = (generator) =>
    StyleProvider.active.selectors(generator, TYPE_ATTRS) as ReturnType<Attributes>;

/**
 * Create a lazy custom stylesheet
 * @param generator - stylesheet generator
 */
export const lazyCustomStyles: LazyCustomStyles = (generator) =>
    StyleProvider.active.selectors(generator, TYPE_CUSTOM) as ReturnType<CustomStyles>;

// base

/**
 * Create a stylesheet with class selectors
 * @param generator - stylesheet generator
 */
export const classNames = ((generator) => StyleProvider.make.selectors(generator, TYPE_CLS)) as ClassNames;
classNames.lazy = lazyClassNames;

/**
 * Create a stylesheet with attribute selectors
 * @param generator - stylesheet generator
 */
export const attributes = ((generator) => StyleProvider.make.selectors(generator, TYPE_ATTRS)) as Attributes;
attributes.lazy = lazyAttributes;

/**
 * Create a custom stylesheet
 * @param generator - stylesheet generator
 */
export const customStyles: CustomStyles = (generator) => StyleProvider.make.selectors(generator, TYPE_CUSTOM);
customStyles.lazy = lazyCustomStyles;

// stylesheets

/**
 * Get a stylesheet via resolver
 * @param resolver - stylesheet resolver
 */
export const stylesheet = (resolver: Function): EffCSSStyleSheet | undefined =>
    resolver && StyleProvider.map.get(resolver);

/**
 * Get the variables stylesheet
 */
export const variablesStylesheet = () => StyleProvider.vs;

/**
 * Get the animations stylesheet
 */
export const animationsStylesheet = () => StyleProvider.as;

/**
 * Get the layers stylesheet
 */
export const layersStylesheet = () => StyleProvider.ls;

/**
 * Get the shared stylesheet
 */
export const sharedStylesheet = () => StyleProvider.ss;

/**
 * Get the fonts stylesheet
 */
export const fontsStylesheet = () => StyleProvider.fs;

// advanced

/**
 * Update variable/variables
 * @param arg - source variable/variables
 * @param value - next value
 */
export const update: Update = (arg: any, value: any) => StyleProvider.update(arg, value);

/**
 * Serialize specified or all stylesheets
 * @param arg - concrete stylesheet or selectors resolver
 */
export const serialize = (arg?: EffCSSStyleSheet | Function) => StyleProvider.serialize(arg);

/**
 * Serialize metadata of specified or all stylesheets
 * @param arg - concrete stylesheet or selectors resolver
 */
export const serializeMeta = (arg?: EffCSSStyleSheet | Function) => StyleProvider.serializeMeta(arg);

/**
 * Configure CSS generation
 * @param config - generation config
 */
export const configure = (config: { prefix?: string; minify?: boolean; emulate?: boolean; lazy?: boolean }) => {
    if (StyleProvider.scopeCount > 0) return false;
    const {
        prefix = StyleProvider.prefix,
        minify = StyleProvider.minify,
        emulate = StyleProvider.emulate,
        lazy = StyleProvider.lazy
    } = config;
    StyleProvider.prefix = prefix;
    StyleProvider.minify = minify;
    StyleProvider.emulate = emulate;
    StyleProvider.lazy = lazy;
    return true;
};

/**
 * Subscribe to CSS generation events
 * @param fn - callback receiving EffCSSEvent
 * @returns unsubscribe function
 */
export const subscribe = (fn: (event: EffCSSEvent) => void): (() => void) => StyleProvider.subscribe(fn);

/**
 * Create theme
 * @param config - theme config
 */
export const theme: Theme = (config) => {
    const { vars, options, initial } = config;
    const varsResolvers = StyleProvider.variables(vars);
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
