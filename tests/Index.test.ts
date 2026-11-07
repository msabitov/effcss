import { afterAll, afterEach, describe, expect, test } from 'vitest';
import {
    variable,
    animation,
    container,
    font,
    layers,
    id,
    className,
    style,
    theme,
    context,
    serialize,
    setConfig,
    getConfig,
    clear
} from '../src/index';

const EFFCSS_KEY_ATTR = 'data-effcss-key';
const EFFCSS_COUNT_ATTR = 'data-effcss-count';

describe('Client-side', () => {
    const defGlobalKey = getConfig().key;
    const keyPrefix = 'ssr';
    let counter = 0;
    const contexts: ReturnType<typeof context>[] = [];
    const createCtx = (config: { key: string }) => {
        const ctx = context(config);
        contexts.push(ctx);
        return ctx;
    };

    const getKey = () => keyPrefix + counter++;

    const cleanHead = () => {
        document.head.querySelectorAll(`style[${EFFCSS_KEY_ATTR}^="${keyPrefix}"]`).forEach((el) => el.remove());
    };

    afterEach(() => {
        contexts.splice(0).forEach((ctx) => ctx.dispose());
        cleanHead();
        clear();
    });

    afterAll(() => {
        counter = 0;
    });

    describe('global provider', () => {
        describe('variable', () => {
            test('token shape, var() and string coercion', () => {
                const size = variable('12px');
                const name = '' + size;
                expect(name).toContain(`--${defGlobalKey}_2-`);
                expect(size()).toBe(`var(${name})`);
                expect(size('18px')).toBe(`var(${name},18px)`);
            });

            test('get/set after emission', () => {
                const value = '12px';
                const size = variable(value);
                expect(size.get()).toBe('');
                size.set('24rem');
                expect(size.get()).toBe('');
                size();
                expect(size.get()).toBe(value);
                const nextValue = '24px';
                size.set(nextValue);
                expect(size.get()).toBe(nextValue);
                size.set((prev) => prev.replace('px', 'rem'));
                expect(size.get()).toBe('24rem');
            });

            test('no CSS until used', () => {
                const size = variable('12px');
                expect(serialize()).toBe('');
                size();
                expect(serialize()).toContain('@property');
                clear();
                const angle = variable('30deg');
                expect(serialize()).toBe('');
                angle + '';
                expect(serialize()).toContain('@property');
            });

            test('object config: syntax, inherits and initialValue', () => {
                const size = variable({ initialValue: '12px', syntax: '<length>', inherits: false });
                size();
                expect(serialize()).toContain('syntax: "<length>"; inherits: false; initial-value: 12px;');
            });

            test('short syntax is emitted without angle brackets', () => {
                const color = variable({ initialValue: '#eff', syntax: 'color' });
                color();
                expect(serialize()).toContain('syntax: "<color>";');
            });

            test('full syntax string is emitted as-is', () => {
                const custom = variable({ initialValue: '10%', syntax: '<length> | <percentage>' });
                custom();
                expect(serialize()).toContain('syntax: "<length> | <percentage>";');
            });

            test('get/set on not-emitted variable', () => {
                const size = variable('12px');
                expect(serialize()).toBe('');
                expect(size.get()).toBe('');
                size.set('24px');
                expect(serialize()).toBe('');
                size();
                expect(size.get()).toBe('12px');
            });

            test('number initialValue coerced to string', () => {
                const size = variable({ initialValue: 0, syntax: '<number>' });
                size();
                expect(serialize()).toContain('initial-value: 0;');
            });

            test('variable without initialValue emits no initial-value', () => {
                const size = variable();
                size();
                expect(serialize()).toContain(`@property --${defGlobalKey}_2-`);
                expect(serialize()).not.toContain('initial-value');
            });

            test('null initialValue returns empty', () => {
                const size = variable({ initialValue: null });
                size();
                expect(size.get()).toBe('');
            });

            test('star and quoted syntax as-is', () => {
                const any = variable({ initialValue: '1', syntax: '*' });
                const quoted = variable({ initialValue: '#eff', syntax: '"<color>"' });
                any + '';
                quoted + '';
                const css = serialize();
                expect(css).toContain('syntax: "*";');
                expect(css).toContain('syntax: "<color>";');
            });

            test('hydration reuses existing stylesheet', () => {
                document.head.insertAdjacentHTML(
                    'beforeend',
                    `<style ${EFFCSS_KEY_ATTR}="${defGlobalKey}-2" ${EFFCSS_COUNT_ATTR}="1">@property --${defGlobalKey}_2-0{syntax:"*";inherits:true;initial-value:12px;}</style>`
                );
                const existing = document.head.querySelector(`style[${EFFCSS_KEY_ATTR}="${defGlobalKey}-2"]`);

                const size = variable('12px');
                size();

                const styles = document.head.querySelectorAll(`style[${EFFCSS_KEY_ATTR}="${defGlobalKey}-2"]`);
                expect(styles.length).toBe(1);
                expect(styles[0]).toBe(existing);
            });
        });

        describe('animation', () => {
            test('uses object arg to create resolver', () => {
                const myAnimation = animation({ from: { width: '100px' }, to: { width: '200px' } });
                expect(serialize()).toBe('');
                const token = myAnimation();
                expect(token).toContain(`${defGlobalKey}_3-`);
                expect(serialize()).toContain(`@keyframes ${token}`);
            });

            test('uses function arg with tokens to create resolver', () => {
                const size = variable('100px');
                const myAnimation = animation(() => ({ from: { width: size() }, to: { width: '200px' } }));
                expect(serialize()).toBe('');
                const token = myAnimation();
                expect(token).toContain(`${defGlobalKey}_3-`);
                expect(serialize()).toContain(`@keyframes ${token}`);
            });

            test('uses object arg with tokens to throw TypeError on usage', () => {
                const size = variable('100px');
                const myAnimation = animation({ from: { width: size() }, to: { width: '200px' } });
                expect(() => myAnimation()).toThrow(TypeError);
            });

            test('object form with tokens does not throw on creation', () => {
                const size = variable('100px');
                expect(() => animation({ from: { width: size() }, to: { width: '200px' } })).not.toThrow();
            });
        });

        describe('layers', () => {
            test('returns object of resolvers with @layer', () => {
                const myLayers = layers(['reset', 'base']);
                expect(serialize()).toBe('');
                expect(myLayers.reset()).toContain(`@layer ${defGlobalKey}_0-`);
                const html = serialize();
                expect(html).toContain(`@layer ${defGlobalKey}_0-0, ${defGlobalKey}_0-1;`);
                expect(myLayers.base()).toContain(`@layer ${defGlobalKey}_0-`);
                expect(serialize()).toBe(html);
            });

            test('layer coercion equals call', () => {
                const myLayers = layers(['reset']);
                const layerAsKey = '' + myLayers.reset;
                expect(layerAsKey).toContain(`@layer ${defGlobalKey}_0-`);
                expect(myLayers.reset()).toBe(layerAsKey);
            });
        });

        describe('container', () => {
            test('returns name/type, coercion returns @container', () => {
                const myContainer = container('inline-size');
                expect(serialize()).toBe('');
                const containerAsKey = '' + myContainer;
                expect(containerAsKey).toContain(`@container ${defGlobalKey}_4-`);
                expect(serialize()).toBe('');
                const name = containerAsKey.slice('@container '.length);
                expect(myContainer()).toBe(`${name} / inline-size`);
                expect(serialize()).toBe('');
            });

            test('container without type uses default', () => {
                const myContainer = container();
                const containerAsKey = '' + myContainer;
                expect(containerAsKey).toContain(`@container ${defGlobalKey}_4-`);
                expect(myContainer()).toContain(`/ normal`);
            });
        });

        describe('font', () => {
            test('returns bare name and generates @font-face', () => {
                const myFont = font({ src: 'url("x.woff2")' });
                expect(serialize()).toBe('');
                const token = myFont();
                expect(token).toContain(`${defGlobalKey}_1-`);
                expect(serialize()).toContain('@font-face ');
                expect(serialize()).toContain(`font-family: ${token}`);
                expect(myFont + '').toBe(token);
            });

            test('fallbacks appended after family name', () => {
                const myFont = font({ src: 'url("x.woff2")' });
                const name = myFont();
                expect(myFont('sans-serif')).toBe(`${name}, sans-serif`);
                expect(myFont('Arial', 'sans-serif')).toBe(`${name}, Arial, sans-serif`);
            });

            test('coercion reuses cached resolver', () => {
                const myFont = font({ src: 'url("x.woff2")' });
                const name = myFont();
                expect('' + myFont).toBe(name);
            });
        });

        describe('className', () => {
            test('uses object arg to create resolver', () => {
                const myCls = className({ margin: 'auto' });
                expect(serialize()).toBe('');
                const token = myCls();
                expect(token).toContain(`${defGlobalKey}_6-`);
                expect(serialize()).toContain(`.${token} { margin: auto; }`);
                expect(myCls + '').toBe(token);
            });

            test('uses function arg with tokens to create resolver', () => {
                const size = variable('100px');
                const myCls = className(() => ({ padding: size() }));
                expect(serialize()).toBe('');
                const token = myCls();
                expect(token).toContain(`${defGlobalKey}_6-`);
                expect(serialize()).toContain(`.${token} { padding: var(--${defGlobalKey}_2-0); }`);
            });

            test('uses object arg with tokens to throw TypeError on usage', () => {
                const size = variable('100px');
                // the definition stays pure, the error is thrown on realization
                const myCls = className({ padding: size() });
                expect(() => myCls()).toThrow(TypeError);
            });

            test('object form with tokens does not throw on creation', () => {
                const size = variable('100px');
                expect(() => className({ padding: size() })).not.toThrow();
            });

            test('object arg with a token from another context throws TypeError', () => {
                const ctx = createCtx({ key: getKey() });
                const foreign = ctx.variable('100px');
                // the guard is key-agnostic
                const myCls = className({ padding: foreign() });
                expect(() => myCls()).toThrow(TypeError);
            });

            test('postfix variants create distinct tokens', () => {
                const myCls = className(() => ({ color: 'red' }));
                const baseToken = myCls();
                const hoverToken = myCls(':hover');
                const focusToken = myCls(':focus');
                const dataToken = myCls('[data-state="open"]');
                // each postfix yields a distinct token, different from the base
                expect(hoverToken).not.toBe(baseToken);
                expect(focusToken).not.toBe(baseToken);
                expect(focusToken).not.toBe(hoverToken);
                expect(dataToken).not.toBe(baseToken);
                expect(serialize()).toContain(`.${hoverToken}:hover { color: red; }`);
                expect(serialize()).toContain(`.${focusToken}:focus { color: red; }`);
                expect(serialize()).toContain(`.${dataToken}[data-state="open"] { color: red; }`);
            });

            test('multiple postfixes combined in selector', () => {
                const myCls = className(() => ({ color: 'red' }));
                const token = myCls(':hover', '[data-state="open"]', '@media (max-width: 700px)');
                expect(serialize()).toContain(
                    `@media (max-width: 700px) {\n  .${token}:hover[data-state="open"] { color: red; }\n}`
                );
            });

            test('className coercion equals call', () => {
                const myCls = className(() => ({ margin: 'auto' }));
                const token = myCls();
                expect('' + myCls).toBe(token);
            });

            test('at-rule postfix wraps at nesting level', () => {
                const myCls = className(() => ({ color: 'red' }));
                const token = myCls('@media (max-width: 700px)');
                expect(serialize()).toContain('@media (max-width: 700px)');
                expect(serialize()).toContain(`.${token} { color: red; }`);
            });

            test('hydration reuses existing stylesheet', () => {
                document.head.insertAdjacentHTML(
                    'beforeend',
                    `<style ${EFFCSS_KEY_ATTR}="${defGlobalKey}-6" ${EFFCSS_COUNT_ATTR}="1">.${defGlobalKey}_6-0{padding:4px;}</style>`
                );
                const existing = document.head.querySelector(`style[${EFFCSS_KEY_ATTR}="${defGlobalKey}-6"]`);

                const myCls = className(() => ({ padding: '4px' }));
                myCls();

                const styles = document.head.querySelectorAll(`style[${EFFCSS_KEY_ATTR}="${defGlobalKey}-6"]`);
                expect(styles.length).toBe(1);
                expect(styles[0]).toBe(existing);
            });
        });

        describe('id', () => {
            test('uses object arg to create resolver', () => {
                const myId = id({ margin: 'auto' });
                expect(serialize()).toBe('');
                const token = myId();
                expect(token).toContain(`${defGlobalKey}_5-`);
                expect(serialize()).toContain(`#${token} { margin: auto; }`);
                expect(myId + '').toBe(token);
            });

            test('uses function arg with tokens to create resolver', () => {
                const size = variable('100px');
                const myId = id(() => ({ padding: size() }));
                expect(serialize()).toBe('');
                const token = myId();
                expect(token).toContain(`${defGlobalKey}_5-`);
                expect(serialize()).toContain(`#${token} { padding: var(--${defGlobalKey}_2-0); }`);
            });

            test('uses object arg with tokens to throw TypeError on usage', () => {
                const size = variable('100px');
                const myId = id({ padding: size() });
                expect(() => myId()).toThrow(TypeError);
            });

            test('id supports postfix modifiers like className', () => {
                const myId = id(() => ({ color: 'red' }));
                const baseToken = myId();
                const hoverToken = myId(':hover');
                const dataToken = myId('[data-state="open"]');
                expect(hoverToken).not.toBe(baseToken);
                expect(dataToken).not.toBe(baseToken);
                expect(serialize()).toContain(`#${hoverToken}:hover { color: red; }`);
                expect(serialize()).toContain(`#${dataToken}[data-state="open"] { color: red; }`);
            });

            test('multiple postfixes combined in selector', () => {
                const myId = id(() => ({ color: 'red' }));
                const token = myId(':hover', '[data-state="open"]', '@media (max-width: 700px)');
                expect(serialize()).toContain(
                    `@media (max-width: 700px) {\n  #${token}:hover[data-state="open"] { color: red; }\n}`
                );
            });

            test('at-rule postfix wraps at nesting level', () => {
                const myId = id(() => ({ color: 'red' }));
                const token = myId('@media (max-width: 700px)');
                expect(serialize()).toContain('@media (max-width: 700px)');
                expect(serialize()).toContain(`#${token} { color: red; }`);
            });

            test('id coercion equals call', () => {
                const myId = id(() => ({ margin: 'auto' }));
                const token = myId();
                expect('' + myId).toBe(token);
            });
        });

        describe('style', () => {
            test('uses function arg to create resolver', () => {
                const myStyle = style(() => ({ body: { padding: '1rem' } }));
                expect(serialize()).toBe('');
                const emptyString = myStyle();
                expect(emptyString).toBe('');
                expect(serialize()).toContain('body { padding: 1rem; }');
                expect(myStyle + '').toBe(emptyString);
            });

            test('uses object arg to create resolver', () => {
                const myStyle = style({ body: { padding: '1rem' } });
                expect(serialize()).toBe('');
                const emptyString = myStyle();
                expect(emptyString).toBe('');
                expect(serialize()).toContain('body { padding: 1rem; }');
            });

            test('uses object arg with tokens to throw TypeError on usage', () => {
                const size = variable('100px');
                const myStyle = style({ body: { padding: size() } });
                expect(() => myStyle()).toThrow(TypeError);
            });

            test('null and undefined values are skipped', () => {
                const myStyle = style(() => ({ body: { padding: '1rem', margin: null, gap: undefined } }) as never);
                myStyle();
                const css = serialize();
                expect(css).toContain('padding: 1rem;');
                expect(css).not.toContain('margin');
                expect(css).not.toContain('gap');
            });

            test('array values are flattened', () => {
                const myStyle = style(() => ({ body: { margin: ['0', 'auto'] } }) as never);
                const nextMyStyle = style({
                    '@font-face': [
                        {
                            fontFamily: '"Bitstream Vera Serif Bold"',
                            src: 'url("https://mdn.github.io/shared-assets/fonts/FiraSans-Regular.woff2")'
                        },
                        {
                            fontFamily: '"MyHelvetica"',
                            src: 'local("Helvetica Neue Bold"), local("HelveticaNeue-Bold"), url("MgOpenModernaBold.woff2")',
                            fontWeight: 'bold'
                        }
                    ]
                });
                expect(() => myStyle()).not.toThrow();
                expect(() => nextMyStyle()).not.toThrow();
                // each object in the array yields its own rule
                expect(serialize()).toContain('@font-face { font-family: "Bitstream Vera Serif Bold";');
                expect(serialize()).toContain('@font-face { font-family: MyHelvetica;');
            });

            test('empty string value should be quoted', () => {
                const myStyle = style(() => ({ body: { content: '""' } }) as never);
                myStyle();
                expect(serialize()).toContain('content: "";');
            });

            test('empty string emits a bare at-rule declaration', () => {
                const layerDeclaration = '@layer custom';
                const myStyle = style(() => ({ [layerDeclaration]: '' }) as never);
                myStyle();
                expect(serialize()).toContain(layerDeclaration + ';');
            });

            test('camelCase properties are kebab-cased', () => {
                const myStyle = style(() => ({ body: { fontFamily: 'serif', 'background-color': 'red' } }) as never);
                myStyle();
                expect(serialize()).toContain('font-family: serif;');
                expect(serialize()).toContain('background-color: red;');
            });

            test('style coercion emits styles', () => {
                const myStyle = style(() => ({ body: { padding: '1rem' } }));
                expect('' + myStyle).toBe('');
                expect(serialize()).toContain('body { padding: 1rem; }');
            });

            test('style resolver is idempotent', () => {
                const myStyle = style(() => ({ body: { padding: '1rem' } }));
                myStyle();
                myStyle();
                expect(serialize()).toContain('body { padding: 1rem; }');
            });

            test('hydration reuses existing stylesheet', () => {
                document.head.insertAdjacentHTML(
                    'beforeend',
                    `<style ${EFFCSS_KEY_ATTR}="${defGlobalKey}-7" ${EFFCSS_COUNT_ATTR}="1">.server-rule{color:red;}</style>`
                );
                const existing = document.head.querySelector(`style[${EFFCSS_KEY_ATTR}="${defGlobalKey}-7"]`);

                const myStyle = style(() => ({ '.client-rule': { color: 'blue' } }));
                myStyle();

                const styles = document.head.querySelectorAll(`style[${EFFCSS_KEY_ATTR}="${defGlobalKey}-7"]`);
                expect(styles.length).toBe(1);
                expect(styles[0]).toBe(existing);
            });
        });

        describe('theme', () => {
            test('set switches theme, get returns current', () => {
                const myTheme = theme({
                    vars: { bg: '#eff', fg: 'black' },
                    options: {
                        light: { bg: '#eff', fg: 'black' },
                        dark: { bg: '#111', fg: 'white' }
                    },
                    initial: 'light'
                });
                expect(serialize()).toBe('');
                myTheme.vars.bg();
                expect(serialize()).toContain('initial-value: #eff;');
                expect(serialize()).not.toContain('initial-value: black;');
                myTheme.vars.fg();
                expect(serialize()).toContain('initial-value: black;');
                expect(myTheme.get()).toBe('light');
                expect(myTheme.set('dark')).toBe(true);
                expect(myTheme.get()).toBe('dark');
                expect(myTheme.vars.bg.get()).toBe('#111');
            });

            test('single variable override via vars resolver', () => {
                const myTheme = theme({
                    vars: { bg: '#eff', fg: '#000' },
                    options: { light: { bg: '#eff', fg: '#000' } },
                    initial: 'light'
                });
                myTheme.vars.bg + '';
                myTheme.vars.fg();
                myTheme.vars.bg.set('#eee');
                expect(myTheme.vars.bg.get()).toBe('#eee');
                expect(myTheme.vars.fg.get()).toBe('#000');
            });

            test('no initial: no values until set', () => {
                const myTheme = theme({
                    vars: { bg: '#eff' },
                    options: { light: { bg: '#eff' }, dark: { bg: '#111' } }
                });
                myTheme.vars.bg + '';
                expect(myTheme.get()).toBeUndefined();
                expect(myTheme.set('dark')).toBe(true);
                expect(myTheme.get()).toBe('dark');
                expect(myTheme.vars.bg.get()).toBe('#111');
            });

            test('theme with object variable config keeps syntax', () => {
                const myTheme = theme({
                    vars: { bg: { initialValue: '#eff', syntax: '<color>' } },
                    options: { light: { bg: '#eff' } },
                    initial: 'light'
                });
                myTheme.vars.bg + '';
                expect(serialize()).toContain('syntax: "<color>";');
            });

            test('set before emission on first use', () => {
                const myTheme = theme({
                    vars: { bg: '#eff' },
                    options: { light: { bg: '#eff' }, dark: { bg: '#111' } }
                });
                expect(myTheme.set('dark')).toBe(true);
                myTheme.vars.bg + '';
                expect(myTheme.vars.bg.get()).toBe('#111');
            });

            test('get on an not-emitted variable returns empty', () => {
                const myTheme = theme({
                    vars: { bg: '#eff' },
                    options: { light: { bg: '#eff' } },
                    initial: 'light'
                });
                expect(myTheme.vars.bg.get()).toBe('');
            });

            test('unknown theme name returns false', () => {
                const myTheme = theme({
                    vars: { bg: '#eff' },
                    options: { light: { bg: '#eff' } },
                    initial: 'light'
                });
                expect(myTheme.set('nonexistent' as never)).toBe(false);
                expect(myTheme.get()).toBe('light');
            });
        });

        describe('provider lifecycle', () => {
            test('getConfig returns default key', () => {
                expect(getConfig()).toEqual({ key: defGlobalKey });
            });

            test('setConfig false after provider exists', () => {
                style(() => ({ body: { margin: 0 } }))();
                expect(setConfig({ key: 'late' })).toBe(false);
            });

            test('clear wipes styles and resets counters', () => {
                const size = variable('12px');
                expect(size()).toBe(`var(--${defGlobalKey}_2-0)`);
                expect(serialize()).toContain(`="${defGlobalKey}-2"`);
                clear();
                expect(size()).toBe(`var(--${defGlobalKey}_2-0)`);
                expect(serialize()).toBe('');
            });

            test('while hydration skips a disabled stylesheet', () => {
                document.head.insertAdjacentHTML(
                    'beforeend',
                    `<style ${EFFCSS_KEY_ATTR}="${defGlobalKey}-2" ${EFFCSS_COUNT_ATTR}="1" disabled>@property --${defGlobalKey}_2-0{syntax:"*";inherits:true;initial-value:12px;}</style>`
                );
                const el = document.head.querySelector(
                    `style[${EFFCSS_KEY_ATTR}="${defGlobalKey}-2"]`
                ) as HTMLStyleElement;
                el.disabled = true;
                variable('24px')();
                expect(serialize()).not.toContain(`="${defGlobalKey}-2"`);
            });
        });
    });

    describe('context provider', () => {
        describe('variable', () => {
            test('token shape, var() and string coercion', () => {
                const key = getKey();
                const ctx = createCtx({ key });
                let counter = 0;
                const size = ctx.variable('12px');
                const name = '' + size;
                expect(name).toBe(`--${key}_2-${counter++}`);
                expect(size()).toBe(`var(${name})`);
                expect(size('18px')).toBe(`var(${name},18px)`);
                expect('' + ctx.variable('1rem')).toBe(`--${key}_2-${counter++}`);
            });

            test('get/set after emission', () => {
                const key = getKey();
                const ctx = createCtx({ key });
                const size = ctx.variable('12px');
                size();
                expect(size.get()).toBe('12px');
                size.set('24px');
                expect(size.get()).toBe('24px');
                size.set((prev) => prev + 'x');
                expect(size.get()).toBe('24pxx');
            });

            test('no CSS until used', () => {
                const key = getKey();
                const ctx = createCtx({ key });
                const size = ctx.variable('12px');
                expect(ctx.serialize()).toBe('');
                size();
                expect(ctx.serialize()).toContain('@property');
                ctx.clear();
                const angle = ctx.variable('30deg');
                expect(ctx.serialize()).toBe('');
                angle + '';
                expect(ctx.serialize()).toContain('@property');
            });

            test('object config: syntax, inherits and initialValue', () => {
                const key = getKey();
                const ctx = createCtx({ key });
                const size = ctx.variable({ initialValue: '12px', syntax: '<length>', inherits: false });
                size();
                expect(ctx.serialize()).toContain('syntax: "<length>"; inherits: false; initial-value: 12px;');
            });

            test('short syntax is emitted without angle brackets', () => {
                const key = getKey();
                const ctx = createCtx({ key });
                const color = ctx.variable({ initialValue: '#eff', syntax: 'color' });
                color();
                expect(ctx.serialize()).toContain('syntax: "<color>";');
            });

            test('full syntax string is emitted as-is', () => {
                const key = getKey();
                const ctx = createCtx({ key });
                const custom = ctx.variable({ initialValue: '10%', syntax: '<length> | <percentage>' });
                custom();
                expect(ctx.serialize()).toContain('syntax: "<length> | <percentage>";');
            });

            test('get/set on not-emitted variable', () => {
                const key = getKey();
                const ctx = createCtx({ key });
                const size = ctx.variable('12px');
                expect(ctx.serialize()).toBe('');
                expect(size.get()).toBe('');
                size.set('24px');
                expect(ctx.serialize()).toBe('');
                size();
                expect(size.get()).toBe('12px');
            });

            test('number initialValue coerced to string', () => {
                const key = getKey();
                const ctx = createCtx({ key });
                const size = ctx.variable({ initialValue: 0, syntax: '<number>' });
                size();
                expect(ctx.serialize()).toContain('initial-value: 0;');
            });

            test('variable without initialValue emits no initial-value', () => {
                const key = getKey();
                const ctx = createCtx({ key });
                const size = ctx.variable();
                size();
                expect(ctx.serialize()).toContain(`@property --${key}_2-0`);
                expect(ctx.serialize()).not.toContain('initial-value');
            });

            test('null initialValue returns empty', () => {
                const key = getKey();
                const ctx = createCtx({ key });
                const size = ctx.variable({ initialValue: null });
                size();
                expect(size.get()).toBe('');
            });

            test('star and quoted syntax as-is', () => {
                const key = getKey();
                const ctx = createCtx({ key });
                const any = ctx.variable({ initialValue: '1', syntax: '*' });
                const quoted = ctx.variable({ initialValue: '#eff', syntax: '"<color>"' });
                any + '';
                quoted + '';
                const css = ctx.serialize();
                expect(css).toContain('syntax: "*";');
                expect(css).toContain('syntax: "<color>";');
            });

            test('hydration reuses existing stylesheet', () => {
                const key = getKey();
                document.head.insertAdjacentHTML(
                    'beforeend',
                    `<style ${EFFCSS_KEY_ATTR}="${key}-2" ${EFFCSS_COUNT_ATTR}="1">@property --${key}_2-0{syntax:"*";inherits:true;initial-value:12px;}</style>`
                );
                const existing = document.head.querySelector(`style[${EFFCSS_KEY_ATTR}="${key}-2"]`);
                expect(existing).not.toBeNull();

                const ctx = createCtx({ key });
                const size = ctx.variable('12px');
                size();

                const styles = document.head.querySelectorAll(`style[${EFFCSS_KEY_ATTR}="${key}-2"]`);
                expect(styles.length).toBe(1);
                expect(styles[0]).toBe(existing);
            });
        });

        describe('animation', () => {
            test('uses object arg to create resolver', () => {
                const key = getKey();
                const ctx = createCtx({ key });
                const myAnimation = ctx.animation({ from: { width: '100px' }, to: { width: '200px' } });
                expect(ctx.serialize()).toBe('');
                const token = myAnimation();
                expect(token).toContain(`${key}_3-`);
                expect(ctx.serialize()).toContain(`@keyframes ${token}`);
            });

            test('uses function arg with tokens to create resolver', () => {
                const key = getKey();
                const ctx = createCtx({ key });
                const size = ctx.variable('100px');
                const myAnimation = ctx.animation(() => ({ from: { width: size() }, to: { width: '200px' } }));
                expect(ctx.serialize()).toBe('');
                const token = myAnimation();
                expect(token).toContain(`${key}_3-`);
                expect(ctx.serialize()).toContain(`@keyframes ${token}`);
            });

            test('uses object arg with tokens to throw TypeError on usage', () => {
                const key = getKey();
                const ctx = createCtx({ key });
                const size = ctx.variable('100px');
                const myAnimation = ctx.animation({ from: { width: size() }, to: { width: '200px' } });
                expect(() => myAnimation()).toThrow(TypeError);
            });
        });

        describe('layers', () => {
            test('returns object of resolvers with @layer', () => {
                const key = getKey();
                const ctx = createCtx({ key });
                let counter = 0;
                const myLayers = ctx.layers(['reset', 'base']);
                expect(ctx.serialize()).toBe('');
                expect(myLayers.reset()).toBe(`@layer ${key}_0-${counter++}`);
                const html = ctx.serialize();
                expect(html).toContain(`@layer ${key}_0-0, ${key}_0-1;`);
                expect(myLayers.base()).toBe(`@layer ${key}_0-${counter++}`);
                expect(ctx.serialize()).toBe(html);
            });

            test('layer coercion equals call', () => {
                const key = getKey();
                const ctx = createCtx({ key });
                let counter = 0;
                const myLayers = ctx.layers(['reset']);
                // coercion and call materialize the same resolver once
                expect('' + myLayers.reset).toBe(`@layer ${key}_0-${counter}`);
                expect(myLayers.reset()).toBe(`@layer ${key}_0-${counter}`);
            });
        });

        describe('container', () => {
            test('returns name/type, coercion returns @container', () => {
                const key = getKey();
                const ctx = createCtx({ key });
                let counter = 0;
                const myContainer = ctx.container('inline-size');
                expect(ctx.serialize()).toBe('');
                const as = '' + myContainer;
                expect(as).toBe(`@container ${key}_4-${counter}`);
                expect(ctx.serialize()).toBe('');
                const name = as.slice('@container '.length);
                expect(myContainer()).toBe(`${name} / inline-size`);
                expect(ctx.serialize()).toBe('');
            });

            test('container without type uses default', () => {
                const key = getKey();
                const ctx = createCtx({ key });
                let counter = 0;
                const myContainer = ctx.container();
                const as = '' + myContainer;
                expect(as).toBe(`@container ${key}_4-${counter++}`);
                const name = as.slice('@container '.length);
                expect(myContainer()).toBe(`${name} / normal`);
            });
        });

        describe('font', () => {
            test('returns bare name and generates @font-face', () => {
                const key = getKey();
                const ctx = createCtx({ key });
                const myFont = ctx.font({ src: 'url("x.woff2")' });
                expect(ctx.serialize()).toBe('');
                const token = myFont();
                expect(token).toContain(`${key}_1-`);
                expect(ctx.serialize()).toContain('@font-face ');
                expect(ctx.serialize()).toContain(`font-family: ${token}`);
                expect(myFont + '').toBe(token);
            });

            test('fallbacks appended after family name', () => {
                const key = getKey();
                const ctx = createCtx({ key });
                const myFont = ctx.font({ src: 'url("x.woff2")' });
                const name = myFont();
                expect(myFont('sans-serif')).toBe(`${name}, sans-serif`);
                expect(myFont('Arial', 'sans-serif')).toBe(`${name}, Arial, sans-serif`);
            });

            test('coercion reuses cached resolver', () => {
                const key = getKey();
                const ctx = createCtx({ key });
                const myFont = ctx.font({ src: 'url("x.woff2")' });
                const name = myFont();
                expect('' + myFont).toBe(name);
            });
        });

        describe('className', () => {
            test('uses object arg to create resolver', () => {
                const key = getKey();
                const ctx = createCtx({ key });
                const myCls = ctx.className({ margin: 'auto' });
                expect(ctx.serialize()).toBe('');
                const token = myCls();
                expect(token).toContain(`${key}_6-`);
                expect(ctx.serialize()).toContain(`.${token} { margin: auto; }`);
                expect(myCls + '').toBe(token);
            });

            test('uses function arg with tokens to create resolver', () => {
                const key = getKey();
                const ctx = createCtx({ key });
                const size = ctx.variable('100px');
                const myCls = ctx.className(() => ({ padding: size() }));
                expect(ctx.serialize()).toBe('');
                const token = myCls();
                expect(token).toContain(`${key}_6-`);
                expect(ctx.serialize()).toContain(`.${token} { padding: var(--${key}_2-0); }`);
            });

            test('uses object arg with tokens to throw TypeError on usage', () => {
                const key = getKey();
                const ctx = createCtx({ key });
                const size = ctx.variable('100px');
                const myCls = ctx.className({ padding: size() });
                expect(() => myCls()).toThrow(TypeError);
            });

            test('object arg with a token from another context throws TypeError', () => {
                const firstCtx = createCtx({ key: getKey() });
                const secondCtx = createCtx({ key: getKey() });
                const foreign = firstCtx.variable('100px');
                // the guard is key-agnostic
                const myCls = secondCtx.className({ padding: foreign() });
                expect(() => myCls()).toThrow(TypeError);
            });

            test('object arg with a global token throws TypeError', () => {
                const ctx = createCtx({ key: getKey() });
                const globalSize = variable('100px');
                // a global token is caught by the key-agnostic guard as well
                const myCls = ctx.className({ padding: globalSize() });
                expect(() => myCls()).toThrow(TypeError);
            });

            test('postfix variants create distinct tokens', () => {
                const key = getKey();
                const ctx = createCtx({ key });
                const myCls = ctx.className(() => ({ color: 'red' }));
                const baseToken = myCls();
                const hoverToken = myCls(':hover');
                const focusToken = myCls(':focus');
                const dataToken = myCls('[data-state="open"]');
                // each postfix yields a distinct token, different from the base
                expect(hoverToken).not.toBe(baseToken);
                expect(focusToken).not.toBe(baseToken);
                expect(focusToken).not.toBe(hoverToken);
                expect(dataToken).not.toBe(baseToken);
                expect(ctx.serialize()).toContain(`.${hoverToken}:hover { color: red; }`);
                expect(ctx.serialize()).toContain(`.${focusToken}:focus { color: red; }`);
                expect(ctx.serialize()).toContain(`.${dataToken}[data-state="open"] { color: red; }`);
            });

            test('multiple postfixes combined in selector', () => {
                const key = getKey();
                const ctx = createCtx({ key });
                const myCls = ctx.className(() => ({ color: 'red' }));
                const token = myCls(':hover', '[data-state="open"]', '@media (max-width: 700px)');
                expect(ctx.serialize()).toContain(
                    `@media (max-width: 700px) {\n  .${token}:hover[data-state="open"] { color: red; }\n}`
                );
            });

            test('className coercion equals call', () => {
                const key = getKey();
                const ctx = createCtx({ key });
                const myCls = ctx.className(() => ({ margin: 'auto' }));
                const token = myCls();
                expect('' + myCls).toBe(token);
            });

            test('at-rule postfix wraps at nesting level', () => {
                const key = getKey();
                const ctx = createCtx({ key });
                const myCls = ctx.className(() => ({ color: 'red' }));
                const token = myCls('@media (max-width: 700px)');
                expect(ctx.serialize()).toContain('@media (max-width: 700px)');
                expect(ctx.serialize()).toContain(`.${token} { color: red; }`);
            });

            test('hydration reuses existing stylesheet', () => {
                // type 6 = className
                const key = getKey();
                document.head.insertAdjacentHTML(
                    'beforeend',
                    `<style ${EFFCSS_KEY_ATTR}="${key}-6" ${EFFCSS_COUNT_ATTR}="1">.${key}_6-0{padding:4px;}</style>`
                );
                const existing = document.head.querySelector(`style[${EFFCSS_KEY_ATTR}="${key}-6"]`);

                const ctx = createCtx({ key });
                const myCls = ctx.className(() => ({ padding: '4px' }));
                myCls();

                const styles = document.head.querySelectorAll(`style[${EFFCSS_KEY_ATTR}="${key}-6"]`);
                expect(styles.length).toBe(1);
                expect(styles[0]).toBe(existing);
            });

            test('hydration reuses server blocks, writes only the new one', () => {
                const key = getKey();
                document.head.insertAdjacentHTML(
                    'beforeend',
                    `<style ${EFFCSS_KEY_ATTR}="${key}-6" ${EFFCSS_COUNT_ATTR}="2">.${key}_6-0{padding:4px;}.${key}_6-1{padding:4px;}</style>`
                );
                const existing = document.head.querySelector(
                    `style[${EFFCSS_KEY_ATTR}="${key}-6"]`
                ) as HTMLStyleElement;

                const ctx = createCtx({ key });
                // each className resolver create a distinct token
                const firstCls = ctx.className(() => ({ padding: '4px' }))();
                const secondCls = ctx.className(() => ({ padding: '4px' }))();
                const thirdCls = ctx.className(() => ({ padding: '4px' }))();

                expect(firstCls).toBe(`${key}_6-0`);
                expect(secondCls).toBe(`${key}_6-1`);
                expect(thirdCls).toBe(`${key}_6-2`);

                // the hydrated stylesheet keeps the 2 server rules and gains exactly 1 new rule
                expect(existing.sheet!.cssRules.length).toBe(3);
                expect(ctx.serialize()).toContain(`.${key}_6-2`);
            });
        });

        describe('id', () => {
            test('uses object arg to create resolver', () => {
                const key = getKey();
                const ctx = createCtx({ key });
                const myId = ctx.id({ margin: 'auto' });
                expect(ctx.serialize()).toBe('');
                const token = myId();
                expect(token).toContain(`${key}_5-`);
                expect(ctx.serialize()).toContain(`#${token} { margin: auto; }`);
                expect(myId + '').toBe(token);
            });

            test('uses function arg with tokens to create resolver', () => {
                const key = getKey();
                const ctx = createCtx({ key });
                const size = ctx.variable('100px');
                const myId = ctx.id(() => ({ padding: size() }));
                expect(ctx.serialize()).toBe('');
                const token = myId();
                expect(token).toContain(`${key}_5-`);
                expect(ctx.serialize()).toContain(`#${token} { padding: var(--${key}_2-0); }`);
            });

            test('uses object arg with tokens to throw TypeError on usage', () => {
                const key = getKey();
                const ctx = createCtx({ key });
                const size = ctx.variable('100px');
                const myId = ctx.id({ padding: size() });
                expect(() => myId()).toThrow(TypeError);
            });

            test('id supports postfix modifiers like className', () => {
                const key = getKey();
                const ctx = createCtx({ key });
                const myId = ctx.id(() => ({ color: 'red' }));
                const baseToken = myId();
                const hoverToken = myId(':hover');
                const dataToken = myId('[data-state="open"]');
                expect(hoverToken).not.toBe(baseToken);
                expect(dataToken).not.toBe(baseToken);
                expect(ctx.serialize()).toContain(`#${hoverToken}:hover { color: red; }`);
                expect(ctx.serialize()).toContain(`#${dataToken}[data-state="open"] { color: red; }`);
            });

            test('multiple postfixes combined in selector', () => {
                const key = getKey();
                const ctx = createCtx({ key });
                const myId = ctx.id(() => ({ color: 'red' }));
                const token = myId(':hover', '[data-state="open"]', '@media (max-width: 700px)');
                expect(ctx.serialize()).toContain(
                    `@media (max-width: 700px) {\n  #${token}:hover[data-state="open"] { color: red; }\n}`
                );
            });

            test('at-rule postfix wraps at nesting level', () => {
                const key = getKey();
                const ctx = createCtx({ key });
                const myId = ctx.id(() => ({ color: 'red' }));
                const token = myId('@media (max-width: 700px)');
                expect(ctx.serialize()).toContain('@media (max-width: 700px)');
                expect(ctx.serialize()).toContain(`#${token} { color: red; }`);
            });

            test('id coercion equals call', () => {
                const key = getKey();
                const ctx = createCtx({ key });
                const myId = ctx.id(() => ({ margin: 'auto' }));
                const token = myId();
                expect('' + myId).toBe(token);
            });
        });

        describe('style', () => {
            test('uses function arg to create resolver', () => {
                const key = getKey();
                const ctx = createCtx({ key });
                const myStyle = ctx.style(() => ({ body: { padding: '1rem' } }));
                expect(ctx.serialize()).toBe('');
                const emptyString = myStyle();
                expect(emptyString).toBe('');
                expect(ctx.serialize()).toContain('body { padding: 1rem; }');
                expect(myStyle + '').toBe(emptyString);
            });

            test('uses object arg to create resolver', () => {
                const key = getKey();
                const ctx = createCtx({ key });
                const myStyle = ctx.style({ body: { padding: '1rem' } });
                expect(ctx.serialize()).toBe('');
                const emptyString = myStyle();
                expect(emptyString).toBe('');
                expect(ctx.serialize()).toContain('body { padding: 1rem; }');
            });

            test('uses object arg with tokens to throw TypeError on usage', () => {
                const key = getKey();
                const ctx = createCtx({ key });
                const size = ctx.variable('100px');
                const myStyle = ctx.style({ body: { padding: size() } });
                expect(() => myStyle()).toThrow(TypeError);
            });

            test('null and undefined values are skipped', () => {
                const key = getKey();
                const ctx = createCtx({ key });
                const myStyle = ctx.style(() => ({ body: { padding: '1rem', margin: null, gap: undefined } }) as never);
                myStyle();
                const css = ctx.serialize();
                expect(css).toContain('padding: 1rem;');
                expect(css).not.toContain('margin');
                expect(css).not.toContain('gap');
            });

            test('array values are flattened', () => {
                const key = getKey();
                const ctx = createCtx({ key });
                const myStyle = ctx.style(() => ({ body: { margin: ['0', 'auto'] } }) as never);
                const nextMyStyle = ctx.style({
                    '@font-face': [
                        {
                            fontFamily: '"Bitstream Vera Serif Bold"',
                            src: 'url("https://mdn.github.io/shared-assets/fonts/FiraSans-Regular.woff2")'
                        },
                        {
                            fontFamily: '"MyHelvetica"',
                            src: 'local("Helvetica Neue Bold"), local("HelveticaNeue-Bold"), url("MgOpenModernaBold.woff2")',
                            fontWeight: 'bold'
                        }
                    ]
                });
                expect(() => myStyle()).not.toThrow();
                expect(() => nextMyStyle()).not.toThrow();
                // each object in the array yields its own rule
                expect(ctx.serialize()).toContain('@font-face { font-family: "Bitstream Vera Serif Bold";');
                expect(ctx.serialize()).toContain('@font-face { font-family: MyHelvetica;');
            });

            test('empty string value should be quoted', () => {
                const key = getKey();
                const ctx = createCtx({ key });
                const myStyle = ctx.style(() => ({ body: { content: '""' } }) as never);
                myStyle();
                expect(ctx.serialize()).toContain('content: "";');
            });

            test('empty string emits a bare at-rule declaration', () => {
                const key = getKey();
                const ctx = createCtx({ key });
                const layerDeclaration = '@layer custom';
                const myStyle = ctx.style(() => ({ [layerDeclaration]: '' }) as never);
                myStyle();
                expect(ctx.serialize()).toContain(layerDeclaration + ';');
            });

            test('camelCase properties are kebab-cased', () => {
                const key = getKey();
                const ctx = createCtx({ key });
                const myStyle = ctx.style(
                    () => ({ body: { fontFamily: 'serif', 'background-color': 'red' } }) as never
                );
                myStyle();
                expect(ctx.serialize()).toContain('font-family: serif;');
                expect(ctx.serialize()).toContain('background-color: red;');
            });

            test('style coercion emits styles', () => {
                const key = getKey();
                const ctx = createCtx({ key });
                const myStyle = ctx.style(() => ({ body: { padding: '1rem' } }));
                expect('' + myStyle).toBe('');
                expect(ctx.serialize()).toContain('body { padding: 1rem; }');
            });

            test('style resolver is idempotent', () => {
                const key = getKey();
                const ctx = createCtx({ key });
                const myStyle = ctx.style(() => ({ body: { padding: '1rem' } }));
                myStyle();
                myStyle();
                expect(ctx.serialize()).toContain('body { padding: 1rem; }');
            });

            test('hydration reuses existing stylesheet', () => {
                const key = getKey();
                document.head.insertAdjacentHTML(
                    'beforeend',
                    `<style ${EFFCSS_KEY_ATTR}="${key}-7" ${EFFCSS_COUNT_ATTR}="1">.server-rule{color:red;}</style>`
                );
                const existing = document.head.querySelector(`style[${EFFCSS_KEY_ATTR}="${key}-7"]`);

                const ctx = createCtx({ key });
                const myStyle = ctx.style(() => ({ '.client-rule': { color: 'blue' } }));
                myStyle();

                const styles = document.head.querySelectorAll(`style[${EFFCSS_KEY_ATTR}="${key}-7"]`);
                expect(styles.length).toBe(1);
                expect(styles[0]).toBe(existing);
            });
        });

        describe('theme', () => {
            test('set switches theme, get returns current', () => {
                const key = getKey();
                const ctx = createCtx({ key });
                const myTheme = ctx.theme({
                    vars: { bg: '#eff', fg: 'black' },
                    options: {
                        light: { bg: '#eff', fg: 'black' },
                        dark: { bg: '#111', fg: 'white' }
                    },
                    initial: 'light'
                });
                expect(ctx.serialize()).toBe('');
                myTheme.vars.bg();
                expect(ctx.serialize()).toContain('initial-value: #eff;');
                expect(ctx.serialize()).not.toContain('initial-value: black;');
                myTheme.vars.fg();
                expect(ctx.serialize()).toContain('initial-value: black;');
                expect(myTheme.get()).toBe('light');
                expect(myTheme.set('dark')).toBe(true);
                expect(myTheme.get()).toBe('dark');
                expect(myTheme.vars.bg.get()).toBe('#111');
            });

            test('single variable override via vars resolver', () => {
                const key = getKey();
                const ctx = createCtx({ key });
                const myTheme = ctx.theme({
                    vars: { bg: '#eff', fg: '#000' },
                    options: { light: { bg: '#eff', fg: '#000' } },
                    initial: 'light'
                });
                myTheme.vars.bg + '';
                myTheme.vars.fg();
                myTheme.vars.bg.set('#eee');
                expect(myTheme.vars.bg.get()).toBe('#eee');
                expect(myTheme.vars.fg.get()).toBe('#000');
            });

            test('no initial: no values until set', () => {
                const key = getKey();
                const ctx = createCtx({ key });
                const myTheme = ctx.theme({
                    vars: { bg: '#eff' },
                    options: { light: { bg: '#eff' }, dark: { bg: '#111' } }
                });
                myTheme.vars.bg + '';
                expect(myTheme.get()).toBeUndefined();
                expect(myTheme.set('dark')).toBe(true);
                expect(myTheme.get()).toBe('dark');
                expect(myTheme.vars.bg.get()).toBe('#111');
            });

            test('theme with object variable config keeps syntax', () => {
                const key = getKey();
                const ctx = createCtx({ key });
                const myTheme = ctx.theme({
                    vars: { bg: { initialValue: '#eff', syntax: '<color>' } },
                    options: { light: { bg: '#eff' } },
                    initial: 'light'
                });
                myTheme.vars.bg + '';
                expect(ctx.serialize()).toContain('syntax: "<color>";');
            });

            test('set before emission on first use', () => {
                const key = getKey();
                const ctx = createCtx({ key });
                const myTheme = ctx.theme({
                    vars: { bg: '#eff' },
                    options: { light: { bg: '#eff' }, dark: { bg: '#111' } }
                });
                expect(myTheme.set('dark')).toBe(true);
                myTheme.vars.bg + '';
                expect(myTheme.vars.bg.get()).toBe('#111');
            });

            test('get on an not-emitted variable returns empty', () => {
                const key = getKey();
                const ctx = createCtx({ key });
                const myTheme = ctx.theme({
                    vars: { bg: '#eff' },
                    options: { light: { bg: '#eff' } },
                    initial: 'light'
                });
                expect(myTheme.vars.bg.get()).toBe('');
            });

            test('unknown theme name returns false', () => {
                const key = getKey();
                const ctx = createCtx({ key });
                const myTheme = ctx.theme({
                    vars: { bg: '#eff' },
                    options: { light: { bg: '#eff' } },
                    initial: 'light'
                });
                expect(myTheme.set('nonexistent' as never)).toBe(false);
                expect(myTheme.get()).toBe('light');
            });
        });

        describe('context lifecycle', () => {
            test('isolated contexts with different keys', () => {
                const firstKey = getKey();
                const secondKey = getKey();
                const firstCtx = createCtx({ key: firstKey });
                const secondCtx = createCtx({ key: secondKey });

                const firstCls = firstCtx.className(() => ({ background: 'white' }));
                const firstToken = firstCls();
                expect(firstToken).toBe(`${firstKey}_6-0`);

                const secondCls = secondCtx.className(() => ({ background: 'white' }));
                const secondToken = secondCls();
                expect(secondToken).toBe(`${secondKey}_6-0`);

                // class names must differ because keys differ
                expect(firstToken).not.toBe(secondToken);

                // serialization of each context must contain only its own key
                const firstCSS = firstCtx.serialize();
                const secondCSS = secondCtx.serialize();

                expect(firstCSS).toContain(`${firstKey}_6-0`);
                expect(firstCSS).not.toContain(secondKey);
                expect(firstCSS).not.toContain('f_6');

                expect(secondCSS).toContain(`${secondKey}_6-0`);
                expect(secondCSS).not.toContain(firstKey);
                expect(secondCSS).not.toContain('f_6');
            });

            test('contexts do not share at-rules', () => {
                const firstKey = getKey();
                const secondKey = getKey();
                const firstCtx = createCtx({ key: firstKey });
                const secondCtx = createCtx({ key: secondKey });

                const firstVar = firstCtx.variable('red');
                const secondVar = secondCtx.variable('blue');

                // resolvers are independent
                expect('' + firstVar).toBe(`--${firstKey}_2-0`);
                expect('' + secondVar).toBe(`--${secondKey}_2-0`);
                expect('' + firstVar).not.toBe('' + secondVar);

                const firstCSS = firstCtx.serialize();
                const secondCSS = secondCtx.serialize();

                // each context serializes only its own variable
                expect(firstCSS).toContain(`--${firstKey}_2-0`);
                expect(firstCSS).not.toContain(`--${secondKey}_2-0`);

                expect(secondCSS).toContain(`--${secondKey}_2-0`);
                expect(secondCSS).not.toContain(`--${firstKey}_2-0`);
            });

            test('counters are independent per context', () => {
                const firstKey = getKey();
                const secondKey = getKey();
                const firstCtx = createCtx({ key: firstKey });
                const secondCtx = createCtx({ key: secondKey });

                // both start at 0 for their own key
                expect('' + firstCtx.variable('red')).toBe(`--${firstKey}_2-0`);
                expect('' + secondCtx.variable('red')).toBe(`--${secondKey}_2-0`);

                // incrementing one context does not affect the other
                expect('' + firstCtx.variable('blue')).toBe(`--${firstKey}_2-1`);
                expect('' + secondCtx.variable('blue')).toBe(`--${secondKey}_2-1`);
            });

            test('default context independent from custom', () => {
                const key = getKey();
                const ctx = createCtx({ key });

                const ctxCls = ctx.className(() => ({ background: 'white' }));
                const cls = ctxCls();
                expect(cls).toBe(`${key}_6-0`);

                const css = ctx.serialize();
                expect(css).toContain(`${key}_6-0`);
                expect(css).not.toContain(`${defGlobalKey}_6`);
            });

            test('ctx.getConfig returns the context key', () => {
                const key = getKey();
                const ctx = createCtx({ key });
                expect(ctx.getConfig()).toEqual({ key });
            });

            test('invalid key throws TypeError', () => {
                // key must start with a letter and contain only letters/digits/_/-
                expect(() => context({ key: '1bad' })).toThrow(TypeError);
                expect(() => context({ key: 'bad key' })).toThrow(TypeError);
            });

            test('claimed key throws', () => {
                const key = getKey();
                createCtx({ key });
                expect(() => context({ key })).toThrow(/already in use/);
            });

            test('dispose releases the key', () => {
                const key = getKey();
                const firstCtx = createCtx({ key });
                firstCtx.className(() => ({ padding: '4px' }))();
                firstCtx.dispose();
                // the same key can now be claimed by a new context
                const secondCtx = createCtx({ key });
                expect(secondCtx.className(() => ({ padding: '4px' }))()).toBe(`${key}_6-0`);
            });

            test('dispose blocks style generation', () => {
                const key = getKey();
                const ctx = createCtx({ key });
                ctx.dispose();
                expect(() => ctx.className(() => ({ padding: '4px' }))()).toThrow(/disposed/);
                expect(() => '' + ctx.variable('red')).toThrow(/disposed/);
                expect(() => ctx.style(() => ({ body: { padding: '1rem' } }))()).toThrow(/disposed/);
            });

            test('dispose is idempotent', () => {
                const key = getKey();
                const ctx = createCtx({ key });
                ctx.dispose();
                expect(() => ctx.dispose()).not.toThrow();
            });

            test('clear wipes styles, keeps usable', () => {
                const key = getKey();
                const ctx = createCtx({ key });
                ctx.className(() => ({ padding: '4px' }))();
                expect(ctx.serialize()).toContain(`${key}_6-0`);

                ctx.clear();
                expect(ctx.serialize()).toBe('');

                // context still works and the key stays claimed
                expect(ctx.className(() => ({ padding: '8px' }))()).toBe(`${key}_6-0`);
                expect(ctx.serialize()).toContain(`${key}_6-0`);
            });

            describe('hydration', () => {
                test('clear removes hydrated style element', () => {
                    const key = getKey();
                    document.head.insertAdjacentHTML(
                        'beforeend',
                        `<style ${EFFCSS_KEY_ATTR}="${key}-2" ${EFFCSS_COUNT_ATTR}="1">@property --${key}_2-0{syntax:"*";inherits:true;initial-value:12px;}</style>`
                    );
                    const existing = document.head.querySelector(`style[${EFFCSS_KEY_ATTR}="${key}-2"]`);
                    expect(existing).not.toBeNull();

                    const ctx = createCtx({ key });
                    ctx.variable('12px')(); // reuses the hydrated <style> element

                    // clear() must remove the owning <style> element from the DOM
                    ctx.clear();
                    expect(document.head.querySelector(`style[${EFFCSS_KEY_ATTR}="${key}-2"]`)).toBeNull();
                });
            });
        });
    });
});
