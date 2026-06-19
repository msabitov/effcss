import {
    type ClassNames, type Attributes,
    type Variable, type Animation, type Container, type Layer,
    type Variables, type Animations, type Containers, type Layers,
    type EffCSSStyleSheet,
    type VariableConfig, type VariableResolver,
    type VariablesResolvers,
    type AnimationResolver,
    type AnimationConfig,
    type AnimationsResolvers,
    type LayerResolver,
    type ContainerResolver,
    type ContainerType,
    type ContainersResolvers,
    type Scope,
    type CustomStyles,
    type VariableDescription,
    keySymbol,
    indexSymbol,
    Update,
    Attribute,
    ClassName
} from './types';

const DIVIDER = '_';
const objectReduce = <
    T extends object,
    F extends (previousValue: any, currentValue: [string, any], currentIndex: number, array: [string, any][]) => any
>(
    obj: T,
    callback: F,
    acc: any
) => Object.entries(obj).reduce(callback, acc);
const isSymbol = (val: any) => typeof val === 'symbol';
const isObject = (val: any) => val !== null && typeof val === 'object';
const kebabCase = (str: string): string => str.replace(/[A-Z]/g, (v) => '-' + v.toLowerCase());
const propVal = (prop: string, val: any) => `${kebabCase(prop)}:${'' + val};`
const toRadix = (num: number) => num.toString(36);


/**
 * Stringify style object
 * @param key - stylesheet key
 * @param value - stylesheet content
 * @param parent - parent rule key
 */
const stringify = (key: string, value: object | string | number | undefined | unknown): string => {
    let resKey = '' + key;
    if (value === null || value === undefined) return '';
    else if (Array.isArray(value)) return value.map((v) => propVal(resKey, v)).join('');
    else if (typeof value === 'object') return (
        resKey +
        `{${objectReduce(value, (acc, item) => acc + stringify(...item), '')}}`
    );
    else if (value === '') return resKey + ';';
    else return propVal(resKey, value);
};

const parseStyles = (styles: object): string => objectReduce(styles, (acc, item) => acc + stringify(...item), '');

const markStylesheet = (stylesheet: EffCSSStyleSheet, key: string) => {
    stylesheet[keySymbol] = key;
};

const serializeStylesheet = (stylesheet?: EffCSSStyleSheet, attr?: string) => {
    const key = stylesheet && stylesheet[keySymbol] || '';
    if (stylesheet && !stylesheet.disabled) return `<style${key ? ` data-effcss-key="${key}"` : ''}${attr ? ' ' + attr : ''}>${[
        ...stylesheet.cssRules
    ].reduce((acc, rule) => acc += rule.cssText, '')}</style>`;
    return '';
};

const getServerStylesheet = (key: string) => {
    const head = globalThis.document?.head;
    const stylesheet: HTMLStyleElement | null = head && head.querySelector(`style[data-effcss-key="${key}"]`);
    return stylesheet;
}

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
    rule: string;
    resolver: VariableResolver;
} => {
    let descriptor: VariableDescription;
    if (config && typeof config === 'object') descriptor = config;
    else descriptor = {initialValue: config};

    const {syntax = '*', inherits = true, initialValue} = descriptor;
    const rule = `@property ${name} {syntax:${shortSyntax[syntax] || syntax};inherits:${inherits};${initialValue ? `initial-value:${initialValue};` : ''}}`;
    const resolver = ((fallback?: any) => `var(${name}${fallback ? ',' + fallback : ''})`) as VariableResolver;
    resolver[Symbol.toPrimitive] = () => name;
    return {
        rule, resolver
    };
};

const replaceVariableRule = (
    stylesheet: EffCSSStyleSheet,
    resolver: VariableResolver,
    value: string | number | boolean | undefined | null
): void => {
    const index = resolver[indexSymbol];
    if (typeof index !== 'number') return;
    const rule = stylesheet.cssRules[index];
    const parts = rule.cssText.split(';')
    if (value && parts.length === 3) parts.splice(2, 0, ` initial-value: ${value}`);
    else if (value && parts.length === 4) parts.splice(2, 1, ` initial-value: ${value}`);
    else if (!value && parts.length === 4) parts.splice(2, 1);
    stylesheet.deleteRule(index);
    stylesheet.insertRule(parts.join(';'), index);
};

const animationRule = ({name, config}: {
    name: string;
    config: object;
}): {
    rule: string;
    resolver: AnimationResolver;
} => {
    const rule = `@keyframes ${name} {${parseStyles(config)}}`;
    const resolver = (() => name) as AnimationResolver;
    resolver[Symbol.toPrimitive] = () => name;
    return {
        rule, resolver
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
    counters: {
        variables: 0,
        keyframes: 0,
        layers: 0,
        containers: 0,
        selectors: 0
    },
    cssText: {
        variables: '',
        keyframes: '',
        layers: '',
        containers: '',
        styles: ''
    }
});

const getHash = (params: {
    type: 'class' | 'attr';
    scope: Scope;
    dict: Record<string, string>;
}) => {
    const { scope, type, dict } = params;
    const scopeKey = scope.key;
    let add: (key: string) => string;
    let hash: undefined | ((key: string) => string);
    if (type === 'class') {
        add = StyleProvider.minify ? (key: string) => {
            dict[key] = scopeKey + '_' + toRadix(scope.counters.selectors++)
            return dict[key];
        } : (key: string) => {
            dict[key] = scopeKey + '_' + key;
            scope.counters.selectors++;
            return dict[key];
        }
        hash = (key: string) => '.' + (dict[key] ?? add(key));
    } else {
        add = StyleProvider.minify ? (key: string) => {
            dict[key] = toRadix(scope.counters.selectors++)
            return dict[key];
        } : (key: string) => {
            dict[key] = key;
            scope.counters.selectors++;
            return dict[key];
        };
        hash = (key: string) => `[data-${scopeKey}~="${dict[key] ?? add(key)}"]`;
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

    protected static _globalDict: Record<string, string> = {};
    protected static _globalScope: Scope;

    static get globalScope(): Scope {
        if (!StyleProvider._globalScope) StyleProvider._globalScope = StyleProvider.createScope();
        return StyleProvider._globalScope;
    }

    static scope: Scope | null = null;
    static scopeCount = 0;

    static createScope(): Scope {
        const key = StyleProvider.prefix + toRadix(StyleProvider.scopeCount++);
        return createScope(key);
    }

    // stylesheets

    protected static _variablesStylesheet?: EffCSSStyleSheet;
    protected static _animationsStylesheet?: EffCSSStyleSheet;
    protected static _layersStylesheet?: EffCSSStyleSheet;
    protected static _sharedStylesheet?: EffCSSStyleSheet;

    static stylesheetsKeys: Map<any, Record<string, string>> = new Map();
    static stylesheetsMap: Map<any, EffCSSStyleSheet> = new Map<any, EffCSSStyleSheet>();

    static get variablesStylesheet(): EffCSSStyleSheet {
        if (!StyleProvider._variablesStylesheet) StyleProvider._variablesStylesheet = StyleProvider.createStyleSheet();
        return StyleProvider._variablesStylesheet;
    }

    static get animationsStylesheet(): EffCSSStyleSheet {
        if (!StyleProvider._animationsStylesheet) StyleProvider._animationsStylesheet = StyleProvider.createStyleSheet();
        return StyleProvider._animationsStylesheet;
    }

    static get layersStylesheet(): EffCSSStyleSheet {
        if (!StyleProvider._layersStylesheet) StyleProvider._layersStylesheet = StyleProvider.createStyleSheet();
        return StyleProvider._layersStylesheet;
    }

    static get sharedStylesheet(): EffCSSStyleSheet {
        if (!StyleProvider._sharedStylesheet) StyleProvider._sharedStylesheet = StyleProvider.createStyleSheet();
        return StyleProvider._sharedStylesheet;
    }

    static createStyleSheet = (cssText: string = ''): EffCSSStyleSheet => {
        let stylesheet;
        if (!globalThis.CSSStyleSheet || StyleProvider.emulate) {
            stylesheet = {
                disabled: false,
                cssRules: [{ cssText }],
    
                replaceSync(cssText: string) {
                    this.cssRules = [{
                        cssText
                    }];
                },
                insertRule(cssText: string, index: number) {
                    this.cssRules.splice(index, 0, {
                        cssText
                    });
                    return index;
                },
                deleteRule(index: number) {
                    this.cssRules.splice(index, 1);
                }
            };
        } else {
            stylesheet = new globalThis.CSSStyleSheet();
            stylesheet.replaceSync(cssText);
            globalThis.document.adoptedStyleSheets.push(stylesheet);
        }
        return stylesheet as unknown as EffCSSStyleSheet;
    }

    static linkStylesheet(resolver: any, stylesheet: EffCSSStyleSheet) {
        StyleProvider.stylesheetsMap.set(resolver, stylesheet);
        return resolver;
    }

    static update: Update = (resolver: any, value: any) => {
        if (StyleProvider.scope) return;
        const stylesheet = StyleProvider.variablesStylesheet;
        if (typeof resolver === 'function') replaceVariableRule(stylesheet, resolver, value);
        else Object.entries<any>(value).forEach(([key, val]) => {
            replaceVariableRule(stylesheet, resolver[key], val);
        });
    }
    
    // creators

    /**
     * Create an anonymous rule with a class selector
     * @param rule - rule content
     */
    static className: ClassName = (rule: object) => {
        if (StyleProvider.scope) return '';
        const scope = StyleProvider.globalScope;
        const cls = scope.key + '_' + toRadix(scope.counters.selectors++)
        const stylesheet = StyleProvider.sharedStylesheet;
        stylesheet.insertRule(`.${cls} {${parseStyles(rule)}}`, stylesheet.cssRules.length);
        return cls;
    }

    /**
     * Create an anonymous rule with an attribute selector
     * @param rule - rule content
     */
    static attribute: Attribute = (rule: object) => {
        if (StyleProvider.scope) return {};
        const scope = StyleProvider.globalScope;
        const attr = `data-${scope.key}`;
        const val = toRadix(scope.counters.selectors++);
        const stylesheet = StyleProvider.sharedStylesheet;
        stylesheet.insertRule(`[${attr}~="${val}"] {${parseStyles(rule)}}`, stylesheet.cssRules.length);
        return {
            [attr]: val
        };
    }

    /**
     * Create variable
     * @param config - variable config
     */
    static variable = (config?: VariableConfig): VariableResolver => {
        // local variables
        let scope = StyleProvider.scope;
        if (scope) {
            const name = `--${scope.key}-${toRadix(scope.counters.variables++)}`;
            const { rule, resolver } = variableRule({ name, config });
            scope.cssText.variables += rule;
            return resolver;
        
        }
        // global variables
        scope = StyleProvider.globalScope;
        const stylesheet = StyleProvider.variablesStylesheet;
        const name = `--${scope.key}-${toRadix(scope.counters.variables++)}`;
        const { rule, resolver } = variableRule({ name, config });
        const index = stylesheet.insertRule(rule, stylesheet.cssRules.length);
        resolver[indexSymbol] = index;
        return resolver;
    }

    /**
     * Create variables
     * @param config - variables config
     */
    static variables = <T extends Record<string, VariableConfig>>(config: T): VariablesResolvers<T> => {
        // local variables
        let scope = StyleProvider.scope;
        if (scope) {
            const { key: scopeKey, counters, cssText } = scope;
            return Object.entries(config).reduce((acc, [key, val]) => {
                const name = `--${scopeKey}-${toRadix(counters.variables++)}`;
                const { rule, resolver } = variableRule({ name, config: val })
                cssText.variables += rule;
                acc[key] = resolver;
                return acc;
            }, {} as Record<string, VariableResolver>) as VariablesResolvers<T>;
        }
        scope = StyleProvider.globalScope;
        const { key: scopeKey, counters } = scope;
        const stylesheet = StyleProvider.variablesStylesheet;
        return Object.entries(config).reduce((acc, [key, val]) => {
            const name = `--${scopeKey}-${toRadix(counters.variables++)}`;
            const { rule, resolver } = variableRule({ name, config: val })
            const index = stylesheet.insertRule(rule, stylesheet.cssRules.length);
            resolver[indexSymbol] = index;
            acc[key] = resolver;
            return acc;
        }, {} as Record<string, VariableResolver>) as VariablesResolvers<T>;
    }

    /**
     * Create animation
     * @param config - animation config
     */
    static animation = <T extends Record<string, object>>(config: T): AnimationResolver => {
        // local variables
        let scope = StyleProvider.scope;
        if (scope) {
            const name = `${scope.key}-${toRadix(scope.counters.keyframes++)}`;
            const { rule, resolver } = animationRule({ name, config })
            scope.cssText.keyframes += rule;
            return resolver;
        
        }
        // global variables
        scope = StyleProvider.globalScope;
        const stylesheet = StyleProvider.animationsStylesheet;
        const name = `${scope.key}-${toRadix(scope.counters.keyframes++)}`;
        const { rule, resolver } = animationRule({ name, config })
        stylesheet.insertRule(rule, stylesheet.cssRules.length);
        return resolver;
    }

    /**
     * Create animations
     * @param config - animation configs
     */
    static animations = <T extends Record<string, AnimationConfig>>(config: T): AnimationsResolvers<T> => {
        // local animations
        let scope = StyleProvider.scope;
        if (scope) {
            const { key: scopeKey, counters, cssText } = scope;
            return Object.entries(config).reduce((acc, [key, val]) => {
                const name = `${scopeKey}-${toRadix(counters.keyframes++)}`;
                const { rule, resolver } = animationRule({ name, config: val })
                cssText.keyframes += rule;
                acc[key] = resolver;
                return acc;
            }, {} as Record<string, AnimationResolver>) as AnimationsResolvers<T>;
        }
        // global animations
        scope = StyleProvider.globalScope;
        const stylesheet = StyleProvider.animationsStylesheet;
        return Object.entries(config).reduce((acc, [key, val]) => {
            const name = `${scope.key}-${toRadix(scope.counters.keyframes++)}`;
            const { rule, resolver } = animationRule({ name, config: val })
            stylesheet.insertRule(rule, stylesheet.cssRules.length);
            acc[key] = resolver;
            return acc;
        }, {} as Record<string, AnimationResolver>) as AnimationsResolvers<T>;
    }

    /**
     * Create layer
     */
    static layer = (): LayerResolver => {
        // local layer
        let scope = StyleProvider.scope;
        if (scope) {
            const name = `${scope.key}-${toRadix(scope.counters.layers++)}`;
            const ruleKey = `@layer ${name}`;
            const declaration = ruleKey + ';';
            const resolver = (() => ruleKey) as LayerResolver;
            scope.cssText.layers += declaration;
            resolver[Symbol.toPrimitive] = () => ruleKey;
            return resolver;
        
        }
        // global layer
        scope = StyleProvider.globalScope;
        const stylesheet = StyleProvider.layersStylesheet;
        const name = `${scope.key}-${toRadix(scope.counters.layers++)}`;
        const ruleKey = `@layer ${name}`;
        const declaration = ruleKey + ';';
        const resolver = (() => ruleKey) as LayerResolver;
        resolver[Symbol.toPrimitive] = () => ruleKey;
        stylesheet.insertRule(declaration, stylesheet.cssRules.length);
        return resolver;
    }

    /**
     * Create layers
     * @param config - layers config
     */
    static layers = <T extends string>(config: T[]): Record<NoInfer<T>, LayerResolver> => {
        // local layers
        let scope = StyleProvider.scope;
        const order: string[] = [];
        if (scope) {
            const { key: scopeKey, counters } = scope;
            const resolvers = config.reduce((acc, key) => {
                const name = `${scopeKey}-${toRadix(counters.layers++)}`;
                order.push(name);
                const ruleKey = `@layer ${name}`;
                const resolver = (() => ruleKey) as LayerResolver;
                resolver[Symbol.toPrimitive] = () => ruleKey;
                acc[key] = resolver;
                return acc;
            }, {} as Record<NoInfer<T>, LayerResolver>);
            scope.cssText.layers += (`@layer ${order.join(', ')};`);
            return resolvers;
        }
        // global layers
        scope = StyleProvider.globalScope;
        const stylesheet = StyleProvider.layersStylesheet;
        const resolvers = config.reduce((acc, key) => {
        const name = `${scope.key}-${toRadix(scope.counters.layers++)}`;
            order.push(name);
            const ruleKey = `@layer ${name}`;
            const resolver = (() => ruleKey) as LayerResolver;
            resolver[Symbol.toPrimitive] = () => ruleKey;
            acc[key] = resolver;
            return acc;
        }, {} as Record<NoInfer<T>, LayerResolver>);
        stylesheet.insertRule(`@layer ${order.join(', ')};`, stylesheet.cssRules.length);
        return resolvers;
    }

    /**
     * Create container
     * @param type - container type
     */
    static container = (type?: ContainerType): ContainerResolver => {
        const scope = StyleProvider.scope || StyleProvider.globalScope;
        const name = `${scope.key}-${toRadix(scope.counters.containers++)}`;
        const property = `${name || 'none'} / ${type || 'normal'}`;
        const resolver = (() => property) as ContainerResolver;
        resolver[Symbol.toPrimitive] = () => `@container ${name}`;
        return resolver;
    }

    /**
     * Create containers
     * @param config - containers config
     */
    static containers = <T extends Record<string, ContainerType>>(config: T): ContainersResolvers<T> => {
        return Object.entries(config).reduce((acc, [key, type]) => {
            acc[key] = StyleProvider.container(type);
            return acc;
        }, {} as Record<string, ContainerResolver>) as ContainersResolvers<T>;
    }

    /**
     * Create stylesheet selectors
     * @param generator - stylesheet generator 
     * @param params - stylesheet params
     */
    static selectors(generator: Function, {type}: {
        type?: 'class' | 'attr';
    }) {
        const scope = StyleProvider.createScope();
        const scopeKey = scope.key;
        const stylesheet = StyleProvider.createStyleSheet();
        const serverStylesheet = getServerStylesheet(scopeKey);
        const dict: Record<string, string> = {};
        let serverCSSText: string = '';
        if (serverStylesheet) {
            serverCSSText = serverStylesheet.textContent || '';
            serverStylesheet.disabled = true;
        }

        const hash: undefined | ((key: string) => string) = type && getHash({
            type, dict, scope
        });
        const selectors = hash && getSelectorsProxy(hash);
        // save prev
        const prevScope = StyleProvider.scope;
        // set next
        StyleProvider.scope = scope;
        // calc rules inside current scope
        const styleObject = generator(selectors);
        // return prev scope
        StyleProvider.scope = prevScope;
        // get styles from object
        stylesheet.replaceSync(
            serverCSSText || (scope.cssText.layers + scope.cssText.variables + scope.cssText.keyframes + parseStyles(styleObject))
        );
        markStylesheet(stylesheet, scopeKey);
        const resolveNames = getFromDict(dict);
        let resolver: Function;
        if (type === 'class') resolver = resolveNames;
        else if (type === 'attr') resolver = (config: Record<string, true | Record<string, string | number | boolean>>) => ({[`data-${scope.key}`]: resolveNames(config)});
        else resolver = () => null;
        return StyleProvider.linkStylesheet(resolver, stylesheet);
    }

    static serialize(stylesheet?: EffCSSStyleSheet): string {
        if (stylesheet) return serializeStylesheet(stylesheet);
        return [...StyleProvider.stylesheetsMap.values()].reduce((acc, stylesheet) => {
            return acc += serializeStylesheet(stylesheet);
        },
        serializeStylesheet(StyleProvider._layersStylesheet, 'data-effcss-layers') +
        serializeStylesheet(StyleProvider._variablesStylesheet, 'data-effcss-variables') +
        serializeStylesheet(StyleProvider._animationsStylesheet, 'data-effcss-animations') +
        serializeStylesheet(StyleProvider._sharedStylesheet, 'data-effcss-shared'));
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
export const classNames: ClassNames = (generator) => StyleProvider.selectors(generator, { type: 'class' });

/**
 * Create a stylesheet with attribute selectors
 * @param generator - stylesheet generator
 */
export const attributes: Attributes = (generator) => StyleProvider.selectors(generator , { type: 'attr' });

// custom styles

/**
 * Create a custom stylesheet
 * @param generator - stylesheet generator
 */
export const customStyles: CustomStyles = (generator) => StyleProvider.selectors(generator, { type: undefined });

// stylesheets

/**
 * Get a stylesheet via resolver
 * @param resolver - stylesheet resolver
 */
export const stylesheet = (resolver: any) => resolver && StyleProvider.stylesheetsMap.get(resolver);

/**
 * Get the variables stylesheet
 */
export const variablesStylesheet = () => StyleProvider.variablesStylesheet;

/**
 * Get the animations stylesheet
 */
export const animationsStylesheet = () => StyleProvider.animationsStylesheet;

/**
 * Get the layers stylesheet
 */
export const layersStylesheet = () => StyleProvider.layersStylesheet;

/**
 * Get the shared stylesheet
 */
export const sharedStylesheet = () => StyleProvider.sharedStylesheet;

// advanced

/**
 * Update variable/variables
 * @param arg - source variable/variables
 * @param value - next value 
 */
export const update: Update = (arg: any, value: any) => StyleProvider.update(arg, value);

/**
 * Serialize stylesheet/stylesheets
 * @param stylesheet - concrete stylesheet
 */
export const serialize = (stylesheet?: EffCSSStyleSheet) => StyleProvider.serialize(stylesheet);

/**
 * Configure CSS generation
 * @param config - generation config
 */
export const configure = (config: Partial<{
    prefix: string;
    minify: boolean;
    emulate: boolean;
}>) => {
    if (StyleProvider.stylesheetsMap.size) return false;
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
