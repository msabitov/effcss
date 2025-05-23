// types
import {
    IStyleProcessor, IStyleResolver,
    TStyleSheetConfig, TVariable,
} from '../types';

// local types

/**
 * Processor constructor params
 * @private
 */
interface IConstructorParams {
    sets?: Record<string, Record<string, string | number>>;
    keys?: Record<string, string | number>;
    resolver: IStyleResolver;
}

const objectEntries = Object.entries;
const objectReduce = <T extends object, F extends (previousValue: any, currentValue: [string, any], currentIndex: number, array: [string, any][]) => any>(
    obj: T,
    callback: F,
    acc: any
) => objectEntries(obj).reduce(callback, acc);
const isObject = (arg?: string | number | object) => typeof arg === 'object';
/**
 * Put value in curly braces
 * @param val
 */
export const curlyBraces = (val: string | number) => `{${val}}`;
/**
 * Merge object args
 */
const merge = Object.assign.bind(Object);
/**
 * Prepare `property: value;` string
 * @param prop
 * @param val
 */
const propVal = (prop: string, val: string | number | boolean) => `${prop}:${val};`;
/**
 * Converts lowerCamelCase to kebabCase
 */
const kebabCase = (str: string) => str.replace(/[A-Z]/g, v => "-" + v.toLowerCase());
/**
 * Prepare `@property <...>` string
 * @param name
 * @param config
 */
const property = (name: string, config: TVariable) => [
    '@property',
    name,
    curlyBraces(
        propVal('syntax', config.syn || '"*"') +
        propVal('inherits', config.inh || false) +
        (config.ini ? propVal('initial-value', config.ini) : '')
    )
].join(' ');
/**
 * Add a string inside `var(val)` expression
 * @param val
 */
const varExp = (val: string) => `var(${val})`;
/**
 * Constructs `oklch(l c h / alpha)` expression
 * @param params
 */
const oklch = ({
    l,
    c,
    h,
    a = 1
}: {
    l: string | number;
    c: string | number;
    h: string | number;
    a?: string | number;
}) => `oklch(${l} ${c} ${h} / ${a})`;
/**
 * Color postfixes
 */
const colorPostfixes = ['l', 'c', 'h', 'a'] as const;

/**
 * Style processor
 */
class Processor implements IStyleProcessor {
    /**
     * BEM selectors resolver
     */
    protected _r: IStyleResolver;
    /**
     * Dictionary keys
     */
    protected _k: Record<string, string | number> = {};
    /**
     * Dictionary sets
     */
    protected _s: Record<string, Record<string, string | number>> = {};

    constructor(config: IConstructorParams) {
        const {
            sets, keys, resolver
        } = config;
        this._r = resolver;
        if (keys) this._k = keys;
        if (sets) this._s = sets;
    }

    /**
     * Parse string to find selector parts
     * @param key
     */
    protected _sel = (key: string) => {
        // clear selector
        let clear;
        // element
        let e;
        // modifier
        let m;
        // modifier val
        let mv;
        // modifier val state
        let s;
        ([clear, s] = key.split(':'));
        if (clear.startsWith('__')) ([e, m, mv] = clear.slice(2).split('_'));
        else ([e, m, mv] = clear.split('_'));
        return {e, m, mv, s};
    }

    /**
     * Prepare name of variable
     * @param parts
     */
    protected _var = (...parts: string[]) => this._r.varName(...parts);
    /**
     * Prepare name of keyframes object
     * @param parts
     */
    protected _kf = (...parts: string[]) => this._r.kfName(...parts);

    /**
     * Compile style config to CSS stylesheet text content
     * @param styleConfig
     * @param param
     */
    compile = (b: string, styleConfig: TStyleSheetConfig) => {
        const { _, kf, k = {}, v = {}, c} = styleConfig;
        const prepareSelector = this._r.selector.bind(this);
        const parseSelector = this._sel;
        let config = merge({}, c) as Record<string, string | number | object | unknown>;
        let localKeys = merge({}, k);
        let localVariants = merge({_:{} as Record<string, string>}, v);
        let varStr = '';
        if (_) {
            for (let varKey in _) {
                const varConfig = _[varKey];
                // typ - type, ini - initial-value, inh - inherit, syn - syntax
                switch(varConfig.typ) {
                    case 'c':
                        const colorVarNames: Record<string, string> = {};
                        colorPostfixes.forEach((key) => {
                            const compKey = varKey + key;
                            const varName = this._var(b, compKey);
                            colorVarNames[key] = varName;
                            localKeys['_' + compKey] = colorVarNames[key];
                            varStr += property(varName, varConfig);
                        });
                        // only value accessible, beacause computation
                        localVariants._[varKey] = oklch({
                            l: varExp(colorVarNames.l),
                            c: varExp(colorVarNames.c),
                            h: varExp(colorVarNames.h),
                            a: varExp(colorVarNames.a),
                        });
                        // if all controls needed
                        if (varConfig.all) {
                            config['_' + varKey + 'l'] = `&lig=>${this._var(b, varKey + 'l')}:{1}`;
                            config['_' + varKey + 'c'] = `&chr=>${this._var(b, varKey + 'c')}:{1}`;
                            config['_' + varKey + 'h'] = `&hue=>${this._var(b, varKey + 'h')}:{1}`;
                            config['_' + varKey + 'a'] = `&alp=>${this._var(b, varKey + 'a')}:{1}`;
                        }
                        break;
                    default:
                        const varName = this._var(b, varKey);
                        localKeys['_' + varKey] = varName;
                        localVariants._[varKey] = varExp(varName);
                        varStr += property(varName, varConfig);
                }
            }
        }
        /**
         * Get key from dictionary
         * @param key
         */
        const getKey = (key: string): string | number => {
            return localKeys[key] || this._k[key];
        };
        /**
         * Get variant from dictionary
         * @param key
         */
        const getVariant = (key: string): Record<string, string | number> | undefined => {
            return localVariants[key] || this._s[key] || this._s?.root[key];
        };
        /**
         * Interpolate string from dictionary
         * @param str
         */
        const interpolate = (str: string): string => {
            return str.replaceAll(/\{(.+?)\}/g, (match, content) => {
                const [key, partKey] = content.split('.');
                let res;
                if (partKey) {
                    const variant = getVariant(key);
                    res = (variant?.[partKey] || variant?.def || '');
                } else {
                    res = (getKey(key) || '');
                }
                return '' + res;
            });
        }
        /**
         * Transform value to variant
         * @param str
         */
        const transform = (str: string): Record<string, string | number> | undefined => {
            //map,filter 'perc?sz[s,m,l]=>{0}|{bg}:{1}px'
            const valItems = str.split('?');
            let obj: Record<string, string | number> | undefined = undefined;
            for (let valIndex in valItems) {
                const valItem = valItems[valIndex];
                const [pre, post] = valItem.split('=>');
                const prerMatch = pre.match(/(\w+)(\[[\w,]+\])?/);
                if (!prerMatch) continue;
                const [_, key, filter] = prerMatch;
                const variant = getVariant(key);
                if (!variant) continue;
                obj = variant;
                let entries = objectEntries(obj);
                const filterKeys = filter?.slice(1, -1).split(',');
                if (filterKeys) {
                    const filterKeysSet = new Set(filterKeys);
                    entries = entries.filter(([key, val]) => filterKeysSet.has(key));
                }
                if (post) {
                    let [resKey, resVal] = post.split('|');
                    if (resVal === undefined) {
                        resVal = resKey;
                        resKey = '';
                    }
                    entries = entries.map(([key, val]) => {
                        return [resKey.replace('{0}', key) || key, interpolate(resVal.replaceAll('{1}', '' + val))];
                    });
                }
                if (filterKeys || post) {
                    obj = Object.fromEntries(entries);
                }
                break;
            }
            return obj;
        };

        /**
         * Stringify config
         * @param key
         * @param value
         * @param parent
         */
        function stringify(
            key: string,
            value: object | string | number | undefined | unknown,
            parent?: string
        ): string {
            let resKey = '' + key;
            if (key?.startsWith?.('$')) {
                resKey = '' + getKey(key.slice(1));
                if (!resKey) return '';
            }
            if (Array.isArray(value)){
                return stringify(
                    resKey,
                    Object.assign(
                        {},
                        ...value.map((
                            item
                        ) => typeof item === 'string' ? transform(item) : item)
                    ),
                    parent
                );
            } else if (value === null || value === undefined) {
                return '';
            } else if (isObject(value)){
                // if nested rule
                const prefix = !!parent && !parent.startsWith?.('@') && !resKey.startsWith('&') && !resKey.startsWith('@') ? '&' : '';
                // BEM-selector
                if (resKey.startsWith('_')) {
                    const {e, m, mv} = parseSelector(resKey);
                    // if no modifier value
                    if (m && typeof mv !== 'string') {
                        // modifiers
                        return objectReduce(value, (acc, [mvkey, mvval]) => {
                            let mbody;
                            if (isObject(mvval)) {
                                mbody = objectReduce(mvval, (acc, item) => acc + stringify(...item, resKey), '')
                            } else {
                                mbody = mvval + ';';
                            }
                            return acc + prefix + prepareSelector({ b, e, m, mv: mvkey }) + curlyBraces(mbody);
                        }, '');
                    }
                    return (
                        prefix +
                        prepareSelector({ b, e, m, mv }) +
                        curlyBraces(
                            objectReduce(value, (acc, item) => acc + stringify(...item, resKey), '')
                        )
                    );
                } else {
                    return prefix + resKey + curlyBraces(
                        objectReduce(value, (acc, item) => acc + stringify(...item, resKey), '')
                    );
                }
            } else {
                let strVal = '' + value;
                if(strVal?.startsWith?.('&')) {
                    return stringify(resKey, transform(strVal.slice(1)), parent);
                } else if(strVal?.includes?.('{')) {
                    return stringify(resKey, interpolate(strVal), parent);
                } else {
                    return propVal(kebabCase(resKey), strVal);
                }
            }
        }

        let kfStr = '';
        if (kf) {
            for (let kfKey in kf) {
                const kfConfig = kf[kfKey];
                const kfName = this._kf(b, kfKey);
                localKeys['kf_' + kfKey] = kfName;
                kfStr += `@keyframes ${kfName} ` + curlyBraces(objectReduce(kfConfig, (acc, [frameKey, frameVal]) => {
                    const postfix = String(+frameKey) === frameKey ? '%' : '';
                    return acc + frameKey + postfix + curlyBraces(objectReduce(frameVal, (acc, item) => acc + stringify(...item), ''));
                }, ''))
            }
        }
        return varStr + kfStr + objectReduce(config, (acc, item) => acc + stringify(...item), '');
    };
}

/**
 * Create {@link IStyleProcessor | style processor}
 * @param params - processor params
 * @returns IStyleProcessor
 */
export function createProcessor(params: IConstructorParams): IStyleProcessor {
    return new Processor(params);
}
