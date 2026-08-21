import type {
    CustomStyles,
    ClassNames, ClassNamesResolver,
    Attributes, AttributesResolver,
    Attribute, ClassName,
    Variable, VariableResolver,
    Animation, AnimationResolver,
    Container, ContainerResolver,
    Layer, LayerResolver,
    Font, FontResolver,
    Variables, VariablesResolvers,
    Animations, AnimationsResolvers,
    Containers, ContainersResolvers,
    Layers, LayersResolvers,
    Fonts, FontsResolvers,
    EffCSSStyleSheet, EffCSSEvent, Generator,

    VariableConfig,
    AnimationConfig,
    ContainerType,
    FontConfig,
    Scope,
    VariableDescription,
    Update,
    StyleSheetType, GlobalKey
} from './types';
import {
    keySymbol,
    indexSymbol,
    dictSymbol,
    LIBRARY
} from './constants';

export type {
    CustomStyles,
    ClassNames, ClassNamesResolver,
    Attributes, AttributesResolver,
    Attribute, ClassName,
    Variable, VariableResolver,
    Animation, AnimationResolver,
    Container, ContainerResolver,
    Layer, LayerResolver,
    Font, FontResolver,
    Variables, VariablesResolvers,
    Animations, AnimationsResolvers,
    Containers, ContainersResolvers,
    Layers, LayersResolvers,
    Fonts, FontsResolvers,
    EffCSSStyleSheet, EffCSSEvent, Generator
};
const DATA_ = 'data-';
const PREFIX = DATA_ + LIBRARY + '-';
const KEY_ATTR = PREFIX + 'key';
const GLOBAL_ATTR = PREFIX + 'global';
const DIVIDER = '_';
const CSS_RULES = 'cssRules';
const ATTRIBUTE = 'attribute';
const ATTRIBUTES = ATTRIBUTE + 's' as 'attributes';
const CLASSNAME = 'className';
const CLASSNAMES = CLASSNAME + 's' as 'classNames';
const CUSTOM_STYLES = 'customStyles';
const VARIABLE = 'variable';
const VARIABLES = VARIABLE + 's' as 'variables';
const VARIABLE_SET = VARIABLE + '.set' as 'variable.set';
const ANIMATION = 'animation';
const ANIMATIONS = ANIMATION + 's' as 'animations';
const CONTAINER = 'container';
const CONTAINERS = CONTAINER + 's' as 'containers';
const FONT = 'font';
const FONTS = FONT + 's' as 'fonts';
const LAYER = 'layer';
const LAYERS = LAYER + 's' as 'layers';
const AT_LAYER_ = '@' + LAYER + ' ';
const SHARED = 'shared';
const TYPE_ATTRS = { type: ATTRIBUTES } as const;
const TYPE_CLS = { type: CLASSNAMES } as const;
const TYPE_CUSTOM =  { type: CUSTOM_STYLES } as const;
const GLOBALS = [LAYERS, VARIABLES, FONTS, ANIMATIONS, SHARED] as const;
const STYLE_ATTRS = GLOBALS.reduce((acc, key) => ({
    ...acc, [key]: GLOBAL_ATTR + '="'  + key + '"'
}), {} as Record<string, string>);
const keyAttr = (val: string) => `${KEY_ATTR}="${val}"`;
const isSymbol = (val: any) => typeof val === 'symbol';
const isObject = (val: any) => val !== null && typeof val === 'object';
const isNotNumber = (arg: any) => typeof arg !== 'number';
const kebabCache = new Map<string, string>();
const kebabCase = (str: string): string => {
    let k = kebabCache.get(str);
    if (!k) {
        k = str.replace(/[A-Z]/g, (v) => '-' + v.toLowerCase());
        kebabCache.set(str, k);
    }
    return k;
};
const propVal = (prop: string, val: any) => `${kebabCase(prop)}:${'' + val};`
const toRadix = (num: number) => num.toString(36);
const hasProperty = (obj: any, prop: PropertyKey) => Object.prototype.hasOwnProperty.call(obj, prop);

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
        for (const prop in value as object) {
            if (hasProperty(value, prop)) collect(prop, (value as any)[prop], out);
        }
        out.push('}');
        return;
    }
    if (value === '') {
        out.push(resKey, ';');
        return;
    }
    out.push(propVal(resKey, value));
};

const parseStyles = (styles: object = {}): string => {
    const out: string[] = [];
    for (const prop in styles as object) {
        if (hasProperty(styles, prop)) collect(prop, (styles as any)[prop], out);
    }
    return out.join('');
};

const markStylesheet = (stylesheet: EffCSSStyleSheet, key: string, dict: Record<string, string>) => {
    stylesheet[keySymbol] = key;
    stylesheet[dictSymbol] = dict;
};

const serializeStylesheet = (stylesheet?: EffCSSStyleSheet, attr?: string) => {
    const key = stylesheet && stylesheet[keySymbol] || '';
    if (stylesheet && !stylesheet.disabled) return `<style${key ? (' ' + keyAttr(key)) : ''}${attr ? ' ' + attr : ''}>${[
        ...stylesheet[CSS_RULES]
    ].reduce((acc, rule) => acc += rule.cssText, '')}</style>`;
    return '';
};

const serializeStylesheetMeta = (stylesheet?: EffCSSStyleSheet) => {
    if (!stylesheet) return '';
    const key = stylesheet[keySymbol];
    const dict = stylesheet[dictSymbol];
    if (!stylesheet.disabled && key && dict) return `<script type="application/json" ${keyAttr(key)}>${
        Object.keys(dict).length ? JSON.stringify(dict) : ''
    }</script>`;
    return '';
};

const propertySyntaxList = [
    'angle', 'color', 'custom-ident', 'image', 'integer',
    'length', 'length-percentage', 'number', 'percentage',
    'resolution', 'string', 'time', 'transform-function',
    'transform-list', 'url'
];

const shortSyntax = propertySyntaxList.reduce((acc, key) => {
    acc[key] = `"<${key}>"`;
    return acc;
}, {'*': '"*"'} as Record<string, string>);

const variableRule = ({name, config}: {
    name: string;
    config?: VariableConfig;
}): {
    s: string;
    f: VariableResolver;
} => {
    let descriptor: VariableDescription;
    if (config && typeof config === 'object') descriptor = config;
    else descriptor = {initialValue: config};

    const {syntax = '*', inherits = true, initialValue} = descriptor;
    const rule = `@property ${name} {syntax:${shortSyntax[syntax] || syntax};inherits:${inherits};${initialValue ? `initial-value:${initialValue};` : ''}}`;
    const resolver = ((fallback?: any) => `var(${name}${fallback ? ',' + fallback : ''})`) as VariableResolver;
    resolver[Symbol.toPrimitive] = () => name;
    return {
        s: rule, f: resolver
    };
};

const replaceVariableRule = (
    stylesheet: EffCSSStyleSheet,
    resolver: VariableResolver,
    value: string | number | boolean | undefined | null
): string => {
    const index = resolver[indexSymbol];
    if (isNotNumber(index)) return '';
    const rule = stylesheet[CSS_RULES][index];
    const cssText = rule.cssText;
    const parts = cssText.split(/initial-value:\s?/)
    const nextVal = value ? `initial-value:${value};` : '';
    let result: string;
    if (parts.length === 1) {
        result = (cssText.slice(0, -1) + nextVal + '}');
    } else {
        const [_, ...rest] = parts[1].split(';');
        result = (parts[0] + nextVal + rest.join(';'));
    }
    stylesheet.deleteRule(index);
    stylesheet.insertRule(result, index);
    return result;
};

const getVariableValue = (
    stylesheet: EffCSSStyleSheet,
    resolver: VariableResolver
): string => {
    const index = resolver[indexSymbol];
    if (isNotNumber(index)) return '';
    const rule = stylesheet[CSS_RULES][index];
    const parts = rule.cssText.split(/initial-value:\s?/)
    if (parts.length === 1) return '';
    return parts[1].split(';')[0];
};

const fontRule = ({name, config}: {
    name: string;
    config: FontConfig;
}): {
    s: string;
    f: FontResolver;
} => {
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
    const resolver = ((...fallbacks: any[]) => qName + (fallbacks?.length ? ', ' + fallbacks.join(', ') : '') + lastFallback) as VariableResolver;
    resolver[Symbol.toPrimitive] = () => qName;
    return {
        s: rule, f: resolver
    };
};

const animationRule = ({name, config}: {
    name: string;
    config: object;
}): {
    s: string;
    f: AnimationResolver;
} => {
    const rule = `@keyframes ${name} {${parseStyles(config)}}`;
    const resolver = (() => name) as AnimationResolver;
    resolver[Symbol.toPrimitive] = () => name;
    return {
        s: rule, f: resolver
    };
};

const getSelectorsProxy = (hash: (key: string) => void, parent: string = '') => {
    const hashed = parent && hash(parent);
    return new Proxy({
        [Symbol.toPrimitive]: () => hashed
    },{
        get(target, property, receiver) {
            if (isSymbol(property)) return Reflect.get(target, property, receiver);
            return getSelectorsProxy(hash, parent ? parent + DIVIDER + property : property);
        }
    });
};

const createScope = (key: string): Scope => ({
    key,
    c: {
        v: 0,
        a: 0,
        l: 0,
        ld: 0,
        f: 0,
        c: 0,
        s: 0
    },
    t: {
        v: '',
        a: '',
        l: '',
        f: '',
        c: ''
    }
});

const getHash = (params: {
    type: StyleSheetType;
    scope: Scope;
    dict: Record<string, string>;
}) => {
    const { scope, type, dict } = params;
    const scopeKey = scope.key;
    let add: (key: string) => string;
    let hash: undefined | ((key: string) => string);
    if (type === CLASSNAMES) {
        add = StyleProvider.minify ? (key: string) => {
            dict[key] = scopeKey + '_' + toRadix(scope.c.s++)
            return dict[key];
        } : (key: string) => {
            dict[key] = scopeKey + '_' + key;
            scope.c.s++;
            return dict[key];
        }
        hash = (key: string) => '.' + (dict[key] ?? add(key));
    } else {
        add = StyleProvider.minify ? (key: string) => {
            dict[key] = toRadix(scope.c.s++)
            return dict[key];
        } : (key: string) => {
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
    return Object.entries(config).reduce((acc, [prop, val]) => {
        const currentLevel = parent ? parent + DIVIDER + prop : prop;
        if (isObject(val)) {
            acc.push(dict[currentLevel]);
            const parsed = parseDict(dict, val, currentLevel);
            if (parsed) acc.push(parsed);
        } else if (val !== undefined) acc.push(dict[currentLevel + DIVIDER + val]);
        return acc;
    }, [] as string[]).join(' ');
};

const getFromDict = (dict: Record<string, string>) => (
    config: Record<string, true | Record<string, never | boolean | string | number>>
) => parseDict(dict, config);

// Style provider

class StyleProvider {
    // settings

    static prefix = 'f';
    static minify = true;
    static emulate = false;

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
    protected static _sc = {
        v: 0,
        a: 0,
        l: 0,
        f: 0,
        s: 0
    };

    // variables stylesheet
    protected static _vs?: EffCSSStyleSheet;
    // animations stylesheet
    protected static _as?: EffCSSStyleSheet;
    // layers stylesheet
    protected static _ls?: EffCSSStyleSheet;
    // shared stylesheet
    protected static _ss?: EffCSSStyleSheet;
    // fonts stylesheet
    protected static _fs?: EffCSSStyleSheet;

    protected static _serverGlobalCSS: Map<GlobalKey, CSSStyleSheet> | null = null;
    protected static _serverCSS: Map<string, CSSStyleSheet> | null = null;
    protected static _serverMeta: Map<string, Record<string, string>> | null = null;

    static map: Map<any, EffCSSStyleSheet> = new Map<any, EffCSSStyleSheet>();

    // subscribers
    protected static _sub: Set<(data: EffCSSEvent) => void> = new Set();
    // hasSubscribers
    protected static _hs: boolean = false;

    protected static emit(data: EffCSSEvent): void {
        for (const fn of StyleProvider._sub) {
            try { fn(data); } catch { /* ignore */ }
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
            const elements = globalThis.document?.head.querySelectorAll(`style[${KEY_ATTR}]`) as NodeListOf<HTMLStyleElement> | null;
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
            const elements = globalThis.document?.head.querySelectorAll(`[${GLOBAL_ATTR}]`) as NodeListOf<HTMLStyleElement> | null;
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
            const elements = globalThis.document?.head.querySelectorAll(`script[${KEY_ATTR}]`) as NodeListOf<HTMLScriptElement> | null;
            elements?.forEach((el) => {
                const key = el.getAttribute(KEY_ATTR);
                const textContent = el.textContent;
                const dict = textContent ? JSON.parse(el.textContent) : {};
                if (key) StyleProvider._serverMeta!.set(key, dict);
            });
        }
        return StyleProvider._serverMeta;
    }

    static get vs(): EffCSSStyleSheet {
        if (!StyleProvider._vs) {
            const serverStylesheet = StyleProvider.serverGlobalCSS.get(VARIABLES);
            if (serverStylesheet) {
                StyleProvider._vs = serverStylesheet;
                StyleProvider._sc.v = serverStylesheet[CSS_RULES].length;
            } else StyleProvider._vs = StyleProvider.cst();
        }
        return StyleProvider._vs;
    }

    static get as(): EffCSSStyleSheet {
        if (!StyleProvider._as) {
            const serverStylesheet = StyleProvider.serverGlobalCSS.get(ANIMATIONS);
            if (serverStylesheet) {
                StyleProvider._as = serverStylesheet;
                StyleProvider._sc.a = serverStylesheet[CSS_RULES].length;
            } else StyleProvider._as = StyleProvider.cst();
        }
        return StyleProvider._as;
    }

    static get ls(): EffCSSStyleSheet {
        if (!StyleProvider._ls) {
            const serverStylesheet = StyleProvider.serverGlobalCSS.get(LAYERS);
            if (serverStylesheet) {
                StyleProvider._ls = serverStylesheet;
                StyleProvider._sc.l = serverStylesheet[CSS_RULES].length;
            } else StyleProvider._ls = StyleProvider.cst();
        }
        return StyleProvider._ls;
    }

    static get fs(): EffCSSStyleSheet {
        if (!StyleProvider._fs) {
            const serverStylesheet = StyleProvider.serverGlobalCSS.get(FONTS);
            if (serverStylesheet) {
                StyleProvider._fs = serverStylesheet;
                StyleProvider._sc.f = serverStylesheet[CSS_RULES].length;
            } else StyleProvider._fs = StyleProvider.cst();
        }
        return StyleProvider._fs;
    }

    static get ss(): EffCSSStyleSheet {
        if (!StyleProvider._ss) {
            const serverStylesheet = StyleProvider.serverGlobalCSS.get(SHARED);
            if (serverStylesheet) {
                StyleProvider._ss = serverStylesheet;
                StyleProvider._sc.s = serverStylesheet[CSS_RULES].length;
            } else StyleProvider._ss = StyleProvider.cst();
        }
        return StyleProvider._ss;
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
                    this[CSS_RULES] = [{
                        cssText
                    }];
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
    }

    // linkStylesheet
    static lst(resolver: any, stylesheet: EffCSSStyleSheet) {
        StyleProvider.map.set(resolver, stylesheet);
        return resolver;
    }

    static update: Update = (resolver: any, value: any) => {
        if (StyleProvider.scope) return;
        if (typeof resolver === 'function') resolver.set(value);
        else Object.entries<any>(value).forEach(([key, val]) => resolver[key].set(val));
    }
    
    // creators

    /**
     * Create an anonymous rule with a class selector
     * @param rule - rule content
     */
    static className: (rule: object) => string = (rule: object) => {
        if (StyleProvider.scope) return '';
        const scope = StyleProvider.gs;
        const index = scope.c.s++;
        const cls = scope.key + '_' + toRadix(index);
        const selector = '.' + cls;
        const cssText = selector + ` {${parseStyles(rule)}}`;
        const stylesheet = StyleProvider.ss;
        if (StyleProvider._sc.s <= index) stylesheet.insertRule(cssText, stylesheet[CSS_RULES].length);
        if (StyleProvider._hs) StyleProvider.emit({ fn: CLASSNAME, css: cssText, result: cls });
        return cls;
    }

    /**
     * Create an anonymous rule with an attribute selector
     * @param rule - rule content
     */
    static attribute: (rule: object) => object = (rule: object) => {
        if (StyleProvider.scope) return {};
        const scope = StyleProvider.gs;
        const index = scope.c.s++;
        const attr = DATA_ + scope.key + '-' + toRadix(index);
        const val = '';
        const cssText = `[${attr}] {${parseStyles(rule)}}`;
        const stylesheet = StyleProvider.ss;
        const result = {[attr]: val};
        if (StyleProvider._sc.s <= index) stylesheet.insertRule(cssText, stylesheet[CSS_RULES].length);
        if (StyleProvider._hs) StyleProvider.emit({ fn: ATTRIBUTE, css: cssText, result });
        return result;
    }

    /**
     * Create variable
     * @param config - variable config
     */
    static variable = (config?: VariableConfig): VariableResolver => {
        // local variables
        let scope = StyleProvider.scope;
        if (scope) {
            const name = `--${scope.key}-${toRadix(scope.c.v++)}`;
            const { s, f } = variableRule({ name, config });
            scope.t.v += s;
            return f;
        }
        // global variables
        scope = StyleProvider.gs;
        const stylesheet = StyleProvider.vs;
        const index = scope.c.v++;
        const name = `--${scope.key}-${toRadix(index)}`;
        const { s, f } = variableRule({ name, config });

        if (StyleProvider._sc.v <= index) stylesheet.insertRule(s, index);
        f[indexSymbol] = index;
        f.set = (value: any) => {
            replaceVariableRule(stylesheet, f, value);
        };
        f.get = () => getVariableValue(stylesheet, f);
        if (StyleProvider._hs) {
            StyleProvider.emit({ fn: VARIABLE, css: s, name });
            f.set = (value: any) => {
                const css = replaceVariableRule(stylesheet, f, value);
                StyleProvider.emit({ fn: VARIABLE_SET, css, name, value });
            };
        }
        return f;
    }

    /**
     * Create variables
     * @param config - variables config
     */
    static variables = <T extends Record<string, VariableConfig>>(config: T): VariablesResolvers<T> => {
        // local variables
        let scope = StyleProvider.scope;
        if (scope) {
            const { key: scopeKey, c, t } = scope;
            return Object.entries(config).reduce((acc, [key, val]) => {
                const index = c.v++;
                const name = `--${scopeKey}-${toRadix(index)}`;
                const { s, f } = variableRule({ name, config: val })
                t.v += s;
                acc[key] = f;
                return acc;
            }, {} as Record<string, VariableResolver>) as VariablesResolvers<T>;
        }
        scope = StyleProvider.gs;
        const { key: scopeKey, c } = scope;
        const stylesheet = StyleProvider.vs;
        let fullCSS = '';
        const names: string[] = [];
        const prepare = (val: VariableConfig) => {
            const index = c.v++
            const name = `--${scopeKey}-${toRadix(index)}`;
            const { s, f } = variableRule({ name, config: val })
            if (StyleProvider._sc.v <= index) stylesheet.insertRule(s, index);
            f[indexSymbol] = index;
            return {name, s, f};
        };
        const handlers = Object.entries(config).reduce(StyleProvider._hs ? (acc, [key, val]) => {
            const { name, s, f } = prepare(val);
            f.set = (value: any) => {
                const css = replaceVariableRule(stylesheet, f, value);
                StyleProvider.emit({ fn: VARIABLE_SET, css, name, value });
            };
            fullCSS += s;
            names.push(name);
            acc[key] = f;
            return acc;
        } : (acc, [key, val]) => {
            const { f } = prepare(val);
            f.set = (value: any) => {
                replaceVariableRule(stylesheet, f, value);
            };
            acc[key] = f;
            return acc;
        }, {} as Record<string, VariableResolver>) as VariablesResolvers<T>;
        if (StyleProvider._hs) StyleProvider.emit({ fn: VARIABLES, css: fullCSS, names });
        return handlers;
    }

    /**
     * Create animation
     * @param config - animation config
     */
    static animation = <T extends Record<string, object>>(config: T): AnimationResolver => {
        // local animation
        let scope = StyleProvider.scope;
        if (scope) {
            const name = `${scope.key}-${toRadix(scope.c.a++)}`;
            const { s, f } = animationRule({ name, config })
            scope.t.a += s;
            return f;
        }
        // global animation
        scope = StyleProvider.gs;
        const stylesheet = StyleProvider.as;
        const index = scope.c.a++;
        const name = `${scope.key}-${toRadix(index)}`;
        const { s, f } = animationRule({ name, config });
        if (StyleProvider._sc.a <= index) stylesheet.insertRule(s, index);
        if (StyleProvider._hs) StyleProvider.emit({ fn: ANIMATION, css: s, name });
        return f;
    }

    /**
     * Create animations
     * @param config - animation configs
     */
    static animations = <T extends Record<string, AnimationConfig>>(config: T): AnimationsResolvers<T> => {
        // local animations
        let scope = StyleProvider.scope;
        if (scope) {
            const { key: scopeKey, c, t } = scope;
            return Object.entries(config).reduce((acc, [key, val]) => {
                const name = `${scopeKey}-${toRadix(c.a++)}`;
                const { s, f } = animationRule({ name, config: val })
                t.a += s;
                acc[key] = f;
                return acc;
            }, {} as Record<string, AnimationResolver>) as AnimationsResolvers<T>;
        }
        // global animations
        scope = StyleProvider.gs;
        const stylesheet = StyleProvider.as;
        let fullCSS = '';
        const names: string[] = [];
        const prepare = (val: AnimationConfig) => {
            const index = scope.c.a++;
            const name = `${scope.key}-${toRadix(index)}`;
            const { s, f } = animationRule({ name, config: val });
            if (StyleProvider._sc.a <= index) stylesheet.insertRule(s, index);
            return {name, s, f};
        };
        const handlers = Object.entries(config).reduce(StyleProvider._hs ? (acc, [key, val]) => {
            const {name, s, f} = prepare(val);
            fullCSS += s;
            names.push(name);
            acc[key] = f;
            return acc;
        } : (acc, [key, val]) => {
            acc[key] = prepare(val).f;
            return acc;
        }, {} as Record<string, AnimationResolver>) as AnimationsResolvers<T>;
        if (StyleProvider._hs) StyleProvider.emit({ fn: ANIMATIONS, css: fullCSS, names });
        return handlers;
    }

    /**
     * Create layer
     */
    static layer = (): LayerResolver => {
        // local layer
        let scope = StyleProvider.scope;
        if (scope) {
            const name = `${scope.key}-${toRadix(scope.c.l++)}`;
            const ruleKey = AT_LAYER_ + name;
            const declaration = ruleKey + ';';
            scope.c.ld++;
            const resolver = (() => ruleKey) as LayerResolver;
            scope.t.l += declaration;
            resolver[Symbol.toPrimitive] = () => ruleKey;
            return resolver;
        }
        // global layer
        scope = StyleProvider.gs;
        const stylesheet = StyleProvider.ls;
        const index = scope.c.l++;
        const name = `${scope.key}-${toRadix(index)}`;
        const ruleKey = AT_LAYER_ + name;
        const declaration = ruleKey + ';';
        const declarationIndex = scope.c.ld++;
        const resolver = (() => ruleKey) as LayerResolver;
        resolver[Symbol.toPrimitive] = () => ruleKey;
        if (StyleProvider._sc.l <= declarationIndex) stylesheet.insertRule(declaration, declarationIndex);
        if (StyleProvider._hs) StyleProvider.emit({ fn: LAYER, css: declaration, name });
        return resolver;
    }

    /**
     * Create layers
     * @param config - layers config
     */
    static layers = <T extends string>(config: T[]): LayersResolvers<T> => {
        // local layers
        let scope = StyleProvider.scope;
        const order: string[] = [];
        if (scope) {
            const { key: scopeKey, c } = scope;
            const resolvers = config.reduce((acc, key) => {
                const name = `${scopeKey}-${toRadix(c.l++)}`;
                order.push(name);
                const ruleKey = AT_LAYER_ + name;
                const resolver = (() => ruleKey) as LayerResolver;
                resolver[Symbol.toPrimitive] = () => ruleKey;
                acc[key] = resolver;
                return acc;
            }, {} as Record<NoInfer<T>, LayerResolver>);
            scope.t.l += (AT_LAYER_ + order.join(', ') + ';');
            return resolvers;
        }
        // global layers
        scope = StyleProvider.gs;
        const stylesheet = StyleProvider.ls;
        const resolvers = config.reduce((acc, key) => {
            const index = scope.c.l++;
            const name = `${scope.key}-${toRadix(index)}`;
            order.push(name);
            const ruleKey = AT_LAYER_ + name;
            const resolver = (() => ruleKey) as LayerResolver;
            resolver[Symbol.toPrimitive] = () => ruleKey;
            acc[key] = resolver;
            return acc;
        }, {} as Record<NoInfer<T>, LayerResolver>);
        const declaration = AT_LAYER_ + order.join(', ') + ';';
        const declarationIndex = scope.c.ld++;
        if (StyleProvider._sc.l <= declarationIndex) stylesheet.insertRule(declaration, declarationIndex);
        if (StyleProvider._hs) StyleProvider.emit({ fn: LAYERS, css: declaration, names: order });
        return resolvers;
    }

    protected static _container = (containerType?: ContainerType) => {
        const scope = StyleProvider.scope || StyleProvider.gs;
        const name = `${scope.key}-${toRadix(scope.c.c++)}`;
        const type = containerType || 'normal';
        const property = `${name || 'none'} / ${type}`;
        const resolver = (() => property) as ContainerResolver;
        resolver[Symbol.toPrimitive] = () => `@container ${name}`;
        return { name, type, resolver};
    }

    /**
     * Create container
     * @param type - container type
     */
    static container: Container = (containerType) => {
        const {name, type, resolver} = StyleProvider._container(containerType);
        if (StyleProvider._hs && !StyleProvider.scope) StyleProvider.emit({ fn: CONTAINER, name, type, css: '' });
        return resolver;
    }

    /**
     * Create containers
     * @param config - containers config
     */
    static containers = <T extends Record<string, ContainerType>>(config: T): ContainersResolvers<T> => {
        const items: {name: string; type: string;}[] = [];
        const callback: (
            acc: Record<string, ContainerResolver>, [key, containerType]: [string, ContainerType]
        ) => Record<string, ContainerResolver> = StyleProvider._hs && !StyleProvider.scope ? (acc, [key, containerType]) => {
            const {name, type, resolver} = StyleProvider._container(containerType);
            acc[key] = resolver;
            items.push({name, type});
            return acc;
        } : (acc, [key, containerType]) => {
            acc[key] = StyleProvider._container(containerType).resolver;
            return acc;
        };
        const handlers = Object.entries(config).reduce(callback, {} as Record<string, ContainerResolver>) as ContainersResolvers<T>;
        if (StyleProvider._hs) StyleProvider.emit({ fn: CONTAINERS, items, css: '' });
        return handlers;
    }

    /**
     * Create font
     * @param config - font config
     */
    static font: Font = (config) => {
        // local fonts
        let scope = StyleProvider.scope;
        if (scope) {
            const name = `${scope.key}-${toRadix(scope.c.f++)}`;
            const { s, f } = fontRule({ name, config });
            scope.t.f += s;
            return f;
        }
        // global fonts
        scope = StyleProvider.gs;
        const stylesheet = StyleProvider.fs;
        const index = scope.c.f++;
        const name = `${scope.key}-${toRadix(index)}`;
        const { s, f } = fontRule({ name, config });

        if (StyleProvider._sc.f <= index) stylesheet.insertRule(s, index);
        if (StyleProvider._hs) StyleProvider.emit({ fn: FONT, css: s, name });
        return f;
    }

    /**
     * Create fonts
     * @param config - fonts configs
     */
    static fonts = <T extends Record<string, FontConfig>>(config: T): FontsResolvers<T> => {
        // local fonts
        let scope = StyleProvider.scope;
        if (scope) {
            const { key: scopeKey, c, t } = scope;
            return Object.entries(config).reduce((acc, [key, val]) => {
                const name = `${scopeKey}-${toRadix(c.f++)}`;
                const { s, f } = fontRule({ name, config: val })
                t.f += s;
                acc[key] = f;
                return acc;
            }, {} as Record<string, FontResolver>) as FontsResolvers<T>;
        }
        // global fonts
        scope = StyleProvider.gs;
        const stylesheet = StyleProvider.fs;
        let fullCSS = '';
        const names: string[] = [];
        const prepare = (config: FontConfig) => {
            const index = scope.c.f++;
            const name = `${scope.key}-${toRadix(index)}`;
            const { s, f } = fontRule({ name, config });
            if (StyleProvider._sc.f <= index) stylesheet.insertRule(s, index);
            return {name, s, f};
        };
        const handlers = Object.entries(config).reduce(StyleProvider._hs ? (acc, [key, val]) => {
            const {name, s, f} = prepare(val);
            fullCSS += s;
            names.push(name);
            acc[key] = f;
            return acc;
        } : (acc, [key, val]) => {
            acc[key] = prepare(val).f;
            return acc;
        }, {} as Record<string, FontResolver>) as FontsResolvers<T>;
        if (StyleProvider._hs) StyleProvider.emit({ fn: FONTS, css: fullCSS, names });
        return handlers;
    }

    // resolveStylesheet
    static rst(generator: Function, {type}: {
        type: StyleSheetType;
    }) {
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
        if (serverStyleSheet && serverMeta) dict = serverMeta;
        else {
            const hash: undefined | ((key: string) => string) = type === CUSTOM_STYLES ? undefined : getHash({
                type, dict, scope
            });
            const selectors = hash && getSelectorsProxy(hash);
            // save prev
            const prevScope = StyleProvider.scope;
            // set next
            StyleProvider.scope = scope;
            // calc rules inside current scope
            let styleObject: object | undefined;
            // if we have server css for custom styles
            if (type === CUSTOM_STYLES && cssText) styleObject = undefined;
            else styleObject = generator(selectors);
            // if there are no server CSS
            if (!serverStyleSheet) {
                cssText = scope.t.f + scope.t.l + scope.t.v + scope.t.a + parseStyles(styleObject);
                stylesheet.replaceSync(cssText);
            }
            // return prev scope
            StyleProvider.scope = prevScope;
        }
        markStylesheet(stylesheet, scopeKey, dict);
        if (StyleProvider._hs) StyleProvider.emit({ fn: type, css: cssText, key: scopeKey, dict });
        const resolveNames = getFromDict(dict);
        let resolver: Function;
        if (type === CLASSNAMES) resolver = resolveNames;
        else if (type === ATTRIBUTES) resolver = (
            config: Record<string, true | Record<string, string | number | boolean>>
        ) => ({[DATA_ + scope.key]: resolveNames(config)});
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
    static selectors(generator: Function, {type}: {
        type:StyleSheetType;
    }) {
        const {resolver, stylesheet} = StyleProvider.rst(generator, {type});
        return StyleProvider.lst(resolver, stylesheet);
    }

    static lazySelectors(generator: Function, {type}: {
        type: StyleSheetType;
    }) {
        let selectorsResolver: Function;
        const lazyResolver = (config: object) => {
            if (!selectorsResolver) {
                const {resolver, stylesheet} = StyleProvider.rst(generator, {type});
                selectorsResolver = resolver;
                StyleProvider.lst(lazyResolver, stylesheet);
            }
            return selectorsResolver(config);
        };
        return lazyResolver;
    }
    // serialize layers
    protected static _sl(): string {
        return serializeStylesheet(StyleProvider._ls, STYLE_ATTRS.layers);
    }
    // serialize variables
    protected static _sv(): string {
        return serializeStylesheet(StyleProvider._vs, STYLE_ATTRS.variables);
    }
    // serialize animations
    protected static _sa(): string {
        return serializeStylesheet(StyleProvider._as, STYLE_ATTRS.animations);
    }
    // serialize shared
    protected static _ssh(): string {
        return serializeStylesheet(StyleProvider._ss, STYLE_ATTRS.shared);
    }
    // serialize fonts
    protected static _sf(): string {
        return serializeStylesheet(StyleProvider._fs, STYLE_ATTRS.fonts);
    }

    static serialize(arg?: EffCSSStyleSheet | Function): string {
        let stylesheet: EffCSSStyleSheet | undefined;
        if (typeof arg === 'function') {
            stylesheet = StyleProvider.map.get(arg);
            // if no stylesheet found
            if (!stylesheet) return '';
        } else stylesheet = arg;

        if (stylesheet) {
            switch (stylesheet) {
                case StyleProvider._ls:
                    return StyleProvider._sl();
                case StyleProvider._vs:
                    return StyleProvider._sv();
                case StyleProvider._as:
                    return StyleProvider._sa();
                case StyleProvider._fs:
                    return StyleProvider._sf();
                case StyleProvider._ss:
                    return StyleProvider._ssh();
                default:
                    return serializeStylesheet(stylesheet);
            }
        }
        return [...StyleProvider.map.values()].reduce((acc, stylesheet) => {
            return acc += serializeStylesheet(stylesheet);
        }, (
            StyleProvider._sl() + StyleProvider._sv() +
            StyleProvider._sf() + StyleProvider._sa() + StyleProvider._ssh()
        ));
    }

    static serializeMeta(arg?: EffCSSStyleSheet | Function): string {
        let stylesheet: EffCSSStyleSheet | undefined;
        if (typeof arg === 'function') {
            stylesheet = StyleProvider.map.get(arg);
            // if no stylesheet found
            if (!stylesheet) return '';
        } else stylesheet = arg;
        if (stylesheet) return serializeStylesheetMeta(stylesheet);
        return [...StyleProvider.map.values()].reduce((acc, stylesheet) => {
            return acc += serializeStylesheetMeta(stylesheet);
        }, '' as string);
    }
};

// public utils

// single

/**
 * Create single variable
 * @param config - variable config
 */
export const variable: Variable = (config) => StyleProvider.variable(config);

/**
 * Create single animation
 * @param config - animation config
 */
export const animation: Animation = (config) => StyleProvider.animation(config);

/**
 * Create single layer
 * @param config - layer config
 */
export const layer: Layer = () => StyleProvider.layer();

/**
 * Create single container
 * @param config - container config
 */
export const container: Container = (config) => StyleProvider.container(config);

/**
 * Create single font
 * @param config - font config
 */
export const font: Font = (config) => StyleProvider.font(config);

// multiple

/**
 * Create multiple variables
 * @param config - variables config
 */
export const variables: Variables = (config) => StyleProvider.variables(config);

/**
 * Create multiple animations
 * @param config - animations config
 */
export const animations: Animations = (config) => StyleProvider.animations(config);

/**
 * Create multiple layers
 * @param config - layers config
 */
export const layers: Layers = (config) => StyleProvider.layers(config);

/**
 * Create multiple containers
 * @param config - containers config
 */
export const containers: Containers = (config) => StyleProvider.containers(config);

/**
 * Create multiple fonts
 * @param config - fonts config
 */
export const fonts: Fonts = (config) => StyleProvider.fonts(config);

// selectors

// single

/**
 * Create an anonymous rule with a class selector
 * @param rule - rule content
 */
export const className: ClassName = (rule) => StyleProvider.className(rule);

/**
 * Create an anonymous rule with an attribute selector
 * @param rule - rule content
 */
export const attribute: Attribute = (rule) => StyleProvider.attribute(rule);

// multiple

/**
 * Create a stylesheet with class selectors
 * @param generator - stylesheet generator
 */
export const classNames: ClassNames = (generator) => StyleProvider.selectors(generator, TYPE_CLS);

/**
 * Create a stylesheet with attribute selectors
 * @param generator - stylesheet generator
 */
export const attributes: Attributes = (generator) => StyleProvider.selectors(generator, TYPE_ATTRS);

/**
 * Create a custom stylesheet
 * @param generator - stylesheet generator
 */
export const customStyles: CustomStyles = (generator) => StyleProvider.selectors(generator, TYPE_CUSTOM);

// lazy

/**
 * Create a lazy stylesheet with class selectors
 * @param generator - stylesheet generator
 */
export const lazyClassNames: ClassNames = (generator) => StyleProvider.lazySelectors(generator, TYPE_CLS) as ReturnType<ClassNames>;

/**
 * Create a lazy stylesheet with attribute selectors
 * @param generator - stylesheet generator
 */
export const lazyAttributes: Attributes = (generator) => StyleProvider.lazySelectors(generator, TYPE_ATTRS) as ReturnType<Attributes>;

/**
 * Create a lazy custom stylesheet
 * @param generator - stylesheet generator
 */
export const lazyCustomStyles: CustomStyles = (generator) => StyleProvider.lazySelectors(generator, TYPE_CUSTOM) as ReturnType<CustomStyles>;

// stylesheets

/**
 * Get a stylesheet via resolver
 * @param resolver - stylesheet resolver
 */
export const stylesheet = (resolver: Function): EffCSSStyleSheet | undefined => resolver && StyleProvider.map.get(resolver);

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
export const configure = (config: Partial<{
    prefix: string;
    minify: boolean;
    emulate: boolean;
}>) => {
    if (StyleProvider.scopeCount > 0) return false;
    const {
        prefix = StyleProvider.prefix,
        minify = StyleProvider.minify,
        emulate = StyleProvider.emulate
    } = config;
    StyleProvider.prefix = prefix;
    StyleProvider.minify = minify;
    StyleProvider.emulate = emulate;
    return true;
};

/**
 * Subscribe to CSS generation events
 * @param fn - callback receiving EffCSSEvent
 * @returns unsubscribe function
 */
export const subscribe = (fn: (event: EffCSSEvent) => void): (() => void) => StyleProvider.subscribe(fn);
