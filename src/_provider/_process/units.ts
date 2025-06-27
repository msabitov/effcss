export type TGetUnit = (val: number | string) => string;

const px: TGetUnit = (val) => val + 'px';
const vh: TGetUnit = (val) => val + 'vh';
const vw: TGetUnit = (val) => val + 'vw';
const rem: TGetUnit = (val) => val + 'rem';
const deg: TGetUnit = (val) => val + 'deg';
const ms: TGetUnit = (val) => val + 'ms';
const pc: TGetUnit = (val) => val + '%';
const cqw: TGetUnit = (val) => val + 'cqw';
const cqh: TGetUnit = (val) => val + 'cqh';
const cqi: TGetUnit = (val) => val + 'cqi';
const cqb: TGetUnit = (val) => val + 'cqb';
const cqmin: TGetUnit = (val) => val + 'cqmin';
const cqmax: TGetUnit = (val) => val + 'cqmax';

export const resolveUnits = () => ({
    px,
    vh,
    vw,
    rem,
    deg,
    ms,
    pc,
    cqw,
    cqh,
    cqb,
    cqi,
    cqmin,
    cqmax
});
