export type TCollector = {
    /**
     * Collect maker
     * @param maker - stylesheet maker
     * @param key - stylesheet key
     */
    use(maker: Function): string;
    /**
     * Replace collected maker
     * @param maker - next maker
     * @param original - original maker
     */
    remake(maker: Function, key: Function): string;
    /**
     * Get key of collected maker
     * @param maker - stylesheet maker
     */
    key(maker?: Function): string;
    /**
     * Get all collected keys
     */
    keys: string[];
    /**
     * Get all collected makers
     */
    makers: Record<string, Function>;
};

/**
 * Create stylesheet key maker
 * @param params - collector params
 */
const createKeyMaker = ({
    prefix
}: {
    prefix: string;
}): {
    /**
     * Initial stylesheet key
     */
    initial: string;
    /**
     * Current stylesheet key
     */
    current: string;
    /**
     * Create next key
     */
    next(): string;
} => {
    let count = 0;
    return {
        get initial() {
            return prefix + 0;
        },
        get current() {
            return prefix + count;
        },
        next() {
            count++;
            return this.current;
        }
    };
};

/**
 * Create stylesheet maker collector
 * @param params - collector params
 */
export const createCollector = ({
    prefix
}: {
    prefix: string;
}): TCollector => {
    const k: Set<string> = new Set();
    const _ = new Map<Function, string>();
    const keyMaker = createKeyMaker({ prefix })
    return {
        use(maker) {
            let key = this.key(maker);
            if (key) return key;
            key = keyMaker.current;
            k.add(key);
            _.set(maker, key);
            keyMaker.next();
            return key;
        },

        remake(maker, original) {
            const key = _.get(original);
            if (key) {
                _.delete(original);
                _.set(maker, key);
                return key;
            }
            return this.use(maker);
        },

        key(maker) {
            if (!maker) return keyMaker.initial;
            return _.get(maker) || '';
        },

        get keys() {
            return [...k];
        },

        get makers() {
            return Object.fromEntries(_.entries().map(([s, k]) => [k, s]));
        }
    };
};
