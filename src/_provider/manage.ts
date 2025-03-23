import { IStyleManager, TStyleConsumer } from '../types';

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

    get = (key: string) => {
        return this._stylesheets[key];
    }

    has = (key?: string) => {
        return !!key && !!this.get(key);
    }

    getAll = () => {
        return this._stylesheets;
    }

    add = (key: string, stylesheet: CSSStyleSheet) => {
        if (!this._stylesheets[key]) {
            this._stylesheets[key] = stylesheet;
            this._styleSheetsArray.push(stylesheet);
            this.notify();
            return true;
        }
    }

    status = (key: string) => {
        const styleSheet = key && this._stylesheets[key];
        return !!styleSheet && (this._styleSheetsArray.findIndex((item) => item === styleSheet) !== -1);
    }

    on = (key: string) => {
        const styleSheet = key && this._stylesheets[key];
        if (styleSheet && !this.status(key)) {
            this._styleSheetsArray.push(styleSheet);
            this.notify();
            return true;
        }
    }

    off = (key: string) => {
        const styleSheet = key && this._stylesheets[key];
        if (styleSheet && this.status(key)) {
            const index = this._styleSheetsArray.findIndex((item) => item === styleSheet);
            this._styleSheetsArray.splice(index, 1);
            this.notify();
            return true;
        }
    }

    remove = (key: string) => {
        const current = this.get(key);
        if (!current) {
            return;
        }
        const index = this._styleSheetsArray.findIndex((sheet) => sheet === current);
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

    pack = (key: string, styles: string, save?: boolean) => {
        const styleSheet = new CSSStyleSheet();
        styleSheet.replaceSync(styles);
        if (!styleSheet.cssRules.length) {
            console.log(`StyleSheet '${key}' is empty`);
            return;
        }
        return this.add(key, styleSheet);
    }

    apply = (root: TStyleConsumer) => {
        root.adoptedStyleSheets = this._styleSheetsArray;
    }

    registerNode = (node: TStyleConsumer) => {
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
