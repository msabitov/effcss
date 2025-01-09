import { TStyleConfig } from 'types';

export default {
    c: {
        _: {
            $tdur: '{time.s}',
            $tdel: '{time.no}'
        },
        _tdur: '&time=>{tdur}:{1}',
        _tdel: '&time=>{tdel}:{1}',
        _tb: '&tb=>{tb}:{1}',
        _tp: '&tp=>{tp}:{1}',
        _ttf: '&ttf=>{ttf}:{1}'
    }
} as TStyleConfig;
