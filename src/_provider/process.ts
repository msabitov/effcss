// types
import type { TDeafultBreakpoints } from '../common';
import type { TCreateScope } from './scope'; 
// common
import { merge } from '../common';
// process utils
import { resolveAtRules } from './_process/atrules';
import { resolveUnits } from './_process/units';
import { resolvePseudo } from './_process/pseudo';
import { resolveColor } from './_process/color';
import { resolvePalette } from './_process/palette';
import { resolveCoef } from './_process/coef';
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
     * Coefficient
     */
    coef: ReturnType<typeof resolveCoef>;
    /**
     * Global vars
     */
    vars: <G>(val: Leaves<G>) => string;
    /**
     * Scalable size value
     */
    size: (coef?: number | string) => string;
    /**
     * Scalable time value
     */
    time: (coef?: number | string) => string;
    /**
     * Scalable angle value
     */
    angle: (coef?: number | string) => string;
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
    /**
     * Merge
     */
    merge: typeof merge;
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
    const globalVarExp = globalScope.varExp;
    const vars = (val: string) => globalVarExp(...val.split('.'));
    const time = (coef: string | number = 1) => `calc(${coef} * ${vars('rtime')})`;
    const angle = (coef: string | number = 1) => `calc(${coef} * ${vars('rangle')})`;
    const size = (coef: string | number = 1) => `calc(${coef} * 1rem)`;
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
                        // size
                        size,
                        // time
                        time,
                        // angle
                        angle,
                        // BEM selectors
                        bem: localScope.selector,
                        // pseudo selectors
                        pseudo: resolvePseudo(),
                        // color handlers
                        color: resolveColor(globalVarExp),
                        // palette handlers
                        palette: resolvePalette(globalVarExp),
                        // coefficient handlers
                        coef: resolveCoef(globalVarExp),
                        // css units
                        units: resolveUnits(),
                        // css at-rules
                        at,
                        // limits
                        limit,
                        // merge
                        merge
                    })
                )
            );
        }
    };
};
