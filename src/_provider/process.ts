// css
import { keys as globalKeys } from '../css/dict';
import {
    toCqb,
    toCqi,
    toCqmax,
    toCqmin,
    toCqw,
    toCqh,
    toDeg,
    toMs,
    toPercent,
    toPx,
    toRem,
    toSpan,
    toVh,
    toVmax,
    toVmin,
    toVw
} from '../css/functions';
// defaults
import { defaultParams } from './constants';
// types
import { IStyleProcessor, IValues, TModeValues, TStyleConfig, TVariable } from 'types';

// local types

/**
 * Style generation mode
 * @description
 * `a` - attributes
 * `c` - classes
 */
export type TStyleMode = 'a' | 'c';

type TPrepareSelector = (params: {
    /**
     * Block
     */
    b: string;
    /**
     * Element
     */
    e?: string;
    /**
     * Modifier
     */
    m?: string;
    /**
     * Modifier value
     */
    mv?: string;
    /**
     * HTML element state for modifier value activation
     */
    s?: string;
}) => string;

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
export class Processor implements IStyleProcessor{
    /**
     * Initial styles
     */
    baseStyles: string = '';
    /**
     * Style identifiers prefix
     */
    protected _prefix: string = 'eff';
    /**
     * Style mode
     */
    protected _mode: TStyleMode = 'a';
    /**
     * Manager vars
     */
    protected _params: TModeValues = defaultParams;
    /**
     * Dictionary keys
     */
    protected _compKeys: Record<string, string> = {};
    /**
     * Dictionary values
     */
    protected _compValues: Record<string, Record<string, string | number>> = {};

    /**
     * Prepare rule selector
     */
    protected _prepareSelector: TPrepareSelector;

    constructor(config: {
        mode?: TStyleMode;
        prefix?: string;
        params: Record<string, Record<string, object>>;
    }) {
        const {mode, prefix, params} = config;
        this._mode = mode || 'a';
        this._prefix = prefix || 'eff';
        if (this._mode === 'c') {
            this._prepareSelector = ({ b, e, m, mv, s }) =>
                `.${b}${
                    (e ? '__' + e : '') +
                    (m ? '_' + m : '') +
                    (m && mv ? ('_' + mv) : '') +
                    (s ? (':' + s) : '')}`;
        } else {
            this._prepareSelector = ({ b, e, m, mv, s }) =>
                `[data-${b}${e ? '-' + e : ''}${m ? ('~="' + m + (mv ? '-' + mv : '') + (s ? ':' + s : '') + '"') : ''}]`;
        }
        this._analyzeParams(params);
    }

    protected _analyzeParams = (params: Record<string, Record<string, object>>) => {
        if (params) {
            // apply input params
            for (const key in params) {
                this._params[key] = merge(this._params[key] || {}, params[key]);
            }
        }
        const {
            // universal
            time, rem, szu, sz, sp, rad, th, perc, bp, fsz,
            // text
            lsp,
            // transform
            tr, sk, rot,
            // layout
            fb, ra, ca, ins,
            // container
            cqw, cqh, cqb, cqi, cqmin, cqmax,
            // viewport
            vw, vh, vmin, vmax
        } = this._params.root;
        this._params.root = merge(this._params.root, {
            cqw: toCqw(cqw),
            cqh: toCqh(cqh),
            cqb: toCqb(cqb),
            cqi: toCqi(cqi),
            cqmin: toCqmin(cqmin),
            cqmax: toCqmax(cqmax),
            vw: toVw(vw),
            vh: toVh(vh),
            vmin: toVmin(vmin),
            vmax: toVmax(vmax),
            fb: toPercent(fb),
            ra: toSpan(ra),
            ca: toSpan(ca),
            ins: toPercent(ins),
            sz: merge(toRem(sz) || {}, szu),
            sp: merge(toRem(sp) || {}, szu),
            rad: toRem(rad),
            th: toRem(th),
            bp: toRem(bp),
            fsz: toRem(fsz),
            lsp: toRem(lsp),
            tr: toRem(tr),
            sk: toDeg(sk),
            rot: toDeg(rot),
            perc: toPercent(perc),
            time: toMs(time),
            rem: toPx(rem)
        });
        const {root, ...other} = this._params;
        const otherEntries = Object.entries(other);
        const modeVariables: {
            _mode: Record<string, Record<string, string | number>>
        } = {
            _mode: {
                root: {}
            }
        };
        const changedVariants: Record<string, Record<string, string | number>> = {};
        // mode loop
        otherEntries.forEach(([key, variants]) => {
            if (!modeVariables._mode[key]) modeVariables._mode[key] = {};
            // mode vakues loop
            Object.entries(variants).forEach(([dynamicVariantKey, dynVariant]) => {
                // dynamic value loop
                Object.entries(dynVariant).forEach(([dynKey, dynVal]) => {
                    const varName = this._prepareVarName(dynamicVariantKey, dynKey);
                    modeVariables._mode[key][varName] = dynVal;
                    // create root variables
                    if (!modeVariables._mode.root[varName]) {
                        modeVariables._mode.root[varName] = dynVal;
                        if (!changedVariants[dynamicVariantKey]) changedVariants[dynamicVariantKey] = {};
                        changedVariants[dynamicVariantKey][dynKey] = `var(${varName})`;
                    }
                })
                
            })
        });
        // cpmputed values
        this._compValues = changedVariants;
        // computed keys
        this._compKeys = Object.entries(this._params.root.bp || {}).reduce((acc, [key, val]) => {
            acc[`min_${key}_`] = `@media (min-width:${val})`;
            acc[`max_${key}_`] = `@media (max-width:${val})`;
            return acc;
        }, {} as Record<string, string>);
        this.baseStyles = this.compile('init', {c: {
            ...modeVariables,
            $r_: {
                ...modeVariables._mode.root,
                $c: '{uni.inh}',
                $fsz: '{rem.def}',
                $ff: '{ff.def}',
                $: {
                    $c: '{uni.inh}',
                    $fsz: '{rem.def}',
                    $ff: '{ff.def}'
                }
            },
            ...(modeVariables._mode?.dark ? {
                $dark_: {
                    $r_: modeVariables._mode.dark
                }} : {}),
            ...(modeVariables._mode?.light ? {
                $light_: {
                    $r_: modeVariables._mode.light
                }} : {}),
        }});
    }

    /**
     * Parse string to find selector parts
     * @param key
     */
    protected _parseSelector(key: string) {
        // element
        let e;
        // modifier
        let m;
        // modifier val
        let mv;
        // modifier val state
        let s;
        if (key.startsWith('__')) ([e, m, mv] = key.slice(2).split('_'));
        else ([e, m, mv] = key.split('_'));
        if (mv) ([mv, s] = mv.split(':'));
        return {e, m, mv, s};
    }

    expandSelector(b: string, selector: string): [string, string] {
        const {e, m, mv, s} = this._parseSelector(selector);
        const stateSelector = s && this._getStateSelector(s);
        return [this._prepareSelector({
            b, e, m, mv
        }), this._prepareSelector({
            b, e, m, mv, s
        }) + '{' + stateSelector];
    }

    /**
     * Get state selector
     * @param state
     */
    protected _getStateSelector(state: string) {
        const stateKey = state + '_';
        const stateSelector = this._compKeys[stateKey] || globalKeys[stateKey];
        if (stateSelector) {
            return ((stateSelector.startsWith('&') || stateSelector.startsWith('@')) ? '' : '&') + stateSelector;
        }
    }

    /**
     * Prepare name of variable
     * @param parts
     */
    protected _prepareVarName = (...parts: string[]) => {
        return ['-', this._prefix, ...parts].join('-');
    };

    /**
     * Prepare name of keyframes object
     * @param parts
     */
    protected _prepareKeyframesName = (...parts: string[]) => {
        return [this._prefix, ...parts].join('-');
    };

    /**
     * Compile style config to CSS stylesheet text content
     * @param styleConfig
     * @param param
     */
    compile = (b: string, styleConfig: TStyleConfig) => {
        const { _, kf, k = {}, v = {}, c} = styleConfig;
        const prepareSelector = this._prepareSelector.bind(this);
        const parseSelector = this._parseSelector.bind(this);
        let config = merge({}, c);
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
                            const varName = this._prepareVarName(b, compKey);
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
                            config['_' + varKey + 'l'] = `&lig=>${this._prepareVarName(b, varKey + 'l')}:{1}`;
                            config['_' + varKey + 'c'] = `&chr=>${this._prepareVarName(b, varKey + 'c')}:{1}`;
                            config['_' + varKey + 'h'] = `&hue=>${this._prepareVarName(b, varKey + 'h')}:{1}`;
                            config['_' + varKey + 'a'] = `&alp=>${this._prepareVarName(b, varKey + 'a')}:{1}`;
                        }
                        break;
                    default:
                        const varName = this._prepareVarName(b, varKey);
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
        const getKey = (key: string): string => {
            return localKeys[key] || this._compKeys[key] || globalKeys[key];
        };
        /**
         * Get variant from dictionary
         * @param key
         */
        const getVariant = (key: string): Record<string, string | number> | undefined => {
            return localVariants[key] || this._compValues[key] || this._params.root[key];
        };
        /**
         * Interpolate string from dictionary
         * @param str
         */
        const interpolate = (str: string): string => {
            return str.replaceAll(/\{(.+?)\}/g, (match, content) => {
                const [key, partKey] = content.split('.');
                if (partKey) {
                    const variant = getVariant(key);
                    return variant?.[partKey] || variant?.def;
                } else {
                    return getKey(key);
                }
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
                const [_, key, filter] = pre.match(/(\w+)(\[[\w,]+\])?/);
                const variant = getVariant(key);
                if (!variant) continue;
                obj = variant;
                let entries = Object.entries(obj);
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
                        return [resKey.replace('{0}', key) || key, interpolate(resVal.replaceAll('{1}', val))];
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
            value: Record<string, string | number | Record<string, string | number>> | string | number | undefined,
            parent?: string
        ): string {
            let resKey = '' + key;
            if (key?.startsWith?.('$')) {
                resKey = getKey(key.slice(1));
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
            } else if (typeof value === 'object'){
                // if nested rule
                const prefix = !!parent && !parent.startsWith?.('@') && !resKey.startsWith('&') && !resKey.startsWith('@') ? '&' : '';
                // BEM-selector
                if (resKey.startsWith('_')) {
                    const {e, m, mv} = parseSelector(resKey);
                    // if no modifier value
                    if (m && typeof mv !== 'string') {
                        // modifiers
                        return Object.entries(value).reduce((acc, [mvkey, mvval]) => {
                            let mbody;
                            if (typeof mvval === 'object') {
                                mbody = Object.entries(mvval).reduce((acc, item) => acc + stringify(...item, resKey), '')
                            } else {
                                mbody = mvval + ';';
                            }
                            return acc + prefix + prepareSelector({ b, e, m, mv: mvkey }) + curlyBraces(mbody);
                        }, '')
                    }
                    return (
                        prefix +
                        prepareSelector({ b, e, m, mv }) +
                        curlyBraces(
                            Object.entries(value).reduce((acc, item) => acc + stringify(...item, resKey), '')
                        )
                    );
                } else {
                    return prefix + resKey + curlyBraces(
                        Object.entries(value).reduce((acc, item) => acc + stringify(...item, resKey), '')
                    );
                }
            } else {
                let strVal = '' + value;
                 if(strVal?.startsWith?.('&')) {
                    return stringify(resKey, transform(strVal.slice(1)), parent);
                } else if(strVal?.includes?.('{')) {
                    return stringify(resKey, interpolate(strVal), parent);
                } else {
                    return propVal(resKey,value);
                }
            }
        }

        let kfStr = '';
        if (kf) {
            for (let kfKey in kf) {
                const kfConfig = kf[kfKey];
                const kfName = this._prepareKeyframesName(b, kfKey);
                localKeys['kf_' + kfKey] = kfName;
                kfStr += `@keyframes ${kfName} ` + curlyBraces(Object.entries(kfConfig).reduce((acc, [frameKey, frameVal]) => {
                    const postfix = String(+frameKey) === frameKey ? '%' : '';
                    return acc + frameKey + postfix + curlyBraces(Object.entries(frameVal).reduce((acc, item) => acc + stringify(...item), ''));
                }, ''))
            }
        }
        return varStr + kfStr + Object.entries(config).reduce((acc, item) => acc + stringify(...item), '');
    };
}
