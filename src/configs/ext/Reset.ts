import { comma, pseudoActive, pseudoFocus, pseudoHover, pseudoLink, pseudoVisited, pseudoWhere } from '../../css/functions';
import { TStyleConfig } from 'types';

export default {
    c: {
        $: {
            $p: 0,
            $m: 0,
            $bor: 'none',
            $bsz: '{box.b}',
            $ba_: {
                $bsz: '{box.b}'
            }
        },
        [pseudoWhere(comma('a', pseudoLink('a'), pseudoVisited('a'), pseudoHover('a')))]: {
            $td: 'none'
        },
        [pseudoWhere('aside,nav,footer,header,section,main')]: {
            $dis: '{dis.b}'
        },
        ':host,html': {
            $lh: 1.5
        },
        [pseudoWhere('menu,ol,ul')]: {
            $ls: '{ls.no}'
        },
        [pseudoWhere('input,textarea,button,select')]: {
            $ff: '{uni.inh}',
            $fsz: '{uni.inh}',
            $c: '{uni.inh}',
            $bgc: 'transparent'
        },
        [pseudoWhere(
            comma(pseudoFocus('input'), pseudoActive('input'), pseudoFocus('button'), pseudoActive('button'))
        )]: {
            $o: 'none'
        }
    }
} as TStyleConfig;
