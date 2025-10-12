import { TCreateScope } from '../../common';
import { NO_PARSE_SYMBOL } from './utils';

const AT_MEDIA = '@media';
const AT_CONTAINER = '@container';
const AT_PROPERTY = '@property';
const AT_KEYFRAMES = '@keyframes';
const AT_LAYER = '@layer';
const AT_SCOPE = '@scope';
const AT_SUPPORTS = '@supports';

type TProperty = {
    (val: string | number | boolean): object;
};
type TKeyframes = {
    (config?: Partial<{
        /**
         * Duration
         */
        dur: string;
        /**
         * Delay
         */
        del: string;
        /**
         * Iteration-count
         */
        ic: string;
        /**
         * Direction
         */
        dir: string;
        /**
         * Timing-function
         */
        tf: string;
        /**
         * Play-state
         */
        ps: string;
        /**
         * Fill-mode
         */
        fm: string;
    }>): object;
};
type TScope= {
    (val: object): object;
    /**
     * High bound
     */
    limit: (val: string) => TScope;
    /**
     * Low bound
     */
    root: (val: string) => TScope;
    /**
     * Both bounds inclusive
     */
    both: () => TScope;
    /**
     * None bounds inclusive
     */
    none: () => TScope;
    /**
     * High bound inclusive
     */
    high: () => TScope;
    /**
     * Low bound inclusive
     */
    low: () => TScope;
};

const mq = (q: string, t?: string) => {
    const s = AT_MEDIA + ` ${t || ''}${(t || '') && ' and '}(${q})`;
    return {
        s,
        q,
        t,
        toString: () => s
    };
};
mq.toString = () => AT_MEDIA;

type TMedia = {
    (val: object): object;
    /**
     * Combine with `or` logic
     */
    or: (...val: (TMedia | string)[]) => TMedia;
    /**
     * Combine with `and` logic
     */
    and: (...val: (TMedia | string)[]) => TMedia;
    /**
     * Negate with `not`
     */
    not: TMedia;
    /**
     * `screen` media type
     */
    screen: TMedia;
    /**
     * `all` media type
     */
    all: TMedia;
    /**
     * `print` media type
     */
    print: TMedia;
}

const MEDIA_TYPE = new Set(['screen', 'all', 'print']);

const wrap = (val: string) => `(${val})`;

const media = (params: {
    type?: string;
    or?: (TMedia | string)[];
    and?: (TMedia | string)[];
    not?: boolean;
}): TMedia => {
    const {
        type,
        or = [],
        and = [],
        not = false
    } = params;
    const toString = () => {
        const queries = [];
        const first = [];
        if (type) first.push(type);
        if (and) first.push(...and);
        if (first.length) queries.push(first);
        if (or) queries.push(...or);
        let str = queries.map((g) => Array.isArray(g) ? g.map(i => {
            const str = i + '';
            return (MEDIA_TYPE.has(str) || str.split('(').length === 2 && !str.startsWith('not')) ? str : wrap(str);
        }).join(' and ') : g).join(',')
        if (not) str = 'not ' + ((str.includes(' and ') || str.includes(',')) ? wrap(str) : str);
        return str;
    };
    const use = (rules: object) => {
        const selector = toString();
        return {
            [`${AT_MEDIA}${selector ? ' ' + selector : ''}`]: rules
        }
    };
    return Object.defineProperties(use, {
        // type
        all: {
            get: () => media({
                ...params,
                type: 'all'
            })
        },
        print: {
            get: () => media({
                ...params,
                type: 'print'
            })
        },
        screen: {
            get: () => media({
                ...params,
                type: 'screen'
            })
        },
        // logical
        and: {
            value: (...val: (string | TMedia)[]) => media({
                ...params,
                and: [...and, ...val]
            })
        },
        or: {
            value: (...val: (string | TMedia)[]) => media({
                ...params,
                or: [...or, ...val]
            })
        },
        not: {
            get: () => media({
                ...params,
                not: !not
            })
        },
        // toString
        toString: {
            value: toString
        }
    }) as TMedia;
};

const scope = (state: Partial<{
    root: string;
    limit: string;
    mode: [boolean, boolean];
}>): TScope => {
    const {
        root = '', limit = '', mode = [false, false]
    } = state;
    const use = ((config: object) => ({
        [AT_SCOPE + ` ${root ? `(${root}${mode[0] ? ' > *' : ''})` : ''}${root && limit ? ' ' : ''}${limit ? `to (${limit}${mode[1] ? ' > *' : ''})` : ''}`]: config
    })) as unknown as TScope;
    return Object.defineProperties(use, {
        limit: {
            value: (limit: string) => scope({
                root, limit, mode
            })
        },
        root: {
            value: (root: string) => scope({
                root, limit, mode
            })
        },
        both: {
            value: () => scope({
                root, limit, mode: [false, true]
            })
        },
        none: {
            value: () => scope({
                root, limit, mode: [true, false]
            })
        },
        low: {
            value: () => scope({
                root, limit, mode: [true, true]
            })
        },
        high: {
            value: () => scope({
                root, limit, mode: [false, false]
            })
        },
        toString: {
            value: () => ':scope'
        },
    });
};

export const resolveAtRules = (ctx: ReturnType<ReturnType<TCreateScope>>) => {
    const counters = {
        cp: 1,
        lay: 1,
        kf: 1,
        cq: 1
    };
    const cq = (
        q: string,
        c?: string
    ): {
        /**
         * Container
         */
        c: string;
        /**
         * Query
         */
        q: string;
        /**
         * Selector
         */
        s: string;
        toString(): string;
    } => {
        const name = typeof c === 'string' ? c : ctx.name('cq', counters.cq++);
        const s = AT_CONTAINER + ` ${name ? name + ' ' : ''}(${q})`;
        return {
            c: name,
            q,
            s,
            toString: () => s
        };
    };
    cq.toString = () => AT_CONTAINER;
    const pr = (
        n?: string | number,
        p?: {
            syn?: string;
            inh?: boolean;
            ini?: string | number | boolean;
        }
    ): {
        /**
         * Key
         */
        k: string;
        /**
         * Value
         */
        v: string;
        /**
         * Selector
         */
        s: string;
        /**
         * Rule
         */
        r: {
            [key in string]: {
                syntax: string;
                inherits: boolean;
                initialValue?: string | number | boolean;
            };
        };
        toString(): string;
    } => {
        const k = '--' + (n || ctx.name('cp', counters.cp++));
        const s = AT_PROPERTY + ' ' + k;
        return {
            k,
            v: `var(${k})`,
            s,
            r: {
                [s]: {
                    syntax: p?.syn || '"*"',
                    inherits: p?.inh || false,
                    initialValue: p?.ini
                }
            },
            toString: () => s
        };
    };
    pr.toString = () => AT_PROPERTY;
    const property = (config: {
        /**
         * Syntax
         */
        syn?: string;
        /**
         * Inherits
         */
        inh?: boolean;
        /**
         * Initial value
         */
        ini?: string | number | boolean;
        /**
         * Default value
         */
        def?: string | number | boolean;
    } = {}): TProperty => {
        const {syn = '"*"', inh = true, ini, def} = config;
        const name = '--' + ctx.name('cp', counters.cp++);
        const value = `var(${name}${def !== undefined ? ',' + def : ''})`;
        const ruleKey = AT_PROPERTY + ' ' + name;
        const use: TProperty = (val: string | number | boolean) => {
            return {
                [name]: val
            };
        };
        return Object.defineProperties(use, {
            [ruleKey]: {
                value: {
                    syntax: syn,
                    inherits: inh,
                    initialValue: ini
                },
                enumerable: true
            },
            toString: {
                value: () => value
            },
            [NO_PARSE_SYMBOL]: {
                value: true
            }
        });
    };
    const kf = (
        name?: string
    ): {
        /**
         * Key
         */
        k: string;
        /**
         * Selector
         */
        s: string;
        toString(): string;
    } => {
        const k = name || ctx.name('kf', counters.kf++);
        const s = AT_KEYFRAMES + ' ' + k;
        return {
            k,
            s,
            toString: () => s
        };
    };
    kf.toString = () => AT_KEYFRAMES;
    const keyframes = (config: Record<string, object>): TKeyframes => {
        const name = ctx.name('kf', counters.kf++);
        const ruleKey = AT_KEYFRAMES + ' ' + name;
        const use: TKeyframes = (config) => {
            if (!config) return {
                animationName: name
            };
            const {dur, tf, del, ic, dir, ps, fm} = config;
            return {
                animation: [dur, tf, del, ic, dir, ps, fm, name].filter(Boolean).join(' ')
            };
        };
        return Object.defineProperties(use, {
            [ruleKey]: {
                value: config,
                enumerable: true
            },
            toString: {
                value: () => name
            },
            [NO_PARSE_SYMBOL]: {
                value: true
            }
        });
    };
    const lay = (
        name?: string
    ): {
        /**
         * Key
         */
        k: string;
        /**
         * Selector
         */
        s: string;
        toString(): string;
    } => {
        const k = name || ctx.name('lay', counters.lay++);
        const s = AT_LAYER + ' ' + k;
        return {
            k,
            s,
            toString: () => s
        };
    };
    lay.toString = () => AT_LAYER;
    const sc = (
        r: string = '',
        l: string = ''
    ): {
        /**
         * Root
         */
        r: string;
        /**
         * Limit
         */
        l: string;
        /**
         * Selector
         */
        s: string;
        toString(): string;
    } => {
        const s = AT_SCOPE + ` ${r ? `(${r})` : ''}${r && l ? ' ' : ''}${l ? `to (${l})` : ''}`;
        return {
            r,
            l,
            s,
            toString: () => s
        };
    };
    lay.toString = () => AT_SCOPE;
    const sup = (
        c: string = '',
        n: boolean = false
    ): {
        /**
         * Condition
         */
        c: string;
        /**
         * Not
         */
        n: boolean;
        /**
         * Selector
         */
        s: string;
        toString(): string;
    } => {
        const s = AT_SUPPORTS + ` ${n ? 'not ' : ''}(${c})`;
        return {
            c,
            n,
            s,
            toString: () => s
        };
    };
    sup.toString = () => AT_SUPPORTS;
    return {
        /**
         * `@property` selector
         * @param name - property name
         * @deprecated It will be deleted in the next major version, use `property` instead
         */
        pr,
        /**
         * `@keyframes` selector
         * @param name - keyframes name
         * @deprecated It will be deleted in the next major version, use `keyframes` instead
         */
        kf,
        /**
         * `@media` selector
         * @deprecated It will be deleted in the next major version, use `media` instead
         */
        mq,
        /**
         * `@container` selector
         */
        cq,
        /**
         * `@layer` selector
         */
        lay,
        /**
         * `@scope` selector
         * @param r - root
         * @param l - limit
         * @deprecated It will be deleted in the next major version, use `scope` instead
         */
        sc,
        /**
         * `@supports` selector
         * @param c - condition
         * @param n - invert condition
         */
        sup,
        /**
         * Scoped `@keyframes` rule maker
         * @param config - keyframes
         */
        keyframes,
        /**
         * Scoped `@property` rule maker
         * @param config - property params
         */
        property,
        /**
         * `@scope` rule maker
         * @param rules - nested rules
         */
        scope: scope({}),
        /**
         * `@media` rule maker
         * @param rules - nested rules
         */
        media: media({})
    };
};
