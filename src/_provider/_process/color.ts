type TChangeStr = (val: string) => string;
type TChangeColor = (color: string | object, val?: number | string) => string;

const OKLCH = 'oklch';
const oklch: TChangeStr = (val) => OKLCH + `(${val})`;
const oklchFrom: TChangeStr = (val) => oklch(`from ${val}`);
const lighten: TChangeColor = (color, val = 0.1) => oklchFrom(`${color} calc(l + ${val}) c h / alpha)`);
const darken: TChangeColor = (color, val = 0.1) => oklchFrom(`${color} calc(l - ${val}) c h / alpha)`);
const fadein: TChangeColor = (color, val = 0.1) => oklchFrom(`${color} l c h / calc(alpha + ${val}))`);
const fadeout: TChangeColor = (color, val = 0.1) => oklchFrom(`${color} l c h / calc(alpha - ${val}))`);
const saturate: TChangeColor = (color, val = 0.04) => oklchFrom(`${color} l calc(c + ${val}) h / alpha)`);
const desaturate: TChangeColor = (color, val = 0.04) => oklchFrom(`${color} l calc(c - ${val}) h / alpha)`);
const spin: TChangeColor = (color, val = 30) =>
    oklchFrom(`${color} l c calc(h${typeof val === 'number' ? (val > 0 ? ' + ' + val : ' - ' + -val) : val}) / alpha)`);

export const resolveColor = () => ({
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
    spin
});
