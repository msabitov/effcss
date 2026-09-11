import { beforeAll, describe, expect, test, vi } from 'vitest';
import { configure, classNames, variable, attributes, serialize, serializeMeta, variablesStylesheet } from '../src/index';

type Card = {
    w: 's' | 'm' | 'l';
    blur: true;
};

const SERVER_CSS = (
    `<style data-effcss-key="f0">.f0_2{width:12px;}.f0_3{filter:blur(5px);}</style>` +
    `<style data-effcss-key="f1">[data-f1~="2"]{width:var(--f2-0);}[data-f1~="3"]{filter:blur(5px);}</style>` +
    `<style data-effcss-global="variables">@property --f2-0{syntax:"*";inherits:true;initial-value:12px;}</style>`
);
const SERVER_META = (
    `<script type="application/json" data-effcss-key="f0">` +
    `{"w":"f0_0","blur":"f0_1","w_s":"f0_2","blur_true":"f0_3"}` +
    `</script>` +
    `<script type="application/json" data-effcss-key="f1">` +
    `{"w":"0","blur":"1","w_s":"2","blur_true":"3"}` +
    `</script>`
);

describe('Lazy hydrate:', () => {
    configure({ lazy: true });

    beforeAll(async () => {
        document.head.insertAdjacentHTML('beforeend', SERVER_CSS + SERVER_META);
        return () => document.head
            .querySelectorAll('[data-effcss-key], [data-effcss-global]')
            .forEach((el) => el.remove());;
    });

    test('generator reexecuted', async () => {
        const gen = vi.fn((selectors: any) => {
            const { w, blur } = selectors;
            return {
                [w.s]: { width: '12px' },
                [blur.true]: { filter: 'blur(5px)' }
            };
        });

        const card = classNames<Card>(gen as never);

        // deferred: not run until first use
        expect(gen).not.toHaveBeenCalled();

        const cls = card({ w: 's' });

        // generator re-executed in lazy mode to get correct rule counters
        expect(gen).toHaveBeenCalledTimes(1);
        // dict recomputed consistently with server-wide names
        expect(cls).toBe('f0_2');
        // memoized and not run again
        expect(card({ w: 's' })).toBe('f0_2');
        expect(gen).toHaveBeenCalledTimes(1);
    });

    test('global at-rules initialized', async () => {
        // warm first variable inside a lazy custom stylesheet
        const size = variable('12px');
        
        const gen = vi.fn((selectors: any) => {
            const { w, blur } = selectors;
            return {
                [w.s]: { width: size() },
                [blur.true]: { filter: 'blur(5px)' }
            };
        });

        const card = attributes<Card>(gen as never);

        // deferred: not run until first use
        expect(gen).not.toHaveBeenCalled();

        const attr = card({ w: 's' });

        // generator re-executed in lazy mode to get correct rule counters
        expect(gen).toHaveBeenCalledTimes(1);
        // dict recomputed consistently with server-wide names
        expect(attr).toEqual({
            'data-f1': '2'
        });
        // memoized and not run again
        expect(card({ w: 's' })).toEqual({
            'data-f1': '2'
        });
        expect(gen).toHaveBeenCalledTimes(1);
        // global var
        expect(serialize(card)).toContain(`var(--f2-0)`);
        expect(serialize(variablesStylesheet())).toContain(`@property --f2-0`);
    });
});
