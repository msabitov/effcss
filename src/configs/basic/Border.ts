import { TStyleConfig } from 'types';

export default {
    _: {
        c: {
            typ: 'c',
            all: true
        }
    },
    c: {
        _: {
            $bw: 0,
            $br: 0,
            $bs: '{ls.s}',
            $bc: '{_.c}'
        },
        // width
        _w: '&th=>{bw}:{1}',
        _xw: '&th=>{blw}:{1};{brw}:{1}',
        _yw: '&th=>{btw}:{1};{bbw}:{1}',
        _rw: '&th=>{brw}:{1}',
        _lw: '&th=>{blw}:{1}',
        _tw: '&th=>{btw}:{1}',
        _bw: '&th=>{bbw}:{1}',
        // radius
        _r: '&rad=>{br}:{1}',
        _lr: '&rad=>{btlr}:{1};{bblr}:{1}',
        _rr: '&rad=>{btrr}:{1};{bbrr}:{1}',
        _tr: '&rad=>{btlr}:{1};{btrr}:{1}',
        _br: '&rad=>{bblr}:{1};{bbrr}:{1}',
        _tlr: '&rad=>{btlr}:{1}',
        _trr: '&rad=>{btrr}:{1}',
        _blr: '&rad=>{bblr}:{1}',
        _brr: '&rad=>{bbrr}:{1}',
        // style
        _s: '&lst=>{bs}:{1}'
    }
} as TStyleConfig;
