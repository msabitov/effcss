import { beforeEach, describe, expect, test } from 'vitest';
import { createCollector } from '../src/utils/common';

const FIRST_CONFIG = {c: {}};
const SECOND_CONFIG = {c: {_: {width: '300px'}}};

const PREFIX = 'pre';
const FIRST_KEY = 'first';
const SECOND_KEY = PREFIX + 1;

describe('Collector:', () => {
    let collector;
    beforeEach(() => {
        collector = createCollector({
            prefix: PREFIX
        });
        collector.use(FIRST_CONFIG, FIRST_KEY);
        collector.use(SECOND_CONFIG);
        return () => {
            collector = undefined;
        }
    });

    test('getConfigs:', () => {
        expect(collector.getConfigs()).toEqual({
            [FIRST_KEY]: FIRST_CONFIG,
            [SECOND_KEY]: SECOND_CONFIG
        });
    });

    test('getKey:', () => {
        expect(collector.getKey(FIRST_CONFIG)).toBe(FIRST_KEY);
    });

    test('getKeys:', () => {
        expect(collector.getKeys()).toEqual([FIRST_KEY, SECOND_KEY]);
    });
});
