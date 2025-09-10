import { TCreateScope } from '../../common';
import { NO_PARSE_SYMBOL } from './utils';

const PALETTE = 'palette';

export const resolvePalette = (varExp: ReturnType<ReturnType<TCreateScope>>['varExp']) => {
    const hue = {
        pri: varExp(PALETTE, 'h', 'pri'),
        sec: varExp(PALETTE, 'h', 'sec'),
        ter: varExp(PALETTE, 'h', 'ter'),
        suc: varExp(PALETTE, 'h', 'suc'),
        inf: varExp(PALETTE, 'h', 'inf'),
        war: varExp(PALETTE, 'h', 'war'),
        dan: varExp(PALETTE, 'h', 'dan'),
    };
    /**
     * Palette generator
     * @description
     * Allows to create palette colors 
     */
    class Palette {
        /**
         * Palette state
         */
        state = {
            l: 'l',
            c: 'base',
            h: hue.pri,
            a: 1,
            m: 'bg'
        };

        constructor(params = {}) {
            Object.assign(this, {[NO_PARSE_SYMBOL]: true});
            this.state = Object.assign(this.state, params);
        }

        // lightness

        /**
         * Returns `xs` lightness color
         */
        get xs() {
            return new Palette({
                ...this.state,
                l: 'xs'
            });
        }
        /**
         * Returns `s` lightness color
         */
        get s() {
            return new Palette({
                ...this.state,
                l: 's'
            });
        }
        /**
         * Returns `m` lightness color
         */
        get m() {
            return new Palette({
                ...this.state,
                l: 'm'
            });
        }
        /**
         * Returns `l` lightness color
         */
        get l() {
            return new Palette({
                ...this.state,
                l: 'l'
            });
        }
        /**
         * Returns `xl` lightness color
         */
        get xl() {
            return new Palette({
                ...this.state,
                l: 'xl'
            });
        }
        /**
         * Returns lightness color dictionary
         */
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

        /**
         * Returns zero chroma color
         */
        get gray() {
            return new Palette({
                ...this.state,
                c: 'gray'
            });
        }
        /**
         * Returns pale chroma color
         */
        get pale() {
            return new Palette({
                ...this.state,
                c: 'pale'
            });
        }
        /**
         * Returns base chroma color
         */
        get base() {
            return new Palette({
                ...this.state,
                c: 'base'
            });
        }
        /**
         * Returns rich chroma color
         */
        get rich() {
            return new Palette({
                ...this.state,
                c: 'rich'
            });
        }
        /**
         * Returns chroma color dictionary
         */
        get chroma() {
            return {
                gray: this.gray,
                pale: this.pale,
                base: this.base,
                rich: this.rich
            };
        }

        // hue

        /**
         * Returns primary hue color
         */
        get pri() {
            return new Palette({
                ...this.state,
                h: hue.pri
            });
        }
        /**
         * Returns secondary hue color
         */
        get sec() {
            return new Palette({
                ...this.state,
                h: hue.sec
            });
        }
        /**
         * Returns success hue color
         */
        get suc() {
            return new Palette({
                ...this.state,
                h: hue.suc
            });
        }
        /**
         * Returns info hue color
         */
        get inf() {
            return new Palette({
                ...this.state,
                h: hue.inf
            });
        }
        /**
         * Returns warning hue color
         */
        get war() {
            return new Palette({
                ...this.state,
                h: hue.war
            });
        }
        /**
         * Returns danger hue color
         */
        get dan() {
            return new Palette({
                ...this.state,
                h: hue.dan
            });
        }
        /**
         * Returns hue color dictionary
         */
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

        /**
         * Returns specified alpha color
         */
        alpha(a = 1) {
            return new Palette({
                ...this.state,
                a
            });
        }

        // mode

        /**
         * Returns background color
         */
        get bg() {
            return new Palette({
                ...this.state,
                m: 'bg'
            });
        }
        /**
         * Returns foreground color
         */
        get fg() {
            return new Palette({
                ...this.state,
                m: 'fg'
            });
        }

        toString() {
            const { l, c, h, a, m } = this.state;
            return `oklch(${varExp(PALETTE, 'l', m, l)} ${varExp(PALETTE, 'c', m, c)} ${h} / ${a})`;
        }
    }
    return new Palette();
};
