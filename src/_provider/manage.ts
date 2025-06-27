type TOptBool = boolean | undefined;
/**
 * Style root
 */
type TStyleRoot = { adoptedStyleSheets: CSSStyleSheet[] };

/**
 * Style manager
 * @description
 * Manages CSS stylesheets.
 */
interface IStyleManager {
    /**
     * Get stylesheet by key
     * @param key - stylesheet key
     */
    get(key?: string): CSSStyleSheet | undefined;
    /**
     * Get index of stylesheet
     * @param styleSheet - CSS stylesheet
     */
    getIndex(styleSheet: CSSStyleSheet): number;
    /**
     * Get all stylesheets dictionary
     */
    getAll(): Record<string, CSSStyleSheet>;
    /**
     * Add stylesheet
     * @param key - stylesheet key
     * @param stylesheet - CSSStylesheet instance
     */
    add(key: string, stylesheet: CSSStyleSheet): TOptBool;
    /**
     * Replace stylesheet content
     * @param key - stylesheet key
     * @param styles - stylesheet content string
     */
    replace(key: string, styles: string): TOptBool;
    /**
     * Remove stylesheet
     * @param key - stylesheet key
     * @returns `true` if stylesheet is removed
     */
    remove(key: string): TOptBool;
    /**
     * Remove all stylesheets
     */
    removeAll(): void;
    /**
     * Pack styles into CSSStyleSheet and add it into stylesheet dictionary
     * @param key - stylesheet key
     * @param styles - stylesheet content string
     */
    pack(key: string, styles: string): TOptBool;
    /**
     * Check if stylesheet exist
     * @param key - stylesheet key
     */
    has(key?: string): boolean;
    /**
     * Is stylesheet on
     * @param key - stylesheet key
     */
    status(key?: string): boolean;
    /**
     * Switch stylesheet on
     * @param key - stylesheet key
     */
    on(...keys: (string | undefined)[]): TOptBool;
    /**
     * Switch stylesheet off
     * @param key - stylesheet key
     */
    off(...keys: (string | undefined)[]): TOptBool;
    /**
     * Apply stylesheets to style root
     * @param consumer - style root
     */
    apply(consumer: TStyleRoot): void;
    /**
     * Register style root
     * @param consumer - style root
     */
    register(consumer: TStyleRoot): void;
    /**
     * Unregister style root
     * @param consumer - style root
     */
    unregister(consumer: TStyleRoot): void;
    /**
     * Apply style changes to dependent nodes
     */
    notify(): void;
}

/**
 * Create {@link IStyleManager | style manager}
 * @param params - manager params
 * @returns IStyleManager
 */
export function createManager(): IStyleManager {
    /**
     * Stylesheets dict
     */
    let _s: Record<string, CSSStyleSheet> = {};
    /**
     * Rules dict
     */
    let _r: Record<string, Record<string, CSSRule>> = {};
    /**
     * Stylesheets array
     */
    let _a: CSSStyleSheet[] = [];
    /**
     * Dependent nodes
     */
    let _l: WeakRef<TStyleRoot>[] = [];

    const apply: IStyleManager['apply'] = (root) => (root.adoptedStyleSheets = _a);
    const notify: IStyleManager['notify'] = () => {
        _l = _l.reduce((acc, listener) => {
            const ref = listener.deref();
            if (ref) {
                apply(ref);
                acc.push(listener);
            }
            return acc;
        }, [] as WeakRef<TStyleRoot>[]);
    };
    const getIndex: IStyleManager['getIndex'] = (styleSheet) => _a.findIndex((item) => item === styleSheet);
    const get: IStyleManager['get'] = (key) => (key ? _s[key] : undefined);
    const has: IStyleManager['has'] = (key) => !!key && !!get(key);
    const getAll: IStyleManager['getAll'] = () => _s;
    const add: IStyleManager['add'] = (key, stylesheet: CSSStyleSheet) => {
        if (!_s[key]) {
            _s[key] = stylesheet;
            _a.push(stylesheet);
            notify();
            return true;
        }
    };
    const status: IStyleManager['status'] = (key) => {
        const styleSheet = get(key);
        return !!styleSheet && getIndex(styleSheet) !== -1;
    };
    const on: IStyleManager['on'] = (...targets) => {
        const result = targets.reduce((acc, key) => {
            const styleSheet = get(key);
            if (styleSheet && !status(key)) {
                _a.push(styleSheet);
                return acc;
            }
            return false;
        }, true);
        notify();
        return result;
    };
    const off: IStyleManager['off'] = (...targets) => {
        const result = targets.reduce((acc, key) => {
            const styleSheet = get(key);
            if (styleSheet && status(key)) {
                const index = getIndex(styleSheet);
                _a.splice(index, 1);
                return acc;
            }
            return false;
        }, true);
        notify();
        return result;
    };
    const remove: IStyleManager['remove'] = (key: string) => {
        const current = get(key);
        if (!current) {
            return;
        }
        const index = getIndex(current);
        if (index > -1) {
            _a.splice(index, 1);
            delete _s[key];
            delete _r[key];
        }
        notify();
        return true;
    };
    const removeAll: IStyleManager['removeAll'] = () => {
        _a.splice(0);
        _s = {};
        _r = {};
        notify();
        return true;
    };
    const pack: IStyleManager['pack'] = (key, styles) => {
        const styleSheet = new CSSStyleSheet();
        styleSheet.replaceSync(styles);
        return !!styleSheet.cssRules.length && add(key, styleSheet);
    };
    const replace: IStyleManager['replace'] = (key, styles) => {
        const styleSheet = _s[key];
        if (styleSheet) {
            styleSheet.replaceSync(styles);
            notify();
            return true;
        }
    };
    const register: IStyleManager['register'] = (node) => {
        const index = _l.findIndex((listener) => listener.deref() === node);
        if (index >= 0) return;
        _l.push(new WeakRef(node));
        apply(node);
    };
    const unregister: IStyleManager['unregister'] = (node: TStyleRoot) => {
        const index = _l.findIndex((listener) => listener.deref() === node);
        if (index >= 0) _l.splice(index, 1);
    };
    return {
        apply,
        notify,
        getIndex,
        get,
        has,
        getAll,
        add,
        status,
        on,
        off,
        remove,
        removeAll,
        pack,
        replace,
        register,
        unregister
    };
}
