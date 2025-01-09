import { TStyleConfig } from 'types';

export default {
    c: {
        _: {
            $dis: '{dis.f}'
        },
        _dis: '&dis[if,f]=>{dis}:{1}',
        _dir: '&fd=>{fd}:{1}',
        _w: '&fw=>{fw}:{1}',
        _jc: '&ali[s,e,c,st,sb,sa,se,fs,fe]=>{jc}:{1}',
        _ai: '&ali[c,st,b,fs,fe]=>{ai}:{1}',
        _ac: '&ali[c,st,sb,sa,se,fs,fe]=>{ac}:{1}'
    }
} as TStyleConfig;
