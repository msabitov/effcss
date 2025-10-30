import { beforeAll, beforeEach, describe, expect, test } from 'vitest';
import { page } from '@vitest/browser/context';
import { defineProvider, TStyleSheetMaker, useStyleProvider } from '../src/index';
import { createConsumer } from '../src/consumer';
import { TAG_NAME } from '../src';

const PROVIDER_ID = 'provider';
const FIRST_ID = 'first';
const SECOND_ID = 'second';
const THIRD_ID = 'third';
const prefix = 'f';
const FIRST_MAKER: TStyleSheetMaker = ({ bem, time }) => {
    return {
        [bem<{}>('')]: {
            width: '100%',
            'flex-shrink': 0
        },
        html: {
            transitionDuration: time()
        }
    };
};
const SECOND_MAKER: TStyleSheetMaker = ({ bem, units: { px, vh } }) => {
    return {
        [bem<{}>('')]: {
            height: vh(100),
            borderTopLeftRadius: px(14),
            flexGrow: 10
        }
    };
};
const THIRD_MAKER: TStyleSheetMaker = ({ time, angle }) => {
    return {
        html: {
            transitionDuration: time(),
            transform: `skew(${angle()})`
        }
    };
};
const FOURTH_MAKER: TStyleSheetMaker = ({ bem, time }) => {
    return {
        [bem('')]: {
            width: '100%',
            'flex-shrink': 0
        },
        [bem('.element')]: {
            width: '50%'
        },
        [bem('.element.animated')]: {
            transitionDuration: time()
        }
    };
};

const PROVIDER_PARAMS = {
    vars: {
        '': {
            rem: '18px',
            rtime: '150ms',
            rangle: '15deg',
            l: {
                def: 0.4
            },
            h: {
                def: 261.35,
                // brand
                b: 261.35,
                // info
                i: 194.77,
                // error
                e: 29.23,
                // warning
                w: 70.66,
                // success
                s: 142.49
            },
            c: {
                def: 0.03,
                xs: 0.03,
                s: 0.06,
                m: 0.1,
                l: 0.15,
                xl: 0.25
            },
            a: {
                def: 1,
                min: 0,
                xs: 0.1,
                s: 0.25,
                m: 0.5,
                l: 0.75,
                xl: 0.9,
                max: 1
            },
            t: {
                def: 300,
                xs: 100,
                s: 200,
                m: 300,
                l: 450
            },
            sz: {
                s: 10,
                m: 20,
                l: 30
            }
        }
    },
    palette: {
        h: {
            sec: 220,
        },
        l: {
            light: {
                bg: {
                    s: 0.785
                }
            }
        },
        c: {
            light: {
                fg: {
                    rich: 0.145
                }
            }
        }
    },
    coef: {
        $0_: {
            xxs: 0.05
        },
        max: 220,
        $1_: {
            xxl: 1.9
        }
    }
};

describe('Provider utils:', () => {
    let consumer: ReturnType<typeof createConsumer>;
    beforeAll(() => {
        defineProvider(PROVIDER_PARAMS);
    });

    beforeEach(() => {
        const element = document.createElement('script', {
            is: TAG_NAME
        });
        element.dataset.testid = PROVIDER_ID;
        element.setAttribute('is', TAG_NAME);
        document.head.append(element);
        consumer = createConsumer({});
        return () => element.remove();
    });

    test('get provider', () => {
        const provider = page.getByTestId(PROVIDER_ID).query();
        expect(consumer).toBe(provider);
    });

    test('initial rem', () => {
        expect(getComputedStyle(document.documentElement).fontSize).toBe(PROVIDER_PARAMS.vars[''].rem);
    });

    test('get collected stylesheets', () => {
        const makers = { [FIRST_ID]: FIRST_MAKER, [SECOND_ID]: SECOND_MAKER };
        consumer.usePublic(makers);
        const stylesheets = consumer.stylesheets();
        expect(stylesheets.length).toBe(3);
    });

    test('get collected stylesheets by args', () => {
        const makers = { [FIRST_ID]: FIRST_MAKER, [SECOND_ID]: SECOND_MAKER };
        consumer.usePublic(makers);
        const stylesheets = consumer.stylesheets(FIRST_ID, SECOND_ID);
        expect(stylesheets.filter(Boolean).length).toBe(2);
    });

    test('get collected stylesheets by array', () => {
        const makers = { [FIRST_ID]: FIRST_MAKER, [SECOND_ID]: SECOND_MAKER };
        consumer.usePublic(makers);
        const stylesheets = consumer.stylesheets([FIRST_ID, SECOND_ID]);
        expect(stylesheets.filter(Boolean).length).toBe(2);
    });

    test('use stylesheet', () => {
        const resolve = consumer.use(FIRST_MAKER);
        const attrs = resolve('');
        expect(attrs + '').toBe(`data-${prefix}1="_"`);
    });

    test('use public stylesheets', () => {
        const resolvers = consumer.usePublic({ [FIRST_ID]: FIRST_MAKER });
        const resolver = resolvers[FIRST_ID];
        const attrs = resolver('');
        expect(attrs[`data-${FIRST_ID}`]).toBe('_');
    });

    test('use private stylesheets', () => {
        const resolvers = consumer.usePrivate([SECOND_MAKER]);
        const resolver = resolvers[0];
        const attrs = resolver('');
        expect(attrs + '').toBe(`data-${prefix}1="_"`);
    });

    test('resolve stylesheet', () => {
        consumer.use(FIRST_MAKER, FIRST_ID);
        expect(consumer.resolve(FIRST_ID)('') + '').toBe(`data-${FIRST_ID}="_"`);
    });

    test('get provider settings', () => {
        expect(consumer.settings.vars).toMatchObject(PROVIDER_PARAMS.vars);
    });

    test('get provider makers', () => {
        consumer.use(FIRST_MAKER, FIRST_ID);
        expect(consumer.makers[FIRST_ID]).toBe(FIRST_MAKER);
    });

    test('set size attribute', () => {
        const rem = 24;
        consumer.size = rem;
        expect(getComputedStyle(document.documentElement).fontSize).toBe(rem + 'px');
    });

    test('reset size attribute', () => {
        const rem = 24;
        consumer.size = rem;
        consumer.size = null;
        expect(getComputedStyle(document.documentElement).fontSize).toBe(PROVIDER_PARAMS.vars[''].rem);
    });

    test('set time attribute', () => {
        consumer.use(THIRD_MAKER, THIRD_ID);
        const time = 550;
        consumer.time = time;
        expect(getComputedStyle(document.documentElement).transitionDuration).toBe(time / 1000 + 's');
    });

    test('reset time attribute', () => {
        consumer.use(THIRD_MAKER, THIRD_ID);
        const time = 550;
        consumer.time = time;
        consumer.time = null;
        expect(getComputedStyle(document.documentElement).transitionDuration).toBe('0.15s');
    });

    test('set angle attribute', () => {
        const angle = 60;
        consumer.angle = angle;
        expect(window.getComputedStyle(document.documentElement).getPropertyValue('--f0-rangle') + '').toBe(angle + 'deg');
    });

    test('reset angle attribute', () => {
        const angle = 35;
        consumer.angle = angle;
        consumer.angle = null;
        expect(window.getComputedStyle(document.documentElement).getPropertyValue('--f0-rangle') + '').toBe(PROVIDER_PARAMS.vars[''].rangle)
    });

    test('custom palette values', () => {
        const custom = {
            sec: window.getComputedStyle(document.documentElement).getPropertyValue('--f0-palette-h-sec'),
            s: window.getComputedStyle(document.documentElement).getPropertyValue('--f0-palette-l-bg-s'),
            rich: window.getComputedStyle(document.documentElement).getPropertyValue('--f0-palette-c-fg-rich')
        };
        expect(custom).toEqual({
            sec: PROVIDER_PARAMS.palette.h.sec + '',
            s: PROVIDER_PARAMS.palette.l.light.bg.s + '',
            rich: PROVIDER_PARAMS.palette.c.light.fg.rich + '',
        });
    });

    test('custom coef values', () => {
        const custom = {
            1: window.getComputedStyle(document.documentElement).getPropertyValue('--f0-coef-1'),
            15: window.getComputedStyle(document.documentElement).getPropertyValue('--f0-coef-15'),
            max: window.getComputedStyle(document.documentElement).getPropertyValue('--f0-coef-32'),
        };
        expect(custom).toEqual({
            1: PROVIDER_PARAMS.coef.$0_.xxs + '',
            15: PROVIDER_PARAMS.coef.$1_.xxl + '',
            max: PROVIDER_PARAMS.coef.max + '',
        });
    });
});

describe('Provider with `min` mode:', () => {
    let consumer: ReturnType<typeof createConsumer>;
    beforeAll(() => {
        defineProvider(PROVIDER_PARAMS);
        const element = document.createElement('script', {
            is: TAG_NAME
        });
        element.dataset.testid = PROVIDER_ID;
        element.setAttribute('is', TAG_NAME);
        element.setAttribute('mode', 'c');
        element.setAttribute('min', '');
        document.head.append(element);
        consumer = createConsumer({});
        consumer.usePrivate([FOURTH_MAKER]);
    });

    test('stylesheet content', () => {
        const rules = consumer.stylesheets(FOURTH_MAKER)[0]?.cssRules || []
        expect([...rules].map(s=>s.cssText).join('')).toBe(
            '.f1-0 { width: 100%; flex-shrink: 0; }.f1-1 { width: 50%; }.f1-2 { transition-duration: calc(1 * var(--f0-rtime)); }'
        );
    });

    test('minified selector resolver', () => {
        const resolve = consumer.use(FOURTH_MAKER);
        const attrs = resolve('.element.animated');
        expect(attrs + '').toBe(`class="f1-1 f1-2"`);
    });

    test('non-implemented selector resolver', () => {
        const resolve = consumer.use(FOURTH_MAKER);
        const attrs = resolve('..animated');
        expect(attrs + '').toBe(`class="f1-0 "`);
    });
});

describe('useStyleProvider:', () => {
    let provider: ReturnType<typeof useStyleProvider>;

    describe('client-side:', () => {
        beforeEach(() => {
            const script = document.querySelector(`script[is=${TAG_NAME}]`);
            script?.remove();
        });

        test(`create the script:`, () => {
            provider = useStyleProvider();
            expect(provider.constructor.name).toBe('StyleProvider');
        });

        test(`check the script inherits:`, () => {
            provider = useStyleProvider();
            expect(provider.tagName).toContain('SCRIPT');
        });

        test(`create the script with attributes:`, () => {
            provider = useStyleProvider({
                attrs: {
                    min: true,
                    mode: 'c',
                    time: 250,
                    size: 12,
                    prefix: 'eff',
                    theme: 'main'
                }
            });
            expect(provider + '').toBe(`<script is="effcss-provider" min mode="c" time="250" size="12" prefix="eff" theme="main"></script>`);
        });

        test(`use the existing script`, () => {
            const script = document.createElement('script', {
                is: TAG_NAME
            })
            script.setAttribute('is', TAG_NAME);
            document.head.appendChild(script);
            provider = useStyleProvider();
            expect(provider).toBe(script);
        });
    });

    describe('server-side:', () => {
        beforeEach(() => {
            const script = document.querySelector(`script[is=${TAG_NAME}]`);
            script?.remove();
        });

        test(`create the script emulation:`, () => {
            provider = useStyleProvider({
                emulate: true
            });
            expect(provider.tagName).toBe('');
        });

        test(`stringify the script emulation for SSR:`, () => {
            provider = useStyleProvider({
                emulate: true,
                attrs: {
                    min: true,
                    mode: 'c',
                    time: 250,
                    size: 12
                },
                ...PROVIDER_PARAMS
            });
            provider.use(FOURTH_MAKER);
            provider.usePublic({ [FIRST_ID]: FIRST_MAKER, [SECOND_ID]: SECOND_MAKER });
            provider.off(SECOND_ID);
            expect((provider + '').split('</style>').slice(1).join('</style>')).toBe(
                `<style data-effcss="f1">.f1-0{width:100%;flex-shrink:0;}.f1-1{width:50%;}.f1-2{transition-duration:calc(1 * var(--f0-rtime));}</style>` +
                `<style data-effcss="first">.first-0{width:100%;flex-shrink:0;}html{transition-duration:calc(1 * var(--f0-rtime));}</style><style data-effcss="second">.second-0{height:100vh;border-top-left-radius:14px;flex-grow:10;}</style>` +
                `<script is="effcss-provider" type="application/json" mode="c" min size="12" time="250">{"vars":{"":{"rem":"18px","rtime":"150ms","rangle":"15deg","l":{"def":0.4},"h":{"def":261.35,"b":261.35,"i":194.77,"e":29.23,"w":70.66,"s":142.49},"c":{"def":0.03,"xs":0.03,"s":0.06,"m":0.1,"l":0.15,"xl":0.25},"a":{"def":1,"min":0,"xs":0.1,"s":0.25,"m":0.5,"l":0.75,"xl":0.9,"max":1},"t":{"def":300,"xs":100,"s":200,"m":300,"l":450},"sz":{"s":10,"m":20,"l":30}}},"palette":{"h":{"sec":220},"l":{"light":{"bg":{"s":0.785}}},"c":{"light":{"fg":{"rich":0.145}}}},"coef":{"$0_":{"xxs":0.05},"max":220,"$1_":{"xxl":1.9}}}</script>`
            );
        });

        test(`stringify the script emulation for SSG:`, () => {
            provider = useStyleProvider({
                emulate: true,
                attrs: {
                    min: true,
                    mode: 'c',
                },
                noscript: true
            });
            provider.use(FOURTH_MAKER);
            provider.usePublic({ [FIRST_ID]: FIRST_MAKER, [SECOND_ID]: SECOND_MAKER });
            provider.off(SECOND_ID);
            expect((provider + '').split('</style>').slice(1).join('</style>')).toBe(
                `<style data-effcss="f1">.f1-0{width:100%;flex-shrink:0;}.f1-1{width:50%;}.f1-2{transition-duration:calc(1 * var(--f0-rtime));}</style>` +
                `<style data-effcss="first">.first-0{width:100%;flex-shrink:0;}html{transition-duration:calc(1 * var(--f0-rtime));}</style><style data-effcss="second">.second-0{height:100vh;border-top-left-radius:14px;flex-grow:10;}</style>`    
            );
        });
    });
});