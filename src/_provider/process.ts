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
type TBezier = {
    x1?: number;
    y1?: number;
    x2?: number;
    y2?: number;
};
type TRelative = (coef?: number | string | object) => string;

export interface IMakerParams {
    dash: typeof dash;
    comma: typeof comma;
    space: typeof space;
    range: typeof range;
    each: typeof each;
    merge: typeof merge;
    when: typeof when;
    /**
     * Resolve scoped selector
     */
    select: TScope['select'];
    /**
     * BEM selector resolver
     * @deprecated
     * Will be deleted in the next major version. Use `select` utility instead
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
    size: TRelative;
    /**
     * Scalable time value
     */
    time: TRelative;
    /**
     * Scalable angle value
     */
    angle: TRelative;
    /**
     * Easing function
     */
    easing: (bezier?: TBezier) => string;
}

export type TProcessor = {
    /**
     * Compile stylesheet maker to CSSStylesheet content
     * @param params - params
     */
    compile(params: { key: string; maker: (params: IMakerParams) => object | string }): string;
};
type TCreateProcessor = (params: {
    scope: ReturnType<TCreateScope>;
    globalKey: string;
}) => TProcessor;

const pseudo = resolvePseudo();
const units = resolveUnits();
const multiplier = (val: string | number | object) => val !== 1 ? val + ' * ' : '';

/**
 * Create style processor
 * @param params - processor params
 */
export const createProcessor: TCreateProcessor = (params) => {
    const { scope, globalKey } = params;
    const globalScope = scope(globalKey)
    const themeVar = globalScope.varExp;
    const time: TRelative = (coef = 1) => units.ms(multiplier(coef) + themeVar('time'));
    const angle: TRelative = (coef = 1) => units.deg(multiplier(coef) + themeVar('angle'));
    const size: TRelative = (coef = 1) => units.px(multiplier(coef) + themeVar('size'));
    const easing = (bezier?: TBezier) => !bezier ? themeVar('easing') : `cubic-bezier(${bezier.x1 || 0},${bezier.y1 || 0},${bezier.x2 || 1},${bezier.y2 || 1})`;
    return {
        compile: ({ key, maker }) => {
            const localScope = scope(key);
            const bem = localScope.selector;
            const select = localScope.select;
            const at = resolveAtRules(localScope);
            const styles = maker({
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
                // easing function
                easing,
                // BEM selectors
                bem,
                // Scoped selectors
                select,
                // pseudo selectors
                pseudo,
                // color handlers
                color: resolveColor(themeVar),
                // palette handlers
                palette: resolvePalette(themeVar),
                // coefficient handlers
                coef: resolveCoef(themeVar),
                // css units
                units,
                // css at-rules
                at
            });
            if (typeof styles === 'string') return styles;
            return parseStyles(styles);
        }
    };
};
