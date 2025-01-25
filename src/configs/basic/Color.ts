import { TStyleSheetConfig } from '../../types';

export default {
    _: {
        c: {
            typ: 'c',
            all: true
        },
        b: {
            typ: 'c',
            all: true
        },
        s: {
            typ: 'c',
            all: true
        },
        f: {
            typ: 'c',
            all: true
        }
    },
    c: {
        _: {
            $_cc: '{chr.xs}',
            $_ch: '{hue.def}',
            $_cl: '{lig.c}',
            $_ca: 1,
            $_bc: '{chr.xs}',
            $_bl: '{lig.n}',
            $_bh: '{hue.def}',
            $_ba: 1,
            $_fc: '{chr.xs}',
            $_fh: '{hue.def}',
            $_fl: '{lig.c}',
            $_fa: 1,
            $_sc: '{chr.xs}',
            $_sl: '{lig.n}',
            $_sh: '{hue.def}',
            $_sa: 1,
        },
        _b_: {
            $bgc: '{_.b}'
        },
        _c_: {
            $c: '{_.c}'
        },
        _f_: {
            $fi: '{_.f}'
        },
        _s_: {
            $st: '{_.s}'
        }
    }
} as TStyleSheetConfig;
