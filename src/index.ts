
// types
import type { TProcessor } from './_provider/process';
import type { TManager } from './_provider/manage';
import type { TCollector } from './_provider/collect';
import type { TDeepPartial } from './_provider/scope';
import type { TDetails, TScope, TScopeResolver, TStyles } from './_provider/scope';
import type { TThemeController } from './_provider/theme';
export type {
    TShortRange,
    TMainRange,
    TBaseRange,
    TLongRange,
    TFullRange,
    TSparseRange
} from './_provider/_process/coef';
export type {
    TPaletteHue,
    TPaletteChroma,
    TPaletteLightness,
    TPaletteMode
} from './_provider/_process/palette';
export type { TDetails };
// functions
import { createProcessor } from './_provider/process';
import { createManager } from './_provider/manage';
import { createCollector } from './_provider/collect';
import { createScope } from './_provider/scope';
import { createThemeController } from './_provider/theme';

/**
 * EffCSS core attributes
 */
type TAttrs = {
    /**
     * Root font size in px
     */
    size: TNumberAttr;
    /**
     * Root space variable in px
     */
    space: TNumberAttr;
    /**
     * Root radius variable in px
     */
    radius: TNumberAttr;
    /**
     * Root time in ms
     */
    time: TNumberAttr;
    /**
     * Root angle in deg
     */
    angle: TNumberAttr;
    /**
     * Root color
     */
    color: TStringAttr;
    /**
     * Root easing function
     */
    easing: TStringAttr;
    /**
     * Root contrast color
     */
    contrast: TStringAttr;
    /**
     * Root neutral color
     */
    neutral: TStringAttr;
    /**
     * Sans-serif font family
     */
    sans: TStringAttr;
    /**
     * Serif font family
     */
    serif: TStringAttr;
    /**
     * Monospace font family
     */
    mono: TStringAttr;
};
/**
 * Provider attributes
 */
export type TProviderAttrs = {
    /**
     * Stylesheet key prefix
     */
    pre: string;
    /**
     * Scoped selector generation mode
     * @description
     * `a` - data-attributes
     * `c` - classes
     * @deprecated
     * Will be deleted in the next major version.
     * Use `dx` and `cx` methods to to explicitly create selectors in form of data attributes or classnames respectively
     */
    mode: 'a' | 'c';
    /**
     * Scoped selectors minification
     */
    min: boolean;
    /**
     * Color scheme
     */
    scheme: 'light' | 'dark';
} & TAttrs;
/**
 * Override element attributes
 */
export type TOverrideAttrs = {
    /**
     * EffCSS variable values encoded string
     */
    values: string;
    /**
     * Color-scheme
     */
    scheme: 'light' | 'dark';
} & TAttrs;
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
 * Describe mono block styles
 */
export type TMonoBlock<TStyle extends object> = {
    '': TStyle;
};
/**
 * Describe mono element styles (Atomic CSS)
 */
export type TMonoElement<TStyle extends object> = {
    '': {
        '': TStyle;
    }
};
/**
 * Style target
 */
type TStyleTarget = string | TStyleSheetMaker;
type TNumberAttr = number[] | number | null;
type TStringAttr = string[] | string | null;

/**
 * Classname expression
 */
type CX = {
    /**
     * Resolve classnames
     * @param maker - stylesheet maker
     * @param details - design details
     */
    <T extends TStyles>(maker: TStyleSheetMaker, details: TDetails<T>): string;
    /**
     * Join expressions
     * @param args - arguments
     */
    join(...args: (string | false | null | undefined)[]): string;
};
/**
 * Data attribute expression
 */
type DX = {
    /**
     * Resolve data attributes
     * @param maker - stylesheet maker
     * @param details - design details
     */
    <T extends TStyles>(maker: TStyleSheetMaker, details: TDetails<T>): Record<string, string>;
    /**
     * Join expressions
     * @param args - arguments
     */
    join(...args: (Record<string, string> | false | null | undefined)[]): Record<string, string>;
};
/**
 * Style provider
 * @description
 * Basic interface for style provider component.
 */
export interface IStyleProvider extends TAttrs {
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
    css(maker: TStyleSheetMaker, key: string, mode?: 'a' | 'c'): string;
    /**
     * Classnames expression resolver
     */
    cx: CX;
    /**
     * Data attributes expression resolver
     */
    dx: DX;
    /**
     * Tune stylesheet
     * @param maker - stylesheet maker
     * @param tunings - tunings object
     */
    tune<T extends object>(tunings: TDeepPartial<T>, maker?: TStyleSheetMaker): object;

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
    /**
     * Use as global object
     */
    global?: boolean;
};
type TGlobalThisWithProvider = typeof globalThis & {
    [PROVIDER_SYMBOL]?: IStyleProvider;
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
type THost = IStyleProvider & TAttrsHandlers & {textContent: string | null;};

// constants
const LIBRARY = 'effcss';
export const TAG_NAME = LIBRARY + '-provider';
export const TAG_NAME_OVERRIDE = LIBRARY + '-override';
const VALUES = 'values';
const HOST = ':host';
const DIS_CON = 'display:contents;';
const MEDIA = '@media';
const SCRIPT = 'script';
const STYLE = 'style';
const THEME_ATTR = 'theme';
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
const PROVIDER_SYMBOL = Symbol(TAG_NAME);
const CUST_NUM_ATTRS = [
    'size', 'space', 'radius', 'angle', 'time'
] as const;
const CUST_STRING_ATTRS = [
    'easing', 'color', 'contrast', 'neutral', 'sans', 'serif', 'mono'
] as const;
const CUST_ATTRS = [
    ...CUST_NUM_ATTRS,
    ...CUST_STRING_ATTRS
] as const;
const CUST_ATTRS_SET = new Set(CUST_ATTRS);

const ATTR_VAL_SEPARATOR = ';';
// utils
const isBoolean = (val: any) => typeof val === 'boolean';
const numOrNull = (val: TStringAttr | undefined) => typeof val === 'string' ? Number(val) : null;
const getAttr = (self: {
    getAttribute(qualifiedName: string): string | null;
}, name: keyof TProviderAttrs) => self.getAttribute(name) || DEFAULT_ATTRS[name];
const getNumAttr = (self: {
    getAttribute(qualifiedName: string): string | null;
}, name: keyof TProviderAttrs) => {
    const val = getAttr(self, name);
    if (!val) return numOrNull(val);
    const arr = val.split(ATTR_VAL_SEPARATOR);
    return arr.length > 1 ? arr.map(numOrNull) : numOrNull(val);
};
const setAttr = (self: TAttrsHandlers, name: string, val: TNumberAttr | TStringAttr) => val === null ? self.removeAttribute(name) : self.setAttribute(name, Array.isArray(val) ? val.join(ATTR_VAL_SEPARATOR) : val + '');
const getAttrSelector = (attr?: string) => `:root:has([is=${TAG_NAME}]${attr ? `[${attr}]` : ''})`;
const plainVars = (vars: object) => Object.entries(vars).reduce((acc, [p,v]) => acc + p + ':' + v + ';', '');
const posVal = (prefix: string, ind: number) => prefix + (+ind ? '-' + ind : '');

const createGlobalMaker = ({
    theme, attrs, scope
}: {
    theme: TThemeController;
    attrs: TAttrs;
    scope: TScope;
}): TStyleSheetMaker => {
    return ({ bem, each, themeVar, merge, pseudo: {r}, at: { media }, units: {px} }) => {
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
                [getAttrSelector('scheme=light')]: {
                    colorScheme: 'light',
                    ...$light
                },
                [getAttrSelector('scheme=dark')]: {
                    colorScheme: 'dark',
                    ...$dark
                }
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
            ...CUST_ATTRS.map((name) => {
                const val = attrs[name];
                return val && (
                    {
                        [getAttrSelector(name)]: each(
                            Array.isArray(val) ? val : [val], (ind, curVal) => ({
                                [scope.varName(posVal(name, +ind))]: curVal
                        }))
                    }
                );
            })
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
}): Pick<IStyleProvider,'use' | 'remake' | 'css' | 'cx' | 'dx' | 'tune' | 'status' | 'on' | 'off' | 'stylesheets'> => {
    const key = (param: TStyleTarget) => (typeof param === 'string' ? param : collector.key(param));
    const resolve = (key: string, mode?: 'a' | 'c') => scope(key || collector.key(), mode).attr;
    const css: IStyleProvider['css'] = (maker, key, mode) =>
        processor.compile({
            key,
            maker,
            mode
        });
    const useSingle = (maker: TStyleSheetMaker, mode?: 'a' | 'c') => {
        let k = collector.use(maker);
        if (manager && !manager.get(k)) {
            manager.pack(k, manager.hydrate(k) || css(maker, k, mode));
        }
        return resolve(k, mode);
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
    const cx = <T extends TStyles>(maker: TStyleSheetMaker, details: TDetails<T>) => {
        const resolver = useSingle(maker, 'c');
        if (Array.isArray(details)) return resolver.list<T>(...details).$;
        return resolver.obj<T>(details).$;
    };
    cx.join = (...args: (string | false | null | undefined)[]): string => {
        return args.reduce((acc, arg) => {
            if (!arg) return acc;
            else if (!acc) return arg || '';
            return acc + ' ' + arg;
        }, '') as string;
    };
    const dx = <T extends TStyles>(maker: TStyleSheetMaker, details: TDetails<T>) => {
        const resolver = useSingle(maker, 'a');
        if (Array.isArray(details)) return resolver.list<T>(...details);
        return resolver.obj<T>(details);
    };
    dx.join = (...args: (Record<string, string> | false | null | undefined)[]): Record<string, string> => {
        return args.reduce((acc, arg) => {
            if (!arg) return acc;
            return {...acc, ...arg};
        }, {} as Record<string, string>) as Record<string, string>;
    };
    const tune = <T extends object>(tuning: TDeepPartial<T>, maker?: TStyleSheetMaker) => {
        const makerKey = collector.key(maker);
        let result: Record<string, string | number> = {};
        if (makerKey) {
            const localScope = scope(makerKey);
            function parse(key: string, val: string | number | object) {
                if (typeof val !== 'object') result[localScope.varName(key)] = val;
                else Object.entries(val).map(([ekey, evalue]) => {
                    parse(ekey && key ? key + '-' + ekey : key || ekey, evalue);
                });
            }
            parse('', tuning);
        }
        return result;
    }
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
        cx,
        dx,
        tune,
        // stylesheet handlers
        status,
        on,
        off,
        stylesheets
    };
}

const describeNumAttr = (host: THost, name: keyof TProviderAttrs) => ({
    set(val: TNumberAttr) {
        setAttr(host, name, val);
    },
    get() {
        return getNumAttr(host, name);
    }
});
const describeStringAttr = (host: THost, name: keyof TProviderAttrs) => ({
    set(val: TStringAttr) {
        setAttr(host, name, val);
    },
    get(): TStringAttr {
        const val = host.getAttribute(name);
        if (!val) return val;
        const arr = val.split(ATTR_VAL_SEPARATOR);
        return arr.length > 1 ? arr : val;
    }
});

const construct = (host: THost, {
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
        }
    });
    Object.defineProperties(host, CUST_NUM_ATTRS.reduce((acc, attr) => {
        acc[attr] = describeNumAttr(host, attr);
        return acc;
    }, {} as Record<TAttrKeys, object>));
    Object.defineProperties(host, CUST_STRING_ATTRS.reduce((acc, attr) => {
        acc[attr] = describeStringAttr(host, attr);
        return acc;
    }, {} as Record<TAttrKeys, object>));
    const prefix = host.pre;
    const collector = createCollector({ prefix });
    const scope = createScope({
        mode: host.mode,
        min: host.min,
        dict: params?.dict
    });
    const globalScope = scope(collector.key());
    const processor = createProcessor({
        scope,
        prefix
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
                const attrs: Record<string, string | null> = CUST_ATTRS.reduce((acc, attr) => {
                    acc[attr] = host.getAttribute(attr);
                    return acc;
                }, {
                    is: TAG_NAME,
                    min: host.getAttribute('min'),
                    mode: host.getAttribute('mode'),
                    scheme: host.getAttribute('scheme'),
                } as Record<string, string | null>);
                if (!noscript) {
                    tag = SCRIPT;
                    attrs.type = APP_JSON;
                    const params: {
                        theme: TThemeController['actions'];
                        dict?: Record<string, object>;
                    } = {
                        theme: host.theme.actions,
                        dict: scope.dict
                    };
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
};

const queryStyleProvider = () => globalThis?.document.querySelector(`[is=${TAG_NAME}]`) as unknown as IStyleProvider;

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
                return CUST_ATTRS;
            }

            theme: IStyleProvider['theme'];
            pre: IStyleProvider['pre'];
            mode: IStyleProvider['mode'];
            min: IStyleProvider['min'];
            size: IStyleProvider['size'];
            space: IStyleProvider['space'];
            radius: IStyleProvider['radius'];
            angle: IStyleProvider['angle'];
            time: IStyleProvider['time'];
            color: IStyleProvider['color'];
            easing: IStyleProvider['easing'];
            contrast: IStyleProvider['contrast'];
            neutral: IStyleProvider['neutral'];
            sans: IStyleProvider['sans'];
            serif: IStyleProvider['serif'];
            mono: IStyleProvider['mono'];

            // maker handlers

            use: IStyleProvider['use'];
            remake: IStyleProvider['remake'];
            css: IStyleProvider['css'];
            cx: IStyleProvider['cx'];
            dx: IStyleProvider['dx'];
            tune: IStyleProvider['tune'];

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
                // create init stylesheet maker
                const next = createGlobalMaker({
                    theme: this.theme,
                    attrs: this,
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

            disconnectedCallback() {
                delete (globalThis as TGlobalThisWithProvider)[PROVIDER_SYMBOL];
            };
        }
        custom.define(TAG_NAME, StyleProvider, { extends: SCRIPT });
        class Override extends HTMLElement {
            static get observedAttributes() {
                return [VALUES, ...CUST_ATTRS];
            }

            protected _customize() {
                const provider = queryStyleProvider();
                if (this.shadowRoot && provider) {
                    const values = this.getAttribute(VALUES);
                    const sheet = new CSSStyleSheet();
                    const vars = values ? JSON.parse(decodeURIComponent(values)) : {};
                    CUST_ATTRS.forEach((name) => {
                        const value = this.getAttribute(name);
                        if (value) value.split(ATTR_VAL_SEPARATOR).forEach((part, index) => {
                            vars[posVal(name, index)] = part;
                        })
                    });
                    const {$dark = {}, $light = {}, ...host} = provider.theme.makeThemeVars(vars);
                    const lightVars = plainVars($light as object);
                    const darkVars = plainVars($dark as object);
                    sheet.replaceSync(
                        HOST + `{${DIS_CON + plainVars(host as object)}}` +
                        HOST + `([scheme=light]){color-scheme:light;${lightVars}}` +
                        HOST + `([scheme=dark]){color-scheme:dark;${darkVars}}` +
                        MEDIA + `(${LIGHT}){${HOST}{${lightVars}}}` +
                        MEDIA + `(${DARK}){${HOST}{${darkVars}}}`
                    );
                    this.shadowRoot.adoptedStyleSheets = [sheet];
                }
            }

            attributeChangedCallback() {
                if (this.isConnected) this._customize();
            }

            connectedCallback() {
                const shadowRoot = this.attachShadow({mode: 'open'});
                shadowRoot.innerHTML = `<slot></slot>`;
                this._customize();
            }
        }
        custom.define(TAG_NAME_OVERRIDE, Override);
        return true;
    }
}

const emulateProvider = (settings: TUseStylePropviderParams = {}): IStyleProvider => {
    let {
        noscript,
        attrs = {}
    } = settings;
    const attributes = Object.entries(attrs).reduce((acc, [attr, val]) => {
        if (val) acc[attr] = typeof val === 'boolean' ? '' : (val + '');
        return acc;
    }, {
        mode: DEFAULT_ATTRS.mode,
        pre: DEFAULT_ATTRS.prefix
    } as Record<string, string | null>);
    class StyleProviderEmulation implements IStyleProvider {
        get tagName(): string {
            return '';
        }
        get textContent(): string {
            return '';
        }
        attributes = attributes;

        getAttribute(name: TAttrKeys) {
            const val = this.attributes[name];
            return val !== undefined && val !== null ? isBoolean(val) ? '' : (val + '') : null;
        }
        setAttribute(name: TAttrKeys, val: string) {
            this.attributes[name] = (val + '');
            if (CUST_ATTRS_SET.has(name as keyof TAttrs)) this._customize();
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
        space: IStyleProvider['space'];
        radius: IStyleProvider['radius'];
        angle: IStyleProvider['angle'];
        time: IStyleProvider['time'];
        color: IStyleProvider['color'];
        easing: IStyleProvider['easing'];
        contrast: IStyleProvider['contrast'];
        neutral: IStyleProvider['neutral'];
        sans: IStyleProvider['sans'];
        serif: IStyleProvider['serif'];
        mono: IStyleProvider['mono'];

        // maker handlers

        use: IStyleProvider['use'];
        remake: IStyleProvider['remake'];
        css: IStyleProvider['css'];
        cx: IStyleProvider['cx'];
        dx: IStyleProvider['dx'];
        tune: IStyleProvider['tune'];

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
            // create init stylesheet maker
            const next = createGlobalMaker({
                theme: this.theme,
                attrs: this,
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
    const {emulate, global, ...settings} = params;
    const document = globalThis?.document;
    let styleProvider: IStyleProvider;
    const globalProvider = (globalThis as TGlobalThisWithProvider)[PROVIDER_SYMBOL];
    if (global && globalProvider) styleProvider = globalProvider;
    else if (document && !emulate) {
        if (useStyleProvider.isDefined === undefined) useStyleProvider.isDefined = defineProvider();
        const provider: IStyleProvider = queryStyleProvider();
        if (provider) styleProvider = provider;
        else {
            const script = document.createElement(SCRIPT, {
                is: TAG_NAME
            });
            script.setAttribute('is', TAG_NAME);
            const attrs = settings?.attrs;
            if (attrs) Object.entries(attrs).map(([k,v]) => v && DEFAULT_ATTRS[k] !== v && script.setAttribute(k, isBoolean(v) ?
                '' :
                Array.isArray(v) ?
                    v.join(ATTR_VAL_SEPARATOR) :
                    v + ''
                )
            );
            document.head.appendChild(script);
            styleProvider = script as unknown as IStyleProvider;
        }
    } else styleProvider = emulateProvider(settings);
    if (global && !globalProvider) (globalThis as TGlobalThisWithProvider)[PROVIDER_SYMBOL] = styleProvider;
    return styleProvider;
};
/**
 * Prepare string to override global EffCSS variables
 * @param values - CSS variables
 */
export const prepareOverrideValues = (values: object) => encodeURIComponent(JSON.stringify(values));
