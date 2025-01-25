import { TStyleSheetConfig } from '../../types';

const c = ['sz', 'perc'];
const wc = ['cqw', 'cqmin', 'cqmax'];
const wv = ['vw', 'vmin', 'vmax'];
const hc = ['cqh', 'cqmin', 'cqmax'];
const hv = ['vh', 'vmin', 'vmax'];

export default {
    c: {
        _w: [...c.map((item) => `&${item}=>{w}:{1}`), ...wc.map((item) => `&${item}=>{0}${item}|{w}:{1}`), ...wv.map((item) => `&${item}=>{0}${item}|{w}:{1}`)],
        _maxw: [...c.map((item) => `&${item}=>{maxw}:{1}`), ...wc.map((item) => `&${item}=>{0}${item}|{maxw}:{1}`), ...wv.map((item) => `&${item}=>{0}${item}|{maxw}:{1}`)],
        _minw: [...c.map((item) => `&${item}=>{minw}:{1}`), ...wc.map((item) => `&${item}=>{0}${item}|{minw}:{1}`), ...wv.map((item) => `&${item}=>{0}${item}|{minw}:{1}`)],
        _h: [...c.map((item) => `&${item}=>{h}:{1}`), ...hc.map((item) => `&${item}=>{h}:{1}`), ...hv.map((item) => `&${item}=>{0}${item}|{h}:{1}`)],
        _maxh: [...c.map((item) => `&${item}=>{maxh}:{1}`), ...hc.map((item) => `&${item}=>{0}${item}|{maxh}:{1}`), ...hv.map((item) => `&${item}=>{0}${item}|{maxh}:{1}`)],
        _minh: [...c.map((item) => `&${item}=>{minh}:{1}`), ...hc.map((item) => `&${item}=>{0}${item}|{minh}:{1}`), ...hv.map((item) => `&${item}=>{0}${item}|{minh}:{1}`)],
        _ar: '&rat=>{ar}:{1}'
    }
} as TStyleSheetConfig;
