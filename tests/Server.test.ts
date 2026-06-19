import { beforeAll, describe, expect, test } from 'vitest';
import {
    serialize,
    classNames, attributes,
    configure,
    customStyles,
    stylesheet
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
});
