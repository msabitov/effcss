import { TCreateScope } from '../../common';

const COEF = 'coef';

export const resolveCoef = (varExp: ReturnType<ReturnType<TCreateScope>>['varExp']) => {
    /**
     * Coefficient generator
     * @description
     * Allows to create coefficient ranges 
     */
    class Coefficient {
        /**
         * Coefficient state
         */
        state = {
            center: 8
        };

        constructor(params = {}) {
            this.state = Object.assign(this.state, params);
        }

        // values

        /**
         * Returns `xxs` coefficient
         */
        get min() {
            return varExp(COEF, this.state.center - 4);
        }
        /**
         * Returns `xxs` coefficient
         */
        get xxs() {
            return varExp(COEF, this.state.center - 3);
        }
        /**
         * Returns `xs` coefficient
         */
        get xs() {
            return varExp(COEF, this.state.center - 2);
        }
        /**
         * Returns `s` coefficient
         */
        get s() {
            return varExp(COEF, this.state.center - 1);
        }
        /**
         * Returns `m` coefficient
         */
        get m() {
            return varExp(COEF, this.state.center);
        }
        /**
         * Returns `l` coefficient
         */
        get l() {
            return varExp(COEF, this.state.center + 1);
        }
        /**
         * Returns `xl` coefficient
         */
        get xl() {
            return varExp(COEF, this.state.center + 2);
        }
        /**
         * Returns `xxl` coefficient
         */
        get xxl() {
            return varExp(COEF, this.state.center + 3);
        }
        /**
         * Returns `xxl` coefficient
         */
        get max() {
            return varExp(COEF, this.state.center + 4);
        }

        // range from

        /**
         * Range from 0 to 1
         */
        get $0_() {
            return new Coefficient({
                center: 4
            });
        }
        /**
         * Range from 1 to 2
         */
        get $1_() {
            return new Coefficient({
                center: 12
            });
        }
        /**
         * Range from 2 to 16
         */
        get $2_() {
            return new Coefficient({
                center: 20
            });
        }
        /**
         * Range from 16 to the end
         */
        get $16_() {
            return new Coefficient({
                center: 28
            });
        }

        // range around

        /**
         * Range around 1
         */
        get $1() {
            return new Coefficient({
                center: 8
            });
        }
        /**
         * Range around 2
         */
        get $2() {
            return new Coefficient({
                center: 16
            });
        }
        /**
         * Range around 16
         */
        get $16() {
            return new Coefficient({
                center: 24
            });
        }

        // range dictionary

        /**
         * Short range dictionary
         */
        get short() {
            return {
                s: this.s,
                m: this.m,
                l: this.l
            };
        }

        /**
         * Base range dictionary
         */
        get base() {
            return {
                xs: this.xs,
                ...this.short,
                xl: this.xl
            };
        }

        /**
         * Long range dictionary
         */
        get long() {
            return {
                xxs: this.xxs,
                ...this.base,
                xxl: this.xxl
            };
        }

        /**
         * Full range dictionary
         */
        get full() {
            return {
                min: this.min,
                ...this.long,
                max: this.max
            };
        }

        /**
         * Sparse range dictionary
         */
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
