import { TStyleSheetConfig } from '../../types';

export default {
    _: {
        oc: {
            typ: 'c',
            all: true
        }
    },
    c: {
        _: {
            $oc: '{_.oc}',
            $ow: 0,
            $os: '{ls.s}'
        },
        _oo: '&sp=>{oo}:{1}',
        _os: '&lst=>{os}:{1}',
        _ow: '&th=>{ow}:{1}',
    }
} as TStyleSheetConfig;
