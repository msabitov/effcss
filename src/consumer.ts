// constants
import type { TProviderAttrs, TProviderSettings } from './common';
import {
    createCollector, createKeyMaker, createScope,
    DEFAULT_ATTRS, TAG_NAME
} from './common';
// types
import type { IStyleProvider } from './index';

type TAttr = string | null;

const numOrNull = (val: string | number | null) => val === null || val === undefined ? null : Number(val);

/**
 * Create style dispatcher
 * @param params - dispatcher params
 */
export const createConsumer = (attrs: Partial<TProviderAttrs> = {}): IStyleProvider => {
    let provider: IStyleProvider | null = globalThis?.document?.querySelector(
        `script[is=${TAG_NAME}]`
    ) as IStyleProvider | null;
    if (provider) return provider;
    let theme: TAttr;
    let prefix: TAttr;
    let mode: TAttr;
    let min: TAttr;
    let hydrate: TAttr;
    let size: TAttr;
    let time: TAttr;
    let angle: TAttr;
    ({ prefix, mode, hydrate, theme, size, time, angle, min } = Object.assign({}, DEFAULT_ATTRS, attrs));
    let _size: number | null = numOrNull(size);
    let _time: number | null = numOrNull(time);
    let _angle: number | null = numOrNull(angle);
    let palette: TProviderSettings['palette'] | undefined;
    let vars: Record<string, object> | undefined;
    let bp: Record<string, number | string> | undefined;

    const statusOffSet = new Set<string>();
    const getPrefix = () => prefix || (DEFAULT_ATTRS.prefix as string);
    const getMode = () => mode || (DEFAULT_ATTRS.mode as string);
    const getHydrate = () => hydrate === '';
    const getMin = () => min === '';

    const _k: ReturnType<typeof createKeyMaker> = createKeyMaker({ prefix: getPrefix() });
    const _r: ReturnType<typeof createScope> = createScope({
        mode: getMode()
    });
    const c = createCollector();
    const key: IStyleProvider['key'] = (param) => (typeof param === 'string' ? param : c.getKey(param));
    const status: IStyleProvider['status'] = (target) => {
        const source = key(target);
        return !!source && !statusOffSet.has(source);
    };
    const on: IStyleProvider['on'] = (...params) =>
        params.map(key).reduce((acc, k) => acc && !!k && statusOffSet.delete(k), true);
    const off: IStyleProvider['on'] = (...params) =>
        params.map(key).reduce((acc, k) => acc && !!k && !!statusOffSet.add(k), true);
    const resolve: IStyleProvider['resolve'] = (key) => _r(key || _k.base).attr;
    const css: IStyleProvider['css'] = () => '';
    const use: IStyleProvider['use'] = (maker, key) => {
        const styleSheetKey = key || _k.current;
        let k = c.use(maker, styleSheetKey);
        if (!key) _k.next();
        return resolve(k);
    };
    const usePublic: IStyleProvider['usePublic'] = (styles) =>
        Object.fromEntries(Object.entries(styles).map(([key, maker]) => [key, use(maker, key)]));
    const usePrivate: IStyleProvider['usePrivate'] = (styles) => styles.map((maker) => use(maker));
    const stylesheets: IStyleProvider['stylesheets'] = () => [];
    return {
        get makers() {
            return c.makers;
        },
        get prefix() {
            return getPrefix();
        },
        get mode() {
            return getMode();
        },
        get min() {
            return getMin();
        },
        get hydrate() {
            return getHydrate();
        },
        set theme(val) {
            theme = val;
        },
        get theme() {
            return theme || '';
        },
        get size() {
            return _size;
        },
        set size(val) {
            _size = val;
        },
        get time() {
            return _time;
        },
        set time(val) {
            _time = val;
        },
        get angle() {
            return _angle;
        },
        set angle(val) {
            _angle = val;
        },
        get settings() {
            return {
                bp,
                vars,
                off: [...statusOffSet],
                makers: c.makers,
                palette
            };
        },
        set settings(val) {
            ({bp, vars, palette} = val);
        },
        resolve,
        use,
        usePublic,
        usePrivate,
        css,
        key,
        status,
        on,
        off,
        stylesheets,
        toString() {
            const makers = c.makers;
            delete makers[_k.base];
            const attrs = Object.entries({
                is: TAG_NAME,
                prefix: getPrefix(),
                mode: getMode(),
                hydrate: getHydrate(),
                theme,
                size: _size !== null && String(_size),
                time: _time !== null && String(_time),
                angle: _angle !== null && String(_angle)
            })
                .map(([name, value]) => (value ? `${name}="${value}"` : value === '' ? name : ''))
                .filter(Boolean)
                .join(' ');
            const textContent = `document.currentScript.settings = {makers: {${
                makers
                    ? Object.entries(makers).reduce((acc, [key, func]) => {
                          return acc + `${acc ? ',' : ''}${key}: ${func.toString().replaceAll(/\s+/g, ' ')}`;
                      }, '')
                    : ''
            }},${vars ? ` vars: ${vars},` : ''}${bp ? ` bp: ${bp},` : ''}${palette ? ` palette: ${palette},` : ''}${
                statusOffSet.size ? ` off: [${[...statusOffSet]}]` : ''
            }}`;
            return `<script ${attrs}>${textContent}</script>`;
        }
    };
};
