
/**
 * Create stylesheet maker collector
 * @param params - collector params
 */
export const createCollector = (): {
    /**
     * Collect maker
     * @param maker - stylesheet maker
     * @param key - stylesheet key
     */
    use(maker: Function, key: string): string;
    /**
     * Collect makers
     * @param makers - stylesheet makers dict
     */
    useMany(makers: Record<string, Function>): string[];
    /**
     * Get key of collected maker
     * @param maker - stylesheet maker
     */
    getKey(maker: Function): string | undefined;
    /**
     * Get all collected keys
     */
    keys: string[];
    /**
     * Get all collected makers
     */
    makers: Record<string, Function>;
} => {
    const k: Set<string> = new Set();
    const _ = new Map<Function, string>();
    return {
        use(maker, key) {
            const existedKey = _.get(maker);
            if (existedKey) return existedKey;
            k.add(key);
            _.set(maker, key);
            return key;
        },

        useMany(makers) {
            return Object.entries(makers).map(([k, v]) => this.use(v, k));
        },

        getKey(maker) {
            return _.get(maker);
        },

        get keys() {
            return [...k];
        },

        get makers() {
            return Object.fromEntries(_.entries().map(([s, k]) => [k, s]));
        }
    };
};
