import { describe, expect, test } from 'vitest';
import { createScope } from '../src/common';

type TCustomStyleSheet = {
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
const block = 'block';
const elem = 'elem';
const elem1 = 'elem1';
const attrResolver = createScope({ mode: 'a' })(styleSheetKey);
const clsResolver = createScope({ mode: 'c' })(styleSheetKey);

describe('BEM object to data-attribute:', () => {
    test('Block:', () => {
        const styleAttr = attrResolver.attr<TCustomStyleSheet>({
            [block]: {}
        });
        expect(styleAttr[`data-${styleSheetKey}-${block}`]).toBe('');
    });

    test('Block modifiers:', () => {
        const styleAttr = attrResolver.attr<TCustomStyleSheet>({
            [block]: {
                '': {
                    w: 's',
                    sm: ''
                }
            }
        });
        expect(styleAttr[`data-${styleSheetKey}-${block}`]).toBe('w_s sm');
    });

    test('Block undefined modifiers:', () => {
        const styleAttr = attrResolver.attr<TCustomStyleSheet>({
            [block]: {
                '': {
                    w: 's',
                    sm: undefined
                }
            }
        });
        expect(styleAttr[`data-${styleSheetKey}-${block}`]).toBe('w_s');
    });

    test('Element:', () => {
        const styleAttr = attrResolver.attr<TCustomStyleSheet>({
            [block]: {
                [elem]: {}
            }
        });
        expect(styleAttr[`data-${styleSheetKey}-${block}__${elem}`]).toBe('');
    });

    test('Element modifiers:', () => {
        const styleAttr = attrResolver.attr<TCustomStyleSheet>({
            [block]: {
                [elem]: {
                    w: 's',
                    lg: ''
                }
            }
        });
        expect(styleAttr[`data-${styleSheetKey}-${block}__${elem}`]).toBe('w_s lg');
    });

    test('Element undefined modifiers:', () => {
        const styleAttr = attrResolver.attr<TCustomStyleSheet>({
            [block]: {
                [elem]: {
                    w: 's',
                    lg: undefined
                }
            }
        });
        expect(Object.values(styleAttr).join('')).toBe('w_s');
    });

    test('Destruction of single element modifiers:', () => {
        const styleAttr = attrResolver.attr<TCustomStyleSheet>({
            [block]: {
                [elem]: {
                    w: 's',
                    lg: ''
                }
            }
        });
        const dest = { ...styleAttr };
        expect(Object.keys(dest).length).toBe(1);
    });

    test('Destruction of multiple element modifiers:', () => {
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
        expect(Object.keys(dest).length).toBe(2);
    });
});

describe('BEM string to data-attribute:', () => {
    test('Block:', () => {
        const styleAttr = attrResolver.attr<TCustomStyleSheet>(block);
        expect(styleAttr[`data-${styleSheetKey}-${block}`]).toBe('');
    });

    test('Block modifiers:', () => {
        const styleAttr = attrResolver.attr<TCustomStyleSheet>([`${block}..w.s`, `${block}..sm`]);
        expect(styleAttr[`data-${styleSheetKey}-${block}`]).toBe('w_s sm');
    });

    test('Element:', () => {
        const styleAttr = attrResolver.attr<TCustomStyleSheet>(`${block}.${elem}`);
        expect(styleAttr[`data-${styleSheetKey}-${block}__${elem}`]).toBe('');
    });

    test('Element modifiers:', () => {
        const styleAttr = attrResolver.attr<TCustomStyleSheet>([`${block}.${elem}.w.s`, `${block}.${elem}.lg`]);
        expect(styleAttr[`data-${styleSheetKey}-${block}__${elem}`]).toBe('w_s lg');
    });

    test('Destruction of single element modifiers:', () => {
        const styleAttr = attrResolver.attr<TCustomStyleSheet>([`${block}.${elem}.w.s`, `${block}.${elem}.lg`]);
        const dest = { ...styleAttr };
        expect(Object.keys(dest).length).toBe(1);
    });

    test('Destruction of multiple element modifiers:', () => {
        const styleAttr = attrResolver.attr<TCustomStyleSheet>([
            `${block}.${elem}.w.s`,
            `${block}.${elem}.lg`,
            `${block}.${elem1}.h.s`
        ]);
        const dest = { ...styleAttr };
        expect(Object.keys(dest).length).toBe(2);
    });
});

describe('BEM object to class attribute:', () => {
    test('Block:', () => {
        const styleAttr = clsResolver.attr<TCustomStyleSheet>({
            [block]: {}
        });
        expect(styleAttr.class).toBe(`${styleSheetKey}-${block}`);
    });

    test('Block modifiers:', () => {
        const styleAttr = clsResolver.attr<TCustomStyleSheet>({
            [block]: {
                '': {
                    w: 's',
                    sm: ''
                }
            }
        });
        expect(styleAttr.class).toBe(
            `${styleSheetKey}-${block} ${styleSheetKey}-${block}_w_s ${styleSheetKey}-${block}_sm`
        );
    });

    test('Block undefined modifiers:', () => {
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

    test('Element:', () => {
        const styleAttr = clsResolver.attr<TCustomStyleSheet>({
            [block]: {
                [elem]: {}
            }
        });
        expect(styleAttr.class).toBe(`${styleSheetKey}-${block}__${elem}`);
    });

    test('Element modifiers:', () => {
        const styleAttr = clsResolver.attr<TCustomStyleSheet>({
            [block]: {
                [elem]: {
                    w: 's',
                    lg: ''
                }
            }
        });
        expect(styleAttr.class).toBe(
            `${styleSheetKey}-${block}__${elem} ${styleSheetKey}-${block}__${elem}_w_s ${styleSheetKey}-${block}__${elem}_lg`
        );
    });

    test('Element undefined modifiers:', () => {
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

    test('Destruction of single element modifiers:', () => {
        const styleAttr = clsResolver.attr<TCustomStyleSheet>({
            [block]: {
                [elem]: {
                    w: 's',
                    lg: ''
                }
            }
        });
        const dest = { ...styleAttr };
        expect(Object.keys(dest).length).toBe(1);
    });

    test('Destruction of multiple element modifiers:', () => {
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
});

describe('BEM string to class attribute:', () => {
    test('Block:', () => {
        const styleAttr = clsResolver.attr<TCustomStyleSheet>(block);
        expect(styleAttr.class).toBe(`${styleSheetKey}-${block}`);
    });

    test('Block modifiers:', () => {
        const styleAttr = clsResolver.attr<TCustomStyleSheet>([`${block}..w.s`, `${block}..sm`]);
        expect(styleAttr.class).toBe(
            `${styleSheetKey}-${block} ${styleSheetKey}-${block}_w_s ${styleSheetKey}-${block}_sm`
        );
    });

    test('Element:', () => {
        const styleAttr = clsResolver.attr<TCustomStyleSheet>(`${block}.${elem}`);
        expect(styleAttr.class).toBe(`${styleSheetKey}-${block}__${elem}`);
    });

    test('Element modifiers:', () => {
        const styleAttr = clsResolver.attr<TCustomStyleSheet>([`${block}.${elem}.w.s`, `${block}.${elem}.lg`]);
        expect(styleAttr.class).toBe(
            `${styleSheetKey}-${block}__${elem} ${styleSheetKey}-${block}__${elem}_w_s ${styleSheetKey}-${block}__${elem}_lg`
        );
    });

    test('Destruction of single element modifiers:', () => {
        const styleAttr = clsResolver.attr<TCustomStyleSheet>([`${block}.${elem}.w.s`, `${block}.${elem}.lg`]);
        const dest = { ...styleAttr };
        expect(Object.keys(dest).length).toBe(1);
    });

    test('Destruction of multiple element modifiers:', () => {
        const styleAttr = clsResolver.attr<TCustomStyleSheet>([
            `${block}.${elem}.w.s`,
            `${block}.${elem}.lg`,
            `${block}.${elem1}.h.s`
        ]);
        const dest = { ...styleAttr };
        expect(Object.keys(dest).length).toBe(1);
    });
});
