type TOptBool = boolean | undefined;
/**
 * Style root
 */
type TStyleRoot = { adoptedStyleSheets: CSSStyleSheet[] };

/**
 * Style manager
 */
export type TManager = {
    /**
     * Get stylesheet by key
     * @param key - stylesheet key
     */
    get(key?: string): CSSStyleSheet | undefined;
    /**
     * Get all stylesheets dictionary
     */
    all(): Record<string, CSSStyleSheet>;
    /**
     * Add stylesheet
     * @param key - stylesheet key
     * @param stylesheet - CSSStylesheet
     */
    add(key: string, stylesheet: CSSStyleSheet): TOptBool;
    /**
     * Hydrate stylesheet
     * @param key - stylesheet key
     */
    hydrate(key: string): string | undefined;
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
     * @param styles - stylesheet content
     */
    pack(key: string, styles: string): TOptBool;
    /**
     * Is stylesheet on
     * @param key - stylesheet key
     */
    status(key?: string): boolean;
    /**
     * Switch stylesheet on
     * @param key - stylesheet key
     */
    on(...keys: (string | undefined)[]): void;
    /**
     * Switch stylesheet off
     * @param key - stylesheet key
     */
    off(...keys: (string | undefined)[]): void;
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
}

const EFFCSS_SYMBOL: symbol = Symbol('effcss-stylesheet');

class CSSServerStyleSheet {
    disabled: boolean = false;
    cssRules: object[] = [];

    replaceSync(text: string) {
        if (text) {
            this.cssRules = [{
                cssText: text
            }];
        }
    }
}

/**
 * Create {@link TManager | style manager}
 * @param params - manager params
 * @returns TManager
 */
export function createManager({
    initStyles,
    emulate
}: {
    initStyles?: {
        dataset?: {
            effcss?: string;
        };
        disabled: boolean;
        textContent: string | null;
    }[];
    emulate?: boolean;
} = {}): TManager {
    const initCSS: Record<string, {
        disabled?: boolean;
        textContent?: string | null;
    }> = {};
    initStyles?.forEach((i) => {
        const key = i?.dataset?.effcss;
        if (key) initCSS[key] = i;
    });
    
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
    const createStyleSheet = () => !emulate && globalThis.CSSStyleSheet ? new globalThis.CSSStyleSheet() : new CSSServerStyleSheet();
    const hydrate: TManager['hydrate'] = (key: string)=> initCSS[key] && !initCSS[key].disabled ? initCSS[key].textContent || undefined : undefined;
    const mark = (key: string, styleSheet: CSSStyleSheet): CSSStyleSheet => styleSheet.hasOwnProperty(EFFCSS_SYMBOL) ? styleSheet : Object.defineProperties(styleSheet, {
        [EFFCSS_SYMBOL]: {
            value: key
        }
    });
    const apply = (root: TStyleRoot) => root.adoptedStyleSheets = [
        ...(root.adoptedStyleSheets?.length ? [...root.adoptedStyleSheets].filter((s) => !s.hasOwnProperty(EFFCSS_SYMBOL)) : []),
        ..._a
    ];
    const notify = () => {
        _l = _l.reduce((acc, listener) => {
            const ref = listener.deref();
            if (ref) {
                apply(ref);
                acc.push(listener);
            }
            return acc;
        }, [] as WeakRef<TStyleRoot>[]);
    };
    const getIndex = (styleSheet: CSSStyleSheet): number => _a.findIndex((item) => item === styleSheet);
    const get: TManager['get'] = (key) => (key ? _s[key] : undefined);
    const all: TManager['all'] = () => _s;
    const add: TManager['add'] = (key, stylesheet: CSSStyleSheet) => {
        if (!_s[key]) {
            _s[key] = mark(key, stylesheet);
            _a.push(_s[key]);
            const serverStyle = initCSS[key];
            if (serverStyle) serverStyle.disabled = true;
            notify();
            return true;
        }
    };
    const status: TManager['status'] = (key) => {
        const styleSheet = get(key);
        return !styleSheet?.disabled;
    };
    const on: TManager['on'] = (...targets) => {
        targets.forEach((target) => {
            const styleSheet = get(target);
            if (styleSheet) styleSheet.disabled = false;
        });
        notify();
    };
    const off: TManager['off'] = (...targets) => {
        targets.forEach((target) => {
            const styleSheet = get(target);
            if (styleSheet) styleSheet.disabled = true;
        });
        notify();
    };
    const remove: TManager['remove'] = (key: string) => {
        const current = get(key);
        if (!current) return;
        const index = getIndex(current);
        if (index > -1) {
            _a.splice(index, 1);
            delete _s[key];
            delete _r[key];
        }
        notify();
        return true;
    };
    const removeAll: TManager['removeAll'] = () => {
        _a.splice(0);
        _s = {};
        _r = {};
        notify();
        return true;
    };
    const pack: TManager['pack'] = (key, styles) => {
        let styleSheet = _s[key] || createStyleSheet();
        styleSheet.replaceSync(styles);
        styleSheet = mark(key, styleSheet);
        return !!styleSheet.cssRules.length && add(key, styleSheet);
    };
    const register: TManager['register'] = (node) => {
        const index = _l.findIndex((listener) => listener.deref() === node);
        if (index >= 0) return;
        _l.push(new WeakRef(node));
        apply(node);
    };
    const unregister: TManager['unregister'] = (node: TStyleRoot) => {
        const index = _l.findIndex((listener) => listener.deref() === node);
        if (index >= 0) _l.splice(index, 1);
    };
    return {
        get,
        all,
        add,
        status,
        on,
        off,
        remove,
        removeAll,
        pack,
        register,
        unregister,
        hydrate
    };
}
