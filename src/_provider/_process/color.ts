import type { TCreateScope } from '../../_provider/scope';

type TOKLCH = {
    /**
     * Lightness
     */
    l?: string | number;
    /**
     * Chroma
     */
    c?: string | number;
    /**
     * Hue
     */
    h?: string | number;
    /**
     * Alpha
     */
    a?: string | number;
};
type TChangeStr = (val: string) => string;
type TChangeColor = (color: string | object, val?: number | string) => string;

const OKLCH = 'oklch';
const oklch: TChangeStr = (val) => OKLCH + `(${val})`;
const oklchFrom: TChangeStr = (val) => oklch(`from ${val}`);
const oklchFromParams = (rel: string) => (params?: TOKLCH) => params ? oklchFrom(
    rel + ` ${params.l || 'l'} ${params.c || 'c'} ${params.h || 'h'} / ${params.a || '1'}`
) : rel;
const lighten: TChangeColor = (color, val = 0.1) => oklchFrom(`${color} calc(l + ${val}) c h / alpha`);
const darken: TChangeColor = (color, val = 0.1) => oklchFrom(`${color} calc(l - ${val}) c h / alpha`);
const fadein: TChangeColor = (color, val = 0.1) => oklchFrom(`${color} l c h / calc(alpha + ${val})`);
const fadeout: TChangeColor = (color, val = 0.1) => oklchFrom(`${color} l c h / calc(alpha - ${val})`);
const saturate: TChangeColor = (color, val = 0.04) => oklchFrom(`${color} l calc(c + ${val}) h / alpha`);
const desaturate: TChangeColor = (color, val = 0.04) => oklchFrom(`${color} l calc(c - ${val}) h / alpha`);
const complement = (color: string | object) => oklchFrom(`${color} l c calc(h + 180) / alpha`);
const grayscale = (color: string | object) => oklchFrom(`${color} l 0 h / alpha`);
const spin: TChangeColor = (color, val = 30) =>
    oklchFrom(`${color} l c calc(h${typeof val === 'number' ? (val > 0 ? ' + ' + val : ' - ' + -val) : val}) / alpha`);

export const resolveColor = (varExp: ReturnType<ReturnType<TCreateScope>>['varExp']) => {
    const rootColor = varExp('color');
    const contrastColor = varExp('contrast');
    const neutralColor = varExp('neutral');
    return {
        /**
         * Theme root color
         * @param params - oklch params
         */
        root: oklchFromParams(rootColor),
        /**
         * Theme contrast color
         * @param params - oklch params
         */
        contrast: oklchFromParams(contrastColor),
        /**
         * Theme neutral color
         * @param params - oklch params
         */
        neutral: oklchFromParams(neutralColor),
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
         * Get complement color
         */
        complement,
        /**
         * Get grayscale color
         */
        grayscale
    };
};
