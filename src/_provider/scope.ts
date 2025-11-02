type TOptStr = string | undefined;
type TParsedBEM = [string, TOptStr, TOptStr, TOptStr][];
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
type TScopeResolver = {
    (key: string): TScope;
    dict?: Record<string, Record<string, string>>;
};

/**
 * Create stylesheet scope
 */
export type TCreateScope = (params?: {
    mode?: string | null;
    min?: boolean;
    dict?: Record<string, Record<string, string>>;
}) => TScopeResolver;

// local utils
const UND = undefined;
const entries = Object.entries;
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
    `${getBase(b, e) + (m ? '_' + m : '') + (m && v ? '_' + v : '')}` || '_';
const makeCls = (key: string, val?: string) => '.' + (val ? (key + (val.startsWith('_') ? '' : '-') + val) : key);
const makeAttr = (key: string, val?: string) => `[data-${key}${val ? `~="${val}"` : ''}]`;

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
    const { mode, min, dict = {} } = params;
    let makeSelector;
    if (mode === 'a') makeSelector = makeAttr;
    else makeSelector = makeCls;
    const scope: TScopeResolver = (styleSheetKey: string) => {
        let ind: number = 0;
        let min = repeat;
        let unmin = repeat;
        const store = scope.dict;
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
                // array arg will be deprecated since v4
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
    if (min) scope.dict = dict;
    return scope;
};
