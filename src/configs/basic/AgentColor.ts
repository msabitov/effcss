import { TStyleSheetConfig } from '../../types';

export default {
    _: {
        cr: {
            typ: 'c',
            all: true
        },
        ac: {
            typ: 'c',
            all: true
        }
    },
    c: {
        _: {
            $_crc: '{chr.xs}',
            $_crh: '{hue.def}',
            $_crl: '{lig.c}',
            $_cra: 1,
            $_acc: '{chr.def}',
            $_acl: '{lig.c}',
            $_ach: '{hue.def}',
            $_aca: 1,
        },
        _ac_: {
            $acc: '{_.ac}'
        },
        _cc_: {
            $ctc: '{_.cr}'
        }
    }
} as TStyleSheetConfig;
