import { TStyleConfig } from 'types';
import { comma, space } from '../../css/functions';

const size = '{_.sz}';
const negVar = `calc(-1 * ${size})`;
const hSize = `calc(0.5 * ${size})`;
const halfNegVar = `calc(-0.5 * ${size})`;
const color = '{_.c}';

export default {
    _: {
        sz: {},
        c: {
            typ: 'c',
            wrap: true
        }
    },
    c: {
        _: {
            $pos: '{pos.r}',
            $_cl: '{lig.def}',
            $_ch: '{hue.def}',
            $_cc: '{chr.def}',
            $_ca: 1,
            $_sz: '{sp.m}',
        },
        _ssz: '&sp=>{_sz}:{1}',
        _shp: {
            r: {
                $bsh: space(size, 0, hSize, halfNegVar, color)
            },
            l: {
                $bsh: space(negVar, 0, hSize, halfNegVar, color)
            },
            t: {
                $bsh: space(0, negVar, hSize, halfNegVar, color)
            },
            b: {
                $bsh: space(0, size, hSize, halfNegVar, color)
            },
            x: {
                $bsh: comma(space(size, 0, hSize, halfNegVar, color), space(negVar, 0, hSize, halfNegVar, color))
            },
            y: {
                $bsh: comma(space(0, negVar, hSize, halfNegVar, color), space(0, size, hSize, halfNegVar, color))
            },
            f: {
                $bsh: space(0, 0, size, hSize, color)
            },
            tr: {
                $bsh: space(size, negVar, size, halfNegVar, color)
            },
            tl: {
                $bsh: space(negVar, negVar, size, halfNegVar, color)
            },
            br: {
                $bsh: space(size, size, size, halfNegVar, color)
            },
            bl: {
                $bsh: space(negVar, size, size, halfNegVar, color)
            }
        },
        _bsz: '&box[c,b]=>{bsz}:{1}'
    }
} as TStyleConfig;
