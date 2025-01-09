import { TStyleConfig } from 'types';

export default {
    _: {
        st: {}
    },
    c: {
        _: {
            '>*': {
                $sst: '{_.st}'
            }
        },
        _b: '&sb=>{sb}:{1}',
        _sa: '&ali[s,e,c,no]=>{ssa}:{1}',
        _ss: '&sss=>{sss}:{1}',
        _st: '&sst=>{st}:{1}',
        _m: '&sp=>{sm}:{1}',
        _mx: '&sp=>{sml}:{1};{smr}:{1}',
        _my: '&sp=>{smt}:{1};{smb}:{1}',
        _mt: '&sp=>{smt}:{1}',
        _ml: '&sp=>{sml}:{1}',
        _mr: '&sp=>{smr}:{1}',
        _mb: '&sp=>{smb}:{1}',
        _p: '&sp=>{sp}:{1}',
        _px: '&sp=>{spl}:{1};{spr}:{1}',
        _py: '&sp=>{spt}:{1};{spb}:{1}',
        _pt: '&sp=>{spt}:{1}',
        _pl: '&sp=>{spl}:{1}',
        _pr: '&sp=>{spr}:{1}',
        _pb: '&sp=>{spb}:{1}'
    }
} as TStyleConfig;
