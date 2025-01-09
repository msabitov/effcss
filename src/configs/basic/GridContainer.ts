import { TStyleConfig } from 'types';

export default {
    c: {
        _: {
            $dis: '{dis.g}'
        },
        _dis: '&dis[g,ig]=>{dis}:{1}',
        _jc: '&ali[s,e,c,st,sb,sa,se]=>{jc}:{1}',
        _ji: '&ali[s,e,c,st]=>{ji}:{1}',
        _ai: '&ali[s,e,c,st,b]=>{ai}:{1}',
        _ac: '&ali[sb,se,sa,c,st]=>{ac}:{1}',
        _gtr: '&gtr=>{gtr}:{1}?coef=>{gtr}:repeat({1},1fr)',
        _gtc: '&gtc=>{gtc}:{1}?coef=>{gtc}:repeat({1},1fr)',
        _rg: '&sp=>{rg}:{1}',
        _cg: '&sp=>{cg}:{1}'
    }
} as TStyleConfig;
