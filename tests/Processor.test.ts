import { describe, expect, test } from 'vitest';
import { createProcessor } from '../src/_provider/process';
import { createScope } from '../src/_provider/scope';

const processor = createProcessor({
    scope: createScope({ mode: 'a' }),
    globalKey: 'f0'
});

const key = 'key';

type TGlobals = { sz: { m: string; l: string } };

describe('Base:', () => {

    test('Theme variable:', () => {
        const styleString = processor.compile({
            key: 'cust',
            maker: ({ themeVar }) => {
                return {
                    [`.cust`]: {
                        width: themeVar<TGlobals>('sz.m')
                    }
                };
            }
        });
        expect(styleString).toBe(`.cust{width:var(--f0-sz-m);}`);
    });

    test('themeVar with fallback:', () => {
        const styleString = processor.compile({
            key: 'cust',
            maker: ({ themeVar }) => {
                return {
                    [`.cust`]: {
                        width: themeVar<TGlobals>('sz.m', '100px')
                    }
                };
            }
        });
        expect(styleString).toBe(`.cust{width:var(--f0-sz-m,100px);}`);
    });

    test('Time:', () => {
        const styleString = processor.compile({
            key: 'cust',
            maker: ({ time }) => {
                return {
                    [`.cust`]: {
                        transitionDuration: time(2)
                    }
                };
            }
        });
        expect(styleString).toBe(`.cust{transition-duration:calc(2 * var(--f0-time) * 1ms);}`);
    });

    test('Size:', () => {
        const styleString = processor.compile({
            key: 'cust',
            maker: ({ size }) => {
                return {
                    [`.cust`]: {
                        width: size(2)
                    }
                };
            }
        });
        expect(styleString).toBe(`.cust{width:calc(2 * var(--f0-size) * 1px);}`);
    });

    test('Angle:', () => {
        const styleString = processor.compile({
            key: 'cust',
            maker: ({ angle }) => {
                return {
                    [`.cust`]: {
                        transform: `skew(${angle(1.5)})`
                    }
                };
            }
        });
        expect(styleString).toBe(`.cust{transform:skew(calc(1.5 * var(--f0-angle) * 1deg));}`);
    });

    test('Nested selector:', () => {
        const styleString = processor.compile({
            key: 'cust',
            maker: () => {
                return {
                    '.custom': {
                        '.nested': { color: 'green' }
                    }
                };
            }
        });
        expect(styleString).toBe(`.custom{&.nested{color:green;}}`);
    });

    test('Nested at-rules:', () => {
        const styleString = processor.compile({
            key: 'block',
            maker: () => {
                return {
                    '.small': { width: '5rem', '@media (prefers-color-scheme: dark)': { '.blue': { color: 'blue' } } }
                };
            }
        });
        expect(styleString).toBe(`.small{width:5rem;@media (prefers-color-scheme: dark){.blue{color:blue;}}}`);
    });

    test('Selector starting with `&`:', () => {
        const styleString = processor.compile({
            key: 'block',
            maker: () => {
                return {
                    '.small': { width: '5rem', '& > .large': { width: '15rem' } }
                };
            }
        });
        expect(styleString).toBe(`.small{width:5rem;& > .large{width:15rem;}}`);
    });

    test('First-level nested selector inside at-rules:', () => {
        const styleString = processor.compile({
            key: 'block',
            maker: () => {
                return {
                    '@media (prefers-color-scheme: dark)': {
                        '.small': { width: '5rem', '.blue': { color: 'blue' } }
                    }
                };
            }
        });
        expect(styleString).toBe(`@media (prefers-color-scheme: dark){.small{width:5rem;&.blue{color:blue;}}}`);
    });

    test('lowerCamelCase to kebabCase:', () => {
        const styleString = processor.compile({
            key: 'cust',
            maker: () => {
                return { body: { 'padding-top': '2rem', borderStartEndRadius: '4px' } };
            }
        });
        expect(styleString.includes(`body{padding-top:2rem;border-start-end-radius:4px;}`)).toBeTruthy();
    });

    test('array of property values:', () => {
        const styleString = processor.compile({
            key: 'cust',
            maker: () => {
                return { '.cls': { textDecoration: ['underline', 'underline dotted'] } };
            }
        });
        expect(styleString.includes(`.cls{text-decoration:underline;text-decoration:underline dotted;}`)).toBeTruthy();
    });
});

describe('Primitive handlers', () => {
    test('dash:', () => {
        const styleString = processor.compile({
            key,
            maker: ({ dash }) => {
                const tag = dash('style', 'provider');
                return {
                    [tag]: { width: '20px' }
                };
            }
        });
        expect(styleString).toBe(`style-provider{width:20px;}`);
    });

    test('comma:', () => {
        const styleString = processor.compile({
            key,
            maker: ({ comma }) => {
                const tag = comma('body', 'div');
                return {
                    [tag]: { 'box-sizing': 'border-box' }
                };
            }
        });
        expect(styleString).toBe(`body,div{box-sizing:border-box;}`);
    });

    test('space:', () => {
        const styleString = processor.compile({
            key,
            maker: ({ space }) => {
                const tag = space('body', 'div');
                return {
                    [tag]: { 'box-sizing': 'border-box' }
                };
            }
        });
        expect(styleString).toBe(`body div{box-sizing:border-box;}`);
    });
});

describe('Object handlers:', () => {
    test('merge:', () => {
        const styleString = processor.compile({
            key: 'cust',
            maker: ({ merge }) => {
                const base = {
                    body: {
                        width: '100%'
                    },
                    div: {
                        width: '100%',
                        span: {
                            width: '100%'
                        }
                    }
                };
                const custom = {
                    body: {
                        width: '100vh',
                        height: '100%'
                    },
                    div: {
                        span: {
                            background: 'transparent'
                        }
                    }
                };

                return merge(base, custom);
            }
        });
        expect(styleString).toBe(
            'body{width:100vh;height:100%;}div{width:100%;&span{width:100%;background:transparent;}}'
        );
    });

    test('range:', () => {
        const styleString = processor.compile({
            key: 'cust',
            maker: ({ range }) => {
                const manyRules = range(5, (k) => {
                    return {
                        [`.sz-${k}`]: {
                            width: k + 'rem'
                        }
                    };
                });
                return manyRules;
            }
        });
        expect(styleString).toBe(
            '.sz-1{width:1rem;}.sz-2{width:2rem;}.sz-3{width:3rem;}.sz-4{width:4rem;}.sz-5{width:5rem;}'
        );
    });

    test('each for array:', () => {
        const styleString = processor.compile({
            key: 'cust',
            maker: ({ each }) => {
                const manyRules = each([1, 2, 3, 4, 5], (k, v) => {
                    return {
                        [`.sz-${v}`]: {
                            width: v + 'rem'
                        }
                    };
                });
                return manyRules;
            }
        });
        expect(styleString).toBe(
            '.sz-1{width:1rem;}.sz-2{width:2rem;}.sz-3{width:3rem;}.sz-4{width:4rem;}.sz-5{width:5rem;}'
        );
    });

    test('each for object:', () => {
        const styleString = processor.compile({
            key: 'cust',
            maker: ({ each }) => {
                const manyRules = each(
                    {
                        '.sz-1': '1rem',
                        '.sz-2': '2rem',
                        '.sz-3': '3rem',
                        '.sz-4': '4rem',
                        '.sz-5': '5rem'
                    },
                    (k, v) => {
                        return {
                            [k]: {
                                width: v
                            }
                        };
                    }
                );
                return manyRules;
            }
        });
        expect(styleString).toBe(
            '.sz-1{width:1rem;}.sz-2{width:2rem;}.sz-3{width:3rem;}.sz-4{width:4rem;}.sz-5{width:5rem;}'
        );
    });

    test('when:', () => {
        const styleString = processor.compile({
            key: 'cust',
            maker: ({ when }) => {
                const first = when(true, {
                    image: {
                        aspectRatio: 1
                    }
                });
                const second = when(false, {
                    image: {
                        aspectRatio: '1 / 2'
                    }
                });
                return {
                    ...first,
                    ...second
                };
            }
        });
        expect(styleString).toBe('image{aspect-ratio:1;}');
    });
});

describe('Units:', () => {
    test('call:', () => {
        const styleString = processor.compile({
            key: 'cust',
            maker: ({ units }) => {
                const { px, rem } = units;
                return {
                    '.custom': {
                        width: px(100),
                        height: rem(1.5)
                    }
                };
            }
        });
        expect(styleString).toBe('.custom{width:calc(100 * 1px);height:calc(1.5 * 1rem);}');
    });
});

describe('Palette:', () => {
    test('hue:', () => {
        const styleString = processor.compile({
            key: 'cust',
            maker: ({ palette, each }) => {
                return each(palette.hue, (k, v) => ({
                    ['.color-' + k]: {
                        color: v
                    }
                }));
            }
        });
        expect(styleString).toBe(
            '.color-pri{color:oklch(var(--f0-lightness-bg-l) var(--f0-chroma-bg-base) var(--f0-hue-pri) / 1);}' +
            '.color-sec{color:oklch(var(--f0-lightness-bg-l) var(--f0-chroma-bg-base) var(--f0-hue-sec) / 1);}' +
            '.color-suc{color:oklch(var(--f0-lightness-bg-l) var(--f0-chroma-bg-base) var(--f0-hue-suc) / 1);}' +
            '.color-inf{color:oklch(var(--f0-lightness-bg-l) var(--f0-chroma-bg-base) var(--f0-hue-inf) / 1);}' +
            '.color-war{color:oklch(var(--f0-lightness-bg-l) var(--f0-chroma-bg-base) var(--f0-hue-war) / 1);}' +
            '.color-dan{color:oklch(var(--f0-lightness-bg-l) var(--f0-chroma-bg-base) var(--f0-hue-dan) / 1);}'
        );
    });

    test('chroma:', () => {
        const styleString = processor.compile({
            key: 'cust',
            maker: ({ palette, each }) => {
                return each(palette.chroma, (k, v) => ({
                    ['.color-' + k]: {
                        color: v
                    }
                }));
            }
        });
        expect(styleString).toBe(
            '.color-gray{color:oklch(var(--f0-lightness-bg-l) var(--f0-chroma-bg-gray) var(--f0-hue-pri) / 1);}' +
            '.color-pale{color:oklch(var(--f0-lightness-bg-l) var(--f0-chroma-bg-pale) var(--f0-hue-pri) / 1);}' + 
            '.color-base{color:oklch(var(--f0-lightness-bg-l) var(--f0-chroma-bg-base) var(--f0-hue-pri) / 1);}' +
            '.color-rich{color:oklch(var(--f0-lightness-bg-l) var(--f0-chroma-bg-rich) var(--f0-hue-pri) / 1);}'
        );
    });

    test('lightness:', () => {
        const styleString = processor.compile({
            key: 'cust',
            maker: ({ palette, each }) => {
                return each(palette.lightness, (k, v) => ({
                    ['.color-' + k]: {
                        color: v
                    }
                }));
            }
        });
        expect(styleString).toBe(
            '.color-xs{color:oklch(var(--f0-lightness-bg-xs) var(--f0-chroma-bg-base) var(--f0-hue-pri) / 1);}' +
            '.color-s{color:oklch(var(--f0-lightness-bg-s) var(--f0-chroma-bg-base) var(--f0-hue-pri) / 1);}' +
            '.color-m{color:oklch(var(--f0-lightness-bg-m) var(--f0-chroma-bg-base) var(--f0-hue-pri) / 1);}' +
            '.color-l{color:oklch(var(--f0-lightness-bg-l) var(--f0-chroma-bg-base) var(--f0-hue-pri) / 1);}' +
            '.color-xl{color:oklch(var(--f0-lightness-bg-xl) var(--f0-chroma-bg-base) var(--f0-hue-pri) / 1);}'
        );
    });

    test('alpha:', () => {
        const styleString = processor.compile({
            key: 'cust',
            maker: ({ palette }) => {
                return {
                    '.color-half': {
                        color: palette.alpha(0.5)
                    }
                };
            }
        });
        expect(styleString).toBe(
            '.color-half{color:oklch(var(--f0-lightness-bg-l) var(--f0-chroma-bg-base) var(--f0-hue-pri) / 0.5);}'
        );
    });

    test('bg/fg:', () => {
        const styleString = processor.compile({
            key: 'cust',
            maker: ({ palette }) => {
                return {
                    '.color-half': {
                        color: palette.fg,
                        backgroundColor: palette.bg
                    }
                };
            }
        });
        expect(styleString).toBe(
            '.color-half{color:oklch(var(--f0-lightness-fg-l) var(--f0-chroma-fg-base) var(--f0-hue-pri) / 1);' +
            'background-color:oklch(var(--f0-lightness-bg-l) var(--f0-chroma-bg-base) var(--f0-hue-pri) / 1);}'
        );
    });

    test('complex:', () => {
        const styleString = processor.compile({
            key: 'cust',
            maker: ({ palette }) => {
                return {
                    '.chromaomplex': {
                        color: palette.fg.gray.inf.l,
                        backgroundColor: palette.bg.pale.sec.xl,
                        borderColor: palette.fg.rich.xs.suc.alpha(0.75)
                    }
                };
            }
        });
        expect(styleString).toBe(
            '.chromaomplex{color:oklch(var(--f0-lightness-fg-l) var(--f0-chroma-fg-gray) var(--f0-hue-inf) / 1);' +
            'background-color:oklch(var(--f0-lightness-bg-xl) var(--f0-chroma-bg-pale) var(--f0-hue-sec) / 1);' +
            'border-color:oklch(var(--f0-lightness-fg-xs) var(--f0-chroma-fg-rich) var(--f0-hue-suc) / 0.75);}'
        );
    });
});

describe('Coefficient:', () => {
    test('short range:', () => {
        const styleString = processor.compile({
            key: 'cust',
            maker: ({ each, coef, size }) => {
                return each(coef.short, (k, v) => ({
                    [`.size-` + k]: {
                        width: size(v)
                    }
                }));
            }
        });
        expect(styleString).toBe(
            '.size-s{width:calc(var(--f0-coef-7) * var(--f0-size) * 1px);}' +
            '.size-m{width:calc(var(--f0-coef-8) * var(--f0-size) * 1px);}' +
            '.size-l{width:calc(var(--f0-coef-9) * var(--f0-size) * 1px);}'
        );
    });

    test('base range:', () => {
        const styleString = processor.compile({
            key: 'cust',
            maker: ({ each, coef, size }) => {
                return each(coef.base, (k, v) => ({
                    [`.size-` + k]: {
                        width: size(v)
                    }
                }));
            }
        });
        expect(styleString).toBe(
            '.size-xs{width:calc(var(--f0-coef-6) * var(--f0-size) * 1px);}' +
            '.size-s{width:calc(var(--f0-coef-7) * var(--f0-size) * 1px);}' +
            '.size-m{width:calc(var(--f0-coef-8) * var(--f0-size) * 1px);}' +
            '.size-l{width:calc(var(--f0-coef-9) * var(--f0-size) * 1px);}' +
            '.size-xl{width:calc(var(--f0-coef-10) * var(--f0-size) * 1px);}'
        );
    });

    test('long range:', () => {
        const styleString = processor.compile({
            key: 'cust',
            maker: ({ each, coef, size }) => {
                return each(coef.long, (k, v) => ({
                    [`.size-` + k]: {
                        width: size(v)
                    }
                }));
            }
        });
        expect(styleString).toBe(
            '.size-xxs{width:calc(var(--f0-coef-5) * var(--f0-size) * 1px);}' +
            '.size-xs{width:calc(var(--f0-coef-6) * var(--f0-size) * 1px);}' +
            '.size-s{width:calc(var(--f0-coef-7) * var(--f0-size) * 1px);}' +
            '.size-m{width:calc(var(--f0-coef-8) * var(--f0-size) * 1px);}' +
            '.size-l{width:calc(var(--f0-coef-9) * var(--f0-size) * 1px);}' +
            '.size-xl{width:calc(var(--f0-coef-10) * var(--f0-size) * 1px);}' +
            '.size-xxl{width:calc(var(--f0-coef-11) * var(--f0-size) * 1px);}'
        );
    });

    test('full range:', () => {
        const styleString = processor.compile({
            key: 'cust',
            maker: ({ each, coef, size }) => {
                return each(coef.full, (k, v) => ({
                    [`.size-` + k]: {
                        width: size(v)
                    }
                }));
            }
        });
        expect(styleString).toBe(
            '.size-min{width:calc(var(--f0-coef-4) * var(--f0-size) * 1px);}' +
            '.size-xxs{width:calc(var(--f0-coef-5) * var(--f0-size) * 1px);}' +
            '.size-xs{width:calc(var(--f0-coef-6) * var(--f0-size) * 1px);}' +
            '.size-s{width:calc(var(--f0-coef-7) * var(--f0-size) * 1px);}' +
            '.size-m{width:calc(var(--f0-coef-8) * var(--f0-size) * 1px);}' +
            '.size-l{width:calc(var(--f0-coef-9) * var(--f0-size) * 1px);}' +
            '.size-xl{width:calc(var(--f0-coef-10) * var(--f0-size) * 1px);}' +
            '.size-xxl{width:calc(var(--f0-coef-11) * var(--f0-size) * 1px);}' +
            '.size-max{width:calc(var(--f0-coef-12) * var(--f0-size) * 1px);}'
        );
    });

    test('sparse range:', () => {
        const styleString = processor.compile({
            key: 'cust',
            maker: ({ each, coef, size }) => {
                return each(coef.sparse, (k, v) => ({
                    [`.size-` + k]: {
                        width: size(v)
                    }
                }));
            }
        });
        expect(styleString).toBe(
            '.size-min{width:calc(var(--f0-coef-4) * var(--f0-size) * 1px);}' +
            '.size-xs{width:calc(var(--f0-coef-6) * var(--f0-size) * 1px);}' +
            '.size-m{width:calc(var(--f0-coef-8) * var(--f0-size) * 1px);}' +
            '.size-xl{width:calc(var(--f0-coef-10) * var(--f0-size) * 1px);}' +
            '.size-max{width:calc(var(--f0-coef-12) * var(--f0-size) * 1px);}'
        );
    });

    test('main range:', () => {
        const styleString = processor.compile({
            key: 'cust',
            maker: ({ each, coef, size }) => {
                return each(coef.main, (k, v) => ({
                    [`.size-` + k]: {
                        width: size(v)
                    }
                }));
            }
        });
        expect(styleString).toBe(
            '.size-min{width:calc(var(--f0-coef-4) * var(--f0-size) * 1px);}' +
            '.size-m{width:calc(var(--f0-coef-8) * var(--f0-size) * 1px);}' +
            '.size-max{width:calc(var(--f0-coef-12) * var(--f0-size) * 1px);}'
        );
    });

    test('`XXS` range center:', () => {
        const styleString = processor.compile({
            key: 'cust',
            maker: ({ coef, size }) => {
                return {
                    [`.size`]: {
                        width: size(coef.$xxs.m)
                    }
                };
            }
        });
        expect(styleString).toBe(
            '.size{width:calc(var(--f0-coef-4) * var(--f0-size) * 1px);}'
        );
    });

    test('`XS` range center:', () => {
        const styleString = processor.compile({
            key: 'cust',
            maker: ({ coef, size }) => {
                return {
                    [`.size`]: {
                        width: size(coef.$xs.m)
                    }
                };
            }
        });
        expect(styleString).toBe(
            '.size{width:calc(var(--f0-coef-8) * var(--f0-size) * 1px);}'
        );
    });

    test('`S` range center:', () => {
        const styleString = processor.compile({
            key: 'cust',
            maker: ({ coef, size }) => {
                return {
                    [`.size`]: {
                        width: size(coef.$s.m)
                    }
                };
            }
        });
        expect(styleString).toBe(
            '.size{width:calc(var(--f0-coef-12) * var(--f0-size) * 1px);}'
        );
    });

    test('`M` range center:', () => {
        const styleString = processor.compile({
            key: 'cust',
            maker: ({ coef, size }) => {
                return {
                    [`.size`]: {
                        width: size(coef.$m.m)
                    }
                };
            }
        });
        expect(styleString).toBe(
            '.size{width:calc(var(--f0-coef-16) * var(--f0-size) * 1px);}'
        );
    });

    test('`L` range center:', () => {
        const styleString = processor.compile({
            key: 'cust',
            maker: ({ coef, size }) => {
                return {
                    [`.size`]: {
                        width: size(coef.$l.m)
                    }
                };
            }
        });
        expect(styleString).toBe(
            '.size{width:calc(var(--f0-coef-20) * var(--f0-size) * 1px);}'
        );
    });

    test('`XL` range center:', () => {
        const styleString = processor.compile({
            key: 'cust',
            maker: ({ coef, size }) => {
                return {
                    [`.size`]: {
                        width: size(coef.$xl.m)
                    }
                };
            }
        });
        expect(styleString).toBe(
            '.size{width:calc(var(--f0-coef-24) * var(--f0-size) * 1px);}'
        );
    });

    test('`XXL` range center:', () => {
        const styleString = processor.compile({
            key: 'cust',
            maker: ({ coef, size }) => {
                return {
                    [`.size`]: {
                        width: size(coef.$xxl.m)
                    }
                };
            }
        });
        expect(styleString).toBe(
            '.size{width:calc(var(--f0-coef-28) * var(--f0-size) * 1px);}'
        );
    });
});

describe('Color:', () => {
    test('darken/lighten:', () => {
        const styleString = processor.compile({
            key: 'cust',
            maker: ({ color }) => {
                const { lighten, darken } = color;
                const first = 'green';
                const second = lighten(first);
                const third = darken(first);
                return {
                    '.custom': {
                        background: second,
                        color: third
                    }
                };
            }
        });
        expect(styleString).toBe(
            '.custom{background:oklch(from green calc(l + 0.1) c h / alpha));color:oklch(from green calc(l - 0.1) c h / alpha));}'
        );
    });

    test('fadein/fadeout:', () => {
        const styleString = processor.compile({
            key: 'cust',
            maker: ({ color }) => {
                const { fadein, fadeout } = color;
                const first = 'green';
                const second = fadein(first);
                const third = fadeout(first);
                return {
                    '.custom': {
                        background: second,
                        color: third
                    }
                };
            }
        });
        expect(styleString).toBe(
            '.custom{background:oklch(from green l c h / calc(alpha + 0.1)));color:oklch(from green l c h / calc(alpha - 0.1)));}'
        );
    });

    test('saturate/desaturate:', () => {
        const styleString = processor.compile({
            key: 'cust',
            maker: ({ color }) => {
                const { saturate, desaturate } = color;
                const first = 'green';
                const second = saturate(first);
                const third = desaturate(first);
                return {
                    '.custom': {
                        background: second,
                        color: third
                    }
                };
            }
        });
        expect(styleString).toBe(
            '.custom{background:oklch(from green l calc(c + 0.04) h / alpha));color:oklch(from green l calc(c - 0.04) h / alpha));}'
        );
    });

    test('spin:', () => {
        const styleString = processor.compile({
            key: 'cust',
            maker: ({ color }) => {
                const { spin } = color;
                const first = 'green';
                const second = spin(first);
                const third = spin(first, 180);
                return {
                    '.custom': {
                        background: second,
                        color: third
                    }
                };
            }
        });
        expect(styleString).toBe(
            '.custom{background:oklch(from green l c calc(h + 30) / alpha));color:oklch(from green l c calc(h + 180) / alpha));}'
        );
    });
});

describe('Pseudo:', () => {
    test('simple call:', () => {
        const styleString = processor.compile({
            key: 'cust',
            maker: ({ pseudo }) => {
                const { h, aft } = pseudo;
                return {
                    [h(aft('.custom'))]: {
                        color: 'transparent'
                    }
                };
            }
        });
        expect(styleString).toBe('.custom::after:hover{color:transparent;}');
    });

    test('simple toString:', () => {
        const styleString = processor.compile({
            key: 'cust',
            maker: ({ pseudo }) => {
                const { h, aft } = pseudo;
                return {
                    [`.custom${aft}${h}`]: {
                        color: 'transparent'
                    }
                };
            }
        });
        expect(styleString).toBe('.custom::after:hover{color:transparent;}');
    });

    test('complex call:', () => {
        const styleString = processor.compile({
            key: 'cust',
            maker: ({ pseudo }) => {
                const { has, is } = pseudo;
                return {
                    [has('image', is('.custom', 'button'))]: {
                        cursor: 'pointer'
                    }
                };
            }
        });
        expect(styleString).toBe('button:is(.custom):has(image){cursor:pointer;}');
    });

    test('complex toString:', () => {
        const styleString = processor.compile({
            key: 'cust',
            maker: ({ pseudo }) => {
                const { has, is } = pseudo;
                return {
                    [`button${is}(.custom)${has}(image)`]: {
                        cursor: 'pointer'
                    }
                };
            }
        });
        expect(styleString).toBe('button:is(.custom):has(image){cursor:pointer;}');
    });
});

describe('at-rule makers', () => {
    test('@supports:', () => {
        const styleString = processor.compile({
            key: 'cust',
            maker: ({ at: { supports } }) => {
                const supportsRule = supports.where('not (text-align-last:justify)');
                return supportsRule({
                    div: {
                        textAlignLast: 'justify'
                    }
                });
            }
        });
        expect(styleString).toBe(`@supports not (text-align-last:justify){div{text-align-last:justify;}}`);
    });

    test('@layer:', () => {
        const styleString = processor.compile({
            key: 'cust',
            maker: ({ at: { layer } }) => {
                const layer1 = layer.named;
                const layer2 = layer.named;
                return {
                    ...layer.list(layer1, layer2),
                    ...layer1({
                        '.padding-sm': {
                            padding: '0.5rem'
                        }
                    }),
                    ...layer2({
                        '.padding-sm': {
                            padding: '0.75rem'
                        }
                    })
                };
            }
        });
        expect(styleString).toBe(
            `@layer cust-lay-1, cust-lay-2;` +
            `@layer cust-lay-1{.padding-sm{padding:0.5rem;}}` +
            `@layer cust-lay-2{.padding-sm{padding:0.75rem;}}`
        );
    });

    test('@starting-style:', () => {
        const key = 'cust';
        const styleString = processor.compile({
            key,
            maker: ({ at: { startingStyle } }) => {
                return {
                    '.target': {
                        transition: 'background-color 1.5s',
                        backgroundColor: 'green',
                        ...startingStyle({opacity: 0})
                    },
                    ...startingStyle({
                        '.target': {
                            backgroundColor: 'transparent'
                        }
                    }),
                    
                }
            }
        });
        expect(styleString).toBe(
            `.target{transition:background-color 1.5s;background-color:green;` +
            `@starting-style{opacity:0;}}` +
            `@starting-style{.target{background-color:transparent;}}`
        );
    });

    test('@keyframes:', () => {
        const key = 'cust';
        const styleString = processor.compile({
            key,
            maker: ({ at: { keyframes } }) => {
                const widthKf = keyframes({
                    from: { width: '10px' },
                    to: { width: '20px' }
                });
                const heightKf = keyframes({
                    from: { height: '10px' },
                    to: { height: '20px' }
                });
                return {
                    ...widthKf,
                    ...heightKf,
                    '.cls1': {
                        ...widthKf()
                    },
                    '.cls2': {
                        animation: `3s linear 1s ${heightKf}`
                    },
                    '.cls3': heightKf({
                        dur: '300ms',
                        tf: 'ease'
                    })
                };
            }
        });
        expect(styleString).toBe(
            `@keyframes cust-kf-1{from{width:10px;}to{width:20px;}}` +
            `@keyframes cust-kf-2{from{height:10px;}to{height:20px;}}` +
            `.cls1{animation-name:cust-kf-1;}` +
            `.cls2{animation:3s linear 1s cust-kf-2;}` +
            `.cls3{animation:300ms ease cust-kf-2;}`
        );
    });

    test('@property:', () => {
        const key = 'cust';
        const styleString = processor.compile({
            key,
            maker: ({ at: { property } }) => {
                const firstProperty = property();
                const secondProperty = property({
                    ini: '25px',
                    inh: false,
                    def: '10px'
                });
                const thirdProperty = property();
                return {
                    ...firstProperty,
                    ...secondProperty,
                    '.mod': firstProperty('150px'),
                    '.full': {
                        ...secondProperty('100px'),
                        ...thirdProperty('red'),
                        aspectRatio: 1
                    },
                    '.cls': {
                        width: firstProperty,
                        height: `calc(2 * ${secondProperty})`
                    },
                    '.cls2': {
                        height: `calc(2 * ${secondProperty.fallback('35px')})`
                    }
                };
            }
        });
        expect(styleString).toBe(
            `@property --cust-cp-1{syntax:"*";inherits:true;}` +
            `@property --cust-cp-2{syntax:"*";inherits:false;initial-value:25px;}` +
            `.mod{--cust-cp-1:150px;}` +
            `.full{--cust-cp-2:100px;--cust-cp-3:red;aspect-ratio:1;}` +
            `.cls{width:var(--cust-cp-1);height:calc(2 * var(--cust-cp-2,10px));}` +
            `.cls2{height:calc(2 * var(--cust-cp-2,35px));}`
        );
    });

    test('@scope:', () => {
        const styleString = processor.compile({
            key: 'cust',
            maker: ({ at: { scope } }) => {
                const baseScope = scope.root('.base');
                const limitedScope = baseScope.limit('.limit');
                return {
                    ...baseScope({
                        span: {
                            textOverflow: 'hidden'
                        }
                    }),
                    ...limitedScope({
                        div: {
                            width: '100%'
                        }
                    }),
                    ...limitedScope.none()({
                        p: {
                            fontSize: '1.5rem'
                        }
                    }),
                    ...limitedScope.low()({
                        p: {
                            fontSize: '2rem'
                        }
                    }),
                    ...limitedScope.both()({
                        p: {
                            fontSize: '0.5rem'
                        }
                    })
                };
            }
        });
        expect(styleString).toBe(
            `@scope (.base){span{text-overflow:hidden;}}` +
            `@scope (.base) to (.limit){div{width:100%;}}` +
            `@scope (.base > *) to (.limit){p{font-size:1.5rem;}}` +
            `@scope (.base > *) to (.limit > *){p{font-size:2rem;}}` +
            `@scope (.base) to (.limit > *){p{font-size:0.5rem;}}`
        );
    });

    test('@media:', () => {
        const styleString = processor.compile({
            key: 'cust',
            maker: ({ at: { media, $logic: {and, or, not} } }) => {
                const logic1 = and('prefers-reduced-motion: reduce', 'hover');
                const logic2 = or('prefers-reduced-motion: reduce', 'hover');
                const logic3 = and('orientation: portrait', 'hover');
                const logic4 = not(and('width > 600px', 'width < 200px'));
                const logic5 = not(or('width > 600px', 'width < 200px'));
                // only type
                const query1 = media.print;
                // only and
                const query2 = media.where(logic1);
                // only or
                const query3 = media.where(logic2);
                // type + and
                const query4 = media.all.where(logic3);
                // type + or
                const query5 = media.screen.where(logic2);
                // and + not
                const query8 = media.where(logic4);
                // and + not + not
                const query9 = query8.where(not(logic4));
                // or + not
                const query10 = media.where(logic5);
                // or + not + not
                const query11 = query10.where(not(logic5));
                // or media
                const query12 = media.where(or(logic1, 'width > 600px'));
                // and media
                const query13 = media.where(and(logic2, 'width > 600px'));
                // or not media
                const query14 = media.where(or('width < 100px', not(or(logic1, 'width > 600px'))));
                // and not media
                const query15 = media.where(and('width < 100px', not(and(logic2, 'width > 600px'))));
                return {
                    ...media({
                        '.cls': {
                            width: '10px'
                        }
                    }),
                    ...query1({
                        '.cls': {
                            maxWidth: '20px'
                        }
                    }),
                    ...query2({
                        '.cls': {
                            maxWidth: '30px'
                        }
                    }),
                    ...query3({
                        '.cls': {
                            maxWidth: '40px'
                        }
                    }),
                    ...query4({
                        '.cls': {
                            maxWidth: '50px'
                        }
                    }),
                    ...query5({
                        '.cls': {
                            maxWidth: '60px'
                        }
                    }),
                    ...query8({
                        '.cls': {
                            maxWidth: '90px'
                        }
                    }),
                    ...query9({
                        '.cls': {
                            maxWidth: '100px'
                        }
                    }),
                    ...query10({
                        '.cls': {
                            maxWidth: '110px'
                        }
                    }),
                    ...query11({
                        '.cls': {
                            maxWidth: '120px'
                        }
                    }),
                    ...query12({
                        '.cls': {
                            maxWidth: '130px'
                        }
                    }),
                    ...query13({
                        '.cls': {
                            maxWidth: '140px'
                        }
                    }),
                    ...query14({
                        '.cls': {
                            maxWidth: '150px'
                        }
                    }),
                    ...query15({
                        '.cls': {
                            maxWidth: '160px'
                        }
                    })
                }
            }
        });
        expect(styleString).toBe(
           `@media{.cls{width:10px;}}` +
           `@media print{.cls{max-width:20px;}}` +
           `@media (prefers-reduced-motion: reduce) and (hover){.cls{max-width:30px;}}` +
           `@media (prefers-reduced-motion: reduce) or (hover){.cls{max-width:40px;}}` +
           `@media all and (orientation: portrait) and (hover){.cls{max-width:50px;}}` +
           `@media screen and ((prefers-reduced-motion: reduce) or (hover)){.cls{max-width:60px;}}` +
           `@media not ((width > 600px) and (width < 200px)){.cls{max-width:90px;}}` +
           `@media (width > 600px) and (width < 200px){.cls{max-width:100px;}}` +
           `@media not ((width > 600px) or (width < 200px)){.cls{max-width:110px;}}` +
           `@media (width > 600px) or (width < 200px){.cls{max-width:120px;}}` +
           `@media (prefers-reduced-motion: reduce) and (hover) or (width > 600px){.cls{max-width:130px;}}` +
           `@media ((prefers-reduced-motion: reduce) or (hover)) and (width > 600px){.cls{max-width:140px;}}` +
           `@media (width < 100px) or not ((prefers-reduced-motion: reduce) and (hover) or (width > 600px)){.cls{max-width:150px;}}` +
           `@media (width < 100px) and not (((prefers-reduced-motion: reduce) or (hover)) and (width > 600px)){.cls{max-width:160px;}}`
        );
    });

    test('@container:', () => {
        const styleString = processor.compile({
            key: 'cust',
            maker: ({ at: { container, $logic: {or, and, not} } }) => {
                const logic1 = and('width > 100px');
                const logic2 = or('orientation: landscape', 'height > 400px', 'width > 100px');
                const logic3 = 'height > 400px';
                // only container
                const query0 = container;
                // with type
                const query1 = container.isize;
                // with scroll-state
                const query2 = container.scroll;
                // with type and scroll-state
                const query3 = container.size.scroll.where(logic1);
                // named
                const query4 = query0.named.where(logic1);
                // named with type
                const query5 = query1.named.where(logic1);
                // named with scroll-state
                const query6 = query2.named.where(logic1);
                // named with type and scroll-state
                const query7 = query3.named;
                // with conditions
                const query8 = query0.where(logic2);
                // named with conditions
                const query9 = query7.where(and(or(logic1, 'height > 400px', 'width > 100px'), 'orientation: landscape'));
                // not
                const query10 = query1.where(not(logic3));
                // named not
                const query11 = query1.named.where(not(logic3));
                return {
                    '.cls0': {
                        ...query0
                    },
                    '.cls1': {
                        ...query1
                    },
                    '.cls2': {
                        ...query2
                    },
                    '.cls3': {
                        ...query3
                    },
                    '.cls4': {
                        ...query4
                    },
                    '.cls5': {
                        ...query5
                    },
                    '.cls6': {
                        ...query6
                    },
                    '.cls7': {
                        ...query7
                    },
                    '.cls8': {
                        ...query8
                    },
                    '.cls9': {
                        ...query9
                    },
                    ...query3({
                        '.cls': {
                            maxWidth: '40px'
                        }
                    }),
                    ...query4({
                        '.cls': {
                            maxWidth: '50px'
                        }
                    }),
                    ...query5({
                        '.cls': {
                            maxWidth: '60px'
                        }
                    }),
                    ...query6({
                        '.cls': {
                            maxWidth: '70px'
                        }
                    }),
                    ...query7({
                        '.cls': {
                            maxWidth: '80px'
                        }
                    }),
                    ...query8({
                        '.cls': {
                            maxWidth: '90px'
                        }
                    }),
                    ...query9({
                        '.cls': {
                            maxWidth: '100px'
                        }
                    }),
                    ...query10({
                        '.cls': {
                            maxWidth: '110px'
                        }
                    }),
                    ...query11({
                        '.cls': {
                            maxWidth: '120px'
                        }
                    })
                };
            }
        });
        expect(styleString).toBe(
           `.cls0{container:none / normal;}` +
           `.cls1{container:none / inline-size;}` +
           `.cls2{container:none / scroll-state;}` +
           `.cls3{container:none / size scroll-state;}` +
           `.cls4{container:cust-cq-1 / normal;}` +
           `.cls5{container:cust-cq-2 / inline-size;}` +
           `.cls6{container:cust-cq-3 / scroll-state;}` +
           `.cls7{container:cust-cq-4 / size scroll-state;}` +
           `.cls8{container:none / normal;}` +
           `.cls9{container:cust-cq-4 / size scroll-state;}` +
           `@container (width > 100px){.cls{max-width:40px;}}` +
           `@container cust-cq-1 (width > 100px){.cls{max-width:50px;}}` +
           `@container cust-cq-2 (width > 100px){.cls{max-width:60px;}}` +
           `@container cust-cq-3 (width > 100px){.cls{max-width:70px;}}` +
           `@container cust-cq-4 (width > 100px){.cls{max-width:80px;}}` +
           `@container (orientation: landscape) or (height > 400px) or (width > 100px){.cls{max-width:90px;}}` +
           `@container cust-cq-4 ((width > 100px) or (height > 400px) or (width > 100px)) and (orientation: landscape){.cls{max-width:100px;}}` +
           `@container not (height > 400px){.cls{max-width:110px;}}` +
           `@container cust-cq-5 not (height > 400px){.cls{max-width:120px;}}`
        )
    });
});

describe('at.$width, at.$height, at.$block, at.$inline:', () => {
    test('@media $width.up:', () => {
        const styleString = processor.compile({
            key: 'cust',
            maker: ({ at: { media, $width: {up} } }) => {
                return media.where(up(64))({
                    '.cls': {
                        width: '100%'
                    }
                });
            }
        });
        expect(styleString).toBe('@media (min-width:64rem){.cls{width:100%;}}');
    });

    test('@media $height.down:', () => {
        const styleString = processor.compile({
            key: 'cust',
            maker: ({ at: { media, $height: {down} } }) => {
                return media.where(down(48))({
                    '.cls': {
                        flexGrow: 1
                    }
                });
            }
        });
        expect(styleString).toBe('@media (max-height:48rem){.cls{flex-grow:1;}}');
    });

    test('@media $width.between:', () => {
        const styleString = processor.compile({
            key: 'cust',
            maker: ({ at: { media, $width: {between} } }) => {
                return media.where(between(30,80))({
                    '.cls': {
                        flexShrink: 0
                    }
                });
            }
        });
        expect(styleString).toBe('@media (min-width:30rem) and (max-width:80rem){.cls{flex-shrink:0;}}');
    });

    test('@media $height.only:', () => {
        const styleString = processor.compile({
            key: 'cust',
            maker: ({ at: { media, $height: {only} } }) => {
                return media.where(only(30))({
                    '.cls': {
                        flexBasis: '100%'
                    }
                });
            }
        });
        expect(styleString).toBe('@media (min-height:30rem) and (max-height:30rem){.cls{flex-basis:100%;}}');
    });

    test('@container $inline.up:', () => {
        const styleString = processor.compile({
            key: 'cust',
            maker: ({ at: { container, $inline: {up} } }) => {
                return container.where(up(64))({
                    '.cls': {
                        width: '100%'
                    }
                });
            }
        });
        expect(styleString).toBe('@container (min-inline-size:64rem){.cls{width:100%;}}');
    });

    test('@container $block.down:', () => {
        const styleString = processor.compile({
            key: 'cust',
            maker: ({ at: { container, $block: {down} } }) => {
                return container.where(down(48))({
                    '.cls': {
                        flexGrow: 1
                    }
                });
            }
        });
        expect(styleString).toBe('@container (max-block-size:48rem){.cls{flex-grow:1;}}');
    });

    test('@container $inline.between:', () => {
        const styleString = processor.compile({
            key: 'cust',
            maker: ({ at: { container, $inline: {between} } }) => {
                return container.where(between(30,80))({
                    '.cls': {
                        flexShrink: 0
                    }
                });
            }
        });
        expect(styleString).toBe('@container (min-inline-size:30rem) and (max-inline-size:80rem){.cls{flex-shrink:0;}}');
    });

    test('@container $block.only:', () => {
        const styleString = processor.compile({
            key: 'cust',
            maker: ({ at: { container, $block: {only} } }) => {
                return container.where(only(30))({
                    '.cls': {
                        flexBasis: '100%'
                    }
                });
            }
        });
        expect(styleString).toBe('@container (min-block-size:30rem) and (max-block-size:30rem){.cls{flex-basis:100%;}}');
    });

   test('named @container $width.up:', () => {
        const styleString = processor.compile({
            key: 'cust',
            maker: ({ at: { container, $width: {up} } }) => {
                return container.named.where(up(64))({
                    '.cls': {
                        width: '100%'
                    }
                });
            }
        });
        expect(styleString).toBe('@container cust-cq-1 (min-width:64rem){.cls{width:100%;}}');
    });

    test('named @container $width.down:', () => {
        const styleString = processor.compile({
            key: 'cust',
            maker: ({ at: { container, $width: {down} } }) => {
                return container.named.where(down(48))({
                    '.cls': {
                        flexGrow: 1
                    }
                });
            }
        });
        expect(styleString).toBe('@container cust-cq-1 (max-width:48rem){.cls{flex-grow:1;}}');
    });

    test('named @container $width.between:', () => {
        const styleString = processor.compile({
            key: 'cust',
            maker: ({ at: { container, $width: {between} } }) => {
                return container.named.where(between(30,80))({
                    '.cls': {
                        flexShrink: 0
                    }
                });
            }
        });
        expect(styleString).toBe('@container cust-cq-1 (min-width:30rem) and (max-width:80rem){.cls{flex-shrink:0;}}');
    });

    test('named @container $width.only:', () => {
        const styleString = processor.compile({
            key: 'cust',
            maker: ({ at: { container, $width: {only} } }) => {
                return container.named.where(only(30))({
                    '.cls': {
                        flexBasis: '100%'
                    }
                });
            }
        });
        expect(styleString).toBe('@container cust-cq-1 (min-width:30rem) and (max-width:30rem){.cls{flex-basis:100%;}}');
    });
});
