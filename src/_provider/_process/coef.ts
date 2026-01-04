import type { TCreateScope } from '../scope';

export type TShortRange = 's' | 'm' | 'l';
export type TMainRange = 'min' | 'm' | 'max';
export type TBaseRange = 'xs' | TShortRange | 'xl';
export type TLongRange = 'xxs' | TBaseRange | 'xxl';
export type TFullRange = 'min' | TLongRange | 'max';
export type TSparseRange = TMainRange | 'xs' | 'xl';

/**
 * Coefficient generator
 * @description
 * Allows to create coefficient ranges 
 */
export interface ICoef {
    /**
     * Coefficient state
     */
    state: {
        center: number;
    };
    /**
     * Returns `xxs` coefficient
     */
    get min(): string;
    /**
     * Returns `xxs` coefficient
     */
    get xxs(): string;
    /**
     * Returns `xs` coefficient
     */
    get xs(): string;
    /**
     * Returns `s` coefficient
     */
    get s(): string;
    /**
     * Returns `m` coefficient
     */
    get m(): string;
    /**
     * Returns `l` coefficient
     */
    get l(): string;
    /**
     * Returns `xl` coefficient
     */
    get xl(): string;
    /**
     * Returns `xxl` coefficient
     */
    get xxl(): string;
    /**
     * Returns `xxl` coefficient
     */
    get max(): string;
    /**
     * Extremly small range center
     * @description
     * Around 4 coef
     */
    get $xxs(): ICoef;
    /**
     * Very small range center
     * @description
     * Around 8 coef
     */
    get $xs(): ICoef;
    /**
     * Small range center
     * @description
     * Around 12 coef
     */
    get $s(): ICoef;
    /**
     * Medium range center
     * @description
     * Around 16 coef
     */
    get $m(): ICoef;
    /**
     * Large range center
     * @description
     * Around 20 coef
     */
    get $l(): ICoef;
    /**
     * Very large range center
     * @description
     * Around 24 coef
     */
    get $xl(): ICoef;
    /**
     * Extremly large range center
     * @description
     * Around 28 coef
     */
    get $xxl(): ICoef;
    /**
     * Short range dictionary
     */
    get short(): Record<TShortRange, string>;
    /**
     * Base range dictionary
     */
    get base(): Record<TBaseRange, string>;
    /**
     * Long range dictionary
     */
    get long(): Record<TLongRange, string>;
    /**
     * Full range dictionary
     */
    get full(): Record<TFullRange, string>;
    /**
     * Main range dictionary
     */
    get main(): Record<TMainRange, string>;
    /**
     * Sparse range dictionary
     */
    get sparse(): Record<TSparseRange, string>;
}

const COEF = 'coef';

export const resolveCoef = (varExp: ReturnType<ReturnType<TCreateScope>>['varExp']): ICoef => {
    const getValue = (self: ICoef, offset: number = 0): string => varExp(`${COEF}.${self.state.center + offset}`);
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

        get min(): string {
            return getValue(this, -4);
        }

        get xxs(): string {
            return getValue(this, -3);
        }

        get xs(): string {
            return getValue(this, -2);
        }

        get s(): string {
            return getValue(this, -1);
        }

        get m(): string {
            return getValue(this);
        }

        get l(): string {
            return getValue(this, 1);
        }

        get xl(): string {
            return getValue(this, 2);
        }

        get xxl(): string {
            return getValue(this, 3);
        }

        get max(): string {
            return getValue(this, 4);
        }

        get $xxs() {
            return new Coefficient({
                center: 4
            });
        }

        get $xs() {
            return new Coefficient({
                center: 8
            });
        }

        get $s() {
            return new Coefficient({
                center: 12
            });
        }

        get $m() {
            return new Coefficient({
                center: 16
            });
        }

        get $l() {
            return new Coefficient({
                center: 20
            });
        }

        get $xl() {
            return new Coefficient({
                center: 24
            });
        }

        get $xxl() {
            return new Coefficient({
                center: 28
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
