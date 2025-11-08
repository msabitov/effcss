export type TGetUnit = (val: number | string) => string;

const calc = (val: string | number, unit: string) => `calc(${val} * 1${unit})`;
const px: TGetUnit = (val) => calc(val, 'px');
const vh: TGetUnit = (val) => calc(val, 'vh');
const vw: TGetUnit = (val) => calc(val, 'vw');
const vmin: TGetUnit = (val) => calc(val, 'vmin');
const vmax: TGetUnit = (val) => calc(val, 'vmax');
const em: TGetUnit = (val) => calc(val, 'em');
const rem: TGetUnit = (val) => calc(val, 'rem');
const deg: TGetUnit = (val) => calc(val, 'deg');
const rad: TGetUnit = (val) => calc(val, 'rad');
const turn: TGetUnit = (val) => calc(val, 'rad');
const ms: TGetUnit = (val) => calc(val, 'ms');
const s: TGetUnit = (val) => calc(val, 's');
const pc: TGetUnit = (val) => calc(val, '%');
const cqw: TGetUnit = (val) => calc(val, 'cqw');
const cqh: TGetUnit = (val) => calc(val, 'cqh');
const cqi: TGetUnit = (val) => calc(val, 'cqi');
const cqb: TGetUnit = (val) => calc(val, 'cqb');
const cqmin: TGetUnit = (val) => calc(val, 'cqmin');
const cqmax: TGetUnit = (val) => calc(val, 'cqmax');

export const resolveUnits = () => ({
    px,
    vh,
    vw,
    vmin,
    vmax,
    em,
    rem,
    deg,
    rad,
    turn,
    ms,
    s,
    pc,
    cqw,
    cqh,
    cqb,
    cqi,
    cqmin,
    cqmax
});
