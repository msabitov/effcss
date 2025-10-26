import { beforeAll, describe, expect, test } from 'vitest';
import { createScope } from '../src/common';

type TCustomStyleSheet = {
    '': {
        '': {
            w: 's' | 'l';
            sm: ''
        };
        elem: {
            h: 's' | 'm';
            lg: '';
        }
    }
    block: {
        /**
         * Block modifiers
         */
        '': {
            /**
             * Width
             */
            w: 's' | 'l';
            /**
             * Small
             */
            sm: '';
        };
        elem: {
            /**
             * Width
             */
            w: 's' | 'm' | 'l';
            /**
             * Large
             */
            lg: '';
        };
        elem1: {
            h: 's' | 'l';
        };
    };
};
const styleSheetKey = 'cust';
const attr = `data-${styleSheetKey}`;
const block = 'block';
const elem = 'elem';
const elem1 = 'elem1';
const attrResolver = createScope({ mode: 'a' })(styleSheetKey);
const clsResolver = createScope({ mode: 'c' })(styleSheetKey);
const clsMinResolver = createScope({ mode: 'c', min: true })(styleSheetKey);
const attrMinResolver = createScope({ mode: 'a', min: true })(styleSheetKey);

describe('BEM to data-attribute:', () => {
    test('Block object:', () => {
        const styleAttr = attrResolver.attr<TCustomStyleSheet>({
            [block]: {}
        });
        expect(styleAttr[attr]).toBe(block);
    });

    test('Block modifiers object:', () => {
        const styleAttr = attrResolver.attr<TCustomStyleSheet>({
            [block]: {
                '': {
                    w: 's',
                    sm: ''
                }
            }
        });
        expect(styleAttr[attr]).toBe(`${block} ${block}_w_s ${block}_sm`);
    });

    test('Block undefined modifiers object:', () => {
        const styleAttr = attrResolver.attr<TCustomStyleSheet>({
            [block]: {
                '': {
                    w: 's',
                    sm: undefined
                }
            }
        });
        expect(styleAttr[attr]).toBe(`${block} ${block}_w_s`);
    });

    test('Element object:', () => {
        const styleAttr = attrResolver.attr<TCustomStyleSheet>({
            [block]: {
                [elem]: {}
            }
        });
        expect(styleAttr[attr]).toBe(`${block}__${elem}`);
    });

    test('Element modifiers object:', () => {
        const styleAttr = attrResolver.attr<TCustomStyleSheet>({
            [block]: {
                [elem]: {
                    w: 's',
                    lg: ''
                }
            }
        });
        expect(styleAttr[attr]).toBe(`${block}__${elem} ${block}__${elem}_w_s ${block}__${elem}_lg`);
    });

    test('Element undefined modifiers object:', () => {
        const styleAttr = attrResolver.attr<TCustomStyleSheet>({
            [block]: {
                [elem]: {
                    w: 's',
                    lg: undefined
                }
            }
        });
        expect(styleAttr[attr]).toBe(`${block}__${elem} ${block}__${elem}_w_s`);
    });

    test('Multiple element modifiers object:', () => {
        const styleAttr = attrResolver.attr<TCustomStyleSheet>({
            [block]: {
                [elem]: {
                    w: 's',
                    lg: ''
                }
            }
        });
        expect(styleAttr[attr]).toBe(`${block}__${elem} ${block}__${elem}_w_s ${block}__${elem}_lg`);
    });

    test('Destruction of multiple elements object:', () => {
        const styleAttr = attrResolver.attr<TCustomStyleSheet>({
            [block]: {
                [elem]: {
                    w: 's',
                    lg: ''
                },
                [elem1]: {
                    h: 's'
                }
            }
        });
        const dest = { ...styleAttr };
        expect(Object.keys(dest).length).toBe(1);
    });

    test('Block string:', () => {
        const styleAttr = attrResolver.attr<TCustomStyleSheet>(block);
        expect(styleAttr[attr]).toBe(block);
    });

    test('Block modifiers string array:', () => {
        const styleAttr = attrResolver.attr<TCustomStyleSheet>([`${block}..w.s`, `${block}..sm`]);
        expect(styleAttr[attr]).toBe(`${block} ${block}_w_s ${block}_sm`);
    });

    test('Element string:', () => {
        const styleAttr = attrResolver.attr<TCustomStyleSheet>(`${block}.${elem}`);
        expect(styleAttr[attr]).toBe(`${block}__${elem}`);
    });

    test('Element modifiers string array:', () => {
        const styleAttr = attrResolver.attr<TCustomStyleSheet>([`${block}.${elem}.w.s`, `${block}.${elem}.lg`]);
        expect(styleAttr[attr]).toBe(`${block}__${elem} ${block}__${elem}_w_s ${block}__${elem}_lg`);
    });

    test('Multiple elements string array:', () => {
        const styleAttr = attrResolver.attr<TCustomStyleSheet>([
            `${block}.${elem}.w.s`,
            `${block}.${elem}.lg`,
            `${block}.${elem1}.h.s`
        ]);
        expect(styleAttr[attr]).toBe(`${block}__${elem} ${block}__${elem}_w_s ${block}__${elem}_lg ${block}__${elem1} ${block}__${elem1}_h_s`);
    });

    test('Destruction of multiple element modifiers string array:', () => {
        const styleAttr = attrResolver.attr<TCustomStyleSheet>([
            `${block}.${elem}.w.s`,
            `${block}.${elem}.lg`,
            `${block}.${elem1}.h.s`
        ]);
        const dest = { ...styleAttr };
        expect(Object.keys(dest).length).toBe(1);
    });

    test('Mono block:', () => {
        const styleAttr = attrResolver.attr<TCustomStyleSheet>().b(block).$;
        expect(styleAttr[attr]).toBe(`${block}`);
    });

    test('Mono element:', () => {
        const styleAttr = attrResolver.attr<TCustomStyleSheet>().b(block).e(elem).$;
        expect(styleAttr[attr]).toBe(`${block}__${elem}`);
    });

    test('Mono modifiers:', () => {
        const styleAttr = attrResolver.attr<TCustomStyleSheet>().b(block).e(elem).m({
            w: 's',
            lg: ''
        }).$;
        expect(styleAttr[attr]).toBe(`${block}__${elem} ${block}__${elem}_w_s ${block}__${elem}_lg`);
    });

    test('Get attribute value via $:', () => {
        const styleAttr = attrResolver.attr<TCustomStyleSheet>().b(block).e(elem).m({
            w: 's',
            lg: ''
        }).$;
        expect(styleAttr.$).toBe(`${block}__${elem} ${block}__${elem}_w_s ${block}__${elem}_lg`);
    });

    test('Empty block selector:', () => {
        const styleSelector = attrResolver.selector<TCustomStyleSheet>('');
        expect(styleSelector).toBe(`[data-${styleSheetKey}~="_"]`);
    });

    test('Empty block modifier selector:', () => {
        const styleSelector = attrResolver.selector<TCustomStyleSheet>('..w.s');
        expect(styleSelector).toBe(`[data-${styleSheetKey}~="_w_s"]`);
    });

    test('Empty block element selector:', () => {
        const styleSelector = attrResolver.selector<TCustomStyleSheet>('.elem');
        expect(styleSelector).toBe(`[data-${styleSheetKey}~="__elem"]`);
    });

    test('Empty block element modifiers selector:', () => {
        const styleSelector = attrResolver.selector<TCustomStyleSheet>('.elem.h.s');
        expect(styleSelector).toBe(`[data-${styleSheetKey}~="__elem_h_s"]`);
    });
});

describe('BEM to class:', () => {
    test('Block object:', () => {
        const styleAttr = clsResolver.attr<TCustomStyleSheet>({
            [block]: {}
        });
        expect(styleAttr.class).toBe(`${styleSheetKey}-${block}`);
    });

    test('Block modifiers object:', () => {
        const styleAttr = clsResolver.attr<TCustomStyleSheet>({
            [block]: {
                '': {
                    w: 's',
                    sm: ''
                }
            }
        });
        expect(styleAttr.class).toBe(`${styleSheetKey}-${block} ${styleSheetKey}-${block}_w_s ${styleSheetKey}-${block}_sm`);
    });

    test('Block undefined modifiers object:', () => {
        const styleAttr = clsResolver.attr<TCustomStyleSheet>({
            [block]: {
                '': {
                    w: 's',
                    sm: undefined
                }
            }
        });
        expect(styleAttr.class).toBe(`${styleSheetKey}-${block} ${styleSheetKey}-${block}_w_s`);
    });

    test('Element object:', () => {
        const styleAttr = clsResolver.attr<TCustomStyleSheet>({
            [block]: {
                [elem]: {}
            }
        });
        expect(styleAttr.class).toBe(`${styleSheetKey}-${block}__${elem}`);
    });

    test('Element modifiers object:', () => {
        const styleAttr = clsResolver.attr<TCustomStyleSheet>({
            [block]: {
                [elem]: {
                    w: 's',
                    lg: ''
                }
            }
        });
        expect(styleAttr.class).toBe(`${styleSheetKey}-${block}__${elem} ${styleSheetKey}-${block}__${elem}_w_s ${styleSheetKey}-${block}__${elem}_lg`);
    });

    test('Element undefined modifiers object:', () => {
        const styleAttr = clsResolver.attr<TCustomStyleSheet>({
            [block]: {
                [elem]: {
                    w: 's',
                    lg: undefined
                }
            }
        });
        expect(styleAttr.class).toBe(`${styleSheetKey}-${block}__${elem} ${styleSheetKey}-${block}__${elem}_w_s`);
    });

    test('Multiple element modifiers object:', () => {
        const styleAttr = clsResolver.attr<TCustomStyleSheet>({
            [block]: {
                [elem]: {
                    w: 's',
                    lg: ''
                }
            }
        });
        expect(styleAttr.class).toBe(
            `${styleSheetKey}-${block}__${elem} ` +
            `${styleSheetKey}-${block}__${elem}_w_s ${styleSheetKey}-${block}__${elem}_lg`
        );
    });

    test('Destruction of multiple elements object:', () => {
        const styleAttr = clsResolver.attr<TCustomStyleSheet>({
            [block]: {
                [elem]: {
                    w: 's',
                    lg: ''
                },
                [elem1]: {
                    h: 's'
                }
            }
        });
        const dest = { ...styleAttr };
        expect(Object.keys(dest).length).toBe(1);
    });

    test('Block string:', () => {
        const styleAttr = clsResolver.attr<TCustomStyleSheet>(block);
        expect(styleAttr.class).toBe(`${styleSheetKey}-${block}`);
    });

    test('Block modifiers string array:', () => {
        const styleAttr = clsResolver.attr<TCustomStyleSheet>([`${block}..w.s`, `${block}..sm`]);
        expect(styleAttr.class).toBe(`${styleSheetKey}-${block} ${styleSheetKey}-${block}_w_s ${styleSheetKey}-${block}_sm`);
    });

    test('Element string:', () => {
        const styleAttr = clsResolver.attr<TCustomStyleSheet>(`${block}.${elem}`);
        expect(styleAttr.class).toBe(`${styleSheetKey}-${block}__${elem}`);
    });

    test('Element modifiers string array:', () => {
        const styleAttr = clsResolver.attr<TCustomStyleSheet>([`${block}.${elem}.w.s`, `${block}.${elem}.lg`]);
        expect(styleAttr.class).toBe(
            `${styleSheetKey}-${block}__${elem} ${styleSheetKey}-${block}__${elem}_w_s ${styleSheetKey}-${block}__${elem}_lg`
        );
    });

    test('Multiple elements string array:', () => {
        const styleAttr = clsResolver.attr<TCustomStyleSheet>([
            `${block}.${elem}.w.s`,
            `${block}.${elem}.lg`,
            `${block}.${elem1}.h.s`
        ]);
        expect(styleAttr.class).toBe(
            `${styleSheetKey}-${block}__${elem} ${styleSheetKey}-${block}__${elem}_w_s ` +
            `${styleSheetKey}-${block}__${elem}_lg ` +
            `${styleSheetKey}-${block}__${elem1} ${styleSheetKey}-${block}__${elem1}_h_s`);
    });

    test('Destruction of multiple elements string array:', () => {
        const styleAttr = clsResolver.attr<TCustomStyleSheet>([
            `${block}.${elem}.w.s`,
            `${block}.${elem}.lg`,
            `${block}.${elem1}.h.s`
        ]);
        const dest = { ...styleAttr };
        expect(Object.keys(dest).length).toBe(1);
    });

    test('Mono block:', () => {
        const styleAttr = clsResolver.attr<TCustomStyleSheet>().b(block).$;
        expect(styleAttr.class).toBe(`${styleSheetKey}-${block}`);
    });

    test('Mono element:', () => {
        const styleAttr = clsResolver.attr<TCustomStyleSheet>().b(block).e(elem).$;
        expect(styleAttr.class).toBe(`${styleSheetKey}-${block}__${elem}`);
    });

    test('Mono modifiers:', () => {
        const styleAttr = clsResolver.attr<TCustomStyleSheet>().b(block).e(elem).m({
            w: 's',
            lg: ''
        }).$;
        expect(styleAttr.class).toBe(`${styleSheetKey}-${block}__${elem} ${styleSheetKey}-${block}__${elem}_w_s ${styleSheetKey}-${block}__${elem}_lg`);
    });

    test('Get attribute value via $:', () => {
        const styleAttr = clsResolver.attr<TCustomStyleSheet>().b(block).e(elem).m({
            w: 's',
            lg: ''
        }).$;
        expect(styleAttr.$).toBe(`${styleSheetKey}-${block}__${elem} ${styleSheetKey}-${block}__${elem}_w_s ${styleSheetKey}-${block}__${elem}_lg`);
    });

    test('Empty block selector:', () => {
        const styleSelector = clsResolver.selector<TCustomStyleSheet>('');
        expect(styleSelector).toBe(`.${styleSheetKey}_`);
    });

    test('Empty block modifier selector:', () => {
        const styleSelector = clsResolver.selector<TCustomStyleSheet>('..w.s');
        expect(styleSelector).toBe(`.${styleSheetKey}_w_s`);
    });

    test('Empty block element selector:', () => {
        const styleSelector = clsResolver.selector<TCustomStyleSheet>('.elem');
        expect(styleSelector).toBe(`.${styleSheetKey}__elem`);
    });

    test('Empty block element modifiers selector:', () => {
        const styleSelector = clsResolver.selector<TCustomStyleSheet>('.elem.h.s');
        expect(styleSelector).toBe(`.${styleSheetKey}__elem_h_s`);
    });
});


describe('BEM to minified class:', () => {
    beforeAll(() => {
        clsMinResolver.selector<TCustomStyleSheet>(block);
        clsMinResolver.selector<TCustomStyleSheet>(`${block}..w.s`);
        clsMinResolver.selector<TCustomStyleSheet>(`${block}..w.l`);
        clsMinResolver.selector<TCustomStyleSheet>(`${block}..sm`);
        clsMinResolver.selector<TCustomStyleSheet>(`${block}.${elem}`);
        clsMinResolver.selector<TCustomStyleSheet>(`${block}.${elem}.w.s`);
        clsMinResolver.selector<TCustomStyleSheet>(`${block}.${elem}.w.m`);
        clsMinResolver.selector<TCustomStyleSheet>(`${block}.${elem}.w.l`);
        clsMinResolver.selector<TCustomStyleSheet>(`${block}.${elem}.lg`);
        clsMinResolver.selector<TCustomStyleSheet>(`${block}.elem1`);
        clsMinResolver.selector<TCustomStyleSheet>(`${block}.elem1.h.s`);
        clsMinResolver.selector<TCustomStyleSheet>(`${block}.elem1.h.l`);
        clsMinResolver.selector<TCustomStyleSheet>('');
        clsMinResolver.selector<TCustomStyleSheet>('..w.s');
        clsMinResolver.selector<TCustomStyleSheet>('..w.l');
        clsMinResolver.selector<TCustomStyleSheet>('..sm');
        clsMinResolver.selector<TCustomStyleSheet>('.elem');
        clsMinResolver.selector<TCustomStyleSheet>('.elem.h.s');
        clsMinResolver.selector<TCustomStyleSheet>('.elem.h.m');
        clsMinResolver.selector<TCustomStyleSheet>('.elem.lg');
    });

    test('Block object:', () => {
        const styleAttr = clsMinResolver.attr<TCustomStyleSheet>({
            [block]: {}
        });
        expect(styleAttr.class).toBe(`${styleSheetKey}-0`);
    });

    test('Block modifiers object:', () => {
        const styleAttr = clsMinResolver.attr<TCustomStyleSheet>({
            [block]: {
                '': {
                    w: 's',
                    sm: ''
                }
            }
        });
        expect(styleAttr.class).toBe(`${styleSheetKey}-0 ${styleSheetKey}-1 ${styleSheetKey}-3`);
    });

    test('Block undefined modifiers object:', () => {
        const styleAttr = clsMinResolver.attr<TCustomStyleSheet>({
            [block]: {
                '': {
                    w: 's',
                    sm: undefined
                }
            }
        });
        expect(styleAttr.class).toBe(`${styleSheetKey}-0 ${styleSheetKey}-1`);
    });

    test('Element object:', () => {
        const styleAttr = clsMinResolver.attr<TCustomStyleSheet>({
            [block]: {
                [elem]: {}
            }
        });
        expect(styleAttr.class).toBe(`${styleSheetKey}-4`);
    });

    test('Element modifiers object:', () => {
        const styleAttr = clsMinResolver.attr<TCustomStyleSheet>({
            [block]: {
                [elem]: {
                    w: 's',
                    lg: ''
                }
            }
        });
        expect(styleAttr.class).toBe(`${styleSheetKey}-4 ${styleSheetKey}-5 ${styleSheetKey}-8`);
    });

    test('Element undefined modifiers object:', () => {
        const styleAttr = clsMinResolver.attr<TCustomStyleSheet>({
            [block]: {
                [elem]: {
                    w: 's',
                    lg: undefined
                }
            }
        });
        expect(styleAttr.class).toBe(`${styleSheetKey}-4 ${styleSheetKey}-5`);
    });

    test('Multiple element modifiers object:', () => {
        const styleAttr = clsMinResolver.attr<TCustomStyleSheet>({
            [block]: {
                [elem]: {
                    w: 's',
                    lg: ''
                }
            }
        });
        expect(styleAttr.class).toBe(
            `${styleSheetKey}-4 ${styleSheetKey}-5 ${styleSheetKey}-8`
        );
    });

    test('Destruction of multiple elements object:', () => {
        const styleAttr = clsMinResolver.attr<TCustomStyleSheet>({
            [block]: {
                [elem]: {
                    w: 's',
                    lg: ''
                },
                [elem1]: {
                    h: 's'
                }
            }
        });
        const dest = { ...styleAttr };
        expect(Object.keys(dest).length).toBe(1);
    });

    test('Block string:', () => {
        const styleAttr = clsMinResolver.attr<TCustomStyleSheet>(block);
        expect(styleAttr.class).toBe(`${styleSheetKey}-0`);
    });

    test('Block modifiers string array:', () => {
        const styleAttr = clsMinResolver.attr<TCustomStyleSheet>([`${block}..w.s`, `${block}..sm`]);
        expect(styleAttr.class).toBe(`${styleSheetKey}-0 ${styleSheetKey}-1 ${styleSheetKey}-3`);
    });

    test('Element string:', () => {
        const styleAttr = clsMinResolver.attr<TCustomStyleSheet>(`${block}.${elem}`);
        expect(styleAttr.class).toBe(`${styleSheetKey}-4`);
    });

    test('Element modifiers string array:', () => {
        const styleAttr = clsMinResolver.attr<TCustomStyleSheet>([`${block}.${elem}.w.s`, `${block}.${elem}.lg`]);
        expect(styleAttr.class).toBe(
            `${styleSheetKey}-4 ${styleSheetKey}-5 ${styleSheetKey}-8`
        );
    });

    test('Multiple elements string array:', () => {
        const styleAttr = clsMinResolver.attr<TCustomStyleSheet>([
            `${block}.${elem}.w.s`,
            `${block}.${elem}.lg`,
            `${block}.${elem1}.h.s`
        ]);
        expect(styleAttr.class).toBe(
            `${styleSheetKey}-4 ${styleSheetKey}-5 ` +
            `${styleSheetKey}-8 ` +
            `${styleSheetKey}-9 ${styleSheetKey}-a`);
    });

    test('Destruction of multiple elements string array:', () => {
        const styleAttr = clsMinResolver.attr<TCustomStyleSheet>([
            `${block}.${elem}.w.s`,
            `${block}.${elem}.lg`,
            `${block}.${elem1}.h.s`
        ]);
        const dest = { ...styleAttr };
        expect(Object.keys(dest).length).toBe(1);
    });

    test('Mono block:', () => {
        const styleAttr = clsMinResolver.attr<TCustomStyleSheet>().b(block).$;
        expect(styleAttr.class).toBe(`${styleSheetKey}-0`);
    });

    test('Mono element:', () => {
        const styleAttr = clsMinResolver.attr<TCustomStyleSheet>().b(block).e(elem).$;
        expect(styleAttr.class).toBe(`${styleSheetKey}-4`);
    });

    test('Mono modifiers:', () => {
        const styleAttr = clsMinResolver.attr<TCustomStyleSheet>().b(block).e(elem).m({
            w: 's',
            lg: ''
        }).$;
        expect(styleAttr.class).toBe(`${styleSheetKey}-4 ${styleSheetKey}-5 ${styleSheetKey}-8`);
    });

    test('Get attribute value via $:', () => {
        const styleAttr = clsMinResolver.attr<TCustomStyleSheet>().b(block).e(elem).m({
            w: 's',
            lg: ''
        }).$;
        expect(styleAttr.$).toBe(`${styleSheetKey}-4 ${styleSheetKey}-5 ${styleSheetKey}-8`);
    });

    test('Empty block selector:', () => {
        const styleSelector = clsMinResolver.selector<TCustomStyleSheet>('');
        expect(styleSelector).toBe(`.${styleSheetKey}-c`);
    });

    test('Empty block modifier selector:', () => {
        const styleSelector = clsMinResolver.selector<TCustomStyleSheet>('..w.s');
        expect(styleSelector).toBe(`.${styleSheetKey}-d`);
    });

    test('Empty block element selector:', () => {
        const styleSelector = clsMinResolver.selector<TCustomStyleSheet>('.elem');
        expect(styleSelector).toBe(`.${styleSheetKey}-g`);
    });

    test('Empty block element modifiers selector:', () => {
        const styleSelector = clsMinResolver.selector<TCustomStyleSheet>('.elem.h.s');
        expect(styleSelector).toBe(`.${styleSheetKey}-h`);
    });
});

describe('BEM to minified data-attribute:', () => {
    beforeAll(() => {
        attrMinResolver.selector<TCustomStyleSheet>(block);
        attrMinResolver.selector<TCustomStyleSheet>(`${block}..w.s`);
        attrMinResolver.selector<TCustomStyleSheet>(`${block}..w.l`);
        attrMinResolver.selector<TCustomStyleSheet>(`${block}..sm`);
        attrMinResolver.selector<TCustomStyleSheet>(`${block}.${elem}`);
        attrMinResolver.selector<TCustomStyleSheet>(`${block}.${elem}.w.s`);
        attrMinResolver.selector<TCustomStyleSheet>(`${block}.${elem}.w.m`);
        attrMinResolver.selector<TCustomStyleSheet>(`${block}.${elem}.w.l`);
        attrMinResolver.selector<TCustomStyleSheet>(`${block}.${elem}.lg`);
        attrMinResolver.selector<TCustomStyleSheet>(`${block}.elem1`);
        attrMinResolver.selector<TCustomStyleSheet>(`${block}.elem1.h.s`);
        attrMinResolver.selector<TCustomStyleSheet>(`${block}.elem1.h.l`);
        attrMinResolver.selector<TCustomStyleSheet>('');
        attrMinResolver.selector<TCustomStyleSheet>('..w.s');
        attrMinResolver.selector<TCustomStyleSheet>('..w.l');
        attrMinResolver.selector<TCustomStyleSheet>('..sm');
        attrMinResolver.selector<TCustomStyleSheet>('.elem');
        attrMinResolver.selector<TCustomStyleSheet>('.elem.h.s');
        attrMinResolver.selector<TCustomStyleSheet>('.elem.h.m');
        attrMinResolver.selector<TCustomStyleSheet>('.elem.lg');
    });

    test('Block object:', () => {
        const styleAttr = attrMinResolver.attr<TCustomStyleSheet>({
            [block]: {}
        });
        expect(styleAttr[attr]).toBe(`0`);
    });

    test('Block modifiers object:', () => {
        const styleAttr = attrMinResolver.attr<TCustomStyleSheet>({
            [block]: {
                '': {
                    w: 's',
                    sm: ''
                }
            }
        });
        expect(styleAttr[attr]).toBe(`0 1 3`);
    });

    test('Block undefined modifiers object:', () => {
        const styleAttr = attrMinResolver.attr<TCustomStyleSheet>({
            [block]: {
                '': {
                    w: 's',
                    sm: undefined
                }
            }
        });
        expect(styleAttr[attr]).toBe(`0 1`);
    });

    test('Element object:', () => {
        const styleAttr = attrMinResolver.attr<TCustomStyleSheet>({
            [block]: {
                [elem]: {}
            }
        });
        expect(styleAttr[attr]).toBe(`4`);
    });

    test('Element modifiers object:', () => {
        const styleAttr = attrMinResolver.attr<TCustomStyleSheet>({
            [block]: {
                [elem]: {
                    w: 's',
                    lg: ''
                }
            }
        });
        expect(styleAttr[attr]).toBe(`4 5 8`);
    });

    test('Element undefined modifiers object:', () => {
        const styleAttr = attrMinResolver.attr<TCustomStyleSheet>({
            [block]: {
                [elem]: {
                    w: 's',
                    lg: undefined
                }
            }
        });
        expect(styleAttr[attr]).toBe(`4 5`);
    });

    test('Multiple element modifiers object:', () => {
        const styleAttr = attrMinResolver.attr<TCustomStyleSheet>({
            [block]: {
                [elem]: {
                    w: 's',
                    lg: ''
                }
            }
        });
        expect(styleAttr[attr]).toBe(
            `4 5 8`
        );
    });

    test('Destruction of multiple elements object:', () => {
        const styleAttr = attrMinResolver.attr<TCustomStyleSheet>({
            [block]: {
                [elem]: {
                    w: 's',
                    lg: ''
                },
                [elem1]: {
                    h: 's'
                }
            }
        });
        const dest = { ...styleAttr };
        expect(Object.keys(dest).length).toBe(1);
    });

    test('Block string:', () => {
        const styleAttr = attrMinResolver.attr<TCustomStyleSheet>(block);
        expect(styleAttr[attr]).toBe(`0`);
    });

    test('Block modifiers string array:', () => {
        const styleAttr = attrMinResolver.attr<TCustomStyleSheet>([`${block}..w.s`, `${block}..sm`]);
        expect(styleAttr[attr]).toBe(`0 1 3`);
    });

    test('Element string:', () => {
        const styleAttr = attrMinResolver.attr<TCustomStyleSheet>(`${block}.${elem}`);
        expect(styleAttr[attr]).toBe(`4`);
    });

    test('Element modifiers string array:', () => {
        const styleAttr = attrMinResolver.attr<TCustomStyleSheet>([`${block}.${elem}.w.s`, `${block}.${elem}.lg`]);
        expect(styleAttr[attr]).toBe(
            `4 5 8`
        );
    });

    test('Multiple elements string array:', () => {
        const styleAttr = attrMinResolver.attr<TCustomStyleSheet>([
            `${block}.${elem}.w.s`,
            `${block}.${elem}.lg`,
            `${block}.${elem1}.h.s`
        ]);
        expect(styleAttr[attr]).toBe(
            `4 5 ` +
            `8 ` +
            `9 a`);
    });

    test('Destruction of multiple elements string array:', () => {
        const styleAttr = attrMinResolver.attr<TCustomStyleSheet>([
            `${block}.${elem}.w.s`,
            `${block}.${elem}.lg`,
            `${block}.${elem1}.h.s`
        ]);
        const dest = { ...styleAttr };
        expect(Object.keys(dest).length).toBe(1);
    });

    test('Mono block:', () => {
        const styleAttr = attrMinResolver.attr<TCustomStyleSheet>().b(block).$;
        expect(styleAttr[attr]).toBe(`0`);
    });

    test('Mono element:', () => {
        const styleAttr = attrMinResolver.attr<TCustomStyleSheet>().b(block).e(elem).$;
        expect(styleAttr[attr]).toBe(`4`);
    });

    test('Mono modifiers:', () => {
        const styleAttr = attrMinResolver.attr<TCustomStyleSheet>().b(block).e(elem).m({
            w: 's',
            lg: ''
        }).$;
        expect(styleAttr[attr]).toBe(`4 5 8`);
    });

    test('Get attribute value via $:', () => {
        const styleAttr = attrMinResolver.attr<TCustomStyleSheet>().b(block).e(elem).m({
            w: 's',
            lg: ''
        }).$;
        expect(styleAttr.$).toBe(`4 5 8`);
    });

    test('Empty block selector:', () => {
        const styleSelector = attrMinResolver.selector<TCustomStyleSheet>('');
        expect(styleSelector).toBe(`[data-${styleSheetKey}~="c"]`);
    });

    test('Empty block modifier selector:', () => {
        const styleSelector = attrMinResolver.selector<TCustomStyleSheet>('..w.s');
        expect(styleSelector).toBe(`[data-${styleSheetKey}~="d"]`);
    });

    test('Empty block element selector:', () => {
        const styleSelector = attrMinResolver.selector<TCustomStyleSheet>('.elem');
        expect(styleSelector).toBe(`[data-${styleSheetKey}~="g"]`);
    });

    test('Empty block element modifiers selector:', () => {
        const styleSelector = attrMinResolver.selector<TCustomStyleSheet>('.elem.h.s');
        expect(styleSelector).toBe(`[data-${styleSheetKey}~="h"]`);
    });
});
