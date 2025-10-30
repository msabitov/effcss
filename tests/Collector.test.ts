import { beforeEach, describe, expect, test } from 'vitest';
import { createCollector } from '../src/_provider/collect';

const FIRST_MAKER = () => ({div: { height: '100vh' }});
const SECOND_MAKER = () => ({div: { width: '300px' }});

const PREFIX = 'pre';
const FIRST_KEY = 'first';
const SECOND_KEY = PREFIX + 1;

describe('Collector:', () => {
    let collector: ReturnType<typeof createCollector>;
    beforeEach(() => {
        collector = createCollector();
        collector.use(FIRST_MAKER, FIRST_KEY);
        collector.use(SECOND_MAKER, SECOND_KEY);
        return () => {
            collector = {} as ReturnType<typeof createCollector>;
        };
    });

    test('makers:', () => {
        expect(collector.makers).toEqual({
            [FIRST_KEY]: FIRST_MAKER,
            [SECOND_KEY]: SECOND_MAKER
        });
    });

    test('getKey:', () => {
        expect(collector.getKey(FIRST_MAKER)).toBe(FIRST_KEY);
    });

    test('keys:', () => {
        expect(collector.keys).toEqual([FIRST_KEY, SECOND_KEY]);
    });
});
