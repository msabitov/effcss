import { beforeAll, describe, expect, test } from 'vitest';
import {
    configure, serialize, stylesheet,
    classNames, attributes, customStyles,
    variable,
    update,
    variablesStylesheet,
    variables,
    subscribe,
    lazyClassNames,
    lazyAttributes,
    lazyCustomStyles,
    className,
    attribute,
    animation,
    layer,
    container,
    font,
    animations,
    layers,
    containers,
    fonts
} from '../src/index';
import { EffCSSEvent, Generator } from '../src/types';

type Card = {
    w: 's' | 'm' | 'l';
    blur: true;
    card: {
        variant: 1 | 2;
        rounded: true;
    }
}

const generator: Generator<Card> = (selectors) => {
    const {w, card} = selectors;
    return {
        [w.s]: {
            width: '12px'
        },
        [card]: {
            background: 'white',
            border: 'none'
        },
        [card.rounded.true]: {
            borderRadius: '1rem'
        }
    };
};

describe('Subscribe:', () => {
    const events: EffCSSEvent[] = [];
    let unsubscribe: Function;

    beforeAll(() => {
        configure({
            emulate: true
        });

        unsubscribe = subscribe((event) => events.push(event));
    });

    describe('stylesheets:', () => {
        test('classNames:', () => {
            const length = events.length;
            const card = classNames<Card>(generator);
            expect(events.length).toBe(length + 1);
            const cls = card({
                card: {
                    rounded: true
                },
                w: 's'
            });
            expect(cls).toBe(`f0_1 f0_4 f0_2`);
            expect(events[events.length - 1]).toEqual({
                fn: 'classNames',
                key: 'f0',
                dict: {
                    card: 'f0_1',
                    card_rounded: 'f0_3',
                    card_rounded_true: 'f0_4',
                    w: 'f0_0',
                    w_s: 'f0_2'
                },
                css: '.f0_2{width:12px;}.f0_1{background:white;border:none;}.f0_4{border-radius:1rem;}'
            });
        });

        test('attributes:', () => {
            const length = events.length;
            const card = attributes<Card>(generator);
            expect(events.length).toBe(length + 1);
            const attrs = card({
                card: {
                    rounded: true
                },
                w: 's'
            });
            expect(attrs).toEqual({
                [`data-f1`]: '1 4 2'
            });
            expect(events[events.length - 1]).toEqual({
                fn: 'attributes',
                key: 'f1',
                dict: {
                    card: '1',
                    card_rounded: '3',
                    card_rounded_true: '4',
                    w: '0',
                    w_s: '2'
                },
                css: '[data-f1~=\"2\"]{width:12px;}[data-f1~=\"1\"]{background:white;border:none;}[data-f1~=\"4\"]{border-radius:1rem;}',
            });
        });

        test('customStyles', () => {
            const length = events.length;
            const custom = customStyles(() => ({
                '.cls': {
                    padding: '1rem',
                    textDecoration: ['underline', 'underline dotted']
                },
                '[data-attr]': {
                    background: 'grey'
                }
            }));
            expect(events.length).toBe(length + 1);
            expect(events[events.length - 1]).toEqual({
                fn: 'customStyles',
                key: 'f2',
                dict: {},
                css: '.cls{padding:1rem;text-decoration:underline;text-decoration:underline dotted;}[data-attr]{background:grey;}',
            });
        });

        test('lazyClassNames:', () => {
            const length = events.length;
            const card = lazyClassNames<Card>(generator);
            expect(events.length).toBe(length);
            const cls = card({
                card: {
                    rounded: true
                },
                w: 's'
            });
            expect(events.length).toBe(length + 1);
            expect(cls).toBe(`f3_1 f3_4 f3_2`);
            expect(events[events.length - 1]).toEqual({
                fn: 'classNames',
                key: 'f3',
                dict: {
                    card: 'f3_1',
                    card_rounded: 'f3_3',
                    card_rounded_true: 'f3_4',
                    w: 'f3_0',
                    w_s: 'f3_2'
                },
                css: '.f3_2{width:12px;}.f3_1{background:white;border:none;}.f3_4{border-radius:1rem;}'
            });
        });

        test('lazyAttributes:', () => {
            const length = events.length;
            const card = lazyAttributes(generator);
            expect(events.length).toBe(length);
            const attrs = card({
                card: {
                    rounded: true
                },
                w: 's'
            });
            expect(events.length).toBe(length + 1);
            expect(attrs).toEqual({
                'data-f4': '1 4 2'
            });
            expect(events[events.length - 1]).toEqual({
                fn: 'attributes',
                key: 'f4',
                dict: {
                    card: '1',
                    card_rounded: '3',
                    card_rounded_true: '4',
                    w: '0',
                    w_s: '2'
                },
                css: '[data-f4~=\"2\"]{width:12px;}[data-f4~=\"1\"]{background:white;border:none;}[data-f4~=\"4\"]{border-radius:1rem;}',
            });
        });

        test('lazyCustomStyles', () => {
            const length = events.length;
            const custom = lazyCustomStyles(() => ({
                '.cls': {
                    padding: '1rem',
                    textDecoration: ['underline', 'underline dotted']
                },
                '[data-attr]': {
                    background: 'grey'
                }
            }));
            expect(events.length).toBe(length);
            custom();
            expect(events.length).toBe(length + 1);
            expect(events[events.length - 1]).toEqual({
                fn: 'customStyles',
                key: 'f5',
                dict: {},
                css: '.cls{padding:1rem;text-decoration:underline;text-decoration:underline dotted;}[data-attr]{background:grey;}',
            });
        });
    });

    describe('rules:', () => {
        test('className:', () => {
            const length = events.length;
            const cls = className({
                margin: 'auto',
                '&:hover': {
                    outline: '2px solid black',
                    '.child': {
                        background: 'grey'
                    }
                }
            });
            expect(events.length).toBe(length + 1);
            expect(events[events.length - 1]).toEqual({
                fn: 'className',
                result: 'f6_0',
                css: '.f6_0 {margin:auto;&:hover{outline:2px solid black;.child{background:grey;}}}'
            });
        });

        test('attribute:', () => {
            const length = events.length;
            const attr = attribute({
                margin: 'auto',
                '&:hover': {
                    outline: '2px solid black',
                    '.child': {
                        background: 'grey'
                    }
                }
            });
            expect(events.length).toBe(length + 1);
            expect(events[events.length - 1]).toEqual({
                fn: 'attribute',
                result: {
                    'data-f6-1': ''
                },
                css: '[data-f6-1] {margin:auto;&:hover{outline:2px solid black;.child{background:grey;}}}'
            });
        });
    });

    describe('at-rules:', () => {
        describe('single rule:', () => {
            test('variable', () => {
                const length = events.length;
                const size = variable('12px');
                const color = variable({
                    syntax: '*',
                    inherits: false,
                    initialValue: 'red'
                });
                
                expect(events.length).toBe(length + 2);
                expect(events[events.length - 2]).toEqual({
                    css: '@property --f6-0 {syntax:"*";inherits:true;initial-value:12px;}',
                    fn: 'variable',
                    name: '--f6-0'
                });
                expect(events[events.length - 1]).toEqual({
                    css: '@property --f6-1 {syntax:"*";inherits:false;initial-value:red;}',
                    fn: 'variable',
                    name: '--f6-1'
                });
            });

            test('animation', () => {
                const length = events.length;
                const size = animation({
                    from: {
                        width: '100px'
                    },
                    to: {
                        width: '200px'
                    }
                });
                const opacity = animation({
                    '0%': {
                        opacity: 0
                    },
                    '50%': {
                        opacity: 0.6
                    },
                    '100%': {
                        opacity: 1
                    }
                });
        
                expect(events.length).toBe(length + 2);
                expect(events[events.length - 2]).toEqual({
                    css: '@keyframes f6-0 {from{width:100px;}to{width:200px;}}',
                    fn: 'animation',
                    name: 'f6-0'
                });
                expect(events[events.length - 1]).toEqual({
                    css: '@keyframes f6-1 {0%{opacity:0;}50%{opacity:0.6;}100%{opacity:1;}}',
                    fn: 'animation',
                    name: 'f6-1'
                });
            });

            test('layer:', () => {
                const length = events.length;
                const startLayer = layer();
        
                expect(events.length).toBe(length + 1);
                expect(events[events.length - 1]).toEqual({
                    css: '@layer f6-0;',
                    fn: 'layer',
                    name: 'f6-0'
                });
            });

            test('container', () => {
                const length = events.length;
                const normalContainer = container();
                const inlineSizeContainer = container('inline-size');
                expect(events.length).toBe(length + 2);
                expect(events[events.length - 2]).toEqual({
                    css: '',
                    fn: 'container',
                    name: 'f6-0',
                    type: 'normal'
                });
                expect(events[events.length - 1]).toEqual({
                    css: '',
                    fn: 'container',
                    name: 'f6-1',
                    type: 'inline-size'
                });
            });

            test('font', () => {
                const length = events.length;
                const first = font({
                    src: `url("/fonts/roboto-regular.woff2") format("woff2"), url("/fonts/roboto-regular.woff") format("woff")`,
                    weight: 400,
                    style: 'normal',
                    display: 'swap'
                });
                const second = font({
                    src: `url("https://mdn.github.io/shared-assets/fonts/FiraSans-Regular.woff2")`,
                    genericName: 'sans-serif'
                });
        
                expect(events.length).toBe(length + 2);
                expect(events[events.length - 2]).toEqual({
                    css: '@font-face {font-family:"f6-0";src:url("/fonts/roboto-regular.woff2") format("woff2"), url("/fonts/roboto-regular.woff") format("woff");font-display:swap;font-style:normal;font-weight:400;}',
                    fn: 'font',
                    name: 'f6-0'
                });
                expect(events[events.length - 1]).toEqual({
                    css: '@font-face {font-family:"f6-1";src:url("https://mdn.github.io/shared-assets/fonts/FiraSans-Regular.woff2");}',
                    fn: 'font',
                    name: 'f6-1'
                });
            });
        });

        describe('multiple rules:', () => {
            test('variables', () => {
                const length = events.length;
                const vars = variables({
                    size: '12px',
                    color: {
                        syntax: '*',
                        inherits: false,
                        initialValue: 'red'
                    }
                });
                
                expect(events.length).toBe(length + 1);
                expect(events[events.length - 1]).toEqual({
                    css: '@property --f6-2 {syntax:"*";inherits:true;initial-value:12px;}@property --f6-3 {syntax:"*";inherits:false;initial-value:red;}',
                    fn: 'variables',
                    names: [
                        '--f6-2',
                        '--f6-3',
                    ]
                });
            });

            test('animations', () => {
                const length = events.length;
                const variants = animations({
                    size: {
                        from: {
                            width: '100px'
                        },
                        to: {
                            width: '200px'
                        }
                    },
                    opacity: {
                        '0%': {
                            opacity: 0
                        },
                        '50%': {
                            opacity: 0.6
                        },
                        '100%': {
                            opacity: 1
                        }
                    }
                });
        
                expect(events.length).toBe(length + 1);
                expect(events[events.length - 1]).toEqual({
                    css: '@keyframes f6-2 {from{width:100px;}to{width:200px;}}@keyframes f6-3 {0%{opacity:0;}50%{opacity:0.6;}100%{opacity:1;}}',
                    fn: 'animations',
                    names: [
                        'f6-2',
                        'f6-3'
                    ]
                });
            });

            test('layers', () => {
                const length = events.length;
                const globalLayers = layers(['start', 'top']);
        
                expect(events.length).toBe(length + 1);
                expect(events[events.length - 1]).toEqual({
                    css: '@layer f6-1, f6-2;',
                    fn: 'layers',
                    names: [
                        'f6-1',
                        'f6-2'
                    ]
                });
            });

            test('containers', () => {
                const length = events.length;
                const globalContainers = containers({
                    normal: '',
                    inline: 'inline-size',
                });

                expect(events.length).toBe(length + 1);
                expect(events[events.length - 1]).toEqual({
                    css: '',
                    fn: 'containers',
                    items: [
                        {
                            name: 'f6-2',
                            type: 'normal'
                        },
                        {
                            name: 'f6-3',
                            type: 'inline-size'
                        }
                    ]
                });
            });

            test('fonts', () => {
                const length = events.length;
                const globalFonts = fonts({
                    first: {
                        src: `url("/fonts/roboto-regular.woff2") format("woff2"), url("/fonts/roboto-regular.woff") format("woff")`,
                        weight: 400,
                        style: 'normal',
                        display: 'swap'
                    },
                    second: {
                        src: `url("https://mdn.github.io/shared-assets/fonts/FiraSans-Regular.woff2")`,
                        genericName: 'sans-serif'
                    }
                });
        
                expect(events.length).toBe(length + 1);
                expect(events[events.length - 1]).toEqual({
                    css: '@font-face {font-family:"f6-2";src:url("/fonts/roboto-regular.woff2") format("woff2"), url("/fonts/roboto-regular.woff") format("woff");font-display:swap;font-style:normal;font-weight:400;}@font-face {font-family:\"f6-3\";src:url("https://mdn.github.io/shared-assets/fonts/FiraSans-Regular.woff2");}',
                    fn: 'fonts',
                    names: [
                        'f6-2',
                        'f6-3'
                    ]
                });
            });
        });

        test('variable updates:', () => {
            const length = events.length;
            const angle = variable('45deg');
            angle.set('90deg');
            expect(events.length).toBe(length + 2);
            expect(events[events.length - 1]).toEqual({
                css: '@property --f6-4 {syntax:"*";inherits:true;initial-value:90deg;}',
                fn: 'variable.set',
                name: '--f6-4',
                value: '90deg'
            });

            const colors = variables({
                primary: 'green',
                secondary: 'red'
            });
            colors.primary.set('purple');
            expect(events.length).toBe(length + 4);
            expect(events[events.length - 1]).toEqual({
                css: '@property --f6-5 {syntax:"*";inherits:true;initial-value:purple;}',
                fn: 'variable.set',
                name: '--f6-5',
                value: 'purple'
            });
        });

        test('ignore local rules', () => {
            const length = events.length;
            customStyles(() => {
                const startLayer = layer();
                const sizeAnimation = animation({
                    from: {
                        width: '100px'
                    },
                    to: {
                        width: '200px'
                    }
                });
                const offset = variable('12px');
                const inlineSizeContainer = container('inline-size');
                const first = font({
                    src: `url("/fonts/roboto-regular.woff2") format("woff2"), url("/fonts/roboto-regular.woff") format("woff")`,
                    weight: 400,
                    style: 'normal',
                    display: 'swap'
                });
                return {
                    [startLayer]: {
                        '.cls-1': {
                            animationName: sizeAnimation(),
                            animationDuration: '3s',
                        },
                        '.cls-2': {
                            fontFamily: first(),
                            container: inlineSizeContainer(),
                            padding: offset('16px')
                        }
                    }
                };
            });

            expect(events.length).toBe(length + 1);
        });
    });

    describe('clean up:', () => {
        test('unsubscribe', () => {
            const length = events.length;
            unsubscribe();

            customStyles(() => ({body: {background: 'white'}}));
            expect(events.length).toBe(length);
        });
    });
});
