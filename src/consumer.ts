// constants
import type { TProviderAttrs, TProviderSettings } from './common';
import { createCollector, createKeyMaker, createScope, DEFAULT_ATTRS, TAG_NAME } from './common';
// types
import type { IStyleProvider } from './index';

/**
 * Create style dispatcher
 * @param params - dispatcher params
 */
export const createConsumer = (attrs: Partial<TProviderAttrs> = {}): IStyleProvider => {
    let provider: IStyleProvider | null = globalThis?.document?.querySelector(
        `script[is=${TAG_NAME}]`
    ) as IStyleProvider | null;
    if (provider) return provider;
    let theme: string | null;
    let prefix: string | null;
    let mode: string | null;
    let hydrate: string | null;
    ({ prefix, mode, hydrate, theme } = Object.assign({}, DEFAULT_ATTRS, attrs));
    let vars: Record<string, object> | undefined;
    let bp: Record<string, number | string> | undefined;

    const statusOffSet = new Set<string>();
    const getPrefix = () => prefix || (DEFAULT_ATTRS.prefix as string);
    const getMode = () => mode || (DEFAULT_ATTRS.mode as string);
    const getHydrate = () => hydrate === '';

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
        get prefix() {
            return getPrefix();
        },
        get mode() {
            return getMode();
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
        get settings() {
            return {
                bp,
                vars,
                off: [...statusOffSet],
                makers: c.makers
            };
        },
        set settings(val) {
            return;
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
                theme
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
            }},${vars ? ` vars: ${vars},` : ''}${bp ? ` bp: ${bp},` : ''}${
                statusOffSet.size ? ` off: [${[...statusOffSet]}]` : ''
            }}`;
            return `<script ${attrs}>${textContent}</script>`;
        }
    };
};
