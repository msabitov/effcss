import { STYLES_SCRIPT_CLS } from '../constants';
import {
    TCreateResolver, IStyleCollector, TStyleSheetConfig,
    TProviderInitContent, TStyleMode,
    IStyleDispatcher, IStyleResolver
} from '../types';

const isObject = (arg?: string | number | object) => typeof arg === 'object';

/**
 * Create BEM resolver
 * @param params - BEM resolver params
 */
export const createResolver: TCreateResolver = (params) => {
    const {
        mode
    } = (params || {});
    const stringifyModifiers = (v: object) => Object.entries(v).reduce((acc, [mod, modv]) => {
        if (modv !== undefined) acc.push(mod + (modv ? ('-' + modv) : ''));
        return acc;
    }, [] as string[]).join(' ');
    const pack = (k: string, v: string) => Object.defineProperties({[k]: v}, {
        k: {value: k},
        v: {value: v}
    });
    const varName = (...parts: (string | number)[]) => '--' + parts.join('-');
    const kfName = (...parts: (string | number)[]) => parts.join('-');
    if (mode === 'c') {
        return {
            selector: ({ b, e, m, mv}) =>
                `.${b}${
                    (e ? '__' + e : '') +
                    (m ? '_' + m : '') +
                    (m && mv ? ('_' + mv) : '')}`,
            attr: (b) => (e) => (ms) => {
                const k = 'class';
                let v = ms || '';
                if (isObject(v)) v = stringifyModifiers(v) as string;
                const base = b + (e ? '__' + e : '');
                v = base + (v ? ' ' + v?.split(' ').map((i) => base + '_' + i.split('-').join('_')).join(' ') : '');
                return pack(k, v);
            },
            varName,
            kfName
        };
    } else {
        return {
            selector: ({ b, e, m, mv}) =>
                `[data-${b}${e ? '-' + e : ''}${m ? ('~="' + (m || '') + (mv ? '-' + mv : '') + '"') : ''}]`, 
            attr: (b) => (e) => (ms) => {
                const k = `data-${b}${e ? ('-' + e) : ''}`;
                let v = ms || '';
                if (isObject(v)) v = stringifyModifiers(v) as string;
                return pack(k, v);
            },
            varName,
            kfName
        };
    }
};

class Collector implements IStyleCollector {
    protected _p;
    protected _c = 0;
    protected _k: Set<string> = new Set();
    protected _ = new Map<TStyleSheetConfig, string>();

    constructor({
        prefix,
        initContent,
        hydrate
    }: {
        prefix?: string;
        initContent?: TProviderInitContent;
        hydrate?: boolean;
    } = {}) {
        this._p = prefix || 'eff';
        if (initContent) {
            Object.entries(initContent).forEach(([key, config]) => this.use(config, key));
        }
        // force hydratation
        if (hydrate) this._c = 0;
    }
    
    use = (config: TStyleSheetConfig, key?: string) => {
        const existedKey = this._.get(config);
        if (existedKey) return existedKey;
        const resKey = key || (this._p + this._c.toString(36));
        this._k.add(resKey);
        this._.set(config, resKey);
        this._c++;
        return resKey;
    }

    mutate = (key: string, nextConfig: TStyleSheetConfig) => Object.assign(this.getConfigs()[key], nextConfig);

    getKey = (config: TStyleSheetConfig) => this._.get(config);

    getKeys = () => [...this._k];

    getConfigs = () => Object.fromEntries(this._.entries().map(([s,k]) => [k,s]));
};

/**
 * Create stylesheet config collector
 * @param params - collector params
 */
export function createCollector(params: {
    prefix?: string;
    initContent?: TProviderInitContent;
    hydrate?: boolean;
}) {
    return new Collector(params);
}

interface IPseudoDispatcherParams {
    mode?: TStyleMode;
    prefix?: string;
    initcls?: string;
}

class PseudoDispatcher implements IStyleDispatcher{
    protected _c: IStyleCollector;
    protected _r: IStyleResolver;
    protected _i: string;
    protected _m = {c: {}};

    get collector() {
        return this._c;
    }

    constructor(params?: IPseudoDispatcherParams) {
        const { prefix, mode, initcls = STYLES_SCRIPT_CLS } = (params || {});
        this._i = initcls;
        this._r = createResolver({
            mode
        });
        this._c = createCollector({
            prefix
        });
        this.use(this._m);
    }

    /**
     * Use stylesheet config
     * @param config - stylesheet config
     * @returns BEM resolver
     */
    use: IStyleDispatcher['use'] = (config, key) => {
        let k = this._c.use(config, key);
        return this.resolve(k);
    }

    /**
     * Use public stylesheet configs
     * @param configs - stylesheet configs
     */
    usePublic: IStyleDispatcher['usePublic'] = (styles) => Object.fromEntries(Object.entries(styles).map(([key, config]) => {
        return [key, this.use(config, key)];
    }));

    /**
     * Use private stylesheet configs
     * @param configs - stylesheet configs
     */
    usePrivate: IStyleDispatcher['usePrivate'] = (styles) => styles.map((config) => {
        return this.use(config);
    });

    /**
     * Resolve styles
     * @param key - stylesheet key
     */
    resolve = (key?: string) => this._r.attr(key || this._c.getKey(this._m));

    toString() {
        const configs = this._c.getConfigs();
        const mainConfigKey = this._c.getKey(this._m);
        if (mainConfigKey) delete configs[mainConfigKey];
        return `<script class="${
            this._i
        }" type="application/json">${
            JSON.stringify(configs)
        }</script>`;
    }
};

/**
 * Basic class for manipulating stylesheets
 */
export function createPseudoDispatcher(params?: IPseudoDispatcherParams) {
    return new PseudoDispatcher(params);
}
