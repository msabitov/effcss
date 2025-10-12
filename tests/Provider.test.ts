import { beforeAll, beforeEach, describe, expect, test } from 'vitest';
import { page } from '@vitest/browser/context';
import { defineProvider, TStyleSheetMaker } from '../src/index';
import { createConsumer } from '../src/consumer';
import { TAG_NAME } from '../src/common';

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
        expect(attrs + '').toBe(`data-${prefix}1=""`);
    });

    test('use public stylesheets', () => {
        const resolvers = consumer.usePublic({ [FIRST_ID]: FIRST_MAKER });
        const resolver = resolvers[FIRST_ID];
        const attrs = resolver('');
        expect(attrs[`data-${FIRST_ID}`]).toBe('');
    });

    test('use private stylesheets', () => {
        const resolvers = consumer.usePrivate([SECOND_MAKER]);
        const resolver = resolvers[0];
        const attrs = resolver('');
        expect(attrs + '').toBe(`data-${prefix}1=""`);
    });

    test('resolve stylesheet', () => {
        consumer.use(FIRST_MAKER, FIRST_ID);
        expect(consumer.resolve(FIRST_ID)('') + '').toBe(`data-${FIRST_ID}=""`);
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
