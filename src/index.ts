// processor
import { createProcessor } from './_provider/process';
// manager
import { createManager } from './_provider/manage';
// common
import type { TProviderSettings } from './common';
import { createCollector, createKeyMaker, createScope, DEFAULT_ATTRS, DEFAULT_SETTINGS, TAG_NAME } from './common';

// constants
const THEME_ATTR = 'theme';
const EVENT_NAME = 'effcsschanges';

// aliases
const assign = Object.assign;
const entries = Object.entries;
const fromEntries = Object.fromEntries;
const getAttr = (self: Element, name: keyof typeof DEFAULT_ATTRS) => self.getAttribute(name) || DEFAULT_ATTRS[name];

type TResolveAttr = ReturnType<ReturnType<typeof createScope>>['attr'];
/**
 * StyleSheet maker
 */
export type TStyleSheetMaker = Parameters<ReturnType<typeof createProcessor>['compile']>[0]['maker'];
/**
 * Style target
 */
type TStyleTarget = string | TStyleSheetMaker;
/**
 * Style provider
 * @description
 * Basic interface for style provider component.
 */
export interface IStyleProvider {
    // getters

    /**
     * Get prefix
     */
    get prefix(): string;
    /**
     * Get mode
     */
    get mode(): string | null;
    /**
     * Get hydrate
     */
    get hydrate(): boolean | null;

    // theme handlers

    /**
     * Get theme value
     */
    get theme(): string | null;
    /**
     * Set theme value
     * @param val - theme value
     */
    set theme(val: string);

    // settings handlers

    /**
     * Get provider settings
     */
    get settings(): Partial<TProviderSettings>;
    /**
     * Set provider settings
     */
    set settings(val: Partial<TProviderSettings>);

    // makers handlers

    /**
     * Use stylesheet maker
     * @param maker - stylesheet maker
     * @returns {@link TResolveAttr | attribute resolver}
     */
    use(maker: TStyleSheetMaker, key?: string): TResolveAttr;
    /**
     * Use public stylesheet makers
     * @param makers - stylesheet makers
     */
    usePublic(makers: Record<string, TStyleSheetMaker>): Record<string, TResolveAttr>;
    /**
     * Use private stylesheet makers
     * @param makers - stylesheet makers
     */
    usePrivate(makers: TStyleSheetMaker[]): TResolveAttr[];
    /**
     * Resolve stylesheet
     * @param key - stylesheet key
     * @returns BEM attribute resolver for stylesheet
     */
    resolve(key?: string): TResolveAttr;
    /**
     * Prepare CSS from config
     * @param maker - stylesheet maker
     * @param key - stylesheet key
     */
    css(maker: TStyleSheetMaker, key: string): string;

    // stylesheet handlers

    /**
     * Resolve target key
     * @param target - style target
     */
    key(target: TStyleTarget): string | undefined;
    /**
     * Is stylesheet on
     * @param key - stylesheet key
     */
    status(key: TStyleTarget): boolean;
    /**
     * Switch stylesheets on
     * @param targets - target stylesheet maker or key
     */
    on(...targets: TStyleTarget[]): boolean | undefined;
    /**
     * Switch stylesheets off
     * @param targets - target stylesheet maker or key
     */
    off(...targets: TStyleTarget[]): boolean | undefined;
    /**
     * Get CSS stylesheets
     * @param targets - target stylesheet makers and/or keys
     */
    stylesheets(targets?: TStyleTarget[]): (CSSStyleSheet | undefined)[];

    /**
     * String representation that allows save or send current state
     */
    toString(): string;
}

export type TBaseStyleSheet = {
    /**
     * Main block
     */
    '': {
        /**
         * Main block modifiers
         */
        '': {
            /**
             * Theme
             */
            theme: string;
        };
    };
};

/**
 * Define style provider custom element
 */
export function defineProvider(settings: Partial<TProviderSettings> = {}): boolean {
    const doc = window.document;
    const custom = window.customElements;
    if (custom?.get(TAG_NAME)) return false;
    else {
        class Provider extends HTMLScriptElement implements IStyleProvider {
            /**
             * Collector
             */
            protected _c: ReturnType<typeof createCollector> = createCollector();
            /**
             * Manager
             */
            protected _m: ReturnType<typeof createManager> = createManager();
            /**
             * Scope
             */
            protected _s: ReturnType<typeof createScope>;
            /**
             * Key maker
             */
            protected _k: ReturnType<typeof createKeyMaker>;
            /**
             * Processor
             */
            protected _p: ReturnType<typeof createProcessor>;
            /**
             * Notifier
             */
            protected _n: {
                set adoptedStyleSheets(styles: CSSStyleSheet[]);
            };
            /**
             * Base stylesheet maker
             */
            protected _: TStyleSheetMaker;
            /**
             * Inner settings
             */
            protected _settings: IStyleProvider['settings'];

            // computed

            get prefix(): string {
                return getAttr(this, 'prefix') || '';
            }

            get mode() {
                return getAttr(this, 'mode');
            }

            get hydrate() {
                return this.getAttribute('hydrate') === '';
            }

            get settings(): IStyleProvider['settings'] {
                return this._settings;
            }

            set settings(val: IStyleProvider['settings']) {
                const nextSettings = assign({}, this._settings, val);
                const { makers, vars, bp, off } = nextSettings;
                if (bp && this._settings?.bp !== bp)
                    this._p = createProcessor({
                        scope: this._s,
                        globalKey: this._k.base,
                        bp
                    });
                if (vars && this._settings?.vars !== vars) this._cust(vars);
                if (makers && this._settings?.makers !== makers) {
                    this._c.useMany(makers);
                    this.usePublic(makers as Record<string, TStyleSheetMaker>);
                    if (off?.length && this._settings.off !== off) this.off(...off);
                    if (this.hydrate) this._k.reset();
                }
                this._settings = nextSettings;
            }

            // theme methods

            set theme(val: string) {
                !val ? this.removeAttribute(THEME_ATTR) : this.setAttribute(THEME_ATTR, val);
            }
            get theme() {
                return getAttr(this, THEME_ATTR) || '';
            }

            protected _cust = (nextVars: IStyleProvider['settings']['vars'] = {}) => {
                const { varName } = this._s(this._k.base);
                function parseParams(params: object, parents: string[]): Record<string, string | number | boolean> {
                    return entries(params).reduce((acc, [key, val]) => {
                        if (val && typeof val === 'object') return assign(acc, parseParams(val, [...parents, key]));
                        else {
                            acc[varName(...parents, key)] = val;
                            return acc;
                        }
                    }, {} as Record<string, string | number | boolean>);
                }
                const {
                    '': rootThemeVars = {},
                    dark,
                    light,
                    ...otherThemeVars
                } = fromEntries(
                    entries(nextVars || {}).map(([themeKey, themeParams]) => [themeKey, parseParams(themeParams, [])])
                );

                // create init stylesheet maker
                this._ = ({ bem, each, when, vars, merge, at: { mq } }) => {
                    const PREFERS_COLOR_SCHEME = 'prefers-color-scheme';
                    const variants = {
                        light: `${PREFERS_COLOR_SCHEME}: light`,
                        dark: `${PREFERS_COLOR_SCHEME}: dark`
                    };
                    return merge(
                        {
                            [`:root:has(script[is=${TAG_NAME}])`]: merge(
                                {
                                    fontSize: vars<{ rem: string }>('rem')
                                },
                                rootThemeVars
                            )
                        },
                        when(!!dark, {
                            [mq(variants.dark).s]: dark
                        }),
                        when(!!light, {
                            [mq(variants.light).s]: light
                        }),
                        each(otherThemeVars, (k, v) => ({
                            [`:root:has(script[is=${TAG_NAME}][${THEME_ATTR}=${k}])`]: v,
                            // multiple themes
                            [bem<TBaseStyleSheet>(`..theme.${k}`)]: v
                        }))
                    );
                };
                // apply maker
                this.use(this._, this._k.base);
            };

            connectedCallback() {
                this._k = createKeyMaker({ prefix: this.prefix });
                this._s = createScope({
                    mode: this.mode
                });
                // create notifier
                const self = this;
                this._n = {
                    set adoptedStyleSheets(styles: CSSStyleSheet[]) {
                        self.dispatchEvent(
                            new CustomEvent(EVENT_NAME, {
                                detail: { styles },
                                bubbles: true
                            })
                        );
                    }
                };
                // register notifier
                this._m.register(this._n);
                // register document
                this._m.register(doc);
                // apply settings
                this.settings = assign({}, DEFAULT_SETTINGS, settings);
            }

            // maker handlers

            use: IStyleProvider['use'] = (maker, key) => {
                const styleSheetKey = key || this._k.current;
                let k = this._c.use(maker, styleSheetKey);
                if (this._m && !this._m.has(key)) this._m.pack(k, this.css(maker, k));
                if (!key) this._k.next();
                return this.resolve(k);
            };
            usePublic: IStyleProvider['usePublic'] = (styles) =>
                fromEntries(entries(styles).map(([key, maker]) => [key, this.use(maker, key)]));

            usePrivate: IStyleProvider['usePrivate'] = (styles) => styles.map((maker) => this.use(maker));

            resolve: IStyleProvider['resolve'] = (key) => this._s(key || this._k.base).attr;

            css: IStyleProvider['css'] = (maker, key) =>
                this._p.compile({
                    key,
                    maker
                });

            // stylesheet handlers

            status: IStyleProvider['status'] = (target) => {
                const source = this.key(target);
                return !!source && this._m.status(source);
            };

            on: IStyleProvider['on'] = (...params) => this._m.on(...params.map(this.key));

            off: IStyleProvider['off'] = (...params) => this._m.off(...params.map(this.key));

            key: IStyleProvider['key'] = (param) => (typeof param === 'string' ? param : this._c.getKey(param));

            stylesheets: IStyleProvider['stylesheets'] = (targets = this._c.keys) =>
                targets.map((target) => this._m.get(this.key(target)));

            toString() {
                const attrs = [...this.attributes]
                    .map((attr) => (attr.value ? `${attr.name}="${attr.value}"` : attr.value === '' ? attr.name : ''))
                    .filter(Boolean)
                    .join(' ');
                return `<script ${attrs}>${this.textContent}</script>`;
            }
        }
        custom.define(TAG_NAME, Provider, { extends: 'script' });
        return true;
    }
}
