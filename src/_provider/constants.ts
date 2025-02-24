import { TDisplayModeValues } from '../types';
import { values } from '../css/dict';

/**
 * Default root styles
 */
export const defaultRootStyle = {
    $c: '{uni.inh}',
    $fsz: '{rem.def}',
    $ff: '{ff.def}',
    $u_: {
        $c: '{uni.inh}',
        $fsz: '{rem.def}',
        $ff: '{ff.def}'
    }
};

/**
 * Default style params
 */
export const defaultParams: TDisplayModeValues = {
    /**
     * Light mode
     */
    light: {
        // lightness
        lig: {
            def: 0.75,
            // contrast
            c: 0.05,
            s: 0.65,
            m: 0.75,
            l: 0.85,
            // neutral
            n: 0.9
        }
    },
    /**
     * Dark mode
     */
    dark: {
        // lightness
        lig: {
            def: 0.4,
            n: 0.25,
            s: 0.3,
            m: 0.4,
            l: 0.5,
            c: 0.95
        }
    },
    /**
     * Default root mode
     */
    root: values
};

const toRem = '{1}rem';
const toDeg = '{1}deg';
const toPerc = 'calc(100% * {1})';
const toSpan = 'span {1}';
const toMs = '{1}ms';
const toPx = '{1}px';

export const defaultUnits: Record<string, string> = {
    cqw: '{1}cqw',
    cqh: '{1}cqh',
    cqb: '{1}cqb',
    cqi: '{1}cqi',
    cqmin: '{1}cqmin',
    cqmax: '{1}cqmax',
    vw: '{1}vw',
    vh: '{1}vh',
    vmin: '{1}vmin',
    vmax: '{1}vmax',
    fb: toPerc,
    ra: toSpan,
    ca: toSpan,
    ins: toPerc,
    sz: toRem,
    sp: toRem,
    rad: toRem,
    th: toRem,
    bp: toRem,
    cbp: toRem,
    fsz: toRem,
    lsp: toRem,
    tr: toRem,
    sk: toDeg,
    rot: toDeg,
    perc: toPerc,
    time: toMs,
    rem: toPx
};
