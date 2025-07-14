import { TCreateScope } from '../../common';

const AT_MEDIA = '@media';
const AT_CONTAINER = '@container';
const AT_PROPERTY = '@property';
const AT_KEYFRAMES = '@keyframes';
const AT_LAYER = '@layer';
const AT_SCOPE = '@scope';
const AT_SUPPORTS = '@supports';

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

export const resolveAtRules = (scope: ReturnType<ReturnType<TCreateScope>>) => {
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
        const name = typeof c === 'string' ? c : scope.name('cq', counters.cq++);
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
        const k = '--' + (n || scope.name('cp', counters.cp++));
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
        const k = name || scope.name('kf', counters.kf++);
        const s = AT_KEYFRAMES + ' ' + k;
        return {
            k,
            s,
            toString: () => s
        };
    };
    kf.toString = () => AT_KEYFRAMES;
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
        const k = name || scope.name('lay', counters.lay++);
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
         */
        pr,
        /**
         * `@keyframes` selector
         * @param name - keyframes name
         */
        kf,
        /**
         * `@media` selector
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
         */
        sc,
        /**
         * `@supports` selector
         * @param c - condition
         * @param n - invert condition
         */
        sup
    };
};
