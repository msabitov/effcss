import { IStyleManager, TStyleConsumer } from '../types';

const toArray = (target: string | string[]) => Array.isArray(target) ? target : [target];

/**
 * Style manager
 */
class Manager implements IStyleManager {
    /**
     * Stylesheets dict
     */
    protected _stylesheets: Record<string, CSSStyleSheet> = {} as Record<string, CSSStyleSheet>;
    /**
     * Rules dict
     */
    protected _rules: Record<string, Record<string, CSSRule>> = {};
    /**
     * Stylesheets array
     */
    protected _styleSheetsArray: CSSStyleSheet[] = [];
    /**
     * Dependent nodes
     */
    protected _listeners: WeakRef<TStyleConsumer>[] = [];

    getIndex = (styleSheet: CSSStyleSheet) => this._styleSheetsArray.findIndex((item) => item === styleSheet);

    get = (key: string) => this._stylesheets[key];

    has = (key?: string) => !!key && !!this.get(key);

    getAll = () => this._stylesheets;

    add = (key: string, stylesheet: CSSStyleSheet) => {
        if (!this._stylesheets[key]) {
            this._stylesheets[key] = stylesheet;
            this._styleSheetsArray.push(stylesheet);
            this.notify();
            return true;
        }
    }

    status = (key: string) => {
        const styleSheet = this.get(key);
        return !!styleSheet && (this.getIndex(styleSheet) !== -1);
    }

    on = (target: string | string[]) => {
        const result = toArray(target).reduce((acc, key) => {
            const styleSheet = this.get(key);
            if (styleSheet && !this.status(key)) {
                this._styleSheetsArray.push(styleSheet);
                return acc;
            }
            return false;
        }, true);
        this.notify();
        return result;
    }

    off = (target: string | string[]) => {
        const result = toArray(target).reduce((acc, key) => {
            const styleSheet = this.get(key);
            if (styleSheet && this.status(key)) {
                const index = this.getIndex(styleSheet);
                this._styleSheetsArray.splice(index, 1);
                return acc;
            }
            return false;
        }, true);
        this.notify();
        return result;
    }

    remove = (key: string) => {
        const current = this.get(key);
        if (!current) {
            return;
        }
        const index = this.getIndex(current);
        if (index > -1) {
            this._styleSheetsArray.splice(index, 1);
            delete this._stylesheets[key];
            delete this._rules[key];
        }
        this.notify();
        return true;
    }

    removeAll() {
        this._styleSheetsArray.splice(0);
        this._stylesheets = {} as Record<string, CSSStyleSheet>;
        this._rules = {};
        this.notify();
        return true;
    }

    pack = (key: string, styles: string) => {
        const styleSheet = new CSSStyleSheet();
        styleSheet.replaceSync(styles);
        if (!styleSheet.cssRules.length) {
            console.log(`StyleSheet '${key}' is empty`);
            return;
        }
        return this.add(key, styleSheet);
    }

    replace = (key: string, styles: string) => {
        const styleSheet = this._stylesheets[key];
        if (styleSheet) {
            styleSheet.replaceSync(styles);
            this.notify();
            return true;
        }
    }

    apply = (root: TStyleConsumer) => {
        root.adoptedStyleSheets = this._styleSheetsArray;
    }

    registerNode = (node: TStyleConsumer) => {
        const index = this._listeners.findIndex((listener) => listener.deref() === node);
        if (index >= 0) return;
        this._listeners.push(new WeakRef(node));
        this.apply(node);
    }

    unregisterNode = (node: TStyleConsumer) => {
        const index = this._listeners.findIndex((listener) => listener.deref() === node);
        if (index >= 0) this._listeners.splice(index, 1);
    }

    notify = () => {
        this._listeners = this._listeners.reduce((acc, listener) => {
            const ref = listener.deref();
            if (ref) {
                this.apply(ref);
                acc.push(listener);
            }
            return acc;
        }, [] as WeakRef<TStyleConsumer>[]);
    }
}

/**
 * Create {@link IStyleManager | style manager}
 * @param params - manager params
 * @returns IStyleManager
 */
export function createManager(): IStyleManager {
    return new Manager();
}
