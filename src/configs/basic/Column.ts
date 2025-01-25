import { TStyleSheetConfig } from '../../types';

export default {
    _: {
        c: {
            typ: 'c',
            wrap: true
        }
    },
    c: {
        _: {
            $_cc: '{c.def}',
            $_ch: '{h.def}',
            $_cl: '{l.def}',
            $crc: '{_.c}'
        },
        _cf: '&cf=>{cf}:{1}',
        _cg: '&sp=>{cg}:{1}',
        _crs: '&lst=>{crs}:{1}',
        _crw: '&th=>{crw}:{1}',
        _cs: '&cs=>{cs}:{1}',
        _cw: '&sz=>{cw}:{1}',
        _cc: '&sp=>{cc}:{1}'
    }
} as TStyleSheetConfig;
