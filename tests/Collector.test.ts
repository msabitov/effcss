import { beforeEach, describe, expect, test } from 'vitest';
import { createCollector } from '../src/common';

const FIRST_MAKER = { c: { _: { height: '100vh' } } };
const SECOND_MAKER = { c: { _: { width: '300px' } } };

const PREFIX = 'pre';
const FIRST_KEY = 'first';
const SECOND_KEY = PREFIX + 1;

describe('Collector:', () => {
    let collector;
    beforeEach(() => {
        collector = createCollector();
        collector.use(FIRST_MAKER, FIRST_KEY);
        collector.use(SECOND_MAKER, SECOND_KEY);
        return () => {
            collector = undefined;
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
