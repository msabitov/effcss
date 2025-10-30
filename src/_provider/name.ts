import { DEFAULT_ATTRS } from '../common';

/**
 * Create stylesheet key maker
 * @param params - collector params
 */
export const createKeyMaker = ({
    prefix = DEFAULT_ATTRS.prefix
}: {
    prefix: string;
}): {
    /**
     * Base stylesheet key
     */
    base: string;
    /**
     * Current stylesheet key
     */
    current: string;
    /**
     * Create next key
     */
    next(): string;
    /**
     * Reset current key
     */
    reset(): void;
} => {
    let count = 1;
    return {
        get base() {
            return prefix + 0;
        },
        get current() {
            return prefix + count;
        },
        next() {
            count++;
            return this.current;
        },
        reset() {
            count = 1;
        }
    };
};
