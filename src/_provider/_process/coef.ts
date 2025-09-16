import { TCreateScope, ICoef } from '../../common';

const COEF = 'coef';

export const resolveCoef = (varExp: ReturnType<ReturnType<TCreateScope>>['varExp']): ICoef => {
    /**
     * Coefficient generator
     * @description
     * Allows to create coefficient ranges 
     */
    class Coefficient implements ICoef {
        state = {
            center: 8
        };

        constructor(params: Partial<ICoef['state']> = {}) {
            this.state = Object.assign(this.state, params);
        }

        // values

        get min() {
            return varExp(COEF, this.state.center - 4);
        }

        get xxs() {
            return varExp(COEF, this.state.center - 3);
        }

        get xs() {
            return varExp(COEF, this.state.center - 2);
        }

        get s() {
            return varExp(COEF, this.state.center - 1);
        }

        get m() {
            return varExp(COEF, this.state.center);
        }

        get l() {
            return varExp(COEF, this.state.center + 1);
        }

        get xl() {
            return varExp(COEF, this.state.center + 2);
        }

        get xxl() {
            return varExp(COEF, this.state.center + 3);
        }

        get max() {
            return varExp(COEF, this.state.center + 4);
        }

        // range from

        get $0_() {
            return new Coefficient({
                center: 4
            });
        }

        get $1_() {
            return new Coefficient({
                center: 12
            });
        }

        get $2_() {
            return new Coefficient({
                center: 20
            });
        }

        get $16_() {
            return new Coefficient({
                center: 28
            });
        }

        // range around

        get $1() {
            return new Coefficient({
                center: 8
            });
        }

        get $2() {
            return new Coefficient({
                center: 16
            });
        }

        get $16() {
            return new Coefficient({
                center: 24
            });
        }

        // range dictionary

        get short() {
            return {
                s: this.s,
                m: this.m,
                l: this.l
            };
        }

        get base() {
            return {
                xs: this.xs,
                ...this.short,
                xl: this.xl
            };
        }

        get long() {
            return {
                xxs: this.xxs,
                ...this.base,
                xxl: this.xxl
            };
        }

        get full() {
            return {
                min: this.min,
                ...this.long,
                max: this.max
            };
        }

        get main() {
            return {
                min: this.min,
                m: this.m,
                max: this.max
            };
        }

        get sparse() {
            return {
                min: this.min,
                xs: this.xs,
                m: this.m,
                xl: this.xl,
                max: this.max
            };
        }
    }
    return new Coefficient();
};
