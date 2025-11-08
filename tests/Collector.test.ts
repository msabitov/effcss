import { beforeEach, describe, expect, test } from 'vitest';
import { createCollector, TCollector } from '../src/_provider/collect';

const GLOBAL_MAKER = () => ({div: { height: '10vh' }});
const FIRST_MAKER = () => ({div: { height: '100vh' }});
const SECOND_MAKER = () => ({div: { width: '300px' }});

const PREFIX = 'pre';
const GLOBAL_KEY = PREFIX + 0;
const FIRST_KEY = PREFIX + 1;
const SECOND_KEY = PREFIX + 2;

describe('Collector:', () => {
    let collector: TCollector;
    beforeEach(() => {
        collector = createCollector({prefix: PREFIX});
        collector.use(GLOBAL_MAKER);
        collector.use(FIRST_MAKER);
        collector.use(SECOND_MAKER);
        return () => {
            collector = {} as TCollector;
        };
    });

    test('makers:', () => {
        expect(collector.makers).toEqual({
            [GLOBAL_KEY]: GLOBAL_MAKER,
            [FIRST_KEY]: FIRST_MAKER,
            [SECOND_KEY]: SECOND_MAKER
        });
    });

    test('key:', () => {
        expect(collector.key(FIRST_MAKER)).toBe(FIRST_KEY);
    });

    test('keys:', () => {
        expect(collector.keys).toEqual([GLOBAL_KEY, FIRST_KEY, SECOND_KEY]);
    });
});
