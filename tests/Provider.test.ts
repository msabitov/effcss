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
const CONTRAST_VAR = '--contrast';
const NEUTRAL_VAR = '--neutral';
const EASING_VAR = '--easing';
const THIRD_MAKER: TStyleSheetMaker = ({ time, angle, color, easing }) => {
    return {
        html: {
            transitionDuration: time(),
            rotate: angle(2),
            [ANGLE_VAR]: angle(),
            [COLOR_VAR]: color.root(),
            [CONTRAST_VAR]: color.contrast(),
            [NEUTRAL_VAR]: color.neutral(),
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

type TMaker = {
    sz: 's' | 'm';
    rounded: '';
    card: {
        bg: 'pri' | 'sec';
        inv: '';
        footer: Record<string, never>;
    }
};
const FIFTH_MAKER: TStyleSheetMaker = ({ select }) => {
    const selector = select<TMaker>;
    return {
        [selector('sz:s')]: {
            width: '10px'
        },
        [selector('card.inv:')]: {
            width: '50%'
        },
        [selector('card.footer')]: {
            height: '32px'
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

    test('`cx` with object', () => {
        const classNames = consumer.cx<TMaker>(FIFTH_MAKER, {
            sz: 's',
            card: {
                footer: {}
            }
        });
        expect(classNames).toEqual('f1-sz_s f1-card-footer');
    });

    test('`cx` with array', () => {
        const classNames = consumer.cx<TMaker>(FIFTH_MAKER, ['sz:s', 'card.footer']);
        expect(classNames).toEqual('f1-sz_s f1-card-footer');
    });

    test('`dx` with object', () => {
        const classNames = consumer.dx<TMaker>(FIFTH_MAKER, {
            sz: 's',
            card: {
                footer: {}
            }
        });
        expect(classNames).toEqual({
            'data-f1': 'sz_s card-footer'
        });
    });

    test('`dx` with array', () => {
        const classNames = consumer.dx<TMaker>(FIFTH_MAKER, ['sz:s', 'card.footer']);
        expect(classNames).toEqual({
            'data-f1': 'sz_s card-footer'
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

    test('set contrast attribute', () => {
        consumer.use(THIRD_MAKER);
        const color = 'green';
        consumer.contrast = color;
        expect(window.getComputedStyle(document.documentElement).getPropertyValue(CONTRAST_VAR)).toBe(color);
    });

    test('reset color attribute', () => {
        consumer.use(THIRD_MAKER);
        const color = 'green';
        consumer.contrast = color;
        consumer.contrast = null;
        const defColor = consumer.theme.get().contrast;
        expect(window.getComputedStyle(document.documentElement).getPropertyValue(CONTRAST_VAR)).toBe(defColor);
    });

    test('set neutral attribute', () => {
        consumer.use(THIRD_MAKER);
        const color = 'green';
        consumer.neutral = color;
        expect(window.getComputedStyle(document.documentElement).getPropertyValue(NEUTRAL_VAR)).toBe(color);
    });

    test('reset neutral attribute', () => {
        consumer.use(THIRD_MAKER);
        const color = 'green';
        consumer.neutral = color;
        consumer.neutral = null;
        const defColor = consumer.theme.get().neutral;
        expect(window.getComputedStyle(document.documentElement).getPropertyValue(NEUTRAL_VAR)).toBe(defColor);
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

    test('`cx` with object', () => {
        const classNames = consumer.cx(FIFTH_MAKER, {
            sz: 's',
            card: {
                footer: {}
            }
        });
        expect(classNames).toEqual('f2-0 f2-2');
    });

    test('`cx` with array', () => {
        const classNames = consumer.cx<TMaker>(FIFTH_MAKER, ['sz:s', 'card.footer']);
        expect(classNames).toEqual('f2-0 f2-2');
    });

    test('`dx` with object', () => {
        const classNames = consumer.dx<TMaker>(FIFTH_MAKER, {
            sz: 's',
            card: {
                footer: {}
            }
        });
        expect(classNames).toEqual({
            'data-f2': '0 2'
        });
    });

    test('`dx` with array', () => {
        const classNames = consumer.dx<TMaker>(FIFTH_MAKER, ['sz:s', 'card.footer']);
        expect(classNames).toEqual({
            'data-f2': '0 2'
        });
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

        test(`new global provider after remove:`, () => {
            const script = useStyleProvider({
                global: true
            }) as IStyleProviderScript;
            script.size = 24;
            script.remove();
            const newScript = useStyleProvider({
                global: true
            });
            expect(!document.head.contains(script) && (newScript.size !== script.size)).toBeTruthy();
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
                `<script is="effcss-provider" min mode="c" size="12" time="250" type="application/json" theme="main">` +
                `{"theme":[{"type":"add","payload":{"params":{},"name":"main"}}],"dict":{"eff0":{"_theme_0":"0"}}}` +
                `</script>`
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
            time: 165,
            angle: 27,
            color: 'purple',
            contrast: 'cyan',
            neutral: 'grey',
            hue: {
                pri: 10
            },
            $light: {
                lightness: {
                    bg: {
                        xl: 0.95
                    }
                }
            },
            $dark: {
                lightness: {
                    bg: {
                        xl: 0.15
                    }
                }
            }
        };
        const newSizeValue = 28;

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

        test(`override values with scheme=light`, () => {
            override?.setAttribute('scheme', 'light');
            expect(inside && getComputedStyle(inside).getPropertyValue('--f0-lightness-bg-xl')).toBe(overValues.$light.lightness.bg.xl + '');
        });

        test(`override values with scheme=dark`, () => {
            override?.setAttribute('scheme', 'dark');
            expect(inside && getComputedStyle(inside).getPropertyValue('--f0-lightness-bg-xl')).toBe(overValues.$dark.lightness.bg.xl + '');
        });

        test(`override values changed:`, () => {
            override?.setAttribute('values', prepareOverrideValues({...overValues, size: newSizeValue}));
            expect(inside && getComputedStyle(inside).getPropertyValue('--f0-size')).toBe(newSizeValue + '');
        });

        test('set size attribute', () => {
            const rem = '24';
            override?.setAttribute('size', rem);
            expect(inside && getComputedStyle(inside).getPropertyValue('--f0-size')).toBe(rem);
        });

        test('reset size attribute', () => {
            override?.removeAttribute('size');
            expect(inside && getComputedStyle(inside).getPropertyValue('--f0-size')).toBe(newSizeValue + '');
        });

        test('set time attribute', () => {
            const time = '550';
            override?.setAttribute('time', time);
            expect(inside && getComputedStyle(inside).getPropertyValue('--f0-time')).toBe(time);
        });

        test('reset time attribute', () => {
            override?.removeAttribute('time');
            expect(inside && getComputedStyle(inside).getPropertyValue('--f0-time')).toBe(overValues.time + '');
        });

        test('set angle attribute', () => {
            const angle = '550';
            override?.setAttribute('angle', angle);
            expect(inside && getComputedStyle(inside).getPropertyValue('--f0-angle')).toBe(angle);
        });

        test('reset angle attribute', () => {
            override?.removeAttribute('angle');
            expect(inside && getComputedStyle(inside).getPropertyValue('--f0-angle')).toBe(overValues.angle + '');
        });

        test('set color attribute', () => {
            const color = '#aa5e5eff';
            override?.setAttribute('color', color);
            expect(inside && getComputedStyle(inside).getPropertyValue('--f0-color')).toBe(color);
        });

        test('reset color attribute', () => {
            override?.removeAttribute('color');
            expect(inside && getComputedStyle(inside).getPropertyValue('--f0-color')).toBe(overValues.color + '');
        });

        test('set contrast attribute', () => {
            const color = '#c0c7c2ff';
            override?.setAttribute('contrast', color);
            expect(inside && getComputedStyle(inside).getPropertyValue('--f0-contrast')).toBe(color);
        });

        test('reset contrast attribute', () => {
            override?.removeAttribute('contrast');
            expect(inside && getComputedStyle(inside).getPropertyValue('--f0-contrast')).toBe(overValues.contrast + '');
        });

        test('set neutral attribute', () => {
            const color = '#5eaa6fff';
            override?.setAttribute('neutral', color);
            expect(inside && getComputedStyle(inside).getPropertyValue('--f0-neutral')).toBe(color);
        });

        test('reset neutral attribute', () => {
            override?.removeAttribute('neutral');
            expect(inside && getComputedStyle(inside).getPropertyValue('--f0-neutral')).toBe(overValues.neutral + '');
        });
    });
});