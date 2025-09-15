// local types
type TOptStr = string | undefined;
type TParsedBEM = [string, TOptStr, TOptStr, TOptStr][];

type THueToken = 'pri' | 'sec' | 'suc' | 'inf' | 'war' | 'dan';
type TLightnessToken = 'xs' | 's' | 'm' | 'l' | 'xl';
type TChromaToken = 'pale' | 'base' | 'rich';
type TPaletteDict <T extends string> = {
    dark: {
        bg: Record<T, number>;
        fg: Record<T, number>;
    };
    light: {
        bg: Record<T, number>;
        fg: Record<T, number>;
    };
}
type RecursivePartial<T> = {
  [P in keyof T]?:
    T[P] extends (infer U)[] ? RecursivePartial<U>[] :
    T[P] extends object | undefined ? RecursivePartial<T[P]> :
    T[P];
};
export type TPaletteHue = Record<THueToken, number>;
export type TPaletteLightness = TPaletteDict<TLightnessToken>;
export type TPaletteChroma = TPaletteDict<TChromaToken>;
export type TPalette = {
    l: TPaletteLightness;
    c: TPaletteChroma;
    h: TPaletteHue;
};
export type TPaletteConfig = RecursivePartial<TPalette>;
export type TCoefShortRange = 's' | 'm' | 'l';
export type TCoefMainRange = 'min' | 'm' | 'max';
export type TCoefBaseRange = 'xs' | TCoefShortRange | 'xl';
export type TCoefLongRange = 'xxs' | TCoefBaseRange | 'xxl';
export type TCoefFullRange = 'min' | TCoefLongRange | 'max';
export type TCoefSparseRange = 'min' | 'xs' | 'm' | 'xl' | 'max';
export type TCoefRangeConfig = Record<'xxs' | 'xs' | 's' | 'm' | 'l' | 'xl' | 'xxl' | 'xxl', number>;
export type TCoef = {
    $0_: TCoefRangeConfig;
    $1_: TCoefRangeConfig;
    $2_: TCoefRangeConfig;
    $16_: TCoefRangeConfig;
    max: number;
};
/**
 * Provider attributes
 */
export type TProviderAttrs = {
    /**
     * Hydratation flag
     */
    hydrate: string | null;
    /**
     * Private stylesheet prefix
     */
    prefix: string | null;
    /**
     * BEM selector generation mode
     * @description
     * `a` - data-attributes
     * `c` - classes
     */
    mode: 'a' | 'c' | null;
    /**
     * Theme
     */
    theme: string | null;
    /**
     * Root font size in px
     */
    size: string | null;
    /**
     * Root time in ms
     */
    time: string | null;
    /**
     * Root angle in deg
     */
    angle: string | null;
};

/**
 * Provider settings
 */
export type TProviderSettings = {
    /**
     * Breakpoints
     */
    bp: Record<string, number | string>;
    /**
     * Global vars for each theme
     */
    vars: Record<string, object>;
    /**
     * Stylesheet makers
     */
    makers: Record<string, Function>;
    /**
     * Switched off stylesheets
     */
    off: string[];
    /**
     * Palette
     */
    palette: TPalette;
    /**
     * Coefficients
     */
    coef: TCoef;
};
export type TProviderSettingsPartial = RecursivePartial<TProviderSettings>;

type TStrDict = Record<string, string>;
type Paths<T> = T extends object
    ? {
          [K in keyof T]: `${Exclude<K, symbol>}${'' | Paths<T[K]> extends '' ? '' : `.${Paths<T[K]>}`}`;
      }[keyof T]
    : T extends string
    ? T
    : never;
type TDeepPartial<T> = T extends object
    ? {
          [P in keyof T]?: TDeepPartial<T[P]>;
      }
    : T;
type TBlocks<T> = Exclude<keyof T, symbol | number>;
type TElems<T> = T extends object
    ? {
          [K in keyof T]: `${Exclude<K, symbol>}${T[K] extends object
              ? `.${Exclude<keyof T[K], symbol | ''>}`
              : never}`;
      }[keyof T]
    : never;
type TMods<T> = T extends object
    ? {
          [K in keyof T]: `${Exclude<K, symbol>}${'' | Paths<T[K]> extends '' ? '' : `.${Paths<T[K]>}`}`;
      }[keyof T]
    : T extends string
    ? T
    : never;
type TStringBEM<T> = TBlocks<T> | TMods<T> | TElems<T>;
type TBEM<T> = TDeepPartial<T> | TStringBEM<T> | TStringBEM<T>[];
type TResolveSelector = <T extends object>(params: TBEM<T>) => string;
type TResolveAttr = <T extends object>(params: TBEM<T>) => TStrDict;
type TParts = (string | number)[];
type TScope = {
    /**
     * BEM selector resolver
     */
    selector: TResolveSelector;
    /**
     * BEM attribute resolver
     */
    attr: TResolveAttr;
    /**
     * Name resolver
     */
    name: (...parts: TParts) => string;
    /**
     * Var name
     */
    varName: (...parts: TParts) => string;
    /**
     * Var expression
     */
    varExp: (...parts: TParts) => string;
};

/**
 * Style scope resolver
 */
type TScopeResolver = (key: string) => TScope;

/**
 * Create stylesheet scope
 */
export type TCreateScope = (params?: { mode?: string | null }) => TScopeResolver;

// local utils
const UND = undefined;
const entries = Object.entries;
const isArray = Array.isArray;
const defineProperties = Object.defineProperties;
const getDataBase = (base: string) => `data-${base}`;
const isString = (val: any) => typeof val === 'string';
const isObject = (val: string | number | object) => val !== null && typeof val === 'object';
const isDefined = (val?: any) => val !== null && val !== UND;
const getBase = (b: string, e?: string) => `${b}${e ? '__' + e : ''}`;
const parseStr = (val: string) => {
    return val.split('.');
};
const parseObj = (val: object, attr?: boolean) => {
    return entries(val).reduce((accb, [b, bv]) => {
        if (isObject(bv)) {
            const be = entries(bv);
            if (be.length)
                accb.push(
                    ...be.reduce((acce, [e, ev]) => {
                        if (isDefined(e) && attr) acce.push([b, e, UND, UND]);
                        if (isObject(ev)) {
                            const ee = entries(ev);
                            if (ee.length)
                                acce.push(
                                    ...ee.reduce((accm, [m, mv]) => {
                                        const type = typeof mv;
                                        if (type === 'string' || type === 'number') accm.push([b, e, m, mv]);
                                        return accm;
                                    }, [] as TParsedBEM)
                                );
                        }
                        return acce;
                    }, [] as TParsedBEM)
                );
            else accb.push([b, UND, UND, UND]);
        }
        return accb;
    }, [] as TParsedBEM);
};
const makeClsVal = (b: string, e?: string, m?: string, v?: string) =>
    `${getBase(b, e) + (m ? '_' + m : '') + (m && v ? '_' + v : '')}`;
const makeCls = (b: string, e?: string, m?: string, v?: string) => '.' + makeClsVal(b, e, m, v);
const makeAttr = (b: string, e?: string, m?: string, v?: string) =>
    `[${getDataBase(getBase(b, e))}${m && v ? `~="${m}_${v}"` : m ? `~="${m}"` : ''}]`;
export const merge = (target: Record<string, any>, ...sources: Record<string, any>[]) =>
    !sources.length
        ? target
        : sources.reduce((acc, source) => {
              entries(source).forEach(([k, v]) => {
                  if (v && typeof v === 'object') {
                      if (!acc[k]) acc[k] = v;
                      else if (isArray(acc[k]) && isArray(v)) acc[k] = [...acc[k], ...v];
                      else merge(acc[k], v || {});
                  } else acc[k] = v;
              });
              return acc;
          }, target as Record<string, any>);
const LIGHTNESS_DEFAULT = {
    def: 0.75,
    // contrast
    c: 0.05,
    // small
    s: 0.65,
    // medium
    m: 0.75,
    // large
    l: 0.85,
    // neutral
    n: 0.9
};

export const TAG_NAME = 'effcss-provider';

export const DEFAULT_ATTRS: TProviderAttrs = {
    theme: null,
    hydrate: null,
    mode: 'a',
    prefix: 'f',
    size: null,
    time: null,
    angle: null
};

const DEFAULT_PALETTE: TPalette = {
    l: {
        dark: {
            bg: {
                xl: 0.24,
                l: 0.3,
                m: 0.36,
                s: 0.42,
                xs: 0.48
            },
            fg: {
                xl: 0.98,
                l: 0.93,
                m: 0.86,
                s: 0.79,
                xs: 0.72
            }
        },
        light: {
            bg: {
                xl: 0.98,
                l: 0.93,
                m: 0.88,
                s: 0.83,
                xs: 0.78
            },
            fg: {
                xl: 0,
                l: 0.12,
                m: 0.24,
                s: 0.36,
                xs: 0.48
            }
        }
    },
    c: {
        dark: {
            bg: {
                pale: 0.02,
                base: 0.06,
                rich: 0.1
            },
            fg: {
                pale: 0.06,
                base: 0.10,
                rich: 0.14
            }
        },
        light: {
            bg: {
                pale: 0.01,
                base: 0.04,
                rich: 0.7
            },
            fg: {
                pale: 0.07,
                base: 0.11,
                rich: 0.15
            }
        }
    },
    h: {
        pri: 184,
        sec: 290,
        suc: Number((0.1 * 184 + 0.9 * 142).toFixed(2)),
        inf: Number((0.1 * 184 + 0.9 * 264).toFixed(2)),
        war: Number((0.1 * 184 + 0.9 * 109).toFixed(2)),
        dan: Number((0.1 * 184 + 0.9 * 29).toFixed(2)),
    }
};

const DEFAULT_COEF: TCoef = {
    $0_: {
        xxs: 0.0625,
        xs: 0.125,
        s: 0.25,
        m: 0.5,
        l: 0.75,
        xl: 0.875,
        xxl: 0.9375
    },
    $1_: {
        xxs: 1.0625,
        xs: 1.125,
        s: 1.25,
        m: 1.5,
        l: 1.75,
        xl: 1.875,
        xxl: 1.9375
    },
    $2_: {
        xxs: 2.5,
        xs: 4,
        s: 5,
        m: 7.5,
        l: 10,
        xl: 12,
        xxl: 15
    },
    $16_: {
        xxs: 20,
        xs: 28,
        s: 36,
        m: 48,
        l: 64,
        xl: 80,
        xxl: 120
    },
    max: 150
};

export const DEFAULT_BREAKPOINTS = {
    '3xs': 18,
    '2xs': 24,
    xs: 30,
    sm: 40,
    md: 48,
    lg: 64,
    xl: 80,
    '2xl': 96
};

export type TDeafultBreakpoints = typeof DEFAULT_BREAKPOINTS;

/**
 * Default provider settings
 */
export const DEFAULT_SETTINGS: Partial<TProviderSettings> = {
    bp: DEFAULT_BREAKPOINTS,
    vars: {
        '': {
            /**
             * Root time
             */
            rtime: '200ms',
            /**
             * Root em
             */
            rem: '16px',
            /**
             * Root angle
             */
            rangle: '30deg',
            /**
             * Lightness
             */
            l: LIGHTNESS_DEFAULT,
            /**
             * Hue
             */
            h: {
                def: 261.35,
                // brand
                b: 261.35,
                // info
                i: 194.77,
                // error
                e: 29.23,
                // warning
                w: 70.66,
                // success
                s: 142.49
            },
            /**
             * Chroma
             */
            c: {
                def: 0.03,
                xs: 0.03,
                s: 0.06,
                m: 0.1,
                l: 0.15,
                xl: 0.25
            },
            /**
             * Alpha
             */
            a: {
                def: 1,
                min: 0,
                xs: 0.1,
                s: 0.25,
                m: 0.5,
                l: 0.75,
                xl: 0.9,
                max: 1
            },
            /**
             * Time
             */
            t: {
                def: 300,
                xs: 100,
                s: 200,
                m: 300,
                l: 450,
                xl: 600,
                no: 0,
                min: 50,
                max: 750
            },
            /**
             * Integer coefficients
             */
            int: [...Array(12).keys()],
            /**
             * Fractions
             */
            fr: {
                0: 0,
                '1/12': '0.0833',
                '1/10': '0.1',
                '1/6': '0.1667',
                '1/5': '0.2',
                '1/4': '0.25',
                '3/10': '0.3',
                '1/3': '0.3333',
                '2/5': '0.4',
                '5/12': '0.4167',
                '1/2': '0.5',
                '7/12': '0.5833',
                '3/5': '0.6',
                '2/3': '0.6667',
                '7/10': '0.7',
                '3/4': '0.75',
                '4/5': '0.8',
                '5/6': '0.8333',
                '9/10': '0.9',
                '11/12': '0.9167',
                1: '1'
            },
            /**
             * Aspect-ratio
             */
            ar: {
                1: 1,
                '2/1': 2,
                '1/2': 0.5,
                '4/3': 1.3333,
                '3/4': 0.75,
                '9/16': 0.5625,
                '16/9': 1.7778
            }
        },
        /**
         * Light mode
         */
        light: {
            // lightness
            l: LIGHTNESS_DEFAULT
        },
        /**
         * Dark mode
         */
        dark: {
            // lightness
            l: {
                def: 0.4,
                n: 0.25,
                s: 0.3,
                m: 0.4,
                l: 0.5,
                c: 0.95
            }
        }
    },
    palette: DEFAULT_PALETTE,
    coef: DEFAULT_COEF
};

/**
 * Create BEM resolver
 * @param params - BEM resolver params
 */
export const createScope: TCreateScope = (params = {}) => {
    const { mode } = params;
    let selector: TScope['selector'];
    let attr: TScope['attr'];
    return (styleSheetKey: string) => {
        const name: TScope['name'] = (...parts) =>
            '' + parts.filter(Boolean).reduce((acc, part) => `${acc}-${part}`, styleSheetKey);
        const varName: TScope['name'] = (...parts) => '--' + name(...parts);
        const varExp: TScope['name'] = (...parts) => `var(${varName(...parts)})`;
        if (mode === 'c') {
            selector = (params) => {
                let braw, e, m, v;
                if (isString(params)) {
                    [braw, e, m, v] = parseStr(params);
                    return makeCls(name(braw), e, m, v);
                } else {
                    return (
                        params &&
                        parseObj(params)
                            .map(([braw, e, m, v]) => makeCls(name(braw), e, m, v))
                            .join(',')
                    );
                }
            };
            attr = (params) => {
                let b, e, m, v;
                const k = 'class';
                let val = '';
                if (Array.isArray(params)) {
                    val = [
                        ...params
                            .reduce((acc, p) => {
                                [b, e, m, v] = parseStr(p);
                                acc.add(makeClsVal(name(b), e));
                                if (m) acc.add(makeClsVal(name(b), e, m, v));
                                return acc;
                            }, new Set())
                            .values()
                    ].join(' ');
                } else if (isString(params)) {
                    [b, e, m, v] = parseStr(params);
                    val = makeClsVal(name(b), e, m, v);
                } else {
                    val =
                        params &&
                        parseObj(params, true)
                            .map(([b, e, m, v]) => makeClsVal(name(b), e, m, v))
                            .join(' ');
                }
                return defineProperties(
                    { [k]: val },
                    {
                        toString: {
                            value: () => `${k}="${val}"`
                        }
                    }
                );
            };
        } else {
            selector = (params) => {
                let b, e, m, v;
                if (isString(params)) {
                    [b, e, m, v] = parseStr(params);
                    return makeAttr(name(b), e, m, v);
                } else {
                    return (
                        params &&
                        parseObj(params)
                            .map(([b, e, m, v]) => makeAttr(name(b), e, m, v))
                            .join(',')
                    );
                }
            };
            attr = (params) => {
                let b, e, m, v;
                let k: string;
                let val: string = '';
                let result: Record<string, string>;
                if (Array.isArray(params))
                    result = params.reduce((acc, p) => {
                        [b, e, m, v] = parseStr(p);
                        const base = getBase(name(b), e);
                        k = getDataBase(base);
                        val = m ? (v ? `${m}_${v}` : `${m}`) : '';
                        if (acc[k] && val) acc[k] = acc[k] + ' ' + val;
                        else acc[k] = val;
                        return acc;
                    }, {});
                else if (isString(params)) {
                    [b, e, m, v] = parseStr(params);
                    const base = getBase(name(b), e);
                    k = getDataBase(base);
                    val = m ? (v ? `${m}_${v}` : `${m}`) : '';
                    result = { [k]: val };
                } else {
                    result =
                        params &&
                        parseObj(params, true).reduce((acc, [b, e, m, v]) => {
                            const base = getBase(name(b), e);
                            k = getDataBase(base);
                            const next = m ? (v ? `${m}_${v}` : `${m}`) : '';
                            if (acc[k]) val = acc[k] + ' ' + next;
                            else val = next;
                            acc[k] = val;
                            return acc;
                        }, {} as Record<string, string>);
                }
                defineProperties(result, {
                    toString: {
                        value: () =>
                            entries(result)
                                .map(([k, v]) => `${k}="${v}"`)
                                .join(' ')
                    }
                });
                return result;
            };
        }
        return {
            selector,
            attr,
            name,
            varName,
            varExp
        };
    };
};

/**
 * Create stylesheet key maker
 * @param params - collector params
 */
export const createKeyMaker = ({
    prefix
}: {
    prefix: string;
}): {
    /**
     * Base stylesheet key
     */
    base: string;
    /**
     * Current stylesheet key
     */
    current: string;
    /**
     * Create next key
     */
    next(): string;
    /**
     * Reset current key
     */
    reset(): void;
} => {
    let count = 1;
    return {
        get base() {
            return prefix + 0;
        },
        get current() {
            return prefix + count;
        },
        next() {
            count++;
            return this.current;
        },
        reset() {
            count = 1;
        }
    };
};

/**
 * Create stylesheet maker collector
 * @param params - collector params
 */
export const createCollector = (): {
    /**
     * Collect maker
     * @param maker - stylesheet maker
     * @param key - stylesheet key
     */
    use(maker: Function, key: string): string;
    /**
     * Collect makers
     * @param makers - stylesheet makers dict
     */
    useMany(makers: Record<string, Function>): string[];
    /**
     * Get key of collected maker
     * @param maker - stylesheet maker
     */
    getKey(maker: Function): string | undefined;
    /**
     * Get all collected keys
     */
    keys: string[];
    /**
     * Get all collected makers
     */
    makers: Record<string, Function>;
} => {
    const k: Set<string> = new Set();
    const _ = new Map<Function, string>();
    return {
        use(maker, key) {
            const existedKey = _.get(maker);
            if (existedKey) return existedKey;
            k.add(key);
            _.set(maker, key);
            return key;
        },

        useMany(makers) {
            return entries(makers).map(([k, v]) => this.use(v, k));
        },

        getKey(maker) {
            return _.get(maker);
        },

        get keys() {
            return [...k];
        },

        get makers() {
            return Object.fromEntries(_.entries().map(([s, k]) => [k, s]));
        }
    };
};
