
// types
import type { IMakerParams, TProcessor } from './_provider/process';
import type { TManager } from './_provider/manage';
import type { TCollector } from './_provider/collect';
import type { TScope, TScopeResolver } from './_provider/scope';
import type { TThemeController } from './_provider/theme';
// functions
import { createProcessor } from './_provider/process';
import { createManager } from './_provider/manage';
import { createCollector } from './_provider/collect';
import { createScope } from './_provider/scope';
import { createThemeController } from './_provider/theme';


/**
 * Provider attributes
 */
export type TProviderAttrs = {
    /**
     * Stylesheet key prefix
     */
    pre: string;
    /**
     * BEM selector generation mode
     * @description
     * `a` - data-attributes
     * `c` - classes
     */
    mode: 'a' | 'c';
    /**
     * BEM selectors minification
     */
    min: boolean;
    /**
     * Root font size in px
     */
    size: number;
    /**
     * Root time in ms
     */
    time: number;
    /**
     * Root angle in deg
     */
    angle: number;
};
type TAttrKeys = keyof TProviderAttrs;
type TManagerLite = Pick<TManager, 'pack' | 'status' | 'on' | 'off' | 'get' | 'hydrate' | 'all'>;
type TResolveAttr = ReturnType<TScopeResolver>['attr'];
/**
 * StyleSheet maker
 */
export type TStyleSheetMaker = Parameters<TProcessor['compile']>[0]['maker'];
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
     * Provider tag name
     */
    get tagName(): string;
    /**
     * Get prefix
     */
    get pre(): string;
    /**
     * Get mode
     */
    get mode(): string;
    /**
     * Get min flag
     */
    get min(): boolean;
    /**
     * Get stylesheet makers
     */
    get makers(): TCollector['makers']

    // global var controls

    /**
     * Theme controller
     */
    theme: TThemeController;

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

    // makers handlers

    /**
     * Use stylesheet makers
     * @param makers - stylesheet makers
     */
    use: (...makers: TStyleSheetMaker[]) => TResolveAttr[];
    /**
     * Remake stylesheet
     * @param maker - stylesheet maker
     * @param original - original maker
     */
    remake(maker: TStyleSheetMaker, original?: TStyleSheetMaker): TResolveAttr;
    /**
     * Prepare CSS from config
     * @param maker - stylesheet maker
     * @param key - stylesheet key
     */
    css(maker: TStyleSheetMaker, key: string): string;

    // stylesheet handlers

    /**
     * Is stylesheet on
     * @param key - stylesheet key
     */
    status(key: TStyleTarget): boolean;
    /**
     * Switch stylesheets on
     * @param targets - target stylesheet maker or key
     */
    on(...targets: TStyleTarget[]): void;
    /**
     * Switch stylesheets off
     * @param targets - target stylesheet maker or key
     */
    off(...targets: TStyleTarget[]): void;
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

export type TBaseStyleSheetMaker = {
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
export type IStyleProviderScript = IStyleProvider & HTMLScriptElement;
type TUseStylePropviderParams = {
    attrs?: Partial<TProviderAttrs>;
    /**
     * Don`t send provider script tag from server-side 
     */
    noscript?: boolean;
    /**
     * Create Style Provider emulation
     */
    emulate?: boolean;
};
type TUseStyleProvider = {
    (settings?: TUseStylePropviderParams): IStyleProvider;
    isDefined?: boolean;
}

type TAttrsHandlers = {
    getAttribute(name: string): string | null;
    removeAttribute(name: string): void;
    setAttribute(name: string, value: string): void
}

// constants
const LIBRARY = 'effcss';
export const TAG_NAME = LIBRARY + '-provider';
const SCRIPT = 'script';
const STYLE = 'style';
const THEME_ATTR = 'theme';
const SIZE_ATTR = 'size';
const TIME_ATTR = 'time';
const ANGLE_ATTR = 'angle';
const EVENT_NAME = LIBRARY + 'changes';
const EFFCSS_ATTR = 'data-' + LIBRARY;
const APP_JSON = 'application/json';
const PREFERS_COLOR_SCHEME = 'prefers-color-scheme';
const LIGHT = `${PREFERS_COLOR_SCHEME}: light`;
const DARK = `${PREFERS_COLOR_SCHEME}: dark`;
export const DEFAULT_ATTRS: Record<string, string> = {
    mode: 'a',
    pre: 'f',
};

// utils
const isBoolean = (val: any) => typeof val === 'boolean';
const numOrNull = (val: string | null | undefined) => typeof val === 'string' ? Number(val) : null;
const getAttr = (self: {
    getAttribute(qualifiedName: string): string | null;
}, name: keyof TProviderAttrs) => self.getAttribute(name) || DEFAULT_ATTRS[name];
const getNumAttr = (self: {
    getAttribute(qualifiedName: string): string | null;
}, name: keyof TProviderAttrs) => {
    const val = getAttr(self, name);
    return numOrNull(val);
};
const setAttr = (self: TAttrsHandlers, name: string, val: string | number | null) => val === null ? self.removeAttribute(name) : self.setAttribute(name, val + '');
const getAttrSelector = (attr?: string) => `:root:has([is=${TAG_NAME}]${attr ? `[${attr}]` : ''})`;

const createGlobalMaker = ({
    theme, attrs, scope
}: {
    theme: TThemeController;
    attrs: {
        size: number | null;
        time: number | null;
        angle: number | null;
    };
    scope: TScope;
}): TStyleSheetMaker => {
    return ({ bem, each, themeVar, merge, pseudo: {r}, at: { media }, units: {px} }) => {
        // manual setted attributes
        const size = attrs.size;
        const time = attrs.time;
        const angle = attrs.angle;
        const {$dark = {}, $light = {}, ...root} = theme.vars();
        return merge(
            {
                [getAttrSelector()]: {
                    ...root,
                    ...media.where(LIGHT)($light),
                    ...media.where(DARK)($dark),
                    [r()]: {
                        fontSize: px(themeVar('size'))
                    },
                },
            },
            // custom theme
            each(theme.list, (k, v) => {
                const {$dark = {}, $light = {}, ...other} = theme.vars(v);
                const value = {
                    ...other,
                    ...media.where(LIGHT)($light),
                    ...media.where(DARK)($dark)
                };
                return {
                    [getAttrSelector(`${THEME_ATTR}=${k}`)]: value,
                    // multiple theme
                    [bem<TBaseStyleSheetMaker>(`..theme.${k}`)]: value
                }
            }),
            size && {
                [getAttrSelector(SIZE_ATTR)]: {
                    [scope.varName('size')]: size
                }
            },
            time && {
                [getAttrSelector(TIME_ATTR)]: {
                    [scope.varName('time')]: time
                }
            },
            angle && {
                [getAttrSelector(ANGLE_ATTR)]: {
                    [scope.varName('angle')]: angle
                }
            }
        );
    };
};
    
const getHandlers = ({
    scope,
    collector,
    manager,
    processor,
    globalMaker
}: {
    scope: TScopeResolver;
    collector: TCollector;
    manager: TManagerLite;
    processor: TProcessor;
    globalMaker: TStyleSheetMaker;
}): Pick<IStyleProvider,'use' | 'remake' | 'css' | 'status' | 'on' | 'off' | 'stylesheets'> => {
    const key = (param: TStyleTarget) => (typeof param === 'string' ? param : collector.key(param));
    const resolve = (key: string) => scope(key || collector.key()).attr;
    const css: IStyleProvider['css'] = (maker, key) =>
        processor.compile({
            key,
            maker
        });
    const useSingle = (maker: TStyleSheetMaker) => {
        let k = collector.use(maker);
        if (manager && !manager.get(k)) {
            manager.pack(k, manager.hydrate(k) || css(maker, k));
        }
        return resolve(k);
    };
    
    const use: IStyleProvider['use'] = (...styles: TStyleSheetMaker[]) => {
        if (styles.length === 0) return [useSingle(globalMaker)];
        return styles.map((maker) => useSingle(maker));
    };
    const remake: IStyleProvider['remake'] = (maker, original) => {
        let k = collector.key(original || maker);
        if (manager && manager.get(k)) {
            if (original) collector.remake(maker, original);
            manager.pack(k, manager.hydrate(k) || css(maker, k));
            return resolve(k);
        }
        return use(maker)[0];
    };
    const status: IStyleProvider['status'] = (target) => {
        const source = key(target);
        return !!source && manager.status(source);
    };
    const on: IStyleProvider['on'] = (...params) => manager.on(...params.map(key));
    const off: IStyleProvider['off'] = (...params) => manager.off(...params.map(key));
    const stylesheets: IStyleProvider['stylesheets'] = (targets = collector.keys) => targets.map((target) => manager.get(key(target)));
    return {
        // maker handlers
        use,
        remake,
        css,
        // stylesheet handlers
        status,
        on,
        off,
        stylesheets
    };
}

const construct = (host: IStyleProvider & TAttrsHandlers & {textContent: string | null;}, {
    initStyles,
    emulate,
    onChange,
    globalMaker,
    noscript
}: {
    initStyles?: {
        dataset?: {
            effcss?: string;
        };
        disabled: boolean;
        textContent: string | null;
    }[];
    emulate?: boolean;
    onChange: () => void;
    globalMaker: TStyleSheetMaker;
    noscript?: boolean;
}) => {
    let params;
    if (host.textContent) params = JSON.parse(host.textContent);
    Object.defineProperties(host, {
        pre: {
            get(): string {
                return host.getAttribute('pre') || 'f';
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
    });
    const collector = createCollector({ prefix: host.pre });
    const scope = createScope({
        mode: host.mode,
        min: host.min,
        dict: params?.dict
    });
    const globalScope = scope(collector.key());
    const processor = createProcessor({
        scope,
        globalKey: collector.key()
    });
    const manager = createManager({initStyles, emulate});
    host.theme = createThemeController({
        provider: host,
        init: params?.theme,
        onChange,
        scope: globalScope
    });
    const handlers = getHandlers({
        scope,
        processor,
        manager,
        collector,
        globalMaker
    });
    Object.defineProperties(host, {
        _c: {
            value: collector
        },
        _s: {
            value: scope
        },
        _p: {
            value: processor
        },
        _m: {
            value: manager
        },
        toString: {
            value: () => {
                const styleSheetsDict = {...manager.all()};
                const cssContent = Object.entries(styleSheetsDict).filter(([k, v]) => !v.disabled).map(([k, v]) => `<style ${EFFCSS_ATTR}="${k}">${[...v.cssRules].map(rule => rule.cssText).join('')}</style>`).join('');
                let tag = STYLE;
                let textContent = '';
                const attrs: Record<string, string | number | boolean | undefined | null> = {
                    is: TAG_NAME,
                    min: host.getAttribute('min'),
                    mode: host.getAttribute('mode'),
                    size: host.getAttribute('size'),
                    time: host.getAttribute('time'),
                    angle: host.getAttribute('angle')
                };
                if (!noscript) {
                    tag = SCRIPT;
                    attrs.type = APP_JSON;
                    const params: {
                        theme: TThemeController['actions'];
                        dict?: Record<string, object>;
                    } = {
                        theme: host.theme.actions
                    };
                    if (host.min && collector.keys.length > 1) params.dict = scope.dict;
                    textContent = JSON.stringify(params);
                }
                const attrsContent = Object.entries(attrs).map(([name, value]) => value !== null && value !== undefined && value !== DEFAULT_ATTRS[name] ? (value === '' ? name :  `${name}="${value}"`) : '')
                    .filter(Boolean)
                    .join(' ');
                return cssContent + `<${tag} ${attrsContent}${host.theme.current ? ` theme="${host.theme.current}"` : ''}>${textContent}</${tag}>`;
            }
        }
    });
    Object.assign(host, handlers);
}

/**
 * Define style provider custom element
 */
function defineProvider(): boolean {
    const doc = globalThis.document;
    const custom = globalThis.customElements;
    if (custom?.get(TAG_NAME)) return false;
    else {
        class StyleProvider extends HTMLScriptElement implements IStyleProvider {
            static get observedAttributes() {
                return [SIZE_ATTR, TIME_ATTR, ANGLE_ATTR];
            }

            theme: IStyleProvider['theme'];
            pre: IStyleProvider['pre'];
            mode: IStyleProvider['mode'];
            min: IStyleProvider['min'];
            size: IStyleProvider['size'];
            angle: IStyleProvider['angle'];
            time: IStyleProvider['time'];

            // maker handlers

            use: IStyleProvider['use'];
            remake: IStyleProvider['remake'];
            css: IStyleProvider['css'];
            get makers() {
                return this._c.makers;
            }

            // stylesheet handlers

            status: IStyleProvider['status'];
            on: IStyleProvider['on'];
            off: IStyleProvider['off'];
            stylesheets: IStyleProvider['stylesheets'];

            // protected

            /**
             * Collector
             */
            protected _c: TCollector;
            /**
             * Manager
             */
            protected _m: TManager;
            /**
             * Scope resolver
             */
            protected _s: TScopeResolver;
            /**
             * Processor
             */
            protected _p: TProcessor;
            /**
             * Base stylesheet maker
             */
            protected _: TStyleSheetMaker;
            /**
             * Notifier
             */
            protected _n: {
                set adoptedStyleSheets(styles: CSSStyleSheet[]);
            };

            protected _customize = () => {
                const size = this.size;
                const time = this.time;
                const angle = this.angle;
                // create init stylesheet maker
                const next = createGlobalMaker({
                    theme: this.theme,
                    attrs: {
                        size,
                        time,
                        angle
                    },
                    scope: this._s(this._c.key())
                });
                // apply maker
                this.remake(next, this._);
                this._ = next;
            };

            attributeChangedCallback() {
                if (this.isConnected) this._customize();
            }

            connectedCallback() {
                construct(this, {
                    initStyles: [...doc.querySelectorAll(STYLE + `[${EFFCSS_ATTR}]`)] as unknown as  {
                        dataset?: {
                            effcss?: string;
                        };
                        disabled: boolean;
                        textContent: string | null;
                    }[],
                    onChange: this._customize,
                    globalMaker: this._
                });
                this._customize();
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
        }
        custom.define(TAG_NAME, StyleProvider, { extends: SCRIPT });
        return true;
    }
}

const emulateProvider = (settings: TUseStylePropviderParams = {}): IStyleProvider => {
    let {
        noscript,
        attrs = {}
    } = settings;
    let {
        mode = DEFAULT_ATTRS.mode, min, pre = DEFAULT_ATTRS.prefix,
        size = null, time = null, angle = null
    } = attrs;
    class StyleProviderEmulation implements IStyleProvider {
        get tagName(): string {
            return '';
        }
        get textContent(): string {
            return '';
        }
        attributes = {
            size: size ? size + '' : null,
            time: time ? time + '' : null,
            angle: angle ? angle + '' : null,
            pre,
            mode,
            min: min ? '' : null
        };

        getAttribute(name: TAttrKeys) {
            const val = this.attributes[name];
            return val !== undefined && val !== null ? isBoolean(val) ? '' : (val + '') : null;
        }
        setAttribute(name: TAttrKeys, val: string) {
            this.attributes[name] = (val + '');
            if (name === SIZE_ATTR || name === TIME_ATTR || name === ANGLE_ATTR) this._customize();
        }
        removeAttribute(name: keyof typeof this.attributes) {
            delete this.attributes[name];
        }

        // properties

        theme: IStyleProvider['theme'];
        pre: IStyleProvider['pre'];
        mode: IStyleProvider['mode'];
        min: IStyleProvider['min'];
        size: IStyleProvider['size'];
        angle: IStyleProvider['angle'];
        time: IStyleProvider['time'];

        // maker handlers

        use: IStyleProvider['use'];
        remake: IStyleProvider['remake'];
        css: IStyleProvider['css'];
        get makers() {
            return this._c.makers;
        }

        // stylesheet handlers

        status: IStyleProvider['status'];
        on: IStyleProvider['on'];
        off: IStyleProvider['off'];
        stylesheets: IStyleProvider['stylesheets'];

        /**
         * Collector
         */
        protected _c: TCollector;
        /**
         * Manager
         */
        protected _m: TManager;
        /**
         * Scope resolver
         */
        protected _s: TScopeResolver;
        /**
         * Processor
         */
        protected _p: TProcessor;
        /**
         * Base stylesheet maker
         */
        protected _: TStyleSheetMaker;
        /**
         * Notifier
         */
        protected _n: {
            set adoptedStyleSheets(styles: CSSStyleSheet[]);
        };

        protected _customize = () => {
            const size = this.size;
            const time = this.time;
            const angle = this.angle;
            // create init stylesheet maker
            const next = createGlobalMaker({
                theme: this.theme,
                attrs: {
                    size,
                    time,
                    angle
                },
                scope: this._s(this._c.key())
            });
            // apply maker
            this.remake(next, this._);
            this._ = next;
        };

        constructor() {
            construct(this, {
                emulate: true,
                onChange: this._customize,
                globalMaker: this._,
                noscript
            });
            this._customize();
        }
    }
    return new StyleProviderEmulation() as unknown as IStyleProvider;
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
        if (useStyleProvider.isDefined === undefined) useStyleProvider.isDefined = defineProvider();
        const provider: IStyleProvider = document.querySelector(`[is=${TAG_NAME}]`) as unknown as IStyleProvider;
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
