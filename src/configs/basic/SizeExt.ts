import { TStyleSheetConfig } from '../../types';

const c = ['sz', 'perc'];
const bc = ['cqb', 'cqmin', 'cqmax'];
const vc = ['vw', 'vh', 'vmin', 'vmax'];
const ic = ['cqi', 'cqmin', 'cqmax'];
export default {
    c: {
        _b: [...c.map((item) => `&${item}=>{b}:{1}`), ...bc.map((item) => `&${item}=>{0}${item}|{b}:{1}`), ...vc.map((item) => `&${item}=>{0}${item}|{b}:{1}`)],
        _maxb: [...c.map((item) => `&${item}=>{maxb}:{1}`), ...bc.map((item) => `&${item}=>{0}${item}|{maxb}:{1}`), ...vc.map((item) => `&${item}=>{0}${item}|{maxb}:{1}`)],
        _minb: [...c.map((item) => `&${item}=>{minb}:{1}`), ...bc.map((item) => `&${item}=>{0}${item}|{minb}:{1}`), ...vc.map((item) => `&${item}=>{0}${item}|{minb}:{1}`)],
        _i: [...c.map((item) => `&${item}=>{i}:{1}`), ...ic.map((item) => `&${item}=>{0}${item}|{i}:{1}`), ...vc.map((item) => `&${item}=>{0}${item}|{i}:{1}`)],
        _maxi: [...c.map((item) => `&${item}=>{maxi}:{1}`), ...ic.map((item) => `&${item}=>{0}${item}|{maxi}:{1}`), ...vc.map((item) => `&${item}=>{0}${item}|{maxi}:{1}`)],
        _mini: [...c.map((item) => `&${item}=>{mini}:{1}`), ...ic.map((item) => `&${item}=>{0}${item}|{mini}:{1}`), ...vc.map((item) => `&${item}=>{0}${item}|{mini}:{1}`)],
        _ar: '&rat=>{ar}:{1}'
    }
} as TStyleSheetConfig;
