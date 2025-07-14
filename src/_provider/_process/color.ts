import { TCreateScope } from '../../common';
type TStrOrNum = string | number;
type TChangeStr = (val: string) => string;
type TChangeColor = (color: string | object, val?: number | string) => string;
type TPaletteState = {
    l: TStrOrNum;
    c: TStrOrNum;
    h: TStrOrNum;
    a: TStrOrNum;
};

const OKLCH = 'oklch';
const oklch: TChangeStr = (val) => OKLCH + `(${val})`;
const oklchFrom: TChangeStr = (val) => oklch(`from ${val}`);
const L = 'l';
const C = 'c';
const H = 'h';
const A = 'a';
const DEF = 'def';

const create = (varExp: ReturnType<ReturnType<TCreateScope>>['varExp']) => {
    const resolveValue = (type: string, val: TStrOrNum) => (typeof val === 'string' ? varExp(type, val) : val);
    class Palette {
        /**
         * Palette state
         */
        state: TPaletteState = {
            l: resolveValue(L, DEF),
            c: resolveValue(C, DEF),
            h: resolveValue(H, DEF),
            a: resolveValue(A, DEF)
        };

        merge = <Theme>(value: Theme extends Partial<TPaletteState> ? Theme : object) =>
            new Palette(Object.assign(this.state, value));

        constructor(params: Partial<TPaletteState> = {}) {
            this.state = Object.assign(this.state, params);
        }
        /**
         * Set lightness
         * @param l - lightness value
         */
        l = <Theme>(
            val: Theme extends { l: Record<string, number | string> }
                ? Exclude<keyof Theme['l'], symbol>
                : TStrOrNum
        ) =>
            this.merge({
                l: resolveValue(L, val)
            });
        /**
         * Set chroma
         * @param c - chroma value
         */
        c = <Theme>(
            val: Theme extends { c: Record<string, number | string> }
                ? Exclude<keyof Theme['c'], symbol>
                : TStrOrNum
        ) =>
            this.merge({
                c: resolveValue(C, val)
            });
        /**
         * Set hue
         * @param h - hue value
         */
        h = <Theme>(
            val: Theme extends { h: Record<string, number | string> }
                ? Exclude<keyof Theme['h'], symbol>
                : TStrOrNum
        ) =>
            this.merge({
                h: resolveValue(H, val)
            });
        /**
         * Set alpha
         * @param value - alpha value
         */
        a = <Theme>(
            val: Theme extends { a: Record<string, number | string> }
                ? Exclude<keyof Theme['a'], symbol>
                : TStrOrNum
        ) =>
            this.merge({
                a: resolveValue(A, val)
            });

        /**
         * Color string
         */
        get s() {
            return this.toString();
        }

        toString() {
            const { l, c, h, a } = this.state;
            return oklch(`${l} ${c} ${h} / ${a}`);
        }
    }

    return (params?: Partial<TPaletteState>) => new Palette(params);
};

const lighten: TChangeColor = (color, val = 0.1) => oklchFrom(`${color} calc(l + ${val}) c h / alpha)`);
const darken: TChangeColor = (color, val = 0.1) => oklchFrom(`${color} calc(l - ${val}) c h / alpha)`);
const fadein: TChangeColor = (color, val = 0.1) => oklchFrom(`${color} l c h / calc(alpha + ${val}))`);
const fadeout: TChangeColor = (color, val = 0.1) => oklchFrom(`${color} l c h / calc(alpha - ${val}))`);
const saturate: TChangeColor = (color, val = 0.04) => oklchFrom(`${color} l calc(c + ${val}) h / alpha)`);
const desaturate: TChangeColor = (color, val = 0.04) => oklchFrom(`${color} l calc(c - ${val}) h / alpha)`);
const spin: TChangeColor = (color, val = 30) =>
    oklchFrom(`${color} l c calc(h${typeof val === 'number' ? (val > 0 ? ' + ' + val : ' - ' + -val) : val}) / alpha)`);
const mix = ({
    base,
    mixin,
    method,
    bpart,
    mpart
}: {
    base: string | object;
    mixin: string | object;
    bpart?: number;
    mpart?: number;
    method?:
        | 'srgb'
        | 'srgb-linear'
        | 'display-p3'
        | 'a98-rgb'
        | 'prophoto-rgb'
        | 'rec2020'
        | 'lab'
        | 'oklab'
        | 'xyz'
        | 'xyz-d50'
        | 'xyz-d65'
        | 'hsl'
        | 'hwb'
        | 'lch'
        | 'oklch';
}) =>
    `color-mix(in ${method || OKLCH}, ${base}${bpart !== undefined ? ` ${bpart}%` : ''}, ${mixin}${
        mpart !== undefined ? ` ${mpart}%` : ''
    })`;

export const resolveColor = (vars: ReturnType<ReturnType<TCreateScope>>['varExp']) => ({
    /**
     * Create color object
     */
    create: create(vars),
    /**
     * oklch()
     */
    oklch,
    /**
     * Increase color lightness
     */
    lighten,
    /**
     * Decrease color lightness
     */
    darken,
    /**
     * Increase color chroma
     */
    saturate,
    /**
     * Decrease color chroma
     */
    desaturate,
    /**
     * Increase color alpha
     */
    fadein,
    /**
     * Decrease color alpha
     */
    fadeout,
    /**
     * Rotate color hue
     */
    spin,
    /**
     * Mix colors
     */
    mix
});
