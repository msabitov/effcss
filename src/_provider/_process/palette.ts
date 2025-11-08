
import type { TCreateScope } from '../../_provider/scope';
import { NO_PARSE_SYMBOL } from './utils';

// local types
type THue = 'pri' | 'sec' | 'suc' | 'inf' | 'war' | 'dan';
type TLightness = 'xs' | 's' | 'm' | 'l' | 'xl';
type TChroma = 'gray' | 'pale' | 'base' | 'rich';
type TMode = 'bg' | 'fg';
/**
 * Palette generator
 * @description
 * Allows to create palette colors 
 */
export interface IPalette {
    state: {
        l: TLightness;
        c: TChroma;
        h: THue;
        a: number;
        m: TMode;
    }
    /**
     * Returns `xs` lightness color
     */
    get xs(): IPalette;
    /**
     * Returns `s` lightness color
     */
    get s(): IPalette;
    /**
     * Returns `m` lightness color
     */
    get m(): IPalette;
    /**
     * Returns `l` lightness color
     */
    get l(): IPalette;
    /**
     * Returns `xl` lightness color
     */
    get xl(): IPalette;
    /**
     * Returns lightness color dictionary
     */
    get lightness(): Record<TLightness, IPalette>;
    /**
     * Returns zero chroma color
     */
    get gray(): IPalette;
    /**
     * Returns pale chroma color
     */
    get pale(): IPalette;
    /**
     * Returns base chroma color
     */
    get base(): IPalette;
    /**
     * Returns rich chroma color
     */
    get rich(): IPalette;
    /**
     * Returns chroma color dictionary
     */
    get chroma(): Record<TChroma, IPalette>;
    /**
     * Returns primary hue color
     */
    get pri(): IPalette;
    /**
     * Returns secondary hue color
     */
    get sec(): IPalette;
    /**
     * Returns success hue color
     */
    get suc(): IPalette;
    /**
     * Returns info hue color
     */
    get inf(): IPalette;
    /**
     * Returns warning hue color
     */
    get war(): IPalette;
    /**
     * Returns danger hue color
     */
    get dan(): IPalette;
    /**
     * Returns hue color dictionary
     */
    get hue(): Record<THue, IPalette>;
    /**
     * Returns specified alpha color
     */
    alpha(a?: number): IPalette;
    /**
     * Returns background color
     */
    get bg(): IPalette;
    /**
     * Returns foreground color
     */
    get fg(): IPalette;
}

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
            return `oklch(${varExp(`lightness.${m}.${l}`)} ${varExp(`chroma.${m}.${c}`)} ${varExp(`hue.${h}`)} / ${a})`;
        }
    }
    return new Palette();
};
