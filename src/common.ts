// local types
type TOptStr = string | undefined;
type TParsedBEM = [string, TOptStr, TOptStr, TOptStr][];

type THue = 'pri' | 'sec' | 'suc' | 'inf' | 'war' | 'dan';
type TLightness = 'xs' | 's' | 'm' | 'l' | 'xl';
type TChroma = 'pale' | 'base' | 'rich';
type TMode = 'bg' | 'fg';
/**
 * Palette generator
 * @description
 * Allows to create palette colors 
 */
export interface IPalette {
    state: {
        l: TLightness;
        c: TChroma | 'gray';
        h: THue;
        a: number;
        m: TMode;
    }
    /**
     * Returns `xs` lightness color
     */
    get xs(): IPalette;
    /**
     * Returns `s` lightness color
     */
    get s(): IPalette;
    /**
     * Returns `m` lightness color
     */
    get m(): IPalette;
    /**
     * Returns `l` lightness color
     */
    get l(): IPalette;
    /**
     * Returns `xl` lightness color
     */
    get xl(): IPalette;
    /**
     * Returns lightness color dictionary
     */
    get lightness(): Record<TLightness, IPalette>;
    /**
     * Returns zero chroma color
     */
    get gray(): IPalette;
    /**
     * Returns pale chroma color
     */
    get pale(): IPalette;
    /**
     * Returns base chroma color
     */
    get base(): IPalette;
    /**
     * Returns rich chroma color
     */
    get rich(): IPalette;
    /**
     * Returns chroma color dictionary
     */
    get chroma(): Record<TChroma, IPalette>;
    /**
     * Returns primary hue color
     */
    get pri(): IPalette;
    /**
     * Returns secondary hue color
     */
    get sec(): IPalette;
    /**
     * Returns success hue color
     */
    get suc(): IPalette;
    /**
     * Returns info hue color
     */
    get inf(): IPalette;
    /**
     * Returns warning hue color
     */
    get war(): IPalette;
    /**
     * Returns danger hue color
     */
    get dan(): IPalette;
    /**
     * Returns hue color dictionary
     */
    get hue(): Record<THue, IPalette>;
    /**
     * Returns specified alpha color
     */
    alpha(a?: number): IPalette;
    /**
     * Returns background color
     */
    get bg(): IPalette;
    /**
     * Returns foreground color
     */
    get fg(): IPalette;
}
type RecursivePartial<T> = {
  [P in keyof T]?:
    T[P] extends (infer U)[] ? RecursivePartial<U>[] :
    T[P] extends object | undefined ? RecursivePartial<T[P]> :
    T[P];
};
type TPaletteDict <T extends string> = {
    dark: {
        bg: Record<T, number>;
        fg: Record<T, number>;
    };
    light: {
        bg: Record<T, number>;
        fg: Record<T, number>;
    };
};
export type TPaletteHue = Record<THue, number>;
export type TPaletteLightness = TPaletteDict<TLightness>;
export type TPaletteChroma = TPaletteDict<TChroma>;
export type TPaletteConfig = {
    l: TPaletteLightness;
    c: TPaletteChroma;
    h: TPaletteHue;
};
export type TShortRange = 's' | 'm' | 'l';
export type TMainRange = 'min' | 'm' | 'max';
export type TBaseRange = 'xs' | TShortRange | 'xl';
export type TLongRange = 'xxs' | TBaseRange | 'xxl';
export type TFullRange = 'min' | TLongRange | 'max';
export type TSparseRange = 'min' | 'xs' | 'm' | 'xl' | 'max';
export type TRangeConfig = Record<'xxs' | 'xs' | 's' | 'm' | 'l' | 'xl' | 'xxl' | 'xxl', number>;
export type TCoefConfig = {
    $0_: TRangeConfig;
    $1_: TRangeConfig;
    $2_: TRangeConfig;
    $16_: TRangeConfig;
    max: number;
};
/**
 * Coefficient generator
 * @description
 * Allows to create coefficient ranges 
 */
export interface ICoef {
    /**
     * Coefficient state
     */
    state: {
        center: number;
    };
    /**
     * Returns `xxs` coefficient
     */
    get min(): string;
    /**
     * Returns `xxs` coefficient
     */
    get xxs(): string;
    /**
     * Returns `xs` coefficient
     */
    get xs(): string;
    /**
     * Returns `s` coefficient
     */
    get s(): string;
    /**
     * Returns `m` coefficient
     */
    get m(): string;
    /**
     * Returns `l` coefficient
     */
    get l(): string;
    /**
     * Returns `xl` coefficient
     */
    get xl(): string;
    /**
     * Returns `xxl` coefficient
     */
    get xxl(): string;
    /**
     * Returns `xxl` coefficient
     */
    get max(): string;
    /**
     * Range from 0 to 1
     */
    get $0_(): ICoef;
    /**
     * Range around 1
     */
    get $1(): ICoef;
    /**
     * Range from 1 to 2
     */
    get $1_(): ICoef;
    /**
     * Range around 2
     */
    get $2(): ICoef;
    /**
     * Range from 2 to 16
     */
    get $2_(): ICoef;
    /**
     * Range around 16
     */
    get $16(): ICoef;
    /**
     * Range from 16 to the end
     */
    get $16_(): ICoef;
    /**
     * Short range dictionary
     */
    get short(): Record<TShortRange, string>;
    /**
     * Base range dictionary
     */
    get base(): Record<TBaseRange, string>;
    /**
     * Long range dictionary
     */
    get long(): Record<TLongRange, string>;
    /**
     * Full range dictionary
     */
    get full(): Record<TFullRange, string>;
    /**
     * Main range dictionary
     */
    get main(): Record<TMainRange, string>;
    /**
     * Sparse range dictionary
     */
    get sparse(): Record<TSparseRange, string>;
}
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
     * BEM selectors minification
     */
    min: '' | null;
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
    palette: TPaletteConfig;
    /**
     * Coefficients
     */
    coef: TCoefConfig;
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
type TStyleSheet = Record<
    string, Record<string, Record<string, string | number>>
>;
export type TMonoResolver<T extends TStyleSheet,
    B extends keyof T, E extends keyof T[B]
> = {
    /**
     * Specify block
     * @param val - block name
     */
    b<BL extends Exclude<keyof T, Symbol | number>>(val: BL): TMonoResolver<T, BL, ''>;
    /**
     * Specify element
     * @param val - element name
     */
    e<EL extends Exclude<keyof T[B], Symbol | number>>(val: EL): TMonoResolver<T, B, EL>;
    /**
     * Specify modifiers
     * @param val - modifiers object
     */
    m(val?: Partial<T[B][E]>): TMonoResolver<T, B, E>;
    /**
     * Result style attributes
     */
    get $(): {
        [key in string]: string;
    };
}
type TResolveSelector = <T extends TStyleSheet>(params: TBEM<T>) => string;
type TResolveAttr = {
    <T extends TStyleSheet>(params: TBEM<T>): Record<string, string>;
    <T extends TStyleSheet>(): TMonoResolver<T, "", "">;
};
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
export type TCreateScope = (params?: {
    mode?: string | null;
    min?: boolean;
}) => TScopeResolver;

// local utils
const UND = undefined;
const entries = Object.entries;
const isArray = Array.isArray;
const defineProperties = Object.defineProperties;
const isString = (val: any) => typeof val === 'string';
const isObject = (val: string | number | object) => val !== null && typeof val === 'object';
const isDefined = (val?: any) => val !== null && val !== UND;
const getBase = (b?: string, e?: string) => `${b || ''}${e ? '__' + e : ''}`;
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
const prepareName = (b: string, e?: string, m?: string, v?: string) =>
    `${getBase(b, e) + (m ? '_' + m : '') + (m && v ? '_' + v : '')}`;
const makeCls = (key: string, val?: string) => '.' + (val ? (key + '-' + val) : key);
const makeAttr = (key: string, val?: string) => `[data-${key}${val ? `~="${val}"` : ''}]`;

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
    angle: null,
    min: null
};
const BASE_HUE = 184;
const computeHue = (val: number) => Number((0.1 * BASE_HUE + 0.9 * val).toFixed(2));

const DEFAULT_PALETTE: TPaletteConfig = {
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
        pri: BASE_HUE,
        sec: 290,
        suc: computeHue(142),
        inf: computeHue(264),
        war: computeHue(109),
        dan: computeHue(29)
    }
};

const DEFAULT_COEF: TCoefConfig = {
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
function resolveMono<T extends Record<
    string, Record<string, Record<string, string | number>>>
>(resolve: (p: object) => object): TMonoResolver<T, '', ''> {
    const get = <
        T,
        B extends Exclude<keyof T, Symbol | number>,
        E extends Exclude<keyof T[B], Symbol | number>
    >({
        b, e, m
    }: {
        b: B,
        e: E,
        m: Partial<T[B][E]>,
    }) => ({
        b<BL extends Exclude<keyof T, Symbol | number>>(b: BL) {
            return get<T, BL, Exclude<keyof T[BL], number | Symbol>>({
                b, e: '' as Exclude<keyof T[BL], number | Symbol>, m: {} as T[BL][Exclude<keyof T[BL], number | Symbol>]
            });
        },
        e<EL extends Exclude<keyof T[typeof b], Symbol | number>>(e: EL) {
            return get<T, B, EL>({
                b, e, m: {} as T[B][EL]
            });
        },
        m(m: Partial<T[B][E]> = {} as Partial<T[B][E]>) {
            return get({
                b, e, m
            });
        },
        get $() {
            return resolve({
                [b]: {
                    [e]: m
                }
            });
        }
    })
    return get<T, Exclude<keyof T, number | Symbol>, Exclude<keyof T[Exclude<keyof T, Symbol | number>], Symbol | number>>({
        b: '' as Exclude<keyof T, Symbol | number>,
        e: '' as Exclude<keyof T[Exclude<keyof T, Symbol | number>], Symbol | number>,
        m: {} as T[Exclude<keyof T, Symbol | number>][Exclude<keyof T[Exclude<keyof T, Symbol | number>], Symbol | number>]
    }) as unknown as TMonoResolver<T, '', ''>;
}

const repeat = (val: string) => val || '';

/**
 * Create BEM resolver
 * @param params - BEM resolver params
 */
export const createScope: TCreateScope = (params = {}) => {
    const { mode, min } = params;
    let makeSelector;
    if (mode === 'a') makeSelector = makeAttr;
    else makeSelector = makeCls;
    let store: Record<string, Record<string, string>>;
    if (min) store = {};
    return (styleSheetKey: string) => {
        let ind: number = 0;
        let min = repeat;
        let unmin = repeat;
        if (store) {
            if (!store[styleSheetKey]) store[styleSheetKey] = {};
            min = (val: string) => store[styleSheetKey][val] ?? (store[styleSheetKey][val] = (ind++).toString(36));
            unmin = (val: string) => store[styleSheetKey][val];
        };
        let name: TScope['name'] = (...parts) => [styleSheetKey, ...parts].filter(Boolean).join('-');
        let keyAttr = 'class';
        let prefix = (val: string) => val ? styleSheetKey + (val.startsWith('_') ? '' : '-') + val : (val === undefined ? undefined : styleSheetKey);
        if (mode === 'a') {
            keyAttr = 'data-' + styleSheetKey;
            prefix = repeat;
        }
        const varName: TScope['name'] = (...parts) => '--' + name(...parts);
        const varExp: TScope['name'] = (...parts) => `var(${varName(...parts)})`;
        const selector: TScope['selector'] = (params) => {
            let braw, e, m, v;
            if (isString(params)) {
                [braw, e, m, v] = parseStr(params);
                return makeSelector(styleSheetKey, min(prepareName(braw, e, m, v)));
            } else {
                return (
                    params &&
                    parseObj(params)
                        .map(([braw, e, m, v]) => makeSelector(styleSheetKey, min(prepareName(braw, e, m, v))))
                        .join(',')
                );
            }
        };
        const attr: TScope['attr'] = (<T extends TStyleSheet>(params?: TBEM<T>) => {
            if (params === undefined) return resolveMono<T>(attr);
            let b, e, m, v;
            let val = '';
            const isStr = isString(params);
            if (isStr || Array.isArray(params)) {
                val = [
                    ...(isStr ? [params] : params)
                        .reduce((acc, p) => {
                            [b, e, m, v] = parseStr(p);
                            acc.add(prefix(unmin(prepareName(b, e))));
                            if (m) acc.add(prefix(unmin(prepareName(b, e, m, v))));
                            return acc;
                        }, new Set())
                        .values()
                ].join(' ');
            } else {
                val =
                    params &&
                    parseObj(params, true)
                        .map(([b, e, m, v]) => prefix(unmin(prepareName(b, e, m, v))))
                        .join(' ');
            }
            return defineProperties(
                { [keyAttr]: val },
                {
                    toString: {
                        value: () => `${keyAttr}="${val}"`
                    },
                    $: {
                        value: val
                    }
                }
            );
        }) as TResolveAttr;
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
