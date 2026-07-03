import { beforeAll, describe, expect, test } from 'vitest';
import {
    configure, serialize, stylesheet,
    classNames, attributes, customStyles,
    variable,
    update,
    variablesStylesheet,
    variables
} from '../src/index';

type Card = {
    w: 's' | 'm' | 'l';
    blur: true;
    card: {
        variant: 1 | 2;
        rounded: true;
    }
}

describe('Configured Utils:', () => {
    const prefix = 'effcss';
    beforeAll(() => {
        configure({
            prefix,
            minify: false,
            emulate: true
        });
    });

    describe('Selectors:', () => {
        test('classNames:', () => {
            const card = classNames<Card>((selectors) => {
                const {w, card, blur} = selectors;
                return {
                    [w.s]: {
                        width: '12px'
                    },
                    [w.m]: {
                        width: '24px'
                    },
                    [w.l]: {
                        width: '26px'
                    },
                    [blur.true]: {
                        filter: 'blur(5px)'
                    },
                    [card]: {
                        background: 'white',
                        border: 'none'
                    },
                    [card.variant[1]]: {
                        width: 'auto',
                        display: 'block',
                        padding: '12px',
                        '&:hover': {
                            cursor: 'pointer'
                        }
                    },
                    [card.variant[2]]: {
                        width: 'auto',
                        display: 'flex',
                        flexDirection: 'column',
                        padding: '16px',
                        '&:hover': {
                            outline: '2px solid black'
                        }
                    },
                    [card.rounded.true]: {
                        borderRadius: '1rem'
                    }
                }
            })
            const cls = card({
                card: {
                    rounded: true
                },
                w: 's'
            });
            expect(cls).toBe(`${prefix}0_card ${prefix}0_card_rounded_true ${prefix}0_w_s`);
        });

        test('attributes:', () => {
            const card = attributes<Card>((selectors) => {
                const {w, card, blur} = selectors;
                return {
                    [w.s]: {
                        width: '12px'
                    },
                    [w.m]: {
                        width: '24px'
                    },
                    [w.l]: {
                        width: '26px'
                    },
                    [blur.true]: {
                        filter: 'blur(5px)'
                    },
                    [card]: {
                        background: 'white',
                        border: 'none'
                    },
                    [card.variant[1]]: {
                        width: 'auto',
                        display: 'block',
                        padding: '12px',
                        '&:hover': {
                            cursor: 'pointer'
                        }
                    },
                    [card.variant[2]]: {
                        width: 'auto',
                        display: 'flex',
                        flexDirection: 'column',
                        padding: '16px',
                        '&:hover': {
                            outline: '2px solid black'
                        }
                    },
                    [card.rounded.true]: {
                        borderRadius: '1rem'
                    }
                }
            })
            const attrs = card({
                card: {
                    rounded: true
                },
                w: 's'
            });
            expect(attrs).toEqual({
                [`data-${prefix}1`]: 'card card_rounded_true w_s'
            });
        });
    });

    describe('Configure:', () => {
        test('blocks configuration when stylesheets are created:', () => {
            const result = configure({
                prefix: 'next',
                minify: false,
                emulate: true
            });
            expect(result).toBeFalsy();
        });

        test('custom prefix:', () => {
            const cssText = serialize();
            expect(cssText).toContain(`.${prefix}0_card_rounded_true`);
            expect(cssText).toContain(`[data-${prefix}1~="card_rounded_true"]`);
        });

        test('not minify:', () => {
            const cssText = serialize();
            expect(cssText).toContain(`.${prefix}0_card_rounded_true`);
            expect(cssText).toContain(`[data-${prefix}1~="card_rounded_true"]`);
        });

        test('emulate:', () => {
            const custom = customStyles(() => ({
                '.custom': {
                    padding: '12px'
                }
            }))
            const customStylesheet = stylesheet(custom);
            expect(customStylesheet instanceof globalThis.CSSStyleSheet).toBeFalsy();
        });
    });

    describe('Serialize', () => {
        test('classNames stylesheet', () => {
            const styles = serialize();
            expect(styles).toContain(
                `<style data-effcss-key="effcss0">` +
                `.effcss0_w_s{width:12px;}.effcss0_w_m{width:24px;}.effcss0_w_l{width:26px;}.effcss0_blur_true{filter:blur(5px);}.effcss0_card{background:white;border:none;}` +
                `.effcss0_card_variant_1{width:auto;display:block;padding:12px;&:hover{cursor:pointer;}}` +
                `.effcss0_card_variant_2{width:auto;display:flex;flex-direction:column;padding:16px;&:hover{outline:2px solid black;}}` +
                `.effcss0_card_rounded_true{border-radius:1rem;}` +
                `</style>`
            );
        });

        test('attributes stylesheet', () => {
            const styles = serialize();
            expect(styles).toContain(
                `<style data-effcss-key="effcss1">` +
                `[data-effcss1~="w_s"]{width:12px;}[data-effcss1~="w_m"]{width:24px;}[data-effcss1~="w_l"]{width:26px;}[data-effcss1~="blur_true"]{filter:blur(5px);}[data-effcss1~="card"]{background:white;border:none;}` +
                `[data-effcss1~="card_variant_1"]{width:auto;display:block;padding:12px;&:hover{cursor:pointer;}}[data-effcss1~="card_variant_2"]{width:auto;display:flex;flex-direction:column;padding:16px;&:hover{outline:2px solid black;}}` +
                `[data-effcss1~="card_rounded_true"]{border-radius:1rem;}` +
                `</style>`
            );
        });

        test('custom stylesheet', () => {
            const styles = serialize();
            expect(styles).toContain(
                `<style data-effcss-key="effcss2">.custom{padding:12px;}</style>`
            );
        });
    });

    describe('Special value syntax', () => {
        test('object array', () => {
            const custom = customStyles(() => ({
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
            }));

            expect(serialize(stylesheet(custom))).toContain(
                `@font-face{font-family:"Bitstream Vera Serif Bold";src:url("https://mdn.github.io/shared-assets/fonts/FiraSans-Regular.woff2");}` +
                `@font-face{font-family:"MyHelvetica";src:local("Helvetica Neue Bold"), local("HelveticaNeue-Bold"), url("MgOpenModernaBold.woff2");font-weight:bold;}`
            );
        });

        test('string array', () => {
            const custom = customStyles(() => ({
                '.cls': {
                    textDecoration: ['underline', 'underline dotted']
                }
            }));

            expect(serialize(stylesheet(custom))).toContain('.cls{text-decoration:underline;text-decoration:underline dotted;}');
        });
    });

    describe('Update', () => {
        test('single variable', () => {
            const size = variable('12px');
            const color = variable({
                syntax: 'color',
                inherits: false,
                initialValue: 'red'
            });
            const empty = variable();

            expect(size.get()).toBe('12px');
            expect(color.get()).toBe('red');
            expect(empty.get()).toBe('');

            update(size, '24px');
            update(color, 'black');

            let varsCSS = serialize(variablesStylesheet());
            expect(varsCSS).toContain(`@property ${size} {syntax:"*";inherits:true;initial-value:24px;}`);
            expect(varsCSS).toContain(`@property ${color} {syntax:"<color>";inherits:false;initial-value:black;}`);
            expect(varsCSS).toContain(`@property ${empty} {syntax:"*";inherits:true;}`);

            expect(size.get()).toBe('24px');
            expect(color.get()).toBe('black');

            size.set('28px');
            color.set('#fefefe');
            empty.set('45deg');

            expect(size.get()).toBe('28px');
            expect(color.get()).toBe('#fefefe');
            expect(empty.get()).toBe('45deg');

            varsCSS = serialize(variablesStylesheet());
            expect(varsCSS).toContain(`@property ${size} {syntax:"*";inherits:true;initial-value:28px;}`);
            expect(varsCSS).toContain(`@property ${color} {syntax:"<color>";inherits:false;initial-value:#fefefe;}`);
            expect(varsCSS).toContain(`@property ${empty} {syntax:"*";inherits:true;initial-value:45deg;}`);

            empty.set('');
            expect(empty.get()).toBe('');
        });

        test('multiple variables', () => {
            const vars = variables({
                size: '12px',
                color: {
                    syntax: 'color',
                    inherits: false,
                    initialValue: 'red'
                }
            });

            update(vars, {
                size: '24px',
                color: 'black'
            });

            let varsCSS = serialize(variablesStylesheet());
            expect(varsCSS).toContain(`@property ${vars.size} {syntax:"*";inherits:true;initial-value:24px;}`);
            expect(varsCSS).toContain(`@property ${vars.color} {syntax:"<color>";inherits:false;initial-value:black;}`);

            vars.size.set('28px');
            vars.color.set('grey');

            varsCSS = serialize(variablesStylesheet());
            expect(varsCSS).toContain(`@property ${vars.size} {syntax:"*";inherits:true;initial-value:28px;}`);
            expect(varsCSS).toContain(`@property ${vars.color} {syntax:"<color>";inherits:false;initial-value:grey;}`);
        });
    });
});
