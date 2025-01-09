import { TStyleConfig } from 'types';

export default {
    c: {
        // width
        _iw: '&th=>{biw}:{1}',
        _blw: '&th=>{bblw}:{1}',
        _bew: '&th=>{bbew}:{1}',
        _bsw: '&th=>{bbsw}:{1}',
        _iew: '&th=>{biew}:{1}',
        _isw: '&th=>{bisw}:{1}',
        // radius
        _bsr: '&rad=>{bser}:{1};{bssr}:{1}',
        _isr: '&rad=>{besr}:{1};{bssr}:{1}',
        _ber: '&rad=>{besr}:{1};{beer}:{1}',
        _ier: '&rad=>{bser}:{1};{beer}:{1}',
        _esr: '&rad=>{besr}:{1}',
        _ssr: '&rad=>{bssr}:{1}',
        _ser: '&rad=>{bser}:{1}',
        _eer: '&rad=>{beer}:{1}',
    }
} as TStyleConfig;
