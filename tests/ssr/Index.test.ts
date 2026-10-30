import { afterAll, describe, expect, test } from 'vitest';
import {
    className,
    clear,
    context,
    getConfig,
    getContexts,
    serialize,
    setConfig,
    style,
    theme,
    variable
} from '../../src/index';

describe('Server-side (SSR):', () => {
    const keyPrefix = 'ssr';
    let counter = 0;
    const getKey = () => keyPrefix + counter++;

    afterAll(() => {
        counter = 0;
    });

    describe('getConfig / setConfig', () => {
        const key = getKey();

        test('setConfig returns boolean, getConfig reports config', () => {
            const result = setConfig({ key });
            expect(typeof result).toBe('boolean');
            // getConfig always returns a config object with a key
            expect(getConfig()).toEqual(expect.objectContaining({ key }));
        });

        test('setConfig with invalid key throws', () => {
            expect(() => setConfig({ key: '1bad' })).toThrow(TypeError);
            expect(() => setConfig({ key: 'bad key' })).toThrow(TypeError);
        });

        test('getConfig reports provider key', () => {
            const resolver = variable('12px');
            resolver();
            // globalProvider now exists -> getConfig returns its key object
            expect(getConfig()).toEqual({ key });
        });

        test('setConfig after provider exists returns false', () => {
            // materialize the shared global provider
            variable('12px')();
            expect(setConfig({ key: 'late' })).toBe(false);
        });

        test('ctx.getConfig returns context key', () => {
            const key = getKey();
            const ctx = context({ key });
            expect(ctx.getConfig()).toEqual({ key });
        });
    });

    describe('serialize', () => {
        test('style tags per type with context key', () => {
            const key = getKey();
            const ctx = context({ key });
            let html = ctx.serialize();
            expect(html).not.toContain(`<style data-effcss-key="${key}-2" data-effcss-count="1">`);

            const size = ctx.variable('12px');
            size();
            html = ctx.serialize();
            expect(html).toContain(`<style data-effcss-key="${key}-2" data-effcss-count="1">`);
            expect(html).toContain(`@property --${key}_2-0`);
            expect(html).not.toContain(`<style data-effcss-key="${key}-3" data-effcss-count="1">`);

            const anim = ctx.animation({ from: { opacity: '0' }, to: { opacity: '1' } });
            anim();
            html = ctx.serialize();
            expect(html).toContain(`<style data-effcss-key="${key}-3" data-effcss-count="1">`);
            expect(html).toContain(`@keyframes ${key}_3-0`);
            expect(html).not.toContain(`<style data-effcss-key="${key}-6" data-effcss-count="1">`);

            const base = ctx.className(() => ({ padding: '4px' }));
            base();
            html = ctx.serialize();
            expect(html).toContain(`<style data-effcss-key="${key}-6" data-effcss-count="1">`);
            expect(html).toContain(`.${key}_6-0`);
            expect(html).not.toContain(`<style data-effcss-key="${key}-5" data-effcss-count="1">`);

            const { utils, spec } = ctx.layers(['utils', 'spec']);
            utils();
            html = ctx.serialize();
            expect(html).toContain(`<style data-effcss-key="${key}-0" data-effcss-count="2">`);
            expect(html).toContain(`@layer ${key}_0-0, ${key}_0-1;`);
            expect(html).not.toContain(`<style data-effcss-key="${key}-1" data-effcss-count="1">`);

            const fontFamily = ctx.font({ src: 'url("x.woff2")' });
            fontFamily();
            html = ctx.serialize();
            expect(html).toContain(`<style data-effcss-key="${key}-1" data-effcss-count="1">`);
            expect(html).toContain('@font-face');
            expect(html).not.toContain(`<style data-effcss-key="${key}-4" data-effcss-count="1">`);

            const id = ctx.id(() => ({ color: 'red' }));
            id();
            html = ctx.serialize();
            expect(html).toContain(`<style data-effcss-key="${key}-5" data-effcss-count="1">`);
            expect(html).toContain(`#${key}_5-0`);
            expect(html).not.toContain(`<style data-effcss-key="${key}-7" data-effcss-count="1">`);

            const custom = ctx.style(() => ({ body: { padding: '1rem' } }));
            custom();
            html = ctx.serialize();
            expect(html).toContain(`<style data-effcss-key="${key}-7" data-effcss-count="1">`);
            expect(html).toContain('body{padding:1rem;}');

            const inlineSize = ctx.container('inline-size');
            inlineSize();
            expect(html).toEqual(ctx.serialize());
        });

        test('variable set() updates the serialized @property rule', () => {
            const key = getKey();
            const ctx = context({ key });
            const size = ctx.variable('12px');
            size();
            expect(ctx.serialize()).toContain('initial-value:12px;');

            size.set('24px');
            expect(ctx.serialize()).toContain('initial-value:24px;');
        });

        test('global serialize emits shared style tag', () => {
            // global utilities share one provider; materialize a variable so the
            // serializer emits a style tag. The global key may be claimed by an
            // earlier setConfig call, so assert shape rather than a fixed key.
            const initialValue = '12px';
            const resolver = variable(initialValue);
            resolver();
            const html = serialize();
            expect(html).toMatch(/<style data-effcss-key="[^"]+-2" data-effcss-count="\d+">/);
            expect(html).toContain('@property');
            expect(html).toContain(`initial-value:${initialValue};`);
        });

        test('theme serializes @property rules', () => {
            const key = getKey();
            const ctx = context({ key });
            const myTheme = ctx.theme({
                vars: { bg: '#fff', fg: 'black' },
                options: { light: { bg: '#fff', fg: 'black' }, dark: { bg: '#111', fg: 'white' } },
                initial: 'light'
            });
            String(myTheme.vars.bg);
            String(myTheme.vars.fg);
            const html = ctx.serialize();
            expect(html).toContain(`@property --${key}_2-0`);
            expect(html).toContain('initial-value:#fff;');
            expect(html).toContain('initial-value:black;');
        });

        test('className postfix serializes modifier selector', () => {
            const key = getKey();
            const ctx = context({ key });
            const myCls = ctx.className(() => ({ color: 'red' }));
            const token = myCls(':hover');
            const html = ctx.serialize();
            expect(html).toContain(`.${token}:hover`);
            expect(html).toContain('color:red;');
        });

        test('empty string value shoud be quoted', () => {
            const key = getKey();
            const ctx = context({ key });
            const myStyle = ctx.style(() => ({ body: { content: '""' } }) as never);
            myStyle();
            expect(ctx.serialize()).toContain('content:"";');
        });

        test('empty string emits a bare at-rule declaration', () => {
            const key = getKey();
            const ctx = context({ key });
            const layerDeclaration = '@layer custom';
            const myStyle = ctx.style(() => ({ [layerDeclaration]: '' }) as never);
            myStyle();
            expect(ctx.serialize()).toContain(layerDeclaration + ';');
        });

        test('array of primitives is flattened into declarations', () => {
            const key = getKey();
            const ctx = context({ key });
            const myStyle = ctx.style(() => ({ body: { margin: ['0', 'auto'] } }) as never);
            myStyle();
            expect(ctx.serialize()).toContain('body{margin:0;margin:auto;}');
        });

        test('camelCase properties are kebab-cased', () => {
            const key = getKey();
            const ctx = context({ key });
            const myStyle = ctx.style(() => ({ body: { fontFamily: 'serif', 'background-color': 'red' } }) as never);
            myStyle();
            expect(ctx.serialize()).toContain('font-family:serif;');
            expect(ctx.serialize()).toContain('background-color:red;');
        });

        test('array of objects emits a separate rule per object', () => {
            const key = getKey();
            const ctx = context({ key });
            const myStyle = ctx.style({
                '@font-face': [
                    {
                        fontFamily: '"Bitstream Vera Serif Bold"',
                        src: 'url("https://mdn.github.io/shared-assets/fonts/FiraSans-Regular.woff2")'
                    },
                    {
                        fontFamily: '"MyHelvetica"',
                        src: 'local("Helvetica Neue Bold"), url("MgOpenModernaBold.woff2")',
                        fontWeight: 'bold'
                    }
                ]
            });
            myStyle();
            const html = ctx.serialize();
            expect(html).toContain('@font-face{font-family:"Bitstream Vera Serif Bold";');
            expect(html).toContain('@font-face{font-family:"MyHelvetica";');
        });
    });

    describe('clear / dispose', () => {
        test('clear wipes styles, keeps usable', () => {
            const key = getKey();
            const ctx = context({ key });
            const size = ctx.variable('12px');
            size();
            expect(ctx.serialize()).toContain(`<style data-effcss-key="${key}-2"`);

            ctx.clear();
            expect(ctx.serialize()).toBe('');

            // the context still works and the key stays claimed
            const again = ctx.variable('14px');
            again();
            expect(ctx.serialize()).toContain(`<style data-effcss-key="${key}-2"`);
        });

        test('dispose releases key, blocks generation', () => {
            const key = getKey();
            const ctx = context({ key });
            const size = ctx.variable('12px');
            size();
            expect(ctx.serialize()).toContain(`<style data-effcss-key="${key}-2"`);

            ctx.dispose();
            expect(ctx.serialize()).toBe('');

            // the key is released, so a new context can claim it
            const recreated = context({ key });
            expect(recreated.serialize()).toBe('');
            recreated.dispose();
        });

        test('dispose is idempotent', () => {
            const key = getKey();
            const ctx = context({ key });
            ctx.dispose();
            expect(() => ctx.dispose()).not.toThrow();
        });

        test('global clear wipes shared styles', () => {
            const resolver = variable('12px');
            resolver();
            expect(serialize()).toContain('@property');
            clear();
            expect(serialize()).toBe('');
        });
    });

    describe('getContexts', () => {
        test('returns created contexts keyed by their key', () => {
            const key = getKey();
            const ctx = context({ key });
            const all = getContexts();
            expect(all[key]).toBe(ctx);
        });

        test('does not include the global provider', () => {
            const key = getKey();
            context({ key });
            const all = getContexts();
            // global key must not appear as a context
            expect(all[getConfig().key]).toBeUndefined();
        });

        test('dispose removes the context from the registry', () => {
            const key = getKey();
            const ctx = context({ key });
            expect(getContexts()[key]).toBe(ctx);
            ctx.dispose();
            expect(getContexts()[key]).toBeUndefined();
        });

        test('clear keeps the context in the registry', () => {
            const key = getKey();
            const ctx = context({ key });
            ctx.className(() => ({ padding: '4px' }))();
            expect(getContexts()[key]).toBe(ctx);
            ctx.clear();
            // still alive and registered
            expect(getContexts()[key]).toBe(ctx);
            ctx.dispose();
        });

        test('each context serializes independently', () => {
            const firstKey = getKey();
            const secondKey = getKey();
            const first = context({ key: firstKey });
            const second = context({ key: secondKey });
            first.className(() => ({ color: 'red' }))();
            second.className(() => ({ color: 'blue' }))();

            const all = getContexts();
            expect(all[firstKey].serialize()).toContain(`${firstKey}_6-0`);
            expect(all[firstKey].serialize()).not.toContain(secondKey);
            expect(all[secondKey].serialize()).toContain(`${secondKey}_6-0`);
            expect(all[secondKey].serialize()).not.toContain(firstKey);

            first.dispose();
            second.dispose();
        });

        test('Symbol.dispose is wired to dispose', () => {
            const key = getKey();
            const ctx = context({ key });
            const disposeSymbol = (Symbol as any).dispose;
            expect(typeof ctx[disposeSymbol]).toBe('function');
            expect(ctx[disposeSymbol]).toBe(ctx.dispose);
            ctx.dispose();
            expect(getContexts()[key]).toBeUndefined();
        });
    });
});
