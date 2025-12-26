import type { TCreateScope } from '../scope';
import { NO_PARSE_SYMBOL } from './utils';

// types
type TProperty = {
    (val: string | number | boolean | object): object;
    /**
     * Use property with fallback value
     */
    fallback(val: string | number): string;
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
type TSupports = {
    (rules: object): object;
    /**
     * Supports condition
     */
    where: (condition: string | object) => TSupports;
};
type TMedia = {
    (val: object): object;
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
    /**
     * Media condition
     */
    where: (condition: string | object) => TMedia;
};
type TContainer = {
    (val: object): object;
    /**
     * Get named container
     */
    named: TContainer;
    /**
     * `inline-size` container type
     */
    isize: TContainer;
    /**
     * `size` container type
     */
    size: TContainer;
    /**
     * `scroll-state` container type
     */
    scroll: TContainer;
    /**
     * Container condition
     */
    where: (condition: string | object) => TContainer;
};
type TLayer = {
    (val: object): object;
    /**
     * Get named layer
     */
    named: TLayer;
    /**
     * Declare layers order
     * @param args 
     */
    list(...args: TLayer[]): object;
};
type TCondition = {
    type: 'and' | 'or' | 'not';
    value: (TCondition | string)[];
};

// constants
const AT_MEDIA = '@media';
const AT_CONTAINER = '@container';
const AT_PROPERTY = '@property';
const AT_KEYFRAMES = '@keyframes';
const AT_LAYER = '@layer';
const AT_SCOPE = '@scope';
const AT_SUPPORTS = '@supports';
const AT_STARTING_STYLE = '@starting-style';

const wrap = (val: string) => `(${val})`;
const isString = (val: any) => typeof val === 'string';

const $logic = () => {
    return {
        and: (...value: (string | TCondition)[]): TCondition => Object.defineProperties({
            type: 'and',
            value,
        }, {
            toString: {
                value: () => value.filter(Boolean).map(cond => {
                    const condStr = prepareCondition(cond);
                    if (typeof cond === 'object' && cond.type === 'or') return wrap(condStr);
                    return condStr;
                }).join(' and ')
            }
        }),
        or: (...value: (string | TCondition)[]): TCondition => Object.defineProperties({
            type: 'or',
            value,
        }, {
            toString: {
                value: () => value.filter(Boolean).map(cond => prepareCondition(cond)).join(' or ')
            }
        }),
        not: (value: string | TCondition): TCondition | string => {
            if (typeof value === 'object' && value.type === 'not') return value.value[0];
            return Object.defineProperties({
                type: 'not',
                value: [value],
            }, {
                toString: {
                    value: () => `not (${prepareCondition(value, true)})`
                }
            });
        }
    };
};
const logicCondition = $logic();

const getSizeCondition = (property: string) => {
    const up = (val: string | number) => ({toString: () => `(min-${property}:${isString(val) ? val : val + 'rem'})`});
    const down = (val: string | number) =>  ({toString: () => `(max-${property}:${isString(val) ? val : val + 'rem'})`});
    const between = (from: string | number, to: string | number) => ({toString: () => `${up(from)} and ${down(to)}`});
    return {
        up,
        down,
        between,
        only: (val: string | number) => between(val, val)
    };
};
const widthCondition = getSizeCondition('width');
const heightCondition = getSizeCondition('height');
const isizeCondition = getSizeCondition('inline-size');
const bsizeCondition = getSizeCondition('block-size');

const prepareCondition = (value?: string | object, nowrap?: boolean) => {
    if (!value) return '';
    else if (typeof value === 'string') return value.includes('(') || nowrap ? value : wrap(value);
    return value + '';
};

/**
 * CSS Media Rule
 * @param params
 */
const media = (params: {
    type?: 'all' | 'print' | 'screen';
    condition?: string | TCondition;
} = {}): TMedia => {
    const {
        type,
        condition
    } = params;
    const condStr = prepareCondition(condition);
    const isOrCond = typeof condition === 'object' && condition.type === 'or';
    const selector = `${AT_MEDIA}${
        type ? ' ' + type : ''
    }${
        type && condStr ? ' and' : ''
    }${
        condStr ? ' ' + (type && isOrCond ? wrap(condStr) : condStr) : ''
    }`;
    const use = (rules: object) => ({
        [selector]: rules
    });
    return Object.defineProperties(use, {
        all: {
            get: () => media({
                condition,
                type: 'all'
            })
        },
        print: {
            get: () => media({
                condition,
                type: 'print'
            })
        },
        screen: {
            get: () => media({
                condition,
                type: 'screen'
            })
        },
        where: {
            value: (condition: TCondition) => media({
                condition,
                type
            })
        },
        toString: {
            value: () => selector
        }
    }) as TMedia;
};
const mediaRule = media({});

/**
 * CSS Supports Rule
 * @param params
 */
const supports = ({
    condition
}: {
    condition?: string | object;
} = {}): TSupports => {
    const condStr = prepareCondition(condition);
    const selector = `${AT_SUPPORTS}${condStr ? ' ' + condStr : ''}`;
    const use = (rules: object) => ({
        [selector]: rules
    });
    return Object.defineProperties(use, {
        where: {
            value: (condition: string | TCondition) => supports({
                condition
            })
        },
        toString: {
            value: () => selector
        }
    }) as TSupports;
};
const supportsRule = supports();

/**
 * CSS Starting Style Rule
 * @param params
 */
const startingStyle = (rules: object) => ({[AT_STARTING_STYLE]: rules});
startingStyle.toString = AT_STARTING_STYLE;

/**
 * CSS Scope Rule
 * @param params
 */
const scope = (params: Partial<{
    root: string;
    limit: string;
    mode: [boolean, boolean];
}>): TScope => {
    const {
        root = '', limit = '', mode = [false, false]
    } = params;
    const selector = AT_SCOPE + ` ${root ? `(${root}${mode[0] ? ' > *' : ''})` : ''}${root && limit ? ' ' : ''}${limit ? `to (${limit}${mode[1] ? ' > *' : ''})` : ''}`;
    const use = ((rules: object) => ({
        [selector]: rules
    }));
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
            value: () => selector
        }
    }) as TScope;
};
const scopeRule = scope({});

export const resolveAtRules = (ctx: ReturnType<ReturnType<TCreateScope>>) => {
    const counters = {
        cp: 1,
        lay: 1,
        kf: 1,
        cq: 1
    };
    const container = (params: {
        type?: string;
        name?: string;
        condition?: string | TCondition;
        scroll?: boolean;
    } = {}): TContainer => {
        const {
            scroll,
            type,
            name,
            condition
        } = params;
        const condStr = prepareCondition(condition);
        const selector = `${AT_CONTAINER}${name ? ' ' + name : ''}${condStr ? ' ' + condStr : ''}`;
        const use = (rules: object) => ({
            [selector]: rules
        });
        return Object.defineProperties(use, {
            container: {
                value: (name || 'none') + ' / ' + (type && scroll ? `${type} scroll-state` : scroll ? 'scroll-state' : (type || 'normal')),
                enumerable: true
            },
            named: {
                get: () => container({
                    scroll,
                    condition,
                    name: name || ctx.name(['cq', counters.cq++]),
                    type
                })
            },
            // type
            size: {
                get: () => container({
                    name,
                    scroll,
                    condition,
                    type: 'size'
                })
            },
            isize: {
                get: () => container({
                    name,
                    scroll,
                    condition,
                    type: 'inline-size'
                })
            },
            scroll: {
                get: () => container({
                    name,
                    scroll: true,
                    condition,
                    type
                })
            },
            where: {
                value: (condition: string | TCondition) => container({
                    name,
                    scroll,
                    condition,
                    type
                })
            },
            [NO_PARSE_SYMBOL]: {
                value: true
            },
            toString: {
                value: () => selector
            }
        }) as TContainer;
    };
    const property = (config: string | number | {
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
        def?: string | number | boolean | object;
    } = {}): TProperty => {
        const ctype = typeof config;
        let syn = '"*"';
        let inh = true;
        let ini;
        let def;
        if (typeof config === 'object') ({syn = syn, inh = inh, ini, def} = config);
        else {
            def = config;
            ini = config;
            inh = false;
        }
        const name = '--' + ctx.name(['cp', counters.cp++]);
        const value = `var(${name}${def !== undefined ? ',' + def : ''})`;
        const ruleKey = AT_PROPERTY + ' ' + name;
        const use = (val: string | number | boolean | object) => {
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
            fallback : {
                value: (val: string | number) => `var(${name},${val})`
            },
            [NO_PARSE_SYMBOL]: {
                value: true
            }
        }) as TProperty;
    };
    const keyframes = (config: Record<string, object>): TKeyframes => {
        const name = ctx.name(['kf', counters.kf++]);
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
    const layer = ({
        name
    }: {
        name?: string;
    } = {}) => {
        const selector = `${AT_LAYER}${name ? ' ' + name : ''}`;
        const use = (rules: object) => ({
            [selector]: rules
        });
        use.toString = () => selector;
        return Object.defineProperties(use, {
            named: {
                get: () => layer({
                    name: name || ctx.name(['lay', counters.lay++])
                })
            },
            list: {
                value: (...args: TLayer[]) => ({[AT_LAYER + (args.map((r) => (r + '').split(AT_LAYER)[1]).filter(Boolean).join(',') || name)]: ''})
            }
        }) as TLayer;
    };
    return {
        /**
         * `@layer` rule maker
         * @param rules - nested rules
         */
        layer: layer(),
        /**
         * `@supports` rule maker
         * @param rules - nested rules
         */
        supports: supportsRule,
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
        scope: scopeRule,
        /**
         * `@media` rule maker
         * @param rules - nested rules
         */
        media: mediaRule,
        /**
         * `@container` rule maker
         * @param rules - nested rules
         */
        container: container({}),
        /**
         * `@starting-style` rule maker
         * @param rules - nested rules
         */
        startingStyle,
        /**
         * Complex logic condition maker
         */
        $logic: logicCondition,
        /**
         * Width condition maker
         */
        $width: widthCondition,
        /**
         * Height condition maker
         */
        $height: heightCondition,
        /**
         * Block-size condition maker
         */
        $block: bsizeCondition,
        /**
         * Inline-size condition maker
         */
        $inline: isizeCondition
    };
};
