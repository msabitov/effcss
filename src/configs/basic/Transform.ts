import { TStyleSheetConfig } from '../../types';

export default {
    _: {
        scx: {
            ini: '0'
        },
        scy: {
            ini: '0'
        },
        skx: {
            ini: '0'
        },
        sky: {
            ini: '0'
        },
        x: {
            ini: '0'
        },
        y: {
            ini: '0'
        },
        z: {
            ini: '0'
        }
    },
    c: {
        _: {
            $sc: '{_scx} {_scy}',
            $tf: 'skew({_skx},{_sky})',
            $tr: '{_x} {_y} {_z}'
        },
        // translate
        _x: '&tr=>{_x}:{1}',
        _y: '&tr=>{_y}:{1}',
        _z: '&tr=>{_z}:{1}',
        // skew
        _skx: '&sk=>{_skx}:{1}',
        _sky: '&sk=>{_sky}:{1}',
        // scale
        _scx: '&sc=>{_scx}:{1}',
        _scy: '&sc=>{_scy}:{1}',
        _sc: '&sc=>{sc}:{1}',
        // rotate
        _rx: `&rot=>{rot}:X {1}`,
        _ry: `&rot=>{rot}:Y {1}`,
        _rz: `&rot=>{rot}:Z {1}`,
        // zoom
        _zm: '&zm=>{zm}:{1}',
        // perspective
        _per: '&per=>{per}:{1}',
        _pero: '&posv=>{pero}:{1}',
        // transform
        _b: '&box[c,b,f,s,v]=>{tfb}:{1}',
        _o: '&pos=>{tfo}:{1}',
        _s: {
            p: '{tfs}:preserve-3',
            f: '{tfs}:flat'
        }
    }
} as TStyleSheetConfig;
