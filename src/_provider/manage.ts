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
     * Expanded selectors dict
     */
    protected _expandedSelectors: Record<string, Set<string>> = {};
    /**
     * Stylesheets array
     */
    protected _styleSheetsArray: CSSStyleSheet[] = [];
    /**
     * Dependent nodes
     */
    protected _listeners: WeakRef<TStyleConsumer>[] = [];

    constructor(config: Record<string, string>) {
        if (config) {
            for (let key in config) {
                this.pack(key, config[key])
            }
        }
    }

    get = (key: string) => {
        return this._stylesheets[key];
    }

    getAll = () => {
        return this._stylesheets;
    }

    add = (key: string, stylesheet: CSSStyleSheet) => {
        if (!this._stylesheets[key]) {
            this._stylesheets[key] = stylesheet;
            this._styleSheetsArray.push(stylesheet);
            this.cacheRules(key, stylesheet);
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
            delete this._expandedSelectors[key];
        }
        this.notify();
        return true;
    }

    removeAll() {
        this._styleSheetsArray.splice(0);
        this._stylesheets = {} as Record<string, CSSStyleSheet>;
        this._rules = {};
        this._expandedSelectors = {};
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

    cacheRules = (key: string, stylesheet: CSSStyleSheet) => {
        [...stylesheet.cssRules].forEach((rule) => {
            const selectorText = rule.cssText.split(' {')[0];
            if (selectorText) {
                if (!this._rules[key]) this._rules[key] = {};
                this._rules[key][selectorText] = rule;
            };
        });
        this._expandedSelectors[key] = new Set();
    }

    getExpandedSelectors = (key: string) => {
        return this._expandedSelectors[key];
    }

    expandRule = (key: string, init: string, exp: string) => {
        const rules = this._rules[key];
        if (!rules) {
            console.log(`No stylesheet with key '${key}'`);
            return;
        }
        const rule = rules[init];
        if (!rule) {
            console.log(`No rule with selector '${init}' in the '${key}' stylesheet`);
            return;
        }
        const [start, end] = rule.cssText.split('{');
        const parentStyleSheet = rule.parentStyleSheet;
        if (parentStyleSheet) {
            const parentRules = parentStyleSheet.cssRules;
            const nextRuleIndex = parentStyleSheet.insertRule(
                exp + '{' + end + '}'.repeat([...exp.matchAll(/{/g)].length),
                parentRules.length
            );
            rules[exp] = parentRules[nextRuleIndex];
            this._expandedSelectors[key].add(exp);
            return true;
        }
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
export function createManager(params: Record<string, string>): IStyleManager {
    return new Manager(params);
}
