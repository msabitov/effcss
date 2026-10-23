import { describe, expect, test } from 'vitest';
import { context } from '../src/index';

type Card = {
    w: 's' | 'm' | 'l';
    blur: true;
    card: {
        variant: 1 | 2;
        rounded: true;
    };
};

describe('Context:', () => {
    test('creates isolated contexts with different prefixes', () => {
        const ctxA = context({ prefix: 'aaa', minify: false, emulate: true });
        const ctxB = context({ prefix: 'bbb', minify: false, emulate: true });

        // write styles into the first context
        const cardA = ctxA.classNames<Card>((selectors) => {
            const { w, card, blur } = selectors;
            return {
                [w.s]: { width: '12px' },
                [w.m]: { width: '24px' },
                [w.l]: { width: '26px' },
                [blur.true]: { filter: 'blur(5px)' },
                [card]: { background: 'white', border: 'none' },
                [card.variant[1]]: { display: 'block', padding: '12px' },
                [card.variant[2]]: { display: 'flex', padding: '16px' },
                [card.rounded.true]: { borderRadius: '1rem' }
            };
        });
        const clsA = cardA({ card: { rounded: true }, w: 's' });
        expect(clsA).toBe('aaa0_card aaa0_card_rounded_true aaa0_w_s');

        // write styles into the second context
        const cardB = ctxB.classNames<Card>((selectors) => {
            const { w, card, blur } = selectors;
            return {
                [w.s]: { width: '12px' },
                [w.m]: { width: '24px' },
                [w.l]: { width: '26px' },
                [blur.true]: { filter: 'blur(5px)' },
                [card]: { background: 'white', border: 'none' },
                [card.variant[1]]: { display: 'block', padding: '12px' },
                [card.variant[2]]: { display: 'flex', padding: '16px' },
                [card.rounded.true]: { borderRadius: '1rem' }
            };
        });
        const clsB = cardB({ card: { rounded: true }, w: 's' });
        expect(clsB).toBe('bbb0_card bbb0_card_rounded_true bbb0_w_s');

        // class names must differ because prefixes differ
        expect(clsA).not.toBe(clsB);

        // serialization of each context must contain only its own prefix
        const cssA = ctxA.serialize();
        const cssB = ctxB.serialize();

        expect(cssA).toContain('aaa0_w_s');
        expect(cssA).toContain('aaa0_card_rounded_true');
        expect(cssA).not.toContain('bbb');
        expect(cssA).not.toContain('f0');

        expect(cssB).toContain('bbb0_w_s');
        expect(cssB).toContain('bbb0_card_rounded_true');
        expect(cssB).not.toContain('aaa');
        expect(cssB).not.toContain('f0');
    });

    test('contexts do not share global at-rules', () => {
        const ctxA = context({ prefix: 'aaa', emulate: true });
        const ctxB = context({ prefix: 'bbb', emulate: true });

        const varA = ctxA.variable('red');
        const varB = ctxB.variable('blue');

        // resolvers are independent
        expect(String(varA)).not.toBe(String(varB));

        const cssA = ctxA.serialize();
        const cssB = ctxB.serialize();

        // each context serializes only its own variable
        expect(cssA).toContain(String(varA));
        expect(cssA).not.toContain(String(varB));

        expect(cssB).toContain(String(varB));
        expect(cssB).not.toContain(String(varA));
    });

    test('default context is independent from custom contexts', () => {
        const ctx = context({ prefix: 'zzz', minify: false, emulate: true });

        const card = ctx.classNames<Card>((selectors) => {
            const { w, card } = selectors;
            return {
                [w.s]: { width: '12px' },
                [card]: { background: 'white' }
            };
        });
        const cls = card({ card: {}, w: 's' });
        expect(cls).toBe('zzz0_card zzz0_w_s');

        const css = ctx.serialize();
        expect(css).toContain('zzz0_w_s');
        expect(css).toContain('zzz0_card');
        // default context uses prefix 'f' and must not contain custom context styles
        expect(css).not.toContain('f0');
    });
});