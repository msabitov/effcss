// processor
import { createProcessor } from './_provider/process';
// manager
import { createManager } from './_provider/manage';
// common
import type { TProviderSettings, TProviderSettingsPartial } from './common';
import {
    createCollector, createKeyMaker, createScope, merge,
    DEFAULT_ATTRS, DEFAULT_SETTINGS, TAG_NAME
} from './common';

// constants
const THEME_ATTR = 'theme';
const SIZE_ATTR = 'size';
const TIME_ATTR = 'time';
const ANGLE_ATTR = 'angle';
const EVENT_NAME = 'effcsschanges';
const PALETTE = 'palette';

// aliases
const assign = Object.assign;
const entries = Object.entries;
const fromEntries = Object.fromEntries;
const getAttr = (self: Element, name: keyof typeof DEFAULT_ATTRS) => self.getAttribute(name) || DEFAULT_ATTRS[name];
const getNumAttr = (self: Element, name: keyof typeof DEFAULT_ATTRS) => {
    const val = getAttr(self, name);
    return val !== null ? Number(val) : null;
};
const setAttr = (self: HTMLScriptElement, name: string, val: string | number | null) => val === null ? self.removeAttribute(name) : self.setAttribute(name, val + '');
const getAttrSelector = (attr?: string) => `:root:has(script[is=${TAG_NAME}]${attr ? `[${attr}]` : ''})`;
const getOrderedRange = (range: Record<string, number>) => [
    range.xxs,
    range.xs,
    range.s,
    range.m,
    range.l,
    range.xl,
    range.xxl
];
const tokens = ['xs', 's', 'm', 'l', 'xl'] as const;
const ctokens = ['pale', 'base', 'rich'] as const;
type TResolveAttr = ReturnType<ReturnType<typeof createScope>>['attr'];
/**
 * StyleSheet maker
 */
export type TStyleSheetMaker = Parameters<ReturnType<typeof createProcessor>['compile']>[0]['maker'];
/**
 * StyleSheet maker utils
 */
export type TStyleSheetUtils = Parameters<TStyleSheetMaker>[0];
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
    /**
     * Get stylesheet makers
     */
    get makers(): ReturnType<typeof createCollector>['makers']

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

    // global var controls

    /**
     * Get root size value
     */
    get size(): number | null;
    /**
     * Set root size value
     * @param val - rem value in px
     */
    set size(val: number | null);
    /**
     * Get root time value
     */
    get time(): number | null;
    /**
     * Set root time value
     * @param val - time value in ms
     */
    set time(val: number | null);
    /**
     * Get root angle value
     */
    get angle(): number | null;
    /**
     * Set root angle value
     * @param val - angle value in ms
     */
    set angle(val: number | null);

    // settings handlers

    /**
     * Get provider settings
     */
    get settings(): Partial<TProviderSettings>;
    /**
     * Set provider settings
     */
    set settings(val: TProviderSettingsPartial);

    // makers handlers

    /**
     * Use stylesheet maker
     * @param maker - stylesheet maker
     * @param key - stylesheet key
     * @param force - force generation
     * @returns {@link TResolveAttr | attribute resolver}
     */
    use(maker: TStyleSheetMaker, key?: string, force?: boolean): TResolveAttr;
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
export function defineProvider(settings: TProviderSettingsPartial = {}): boolean {
    const doc = window.document;
    const custom = window.customElements;
    if (custom?.get(TAG_NAME)) return false;
    else {
        class Provider extends HTMLScriptElement implements IStyleProvider {
            static get observedAttributes() {
                return [SIZE_ATTR, TIME_ATTR, ANGLE_ATTR];
            }

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
            protected _settings: IStyleProvider['settings'] = DEFAULT_SETTINGS;

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

            set settings(val: TProviderSettingsPartial) {
                const nextSettings = merge({}, this._settings, val);
                const { makers, bp, off } = nextSettings;
                if (bp && this._settings?.bp !== bp || !this._p)
                    this._p = createProcessor({
                        scope: this._s,
                        globalKey: this._k.base,
                        bp
                    });
                if (makers && this._settings?.makers !== makers) {
                    this._c.useMany(makers);
                    this.usePublic(makers as Record<string, TStyleSheetMaker>);
                    if (off?.length && this._settings.off !== off) this.off(...off);
                    if (this.hydrate) this._k.reset();
                }
                this._settings = nextSettings;
                if (
                    !this._m?.has(this._k.base) ||
                    val.vars ||
                    val.palette ||
                    val.coef
                ) this._cust();
            }

            get makers(): IStyleProvider['makers'] {
                return this._c.makers;
            }

            // theme methods

            set theme(val: string) {
                setAttr(this, THEME_ATTR, val);
            }
            get theme() {
                return getAttr(this, THEME_ATTR) || '';
            }

            set size(val: number | null) {
                setAttr(this, SIZE_ATTR, val);
            }

            get size() {
                return getNumAttr(this, SIZE_ATTR);
            }

            set time(val) {
                setAttr(this, 'time', val);
            }

            get time() {
                return getNumAttr(this, TIME_ATTR);
            }

            set angle(val) {
                setAttr(this, 'angle', val);
            }

            get angle() {
                return getNumAttr(this, ANGLE_ATTR);
            }

            protected _cust = () => {
                const nextVars: IStyleProvider['settings']['vars'] = this._settings?.vars;
                const { varName } = this._s(this._k.base);
                const rootVar = (name: string) => varName('', name);
                function parseParams(params: object, parents: string[]): Record<string, string | number | boolean> {
                    return entries(params).reduce((acc, [key, val]) => {
                        if (val && typeof val === 'object') return assign(acc, parseParams(val, [...parents, key]));
                        else {
                            acc[varName(...parents, key)] = val;
                            return acc;
                        }
                    }, {} as Record<string, string | number | boolean>);
                }
                const themeVars = fromEntries(
                    entries(nextVars || {}).map(([themeKey, themeParams]) => [themeKey, parseParams(themeParams, [])])
                );
                const {
                    '': rootThemeVars = {},
                    dark,
                    light,
                    ...otherThemeVars
                } = themeVars;
                // manual setted attributes
                const size = this.size;
                const time = this.time;
                const angle = this.angle;
                const {l, c, h} = this._settings.palette as TProviderSettings['palette'];
                const coef = this._settings.coef as TProviderSettings['coef'];
                const coefArray = [
                    0,
                    ...getOrderedRange(coef.$0_),
                    1,
                    ...getOrderedRange(coef.$1_),
                    2,
                    ...getOrderedRange(coef.$2_),
                    16,
                    ...getOrderedRange(coef.$16_),
                    coef.max
                ];
                // create init stylesheet maker
                this._ = ({ bem, each, when, vars, merge, at: { mq }, units: {px, ms, deg} }) => {
                    const PREFERS_COLOR_SCHEME = 'prefers-color-scheme';
                    const variants = {
                        light: `${PREFERS_COLOR_SCHEME}: light`,
                        dark: `${PREFERS_COLOR_SCHEME}: dark`
                    };
                    return merge(
                        {
                            [getAttrSelector()]: merge(
                                {
                                    fontSize: vars<{ rem: string }>('rem'),
                                },
                                rootThemeVars,
                                // coef
                                each(coefArray, (k, v) => ({
                                    [varName('coef', k)]: v
                                })),
                                // palette
                                each(h, (k, v) => ({
                                    [varName(PALETTE, 'h', k)]: v
                                })),
                                {
                                    [varName(PALETTE, 'c', 'bg', 'gray')]: 0,
                                    [varName(PALETTE, 'c', 'fg', 'gray')]: 0
                                },
                                each(variants, (mediaKey, mediaCond) => ({
                                    [mq(mediaCond).s]: merge(
                                        themeVars[mediaKey] || {},
                                        each(tokens, (k, v) => ({
                                            [varName(PALETTE, 'l', 'bg', v)]: l[mediaKey].bg[v],
                                            [varName(PALETTE, 'l', 'fg', v)]: l[mediaKey].fg[v],
                                        })),
                                        each(ctokens, (k, v) => ({
                                            [varName(PALETTE, 'c', 'bg', v)]: c[mediaKey].bg[v],
                                            [varName(PALETTE, 'c', 'fg', v)]: c[mediaKey].fg[v],
                                        }))
                                )}))
                            )
                        },
                        each(otherThemeVars, (k, v) => ({
                            [getAttrSelector(`${THEME_ATTR}=${k}`)]: v,
                            // multiple themes
                            [bem<TBaseStyleSheet>(`..theme.${k}`)]: v
                        })),
                        when(!!size, {
                            [getAttrSelector(SIZE_ATTR)]: {
                                [rootVar('rem')]: px(size as number)
                            }
                        }),
                        when(!!time, {
                            [getAttrSelector(TIME_ATTR)]: {
                                [rootVar('rtime')]: ms(time as number)
                            }
                        }),
                        when(!!angle, {
                            [getAttrSelector(ANGLE_ATTR)]: {
                                [rootVar('rangle')]: deg(angle as number)
                            }
                        })
                    );
                };
                // apply maker
                this.use(this._, this._k.base, true);
            };

            attributeChangedCallback() {
                if (this._k as ReturnType<typeof createKeyMaker> | undefined) this._cust();
            }

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
                this.settings = settings;
            }

            // maker handlers

            use: IStyleProvider['use'] = (maker, key, force) => {
                const styleSheetKey = key || this._k.current;
                let k = this._c.use(maker, styleSheetKey);
                if (force || this._m && !this._m.has(key)) this._m.pack(k, this.css(maker, k));
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
