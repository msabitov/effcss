import { beforeAll, beforeEach, describe, expect, test } from 'vitest';
import { page } from '@vitest/browser/context';
import { IStyleProvider, IStyleProviderScript, prepareOverrideValues, TAG_NAME_OVERRIDE, TStyleSheetMaker, useStyleProvider } from '../src/index';
import { TAG_NAME } from '../src';

const PROVIDER_ID = 'provider';

const FIRST_MAKER: TStyleSheetMaker = ({ bem, time }) => {
    return {
        [bem('')]: {
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
        [bem('')]: {
            height: vh(100),
            borderTopLeftRadius: px(14),
            flexGrow: 10
        }
    };
};
const ANGLE_VAR = '--angle';
const COLOR_VAR = '--color';
const EASING_VAR = '--easing';
const THIRD_MAKER: TStyleSheetMaker = ({ time, angle, color, easing }) => {
    return {
        html: {
            transitionDuration: time(),
            rotate: angle(2),
            [ANGLE_VAR]: angle(),
            [COLOR_VAR]: color.root(),
            [EASING_VAR]: easing()
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

const defThemeVars = {
    size: 18,
    time: 150,
    angle: 15,
    color: 'red',
    easing: 'ease-in-out',
    sz: {
        s: 10,
        m: 20,
        l: 30
    },
    coef: {
        1: 0.05,
        32: 220,
        15: 1.9
    },
    hue: {
        sec: 220,
    },
    $light: {
        lightness: {
            bg: {
                s: 0.785
            }
        },
        chroma: {
            fg: {
                rich: 0.145
            }
        }
    }
};

const customThemeVars = {
    size: 18,
    time: 150,
    angle: 15,
    mySize: {
        s: 10,
        m: 20,
        l: 30
    },
    coef: {
        1: 0.05,
        32: 220,
        15: 1.9
    },
    hue: {
        sec: 220,
    },
    lightness: {
        bg: {
            s: 0.785
        }
    },
    chroma: {
        fg: {
            rich: 0.145
        }
    }
};

describe('Provider utils:', () => {
    let consumer: IStyleProviderScript;
    beforeEach(() => {
        consumer = useStyleProvider() as IStyleProviderScript;
        consumer.dataset.testid = PROVIDER_ID;
        consumer.theme.update(defThemeVars);
        return () => consumer.remove();
    });

    test('get provider', () => {
        const provider = page.getByTestId(PROVIDER_ID).query();
        expect(consumer).toBe(provider);
    });

    test('initial rem', () => {
        expect(getComputedStyle(document.documentElement).fontSize).toBe(defThemeVars.size + 'px');
    });

    test('get collected stylesheets', () => {
        consumer.use(FIRST_MAKER, SECOND_MAKER);
        const stylesheets = consumer.stylesheets();
        expect(stylesheets.length).toBe(3);
    });

    test('get collected stylesheets by args', () => {
        const makers = [FIRST_MAKER, SECOND_MAKER ];
        consumer.use(...makers);
        const stylesheets = consumer.stylesheets([FIRST_MAKER, SECOND_MAKER]);
        expect(stylesheets.filter(Boolean).length).toBe(2);
    });

    test('use stylesheet', () => {
        const [resolve] = consumer.use(FIRST_MAKER);
        const attrs = resolve('');
        expect(attrs + '').toBe(`data-f1="_"`);
    });

    test('remake stylesheet with the same function', () => {
        const property = '--custom-width';
        let width = 50;
        const maker: TStyleSheetMaker = ({units: {px}}) => ({
            html: {
                [property]: px(width)
            }
        });
        consumer.use(maker);
        width = 100;
        consumer.remake(maker);
        expect(window.getComputedStyle(document.documentElement).getPropertyValue(property)).toBe(`calc(${width} * 1px)`);
    });

    test('remake stylesheet with the different function', () => {
        const property = '--custom-width';
        const width1 = 50;
        const width2 = 100;
        const maker1: TStyleSheetMaker = ({units: {px}}) => ({
            html: {
                [property]: px(width1)
            }
        });
        const maker2: TStyleSheetMaker = ({units: {px}}) => ({
            html: {
                [property]: px(width2)
            }
        });
        consumer.use(maker1);
        consumer.remake(maker2, maker1);
        expect(window.getComputedStyle(document.documentElement).getPropertyValue(property)).toBe(`calc(${width2} * 1px)`);
    });

    test('use many stylesheets', () => {
        const [firstResolver, secondResolver] = consumer.use(FIRST_MAKER, SECOND_MAKER);
        const attrs = {
            ...firstResolver(''),
            ...secondResolver('')
        };
        expect(attrs).toEqual({
            'data-f1': '_',
            'data-f2': '_'
        });
    });

    test('get custom theme list', () => {
        consumer.theme.add(customThemeVars, 'custom');
        expect(consumer.theme.list).toContain('custom');
    });

    test('get provider makers', () => {
        consumer.use(FIRST_MAKER);
        expect(Object.values(consumer.makers)).toContain(FIRST_MAKER);
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
        expect(getComputedStyle(document.documentElement).fontSize).toBe(defThemeVars.size + 'px');
    });

    test('set time attribute', () => {
        consumer.use(THIRD_MAKER);
        const time = 550;
        consumer.time = time;
        expect(getComputedStyle(document.documentElement).transitionDuration).toBe(time / 1000 + 's');
    });

    test('reset time attribute', () => {
        consumer.use(THIRD_MAKER);
        const time = 550;
        consumer.time = time;
        consumer.time = null;
        expect(getComputedStyle(document.documentElement).transitionDuration).toBe('0.15s');
    });

    test('set angle attribute', () => {
        consumer.use(THIRD_MAKER);
        const angle = 60;
        consumer.angle = angle;
        expect(window.getComputedStyle(document.documentElement).getPropertyValue(ANGLE_VAR)).toBe(`calc(${angle} * 1deg)`);
    });

    test('reset angle attribute', () => {
        consumer.use(THIRD_MAKER);
        const angle = 35;
        consumer.angle = angle;
        consumer.angle = null;
        const defAngle = consumer.theme.get().angle;
        expect(window.getComputedStyle(document.documentElement).getPropertyValue(ANGLE_VAR)).toBe(`calc(${defAngle} * 1deg)`);
    });

    test('set color attribute', () => {
        consumer.use(THIRD_MAKER);
        const color = 'green';
        consumer.color = color;
        expect(window.getComputedStyle(document.documentElement).getPropertyValue(COLOR_VAR)).toBe(color);
    });

    test('reset color attribute', () => {
        consumer.use(THIRD_MAKER);
        const color = 'green';
        consumer.color = color;
        consumer.color = null;
        const defColor = consumer.theme.get().color;
        expect(window.getComputedStyle(document.documentElement).getPropertyValue(COLOR_VAR)).toBe(defColor);
    });

    
    test('set easing attribute', () => {
        consumer.use(THIRD_MAKER);
        const easing = 'cubic-bezier(0.1, -0.6, 0.2, 0)';
        consumer.easing = easing;
        expect(window.getComputedStyle(document.documentElement).getPropertyValue(EASING_VAR)).toBe(easing);
    });

    test('reset easing attribute', () => {
        consumer.use(THIRD_MAKER);
        const easing = 'cubic-bezier(0.1, -0.6, 0.2, 0)';
        consumer.easing = easing;
        consumer.easing = null;
        const defEasing = consumer.theme.get().easing;
        expect(window.getComputedStyle(document.documentElement).getPropertyValue(EASING_VAR)).toBe(defEasing);
    });

    test('custom palette values', () => {
        const custom = {
            sec: window.getComputedStyle(document.documentElement).getPropertyValue('--f0-hue-sec'),
            s: window.getComputedStyle(document.documentElement).getPropertyValue('--f0-lightness-bg-s'),
            rich: window.getComputedStyle(document.documentElement).getPropertyValue('--f0-chroma-fg-rich')
        };
        expect(custom).toEqual({
            sec: defThemeVars.hue.sec + '',
            s: defThemeVars.$light.lightness.bg.s + '',
            rich: defThemeVars.$light.chroma.fg.rich + '',
        });
    });

    test('custom coef values', () => {
        const custom = {
            1: window.getComputedStyle(document.documentElement).getPropertyValue('--f0-coef-1'),
            15: window.getComputedStyle(document.documentElement).getPropertyValue('--f0-coef-15'),
            32: window.getComputedStyle(document.documentElement).getPropertyValue('--f0-coef-32'),
        };
        expect(custom).toEqual({
            1: defThemeVars.coef[1] + '',
            15: defThemeVars.coef[15] + '',
            32: defThemeVars.coef[32] + ''
        });
    });
});

describe('Provider with `min` mode:', () => {
    let consumer: IStyleProvider;
    beforeAll(() => {
        consumer = useStyleProvider({
            attrs: {
                mode: 'c',
                min: true
            }
        });
        consumer.use(FOURTH_MAKER);
    });

    test('stylesheet content', () => {
        const rules = consumer.stylesheets([FOURTH_MAKER])[0]?.cssRules || []
        expect([...rules].map(s=>s.cssText).join('')).toBe(
            '.f1-0 { width: 100%; flex-shrink: 0; }.f1-1 { width: 50%; }.f1-2 { transition-duration: calc(var(--f0-time) * 1ms); }'
        );
    });

    test('minified selector resolver', () => {
        const [resolve] = consumer.use(FOURTH_MAKER);
        const attrs = resolve('.element.animated');
        expect(attrs + '').toBe(`class="f1-1 f1-2"`);
    });

    test('non-implemented selector resolver', () => {
        const [resolve] = consumer.use(FOURTH_MAKER);
        const attrs = resolve('..animated');
        expect(attrs + '').toBe(`class="f1-0 "`);
    });
});

describe('useStyleProvider:', () => {
    let provider: IStyleProvider;

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
                    pre: 'eff'
                }
            });
            provider.theme.add({}, 'main');
            provider.theme.switch('main');
            expect((provider + '').split('</style>').slice(1).join('</style>')).toBe(
                `<script is="effcss-provider" min mode="c" size="12" time="250" type="application/json" theme="main">{"theme":[{"type":"add","payload":{"params":{},"name":"main"}}]}</script>`
            );
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

        test(`switch off maker with script emulation:`, () => {
            provider = useStyleProvider({
                emulate: true
            });
            provider.use(FOURTH_MAKER);
            provider.off(FOURTH_MAKER);
            expect(provider.status(FOURTH_MAKER)).toBeFalsy();
        });

        test(`switch on maker with script emulation:`, () => {
            provider = useStyleProvider({
                emulate: true
            });
            provider.use(FOURTH_MAKER);
            provider.off(FOURTH_MAKER);
            provider.on(FOURTH_MAKER);
            expect(provider.status(FOURTH_MAKER)).toBeTruthy();
        });

        test(`stringify the script emulation for SSR:`, () => {
            provider = useStyleProvider({
                emulate: true,
                attrs: {
                    min: true,
                    mode: 'c',
                    time: 250,
                    size: 12
                }
            });
            provider.theme.add(customThemeVars, 'custom');
            provider.theme.switch('custom');
            provider.use(FOURTH_MAKER);
            provider.use(FIRST_MAKER, SECOND_MAKER);
            provider.off(SECOND_MAKER);
            expect((provider + '').split('</style>').slice(1).join('</style>')).toBe(
                `<style data-effcss="f1">.f1-0{width:100%;flex-shrink:0;}.f1-1{width:50%;}.f1-2{transition-duration:calc(var(--f0-time) * 1ms);}</style>` +
                `<style data-effcss="f2">.f2-0{width:100%;flex-shrink:0;}html{transition-duration:calc(var(--f0-time) * 1ms);}</style>` +
                `<script is="effcss-provider" min mode="c" size="12" time="250" type="application/json" theme="custom">` +
                `{"theme":[{"type":"add","payload":{"params":{"size":18,"time":150,"angle":15,"mySize":{"s":10,"m":20,"l":30},"coef":{"1":0.05,"15":1.9,"32":220},"hue":{"sec":220},"lightness":{"bg":{"s":0.785}},"chroma":{"fg":{"rich":0.145}}},"name":"custom"}}],` +
                `"dict":{"f0":{"_theme_0":"0"},"f1":{"_":"0","__element":"1","__element_animated":"2"},"f2":{"_":"0"},"f3":{"_":"0"}}}</script>`
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
            provider.theme.add(customThemeVars, 'custom');
            provider.theme.switch('custom');
            provider.use(FOURTH_MAKER);
            provider.use(FIRST_MAKER, SECOND_MAKER);
            provider.off(SECOND_MAKER);
            expect((provider + '').split('</style>').slice(1).join('</style>')).toBe(
                `<style data-effcss="f1">.f1-0{width:100%;flex-shrink:0;}.f1-1{width:50%;}.f1-2{transition-duration:calc(var(--f0-time) * 1ms);}</style>` +
                `<style data-effcss="f2">.f2-0{width:100%;flex-shrink:0;}html{transition-duration:calc(var(--f0-time) * 1ms);}</style>` +
                `<style is="effcss-provider" min mode="c" theme="custom"></style>`
            );
        });

        test(`hydrate stylesheet from SSR without maker call:`, () => {
            let called = 0;
            const maker: TStyleSheetMaker = ({ bem, time }) => {                
                called++;
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
            provider = useStyleProvider({
                emulate: true,
                attrs: {
                    min: true,
                    mode: 'c',
                    time: 250,
                    size: 12
                }
            });
            provider.use(maker);
            document.head.innerHTML = (document.head.innerHTML + provider);
            provider = useStyleProvider();
            expect(called).toBe(1);
        });
    });

    describe('effcss-override:', () => {
        const OVER_ID = 'over-id';
        let inside: HTMLElement | null;
        let override: HTMLElement | null;
        const overValues = {
            size: 24,
            hue: {
                pri: 10
            },
            $light: {
                lightness: {
                    bg: {
                        xl: 0.95
                    }
                }
            }
        };

        beforeAll(() => {
            provider = useStyleProvider();
            document.body.innerHTML = `<${TAG_NAME_OVERRIDE} values="${prepareOverrideValues(overValues)}"><div id="${OVER_ID}"></div></${TAG_NAME_OVERRIDE}>`;
            inside = document.querySelector(`#${OVER_ID}`);
            override = document.querySelector(TAG_NAME_OVERRIDE);
        });

        test(`override values (top level)`, () => {
            expect(inside && getComputedStyle(inside).getPropertyValue('--f0-size')).toBe(overValues.size + '');
        });

        test(`override values (top nested)`, () => {
            expect(inside && getComputedStyle(inside).getPropertyValue('--f0-hue-pri')).toBe(overValues.hue.pri + '');
        });

        test(`override values (@media $light)`, () => {
            document.documentElement.style.setProperty('color-scheme', 'light');
            expect(inside && getComputedStyle(inside).getPropertyValue('--f0-lightness-bg-xl')).toBe(overValues.$light.lightness.bg.xl + '');
        });

        test(`override values changed:`, () => {
            const newValue = 28;
            override?.setAttribute('values', prepareOverrideValues({...overValues, size: newValue}));
            expect(inside && getComputedStyle(inside).getPropertyValue('--f0-size')).toBe(newValue + '');
        });
    });
});