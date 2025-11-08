// types
import type { TCreateScope } from './scope'; 
// process utils
import { resolveAtRules } from './_process/atrules';
import { resolveUnits } from './_process/units';
import { resolvePseudo } from './_process/pseudo';
import { resolveColor } from './_process/color';
import { resolvePalette } from './_process/palette';
import { resolveCoef } from './_process/coef';
import {
    dash,
    comma,
    space,
    range,
    each,
    when,
    merge
} from './utils';
import { parseStyles } from './_process/utils';

type TScope = ReturnType<ReturnType<TCreateScope>>;

export interface IMakerParams {
    dash: typeof dash;
    comma: typeof comma;
    space: typeof space;
    range: typeof range;
    each: typeof each;
    merge: typeof merge;
    when: typeof when;
    /**
     * BEM selector resolver
     */
    bem: TScope['selector'];
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
     * Resolve theme variable
     * @param name - name
     * @param fallback - fallback value
     */
    themeVar: TScope['varExp'];
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
}

export type TProcessor = {
    /**
     * Compile stylesheet maker to CSSStylesheet content
     * @param params - params
     */
    compile(params: { key: string; maker: (params: IMakerParams) => object }): string;
};
type TCreateProcessor = (params: {
    scope: ReturnType<TCreateScope>;
    globalKey: string;
}) => TProcessor;

/**
 * Create style processor
 * @param params - processor params
 */
export const createProcessor: TCreateProcessor = (params) => {
    const { scope, globalKey } = params;
    const globalScope = scope(globalKey)
    const themeVar = globalScope.varExp;
    const time = (coef: string | number = 1) => `calc(${coef !== 1 ? coef + ' * ' : ''}${themeVar('time')} * 1ms)`;
    const angle = (coef: string | number = 1) => `calc(${coef !== 1 ? coef + ' * ' : ''}${themeVar('angle')} * 1deg)`;
    const size = (coef: string | number = 1) => `calc(${coef !== 1 ? coef + ' * ' : ''}${themeVar('size')} * 1px)`;
    return {
        compile: ({ key, maker }) => {
            const localScope = scope(key);
            const bem = localScope.selector;
            const at = resolveAtRules(localScope);
            return parseStyles(
                maker({
                    dash,
                    comma,
                    space,
                    range,
                    each,
                    when,
                    merge,
                    // theme variable
                    themeVar,
                    // size
                    size,
                    // time
                    time,
                    // angle
                    angle,
                    // BEM selectors
                    bem,
                    // pseudo selectors
                    pseudo: resolvePseudo(),
                    // color handlers
                    color: resolveColor(),
                    // palette handlers
                    palette: resolvePalette(themeVar),
                    // coefficient handlers
                    coef: resolveCoef(themeVar),
                    // css units
                    units: resolveUnits(),
                    // css at-rules
                    at
                })
            );
        }
    };
};
