// types
import type { TDeafultBreakpoints, TCreateScope } from '../common';
// process utils
import { resolveAtRules } from './_process/atrules';
import { resolveUnits } from './_process/units';
import { resolvePseudo } from './_process/pseudo';
import { resolveColor } from './_process/color';
import { resolvePalette } from './_process/palette';
import { getBaseHandlers } from './_process/base';
import { parseStyles } from './_process/utils';

type Leaves<T> = T extends object
    ? {
          [K in keyof T]: `${Exclude<K, symbol>}${Leaves<T[K]> extends never ? '' : `.${Leaves<T[K]>}`}`;
      }[keyof T]
    : never;

interface IMakerParams extends ReturnType<typeof getBaseHandlers> {
    /**
     * StyleSheet key
     */
    key: string;
    /**
     * BEM selector resolver
     */
    bem: ReturnType<ReturnType<TCreateScope>>['selector'];
    /**
     * CSS units
     */
    units: ReturnType<typeof resolveUnits>;
    /**
     * Pseudoclasses and pseudoelements
     */
    pseudo: ReturnType<typeof resolvePseudo>;
    /**
     * At-rules
     */
    at: ReturnType<typeof resolveAtRules>;
    /**
     * Colors
     */
    color: ReturnType<typeof resolveColor>;
    /**
     * Color palette
     */
    palette: ReturnType<typeof resolvePalette>;
    /**
     * Global vars
     */
    vars: <G>(val: Leaves<G>) => string;
    /**
     * Scalable time value
     */
    time: (coef?: number) => string;
    /**
     * Width limit queries
     */
    limit: {
        /**
         * `(min-width: val)` query
         * @param val - breakpoint
         * @param scope - container name for `@container`
         */
        up: <T = TDeafultBreakpoints>(val: Exclude<keyof T, Symbol> | number, scope?: string) => string;
        /**
         * `(max-width: val)` query
         * @param val - breakpoint
         * @param scope - container name for `@container`
         */
        down: <T = TDeafultBreakpoints>(val: Exclude<keyof T, Symbol> | number, scope?: string) => string;
        /**
         * `(min-width: from) and (max-width: to)` query
         * @param from - start breakpoint
         * @param to - end breakpoint
         * @param scope - container name for `@container`
         */
        between: <T = TDeafultBreakpoints>(
            from: Exclude<keyof T, Symbol> | number,
            to: Exclude<keyof T, Symbol> | number,
            scope?: string
        ) => string;
        /**
         * `(min-width: val) and (max-width: val)` query
         * @param val - breakpoint
         * @param scope - container name for `@container`
         */
        only: <T = TDeafultBreakpoints>(val: Exclude<keyof T, Symbol> | number, scope?: string) => string;
    };
}

type TCreateProcessor = (params: {
    scope: ReturnType<TCreateScope>;
    globalKey?: string;
    bp?: Record<string, string | number>;
}) => {
    /**
     * Compile stylesheet maker to CSSStylesheet content
     * @param params - params
     */
    compile(params: { key: string; maker: (params: IMakerParams) => object }): string;
};

export const baseHandlers = getBaseHandlers();

const WIDTH_ = 'width: ';
const _AND_ = ') and (';

/**
 * Create style processor
 * @param params - processor params
 */
export const createProcessor: TCreateProcessor = (params) => {
    const { scope, globalKey = '', bp = {} } = params;
    const globalScope = scope(globalKey);
    const vars = (val: string) => globalScope.varExp(...val.split('.'));
    const time = (coef: number = 1) => `calc(${coef} * ${vars('rtime')})`;
    return {
        compile: ({ key, maker }) => {
            const localScope = scope(key);
            const at = resolveAtRules(localScope);
            const stringLimit = (val: string | number) => {
                const resolved = bp[val] || val;
                return typeof resolved === 'number' ? resolved + 'rem' : '';
            };
            const upVal = (val: string | number) => 'min-' + WIDTH_ + stringLimit(val);
            const downVal = (val: string | number) => 'max-' + WIDTH_ + stringLimit(val);
            const limitScope = (val: string, scope?: string) =>
                typeof scope === 'string' ? at.cq(val, scope) : at.mq(val);
            const between: IMakerParams['limit']['between'] = (from, to, scope) =>
                '' + limitScope(upVal(from) + _AND_ + downVal(to), scope);
            const limit: IMakerParams['limit'] = {
                up: (val, scope) => '' + limitScope(upVal(val), scope),
                down: (val, scope) => '' + limitScope(downVal(val), scope),
                between,
                only: (val, scope) => between(val, val, scope)
            };
            return parseStyles(
                maker(
                    Object.assign(baseHandlers, {
                        // global scope
                        key,
                        // global vars
                        vars,
                        // time
                        time,
                        // BEM selectors
                        bem: localScope.selector,
                        // pseudo selectors
                        pseudo: resolvePseudo(),
                        // color handlers
                        color: resolveColor(globalScope.varExp),
                        // palette handlers
                        palette: resolvePalette(globalScope.varExp),
                        // css units
                        units: resolveUnits(),
                        // css at-rules
                        at,
                        // limits
                        limit
                    })
                )
            );
        }
    };
};
