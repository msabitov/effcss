import type { TCreateScope } from '../../_provider/scope';

type TChangeStr = (val: string) => string;
type TChangeColor = (color: string | object, val?: number | string) => string;

const OKLCH = 'oklch';
const oklch: TChangeStr = (val) => OKLCH + `(${val})`;
const oklchFrom: TChangeStr = (val) => oklch(`from ${val}`);
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
    return {
        /**
         * Root color
         * @param p - oklch params
         */
        root: (p?: {
            l?: string | number;
            c?: string | number;
            h?: string | number;
            a?: string | number;
        }) => p ? oklchFrom(rootColor + ` ${p.l || 'l'} ${p.c || 'c'} ${p.h || 'h'} / ${p.a || '1'}`) : rootColor,
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
