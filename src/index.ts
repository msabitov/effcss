// processor
import { createProcessor } from './_provider/process';
// manager
import { createManager } from './_provider/manage';
// collector
import { createCollector } from './_provider/collect';
// key maker
import { createKeyMaker } from './_provider/name';
// scope
import { createScope } from './_provider/scope';
// common
import type {
    TProviderAttrs, TProviderAttrParams, TProviderSettings, TPaletteConfig, TCoefConfig
} from './common';
import {
    merge,
    DEFAULT_ATTRS, DEFAULT_SETTINGS
} from './common';

// constants
export const TAG_NAME = 'effcss-provider';
const SCRIPT = 'script';
const THEME_ATTR = 'theme';
const SIZE_ATTR = 'size';
const TIME_ATTR = 'time';
const ANGLE_ATTR = 'angle';
const EVENT_NAME = 'effcsschanges';
const PALETTE = 'palette';
const EFFCSS_ATTR = 'data-effcss';
const EFFCSS_ATTR_SCOPE = EFFCSS_ATTR + '-scope';
const APP_JSON = 'application/json';

// aliases
const assign = Object.assign;
const entries = Object.entries;
const fromEntries = Object.fromEntries;
const isBoolean = (val: any) => typeof val === 'boolean';
const numOrNull = (val: string | null | undefined) => val !== null ? Number(val) : null;
const getAttr = (self: {
    getAttribute(qualifiedName: string): string | null;
}, name: keyof TProviderAttrs) => self.getAttribute(name) || DEFAULT_ATTRS[name];
const getNumAttr = (self: {
    getAttribute(qualifiedName: string): string | null;
}, name: keyof TProviderAttrs) => {
    const val = getAttr(self, name);
    return numOrNull(val);
};
const setAttr = (self: {
    removeAttribute(name: string): void;
    setAttribute(name: string, value: string): void
}, name: string, val: string | number | null) => val === null ? self.removeAttribute(name) : self.setAttribute(name, val + '');
const getAttrSelector = (attr?: string) => `:root:has(${SCRIPT}[is=${TAG_NAME}]${attr ? `[${attr}]` : ''})`;
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

type TManager = Pick<ReturnType<
    typeof createManager>, 'has' | 'pack' | 'status' | 'on' | 'off' | 'get' | 'hydrate'
>;
type TServerStyleSheet = {key: string; styles: string;};

const createGlobalMaker = ({
    scope, keyMaker, provider
}: {
    provider: IStyleProvider;
    keyMaker: ReturnType<typeof createKeyMaker>;
    scope: ReturnType<typeof createScope>;
}): TStyleSheetMaker => {
    const settings = provider.settings;
    const nextVars: IStyleProvider['settings']['vars'] = settings?.vars;
    const { varName } = scope(keyMaker.base);
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
    const size = provider.size;
    const time = provider.time;
    const angle = provider.angle;
    const {l, c, h} = settings.palette as TPaletteConfig;
    const coef = settings.coef as TCoefConfig;
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
    return ({ bem, each, when, vars, merge, at: { media }, units: {px, ms, deg} }) => {
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
                    each(variants, (mediaKey, mediaCond) => media.and(mediaCond)(
                        merge(
                            themeVars[mediaKey] || {},
                            each(tokens, (k, v) => ({
                                [varName(PALETTE, 'l', 'bg', v)]: l[mediaKey].bg[v],
                                [varName(PALETTE, 'l', 'fg', v)]: l[mediaKey].fg[v],
                            })),
                            each(ctokens, (k, v) => ({
                                [varName(PALETTE, 'c', 'bg', v)]: c[mediaKey].bg[v],
                                [varName(PALETTE, 'c', 'fg', v)]: c[mediaKey].fg[v],
                            }))
                        ))
                    )
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
};
    
const getHandlers = ({
    scope,
    keyMaker,
    collector,
    manager,
    processor
}: {
    scope: ReturnType<typeof createScope>;
    keyMaker: ReturnType<typeof createKeyMaker>;
    collector: ReturnType<typeof createCollector>;
    manager: TManager;
    processor: ReturnType<typeof createProcessor>;
}): Pick<IStyleProvider,'key' | 'use' | 'usePublic' | 'usePrivate' | 'css' | 'resolve' | 'status' | 'on' | 'off' | 'stylesheets'> => {
    const key: IStyleProvider['key'] = (param) => (typeof param === 'string' ? param : collector.getKey(param));
    const resolve: IStyleProvider['resolve'] = (key) => scope(key || keyMaker.base).attr;
    const css: IStyleProvider['css'] = (maker, key) =>
        processor.compile({
            key,
            maker
        });
    const use: IStyleProvider['use'] = (maker, key, force) => {
        const styleSheetKey = key || keyMaker.current;
        let k = collector.use(maker, styleSheetKey);
        if (force || manager && !manager.has(k)) {
            manager.pack(k, manager.hydrate(k) || css(maker, k));
            if (!key) keyMaker.next();
        }
        return resolve(k);
    };
    const usePublic: IStyleProvider['usePublic'] = (styles) =>
        fromEntries(entries(styles).map(([key, maker]) => [key, use(maker, key)]));
    const usePrivate: IStyleProvider['usePrivate'] = (styles) => styles.map((maker) => use(maker));
    const status: IStyleProvider['status'] = (target) => {
        const source = key(target);
        return !!source && manager.status(source);
    };
    const on: IStyleProvider['on'] = (...params) => manager.on(...params.map(key));
    const off: IStyleProvider['off'] = (...params) => manager.off(...params.map(key));
    const stylesheets: IStyleProvider['stylesheets'] = (...targets) => {
        let clearTargets: TStyleTarget[];
        if (!targets.length) clearTargets = collector.keys;
        else if (targets.length === 1 && Array.isArray(targets[0])) clearTargets = targets[0];
        else clearTargets = targets as TStyleTarget[];
        return clearTargets.map((target) => manager.get(key(target)));
    };
    return {
        // maker handlers
        key,
        resolve,
        use,
        usePublic,
        usePrivate,
        css,
        // stylesheet handlers
        status,
        on,
        off,
        stylesheets
    };
}

const defineAttrHandlers = (host: {
    getAttribute(qualifiedName: string): string | null;
    removeAttribute(name: string): void;
    setAttribute(name: string, value: string): void
}) => Object.defineProperties(host, {
    prefix: {
        get(): string {
            return host.getAttribute('prefix') || 'f';
        }
    },
    mode: {
        get() {
            return host.getAttribute('mode') || 'a';
        }
    },
    min: {
        get() {
            return host.getAttribute('min') === '';
        }
    },
    hydrate: {
        get() {
            return host.getAttribute('hydrate') === '';
        }
    },
    theme: {
        set(val: string) {
            setAttr(host, THEME_ATTR, val);
        },
        get() {
            return getAttr(host, THEME_ATTR) || '';
        }
    },
    size: {
        set(val: number | null) {
            setAttr(host, SIZE_ATTR, val);
        },
        get() {
            return getNumAttr(host, SIZE_ATTR);
        }
    },
    time: {
        set(val: number | null) {
            setAttr(host, TIME_ATTR, val);
        },
        get() {
            return getNumAttr(host, TIME_ATTR);
        }
    },
    angle: {
        set(val: number | null) {
            setAttr(host, ANGLE_ATTR, val);
        },
        get() {
            return getNumAttr(host, ANGLE_ATTR);
        }
    },
})

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

    get tagName(): string;
    /**
     * Get prefix
     */
    get prefix(): string;
    /**
     * Get mode
     */
    get mode(): string;
    /**
     * Get min flag
     */
    get min(): boolean;
    /**
     * Get hydrate flag
     * @deprecated The flag will be removed in v4
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
    set settings(val: Partial<TProviderSettings>);

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
    stylesheets(...targets: TStyleTarget[]): (CSSStyleSheet | undefined)[];
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
type TUseStylePropviderParams = Partial<TProviderSettings & {
    attrs?: Partial<TProviderAttrParams>;
    /**
     * Don`t send provider script tag from server-side 
     */
    noscript?: boolean;
    /**
     * Create Style Provider emulation
     */
    emulate?: boolean;
}>;
type TUseStyleProvider = {
    (settings?: TUseStylePropviderParams): IStyleProvider;
    isDefined?: boolean;
}

/**
 * Define style provider custom element
 */
export function defineProvider(settings: Partial<TProviderSettings> = {}): boolean {
    const doc = globalThis.document;
    const custom = globalThis.customElements;
    if (custom?.get(TAG_NAME)) return false;
    else {
        class StyleProvider extends HTMLScriptElement implements IStyleProvider {
            static get observedAttributes() {
                return [SIZE_ATTR, TIME_ATTR, ANGLE_ATTR];
            }

            prefix: IStyleProvider['prefix'];
            hydrate: IStyleProvider['hydrate'];
            mode: IStyleProvider['mode'];
            min: IStyleProvider['min'];
            theme: IStyleProvider['theme'];
            size: IStyleProvider['size'];
            angle: IStyleProvider['angle'];
            time: IStyleProvider['time'];
            serverSettings?: IStyleProvider['settings'];

            /**
             * Collector
             */
            protected _c: ReturnType<typeof createCollector> = createCollector();
            /**
             * Manager
             */
            protected _m: ReturnType<typeof createManager>;
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

            get settings(): IStyleProvider['settings'] {
                return this._settings;
            }

            set settings(val: Partial<TProviderSettings>) {
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

            protected _cust = () => {
                // create init stylesheet maker
                this._ = createGlobalMaker({
                    scope: this._s,
                    keyMaker: this._k,
                    provider: this
                });
                // apply maker
                this.use(this._, this._k.base, true);
            };

            attributeChangedCallback() {
                if (this._k as ReturnType<typeof createKeyMaker> | undefined) this._cust();
            }

            connectedCallback() {
                // apply settings
                if (this.textContent) this._settings = merge(this._settings, JSON.parse(this.textContent));
                else if (settings) this._settings = merge(this._settings, settings);
                defineAttrHandlers(this);
                const dict = doc.querySelector(`script[${EFFCSS_ATTR_SCOPE}]`)?.textContent;
                this._k = createKeyMaker({ prefix: this.prefix });
                this._s = createScope({
                    mode: this.mode,
                    min: this.min,
                    dict: dict && JSON.parse(dict)
                });
                this._p = createProcessor({
                    scope: this._s,
                    globalKey: this._k.base,
                    bp: settings.bp || this.settings.bp
                });
                this._m = createManager(doc.querySelectorAll(`style[${EFFCSS_ATTR}]`));
                const handlers = getHandlers({
                    scope: this._s,
                    processor: this._p,
                    keyMaker: this._k,
                    manager: this._m,
                    collector: this._c
                });
                Object.assign(this, handlers);
                this._cust();
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
            }

            // maker handlers

            use: IStyleProvider['use'];
            usePublic: IStyleProvider['usePublic'];
            usePrivate: IStyleProvider['usePrivate'];
            resolve: IStyleProvider['resolve'];
            css: IStyleProvider['css'];
            key: IStyleProvider['key'];

            // stylesheet handlers

            status: IStyleProvider['status'];
            on: IStyleProvider['on'];
            off: IStyleProvider['off'];
            stylesheets: IStyleProvider['stylesheets'];

            toString() {
                const attrs = [...this.attributes]
                    .map((attr) => (attr.value ? `${attr.name}="${attr.value}"` : attr.value === '' ? attr.name : ''))
                    .filter(Boolean)
                    .join(' ');
                return `<${SCRIPT} ${attrs}>${this.textContent}</${SCRIPT}>`;
            }
        }
        custom.define(TAG_NAME, StyleProvider, { extends: SCRIPT });
        return true;
    }
}

const emulateProvider = (settings: TUseStylePropviderParams = {}): IStyleProvider => {
    let {
        noscript,
        attrs = {},
        ...restSettings
    } = settings;
    const mergedSettings = merge(DEFAULT_SETTINGS, restSettings)
    let {
        mode = DEFAULT_ATTRS.mode, min, prefix = DEFAULT_ATTRS.prefix,
        theme, hydrate,
        size, time, angle
    } = attrs;
    const keyMaker = createKeyMaker({ prefix });
    const scope = createScope({
        mode,
        min
    });
    const processor = createProcessor({
        scope,
        globalKey: keyMaker.base,
        bp: mergedSettings.bp
    });
    const collector = createCollector();

    const styleSheetsDict: Record<string, TServerStyleSheet> = {};
    const activeStyleSheets: TServerStyleSheet[] = [];
    const getIndex = (styleSheet: object) => activeStyleSheets.findIndex((item) => item === styleSheet);
    const manager: TManager = {
        hydrate(key) {
            return undefined;
        },
        get(key?: string) {
            return key ? styleSheetsDict[key] as unknown as CSSStyleSheet : undefined;
        },
        pack(key: string, styles: string) {
            const styleSheet = styleSheetsDict[key] || {key, styles};
            if (!styleSheetsDict[key]) {
                styleSheetsDict[key] = styleSheet;
                activeStyleSheets.push(styleSheet);
                return true;
            }
        },
        has(key?: string) {
            return !!key && !!this.get(key);
        },
        status(key?: string) {
            const styleSheet = this.get(key);
            return !!styleSheet && getIndex(styleSheet) !== -1;
        },
        on(...targets: (string | undefined)[]) {
            return targets.reduce((acc, key) => {
                const styleSheet = this.get(key);
                if (styleSheet && !this.status(key)) {
                    activeStyleSheets.push(styleSheet as unknown as TServerStyleSheet);
                    return acc;
                }
                return false;
            }, true);
        },
        off(...targets: (string | undefined)[]) {
            return targets.reduce((acc, key) => {
                const styleSheet = this.get(key);
                if (styleSheet && this.status(key)) {
                    const index = getIndex(styleSheet);
                    activeStyleSheets.splice(index, 1);
                    return acc;
                }
                return false;
            }, true);
        }
    };
    const handlers = getHandlers({
        scope,
        processor,
        keyMaker,
        manager,
        collector
    });
    const emulation = {
        tagName: '',
        attributes: {
            prefix, mode, hydrate, min, theme,
            size, time, angle
        } as Record<string, string | boolean | undefined>,
        getAttribute(name: string) {
            const val = this.attributes[name];
            return val ? isBoolean(val) ? '' : val : null;
        },
        setAttribute(name: string, val: string) {
            this.attributes[name] = val;
        },
        removeAttribute(name: string) {
            delete this.attributes[name];
        },
        get makers() {
            return collector.makers;
        },
        get settings() {
            return mergedSettings;
        },
        set settings(val) {
            return;
        },
        ...handlers,
        toString() {
            const cssContent = [{
                key: keyMaker.base,
                styles: handlers.css(createGlobalMaker({
                    scope,
                    keyMaker,
                    provider: this as unknown as IStyleProvider
                }) as TStyleSheetMaker, keyMaker.base)
            }, ...activeStyleSheets].map(({key, styles}) => `<style ${EFFCSS_ATTR}="${key}">${styles}</style>`).join('');
            if (noscript) return cssContent;
            const scopeContent = min && collector.keys.length > 1 ? `<${SCRIPT} ${EFFCSS_ATTR_SCOPE} type="${APP_JSON}">${JSON.stringify(scope.dict)}</${SCRIPT}>` : '';
            const textContent = Object.keys(restSettings).length ? JSON.stringify(restSettings) : '';
            const attrs = Object.entries({
                is: TAG_NAME,
                type: APP_JSON,
                ...this.attributes,
            }).map(([name, value]) => value && value !== DEFAULT_ATTRS[name] ? (isBoolean(value) ? name :  `${name}="${value}"`) : '')
                .filter(Boolean)
                .join(' ');
            return cssContent + scopeContent + `<${SCRIPT} ${attrs}>${textContent}</${SCRIPT}>`;
        }
    };
    return defineAttrHandlers(emulation) as unknown as IStyleProvider;
};

/**
 * Use Style Provider
 * @description
 * The function defines and creates a provider script in the browser and emulates the provider on the server.
 * @param settings - provider settings
 */
export const useStyleProvider: TUseStyleProvider = (params = {}) => {
    const {emulate, ...settings} = params;
    const document = globalThis?.document;
    if (document && !emulate) {
        if (useStyleProvider.isDefined === undefined) useStyleProvider.isDefined = defineProvider(settings);
        const provider: IStyleProvider = document.querySelector(
            SCRIPT + `[is=${TAG_NAME}]`
        ) as unknown as IStyleProvider;
        if (provider) return provider;
        const script = document.createElement(SCRIPT, {
            is: TAG_NAME
        })
        script.setAttribute('is', TAG_NAME);
        const attrs = settings?.attrs;
        if (attrs) Object.entries(attrs).map(([k,v]) => v && DEFAULT_ATTRS[k] !== v && script.setAttribute(k, isBoolean(v) ? '' : v + ''));
        document.head.appendChild(script);
        return script as unknown as IStyleProvider;
    }
    return emulateProvider(settings);
};
