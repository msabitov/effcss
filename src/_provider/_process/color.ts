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
type TOKLCHFrom = TOKLCH & {
    /**
     * Origin color
     */
    from?: string;
};
type TChangeStr = (val: string) => string;
type TChangeColor = (color: string | object, val?: number | string) => string;

const OKLCH = 'oklch';
const oklch: TChangeStr = (val) => OKLCH + `(${val})`;
const oklchFrom: TChangeStr = (val) => oklch(`from ${val}`);
const oklchFromParams = (rel?: string) => (params?: TOKLCH) => {
    if (!params) return rel || 'currentColor';
    const {l, c, h, a = 1} = params;
    const hasParams = l && c && h;
    return hasParams ? oklch(
        (rel ? `from ${rel} ` : '') + `${l} ${c} ${h} / ${a || (rel ? 'alpha' : 1)}`
    ) : oklch(
        `from ${rel || 'currentColor'} ${l || 'l'} ${c || 'c'} ${h || 'h'} / ${a || 'alpha'}`
    );
};
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
const oklchFromColor = (params: TOKLCHFrom | string) => typeof params === 'string' ? oklch(params) : oklchFromParams(
    params.from
)(params);

export const resolveColor = (varExp: ReturnType<ReturnType<TCreateScope>>['varExp']) => {
    const rootColor = varExp('color');
    const contrastColor = varExp('contrast');
    const neutralColor = varExp('neutral');
    return {
        /**
         * Theme root color
         * @param params - oklch params
         * @deprecated
         * Will be deleted in the next major version. Use `theme.color` utility instead
         */
        root: oklchFromParams(rootColor),
        /**
         * Theme contrast color
         * @param params - oklch params
         * @deprecated
         * Will be deleted in the next major version. Use `theme.contrast` utility instead
         */
        contrast: oklchFromParams(contrastColor),
        /**
         * Theme neutral color
         * @param params - oklch params
         * @deprecated
         * Will be deleted in the next major version. Use `theme.neutral` utility instead
         */
        neutral: oklchFromParams(neutralColor),
        /**
         * oklch()
         */
        oklch: oklchFromColor,
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
