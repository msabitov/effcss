import { describe, expect, test } from 'vitest';
import { createProcessor } from '../src/_provider/process';
import { createScope, DEFAULT_SETTINGS } from '../src/common';

const processor = createProcessor({
    scope: createScope({ mode: 'a' }),
    globalKey: 'f0',
    bp: DEFAULT_SETTINGS.bp
});

const clsProcessor = createProcessor({
    scope: createScope({ mode: 'c' }),
    globalKey: 'f0',
    bp: DEFAULT_SETTINGS.bp
});

const key = 'key';

type TGlobals = { sz: { m: string; l: string } };
type TStyleSheet = {
    block: {
        '': {
            hidden: '';
        };
        elem: {
            sz: 's' | 'm';
        };
    };
};

describe('Base:', () => {
    test('Key:', () => {
        const styleString = processor.compile({
            key: 'cust',
            maker: ({ key }) => {
                return {
                    [`.${key}`]: {
                        color: 'green'
                    }
                };
            }
        });
        expect(styleString).toBe(`.cust{color:green;}`);
    });

    test('Global:', () => {
        const styleString = processor.compile({
            key: 'cust',
            maker: ({ vars }) => {
                return {
                    [`.cust`]: {
                        width: vars<TGlobals>('sz.m')
                    }
                };
            }
        });
        expect(styleString).toBe(`.cust{width:var(--f0-sz-m);}`);
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

    test('BEM attrs:', () => {
        const styleString = processor.compile({
            key: 'cust',
            maker: ({ bem }) => {
                const selector0 = bem<TStyleSheet>({
                    block: {}
                });
                const selector1 = bem<TStyleSheet>({
                    block: {
                        '': {
                            hidden: ''
                        }
                    }
                });
                const selector2 = bem<TStyleSheet>({
                    block: {
                        elem: {
                            sz: 'm'
                        }
                    }
                });
                const selector3 = bem<TStyleSheet>('block.elem.sz.s');
                return {
                    [selector0]: {
                        overflow: 'hidden'
                    },
                    [selector1]: {
                        visibility: 'hidden'
                    },
                    [selector2]: {
                        width: '5rem'
                    },
                    [selector3]: {
                        width: '2rem'
                    }
                };
            }
        });
        expect(styleString).toBe(
            `[data-cust-block]{overflow:hidden;}[data-cust-block~="hidden"]{visibility:hidden;}[data-cust-block__elem~="sz_m"]{width:5rem;}[data-cust-block__elem~="sz_s"]{width:2rem;}`
        );
    });

    test('BEM cls:', () => {
        const styleString = clsProcessor.compile({
            key: 'cust',
            maker: ({ bem }) => {
                const selector0 = bem<TStyleSheet>({
                    block: {}
                });
                const selector1 = bem<TStyleSheet>({
                    block: {
                        '': {
                            hidden: ''
                        }
                    }
                });
                const selector2 = bem<TStyleSheet>({
                    block: {
                        elem: {
                            sz: 'm'
                        }
                    }
                });
                const selector3 = bem<TStyleSheet>('block.elem.sz.s');
                return {
                    [selector0]: {
                        overflow: 'hidden'
                    },
                    [selector1]: {
                        visibility: 'hidden'
                    },
                    [selector2]: {
                        width: '5rem'
                    },
                    [selector3]: {
                        width: '2rem'
                    }
                };
            }
        });
        expect(styleString).toBe(
            `.cust-block{overflow:hidden;}.cust-block_hidden{visibility:hidden;}.cust-block__elem_sz_m{width:5rem;}.cust-block__elem_sz_s{width:2rem;}`
        );
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
        expect(styleString).toBe('.custom{width:100px;height:1.5rem;}');
    });
});

describe('Color:', () => {
    test('create:', () => {
        const styleString = processor.compile({
            key: 'cust',
            maker: ({ color }) => {
                const { create } = color;
                let first = create();
                first = first.a(0.5);
                first = first.c(0.2);
                const second = create({ h: 'c' });
                return {
                    '.custom': {
                        background: first + '',
                        color: second.s
                    }
                };
            }
        });
        expect(styleString).toBe(
            '.custom{background:oklch(var(--f0-l-def) 0.2 var(--f0-h-def) / 0.5);color:oklch(var(--f0-l-def) var(--f0-c-def) c / var(--f0-a-def));}'
        );
    });

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

    test('mix:', () => {
        const styleString = processor.compile({
            key: 'cust',
            maker: ({ color }) => {
                const { mix } = color;
                const base = 'green';
                const mixin = '#110011';
                const result = mix({ base, mixin, bpart: 10 });
                return {
                    '.custom': {
                        background: result
                    }
                };
            }
        });
        expect(styleString).toBe('.custom{background:color-mix(in oklch, green 10%, #110011);}');
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

describe('Limit:', () => {
    test('@media up:', () => {
        const styleString = processor.compile({
            key: 'cust',
            maker: ({ limit: { up } }) => {
                return {
                    [up('lg')]: {
                        width: '100%'
                    }
                };
            }
        });
        expect(styleString).toBe('@media (min-width: 64rem){width:100%;}');
    });

    test('@media down:', () => {
        const styleString = processor.compile({
            key: 'cust',
            maker: ({ limit: { down } }) => {
                return {
                    [down('md')]: {
                        flexGrow: 1
                    }
                };
            }
        });
        expect(styleString).toBe('@media (max-width: 48rem){flex-grow:1;}');
    });

    test('@media between:', () => {
        const styleString = processor.compile({
            key: 'cust',
            maker: ({ limit: { between } }) => {
                return {
                    [between('xs', 'xl')]: {
                        flexShrink: 0
                    }
                };
            }
        });
        expect(styleString).toBe('@media (min-width: 30rem) and (max-width: 80rem){flex-shrink:0;}');
    });

    test('@media only:', () => {
        const styleString = processor.compile({
            key: 'cust',
            maker: ({ limit: { only } }) => {
                return {
                    [only('xs')]: {
                        flexBasis: '100%'
                    }
                };
            }
        });
        expect(styleString).toBe('@media (min-width: 30rem) and (max-width: 30rem){flex-basis:100%;}');
    });

    test('@container up:', () => {
        const styleString = processor.compile({
            key: 'cust',
            maker: ({ limit: { up } }) => {
                return {
                    [up('lg', '')]: {
                        width: '100%'
                    }
                };
            }
        });
        expect(styleString).toBe('@container (min-width: 64rem){width:100%;}');
    });

    test('@container down:', () => {
        const styleString = processor.compile({
            key: 'cust',
            maker: ({ limit: { down } }) => {
                return {
                    [down('md', '')]: {
                        flexGrow: 1
                    }
                };
            }
        });
        expect(styleString).toBe('@container (max-width: 48rem){flex-grow:1;}');
    });

    test('@container between:', () => {
        const styleString = processor.compile({
            key: 'cust',
            maker: ({ limit: { between } }) => {
                return {
                    [between('xs', 'xl', '')]: {
                        flexShrink: 0
                    }
                };
            }
        });
        expect(styleString).toBe('@container (min-width: 30rem) and (max-width: 80rem){flex-shrink:0;}');
    });

    test('@container only:', () => {
        const styleString = processor.compile({
            key: 'cust',
            maker: ({ limit: { only } }) => {
                return {
                    [only('xs', '')]: {
                        flexBasis: '100%'
                    }
                };
            }
        });
        expect(styleString).toBe('@container (min-width: 30rem) and (max-width: 30rem){flex-basis:100%;}');
    });

    test('named @container up:', () => {
        const styleString = processor.compile({
            key: 'cust',
            maker: ({ limit: { up } }) => {
                return {
                    [up('lg', 'cont')]: {
                        width: '100%'
                    }
                };
            }
        });
        expect(styleString).toBe('@container cont (min-width: 64rem){width:100%;}');
    });

    test('named @container down:', () => {
        const styleString = processor.compile({
            key: 'cust',
            maker: ({ limit: { down } }) => {
                return {
                    [down('md', 'cont')]: {
                        flexGrow: 1
                    }
                };
            }
        });
        expect(styleString).toBe('@container cont (max-width: 48rem){flex-grow:1;}');
    });

    test('named @container between:', () => {
        const styleString = processor.compile({
            key: 'cust',
            maker: ({ limit: { between } }) => {
                return {
                    [between('xs', 'xl', 'cont')]: {
                        flexShrink: 0
                    }
                };
            }
        });
        expect(styleString).toBe('@container cont (min-width: 30rem) and (max-width: 80rem){flex-shrink:0;}');
    });

    test('named @container only:', () => {
        const styleString = processor.compile({
            key: 'cust',
            maker: ({ limit: { only } }) => {
                return {
                    [only('xs', 'cont')]: {
                        flexBasis: '100%'
                    }
                };
            }
        });
        expect(styleString).toBe('@container cont (min-width: 30rem) and (max-width: 30rem){flex-basis:100%;}');
    });
});

describe('at-rules', () => {
    test('@media:', () => {
        const styleString = processor.compile({
            key: 'cust',
            maker: ({ at: { mq } }) => {
                const query = mq('prefers-color-scheme: light');
                return {
                    [query.s]: {
                        div: {
                            width: '100%'
                        }
                    }
                };
            }
        });
        expect(styleString).toBe(`@media (prefers-color-scheme: light){div{width:100%;}}`);
    });

    test('@container:', () => {
        const styleString = processor.compile({
            key: 'cust',
            maker: ({ at: { cq } }) => {
                const query = cq('min-width: 5rem');
                return {
                    '.container': {
                        containerName: query.c,
                        containerType: 'inline-size'
                    },
                    [query.s]: {
                        '.nested': {
                            width: '100%'
                        }
                    }
                };
            }
        });
        expect(styleString).toBe(
            `.container{container-name:cust-cq-1;container-type:inline-size;}@container cust-cq-1 (min-width: 5rem){.nested{width:100%;}}`
        );
    });

    test('@keyframes:', () => {
        const key = 'cust';
        const styleString = processor.compile({
            key,
            maker: ({ at: { kf } }) => {
                const keyframes = kf();
                return {
                    [keyframes.s]: {
                        from: { width: '10px' },
                        to: { width: '20px' }
                    },
                    '.cls': { animationName: keyframes.k }
                };
            }
        });
        expect(styleString).toBe(
            `@keyframes cust-kf-1{from{width:10px;}to{width:20px;}}.cls{animation-name:cust-kf-1;}`
        );
    });

    test('@property:', () => {
        const key = 'cust';
        const styleString = processor.compile({
            key,
            maker: ({ at: { pr } }) => {
                const property = pr();
                return {
                    ...property.r,
                    '.mod': {
                        [property.k]: '150px'
                    },
                    '.cls': {
                        width: property.v
                    }
                };
            }
        });
        expect(styleString).toBe(
            `@property --cust-cp-1{syntax:"*";inherits:false;}.mod{--cust-cp-1:150px;}.cls{width:var(--cust-cp-1);}`
        );
    });

    test('@layer:', () => {
        const styleString = processor.compile({
            key: 'cust',
            maker: ({ at: { lay } }) => {
                const layer = lay();
                return {
                    [layer.s]: {
                        '.padding-sm': {
                            padding: '0.5rem'
                        }
                    }
                };
            }
        });
        expect(styleString).toBe(`@layer cust-lay-1{.padding-sm{padding:0.5rem;}}`);
    });

    test('@scope:', () => {
        const styleString = processor.compile({
            key: 'cust',
            maker: ({ at: { sc } }) => {
                const scope = sc('.base', '.limit');
                return {
                    [scope.s]: {
                        div: {
                            width: '100%'
                        }
                    }
                };
            }
        });
        expect(styleString).toBe(`@scope (.base) to (.limit){div{width:100%;}}`);
    });

    test('@supports:', () => {
        const styleString = processor.compile({
            key: 'cust',
            maker: ({ at: { sup } }) => {
                const scope = sup('text-align-last:justify', true);
                return {
                    [scope.s]: {
                        div: {
                            textAlignLast: 'justify'
                        }
                    }
                };
            }
        });
        expect(styleString).toBe(`@supports not (text-align-last:justify){div{text-align-last:justify;}}`);
    });
});
