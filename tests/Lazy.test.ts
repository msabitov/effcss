import { describe, expect, test } from 'vitest';
import {
    serialize,
    stylesheet,
    configure,
    variable, variables,
    animation, animations,
    layer, layers,
    font, fonts,
    lazyClassName,
    lazyAttribute,
    classNames,
    attributes,
    customStyles
} from '../src/index';

type Card = {
    w: 's' | 'm' | 'l';
    blur: true;
    card: {
        variant: 1 | 2;
        rounded: true;
        header: {
            mini: true;
        };
    }
}

describe('Lazy mode:', () => {
    test('configure({ lazy: true })', () => {
        const result = configure({ lazy: true });
        expect(result).toBe(true);
    });

    describe('At-rules:', () => {
        test('variable (generates CSS on first use)', () => {
            const initialCSS = serialize();
            const size = variable('12px');
            const color = variable({
                syntax: '*',
                inherits: false,
                initialValue: 'red'
            });

            // deferred: nothing generated yet
            expect(serialize()).toBe(initialCSS);
            expect(size.get()).toBe('');
            expect(color.get()).toBe('');
            size.set('99px');
            expect(size.get()).toBe('');

            // warm up
            size('24px');
            color + '';
            expect(size.get()).toBe('12px');
            expect(color.get()).toBe('red');

            size.set('99px');
            expect(size.get()).toBe('99px');

            const resultCSS = serialize();
            expect(resultCSS).not.toBe(initialCSS);
            expect(resultCSS).toContain(`@property ${String(size)}`);
            expect(resultCSS).toContain(`@property ${String(color)}`);
        });

        test('variables (batch generates CSS on first use)', () => {
            const initialCSS = serialize();
            const vars = variables({
                size: '12px',
                color: {
                    syntax: '*',
                    inherits: false,
                    initialValue: 'red'
                }
            });

            // deferred: nothing generated yet
            expect(serialize()).toBe(initialCSS);
            expect(vars.size.get()).toBe('');
            expect(vars.color.get()).toBe('');

            // warm up the whole batch via a single resolver
            vars.size('20px');

            const resultCSS = serialize();
            expect(resultCSS).not.toBe(initialCSS);
            expect(resultCSS).toContain(`@property ${vars.size}`);
            expect(resultCSS).toContain(`@property ${vars.color}`);

            expect(vars.size.get()).toBe('12px');
            expect(vars.color.get()).toBe('red');
            expect(vars.color('grey')).toBe(`var(${(vars.color + '')},grey)`);
        });

        test('animation (generates CSS on first use)', () => {
            const initialCSS = serialize();
            const size = animation({
                from: { width: '100px' },
                to: { width: '200px' }
            });
            const transform = animation({
                from: { transform: 'rotate(0deg)' },
                to: { transform: 'rotate(90deg)' }
            });

            // deferred
            expect(serialize()).toBe(initialCSS);

            // warm up
            size();
            transform + '';

            const resultCSS = serialize();
            expect(resultCSS).not.toBe(initialCSS);
            expect(resultCSS).toContain(`@keyframes ${size}`);
            expect(resultCSS).toContain(`@keyframes ${transform}`);
        });

        test('animations (batch generates CSS on first use)', () => {
            const initialCSS = serialize();
            const variants = animations({
                size: {
                    from: { width: '100px' },
                    to: { width: '200px' }
                },
                opacity: {
                    '0%': { opacity: 0 },
                    '50%': { opacity: 0.6 },
                    '100%': { opacity: 1 }
                }
            });

            // deferred
            expect(serialize()).toBe(initialCSS);

            // warm up the whole batch
            variants.size();
            variants.opacity + '';

            const kfCSS = serialize();
            expect(kfCSS).not.toBe(initialCSS);
            expect(kfCSS).toContain(`@keyframes ${variants.size}`);
            expect(kfCSS).toContain(`@keyframes ${variants.opacity}`);
        });

        test('layer (generates CSS on first use)', () => {
            const initialCSS = serialize();
            const startLayer = layer();

            // deferred
            expect(serialize()).toBe(initialCSS);

            // string coercion generates
            startLayer + '';

            const resultCSS = serialize();
            expect(resultCSS).not.toBe(initialCSS);
            expect(resultCSS).toContain(startLayer + '');
        });

        test('layers (batch generates CSS on first use)', () => {
            const initialCSS = serialize();
            const globalLayers = layers(['start', 'middle', 'top']);

            // deferred
            expect(serialize()).toBe(initialCSS);

            // warm up the whole batch
            globalLayers.start + '';

            const resultCSS = serialize();
            expect(resultCSS).not.toBe(initialCSS);
            expect(resultCSS).toContain(
                `@layer f0-1, f0-2, f0-3;`
            );
        });

        test('font (generates CSS on first use)', () => {
            const initialCSS = serialize();
            const first = font({
                src: `url("/fonts/roboto-regular.woff2") format("woff2") ` +
                    `url("/fonts/roboto-regular.woff") format("woff")`,
                weight: 400,
                style: 'normal',
                display: 'swap'
            });
            const second = font({
                src: `url("https://mdn.github.io/shared-assets/fonts/FiraSans-Regular.woff2")`,
                genericName: 'sans-serif'
            });

            // deferred
            expect(serialize()).toBe(initialCSS);

            // warm up
            first();
            second + '';

            const resultCSS = serialize();
            expect(resultCSS).not.toBe(initialCSS);
            expect(resultCSS).toContain(`@font-face { font-family: ${(first + '').replace(/"/g, '')};`);
            expect(resultCSS).toContain(`@font-face { font-family: ${(second + '').replace(/"/g, '')};`);
        });

        test('fonts (batch generates CSS on first use)', () => {
            const initialCSS = serialize();
            const globalFonts = fonts({
                first: {
                    src: `url("/fonts/roboto-regular.woff2") format("woff2")`,
                    weight: 400,
                    display: 'swap'
                },
                second: {
                    src: `url("https://mdn.github.io/shared-assets/fonts/FiraSans-Regular.woff2")`,
                    genericName: 'sans-serif'
                }
            });

            // deferred
            expect(serialize()).toBe(initialCSS);

            // warm up the whole batch
            globalFonts.first();

            const resultCSS = serialize();
            expect(resultCSS).not.toBe(initialCSS);
            expect(resultCSS).toContain(`@font-face { font-family: ${(globalFonts.first + '').replace(/"/g, '')};`);
            expect(resultCSS).toContain(`@font-face { font-family: ${(globalFonts.second + '').replace(/"/g, '')};`);
        });
    });

    describe('Anonymous rules:', () => {
        describe('lazyClassName:', () => {
            test('object arg', () => {
                const initialCSS = serialize();
                const clsResolver = lazyClassName({
                    margin: 'auto',
                    '&:hover': {
                        outline: '2px solid black'
                    }
                });

                // deferred: no shared rule yet
                expect(serialize()).toBe(initialCSS);

                // call returns the class name
                const cls = clsResolver();

                const resultCSS = serialize();
                expect(resultCSS).not.toBe(initialCSS);
                expect(resultCSS).toContain(`${clsResolver} {`);

                expect(cls).toBe('f0_0');

                // string coercion returns the correct selector
                expect(`${clsResolver}`).toBe(`.${cls}`);
            });

            test('function arg', () => {
                const initialCSS = serialize();
                const clsResolver = lazyClassName(() => {
                    const margin = 'auto';
                    return {
                        margin,
                        '&:hover': {
                            outline: '2px solid black'
                        }
                    };
                });

                // deferred: no shared rule yet
                expect(serialize()).toBe(initialCSS);

                clsResolver + '';

                const resultCSS = serialize();
                expect(resultCSS).toContain(`${clsResolver} {`);
                expect(resultCSS).not.toBe(initialCSS);
                const cls = clsResolver();

                expect(cls).toBe('f0_1');
                // string coercion returns the correct selector
                expect(`${clsResolver}`).toBe(`.${cls}`);
                
            });
        });

        describe('lazyAttribute:', () => {
            test('object arg', () => {
                const initialCSS = serialize();
                const attrResolver = lazyAttribute({
                    margin: 'auto',
                    '&:hover': {
                        outline: '2px solid black'
                    }
                });

                // deferred: no shared rule yet
                expect(serialize()).toBe(initialCSS);

                const attrs = attrResolver();

                const key = Object.keys(attrs)[0];
                expect(key).toBe('data-f0-2');

                // string coercion returns the correct selector
                expect(`${attrResolver}`).toBe(`[${key}]`);

                const resultCSS = serialize();
                expect(resultCSS).not.toBe(initialCSS);
                expect(resultCSS).toContain(`[${key}] {`);
            });

            test('function arg', () => {
                const initialCSS = serialize();
                const attrResolver = lazyAttribute(() => {
                    return {
                        margin: 'auto',
                        '&:hover': {
                            outline: '2px solid black'
                        }
                    };
                });

                // deferred: no shared rule yet
                expect(serialize()).toBe(initialCSS);

                const attrs = attrResolver();

                const selector = attrResolver + '';

                const resultCSS = serialize();
                expect(resultCSS).not.toBe(initialCSS);
                expect(resultCSS).toContain(`${selector} {`);

                const key = Object.keys(attrs)[0];
                expect(key).toBe('data-f0-3');
                // string coercion returns the correct selector
                expect(`${attrResolver}`).toBe(`[${key}]`);
            });
        });
    });

    describe('Selectors:', () => {
        test('classNames', () => {
            const initialCSS = serialize();
            const card = classNames<Card>((selectors) => {
                const {w, card, blur} = selectors;
                return {
                    [w.s]: {
                        width: '12px'
                    },
                    [blur.true]: {
                        filter: 'blur(5px)'
                    },
                    [card]: {
                        background: 'white',
                        border: 'none'
                    }
                };
            });

            // deferred: no stylesheet generated yet
            expect(serialize()).toBe(initialCSS);

            // warm up
            const cls = card({
                card: { rounded: true },
                w: 's'
            });
            expect(cls).toBeTruthy();

            const resultCSS = serialize(stylesheet(card));
            expect(resultCSS).toContain('width: 12px;');
            expect(resultCSS).toContain('filter: blur(5px);');
        });

        test('attributes', () => {
            const initialCSS = serialize();
            const card = attributes<Card>((selectors) => {
                const {w, card, blur} = selectors;
                return {
                    [w.s]: {
                        width: '92px'
                    },
                    [blur.true]: {
                        filter: 'blur(95px)'
                    },
                    [card]: {
                        background: 'white',
                        border: 'none'
                    }
                };
            });

            // deferred: no stylesheet generated yet
            expect(serialize()).toBe(initialCSS);

            // warm up
            const attr = card({
                card: { rounded: true },
                w: 's'
            });
            expect(attr).toBeTruthy();

            const resultCSS = serialize(stylesheet(card));
            expect(resultCSS).toContain('width: 92px;');
            expect(resultCSS).toContain('filter: blur(95px);');
        });

        test('customStyles', () => {
            const initialCSS = serialize();
            const custom = customStyles(() => ({
                'body': {
                    padding: '1rem'
                },
                '.class': {
                    background: 'transparent',
                    width: '100%',
                    '&:focus': {
                        borderWidth: '0px'
                    }
                }
            }));

            // deferred: no stylesheet generated yet
            expect(serialize()).toBe(initialCSS);

            // warm up
            custom();

            const resultCSS = serialize(stylesheet(custom));
            expect(resultCSS).toContain('padding: 1rem;');
            expect(resultCSS).toContain('background: transparent;');
        });
    });
});