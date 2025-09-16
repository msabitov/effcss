import { TCreateScope, IPalette } from '../../common';
import { NO_PARSE_SYMBOL } from './utils';

const PALETTE = 'palette';

export const resolvePalette = (varExp: ReturnType<ReturnType<TCreateScope>>['varExp']): IPalette => {
    class Palette implements IPalette {
        /**
         * Palette state
         */
        state: IPalette['state'] = {
            l: 'l',
            c: 'base',
            h: 'pri',
            a: 1,
            m: 'bg'
        };

        constructor(params: Partial<IPalette['state']> = {}) {
            Object.assign(this, {[NO_PARSE_SYMBOL]: true});
            this.state = Object.assign(this.state, params);
        }

        // lightness

        get xs(): Palette {
            return new Palette({
                ...this.state,
                l: 'xs'
            });
        }

        get s(): Palette {
            return new Palette({
                ...this.state,
                l: 's'
            });
        }

        get m(): Palette {
            return new Palette({
                ...this.state,
                l: 'm'
            });
        }

        get l() {
            return new Palette({
                ...this.state,
                l: 'l'
            });
        }

        get xl() {
            return new Palette({
                ...this.state,
                l: 'xl'
            });
        }

        get lightness() {
            return {
                xs: this.xs,
                s: this.s,
                m: this.m,
                l: this.l,
                xl: this.xl
            };
        }

        // chroma

        get gray() {
            return new Palette({
                ...this.state,
                c: 'gray'
            });
        }
        get pale() {
            return new Palette({
                ...this.state,
                c: 'pale'
            });
        }

        get base() {
            return new Palette({
                ...this.state,
                c: 'base'
            });
        }

        get rich() {
            return new Palette({
                ...this.state,
                c: 'rich'
            });
        }

        get chroma() {
            return {
                gray: this.gray,
                pale: this.pale,
                base: this.base,
                rich: this.rich
            };
        }

        // hue

        get pri() {
            return new Palette({
                ...this.state,
                h: 'pri'
            });
        }

        get sec() {
            return new Palette({
                ...this.state,
                h: 'sec'
            });
        }

        get suc() {
            return new Palette({
                ...this.state,
                h: 'suc'
            });
        }

        get inf() {
            return new Palette({
                ...this.state,
                h: 'inf'
            });
        }

        get war() {
            return new Palette({
                ...this.state,
                h: 'war'
            });
        }

        get dan() {
            return new Palette({
                ...this.state,
                h: 'dan'
            });
        }

        get hue() {
            return {
                pri: this.pri,
                sec: this.sec,
                suc: this.suc,
                inf: this.inf,
                war: this.war,
                dan: this.dan
            };
        }

        // alpha

        alpha(a = 1) {
            return new Palette({
                ...this.state,
                a
            });
        }

        // mode

        get bg() {
            return new Palette({
                ...this.state,
                m: 'bg'
            });
        }

        get fg() {
            return new Palette({
                ...this.state,
                m: 'fg'
            });
        }

        toString() {
            const { l, c, h, a, m } = this.state;
            return `oklch(${varExp(PALETTE, 'l', m, l)} ${varExp(PALETTE, 'c', m, c)} ${varExp(PALETTE, 'h', h)} / ${a})`;
        }
    }
    return new Palette();
};
