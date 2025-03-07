import { beforeEach, describe, expect, test } from 'vitest';
import { createPseudoDispatcher } from '../src/utils/common';

const FIRST_CONFIG = {c: {}};
const SECOND_CONFIG = {c: {_: {width: '300px'}}};

const PREFIX = 'pre';
const FIRST_KEY = 'first';
const SECOND_KEY = PREFIX + 1;

describe('PseudoDispatcher:', () => {
    let dispatcher;
    beforeEach(() => {
        dispatcher = createPseudoDispatcher({
            prefix: PREFIX
        });
        return () => {
            dispatcher = undefined;
        }
    });

    test('use named:', () => {
        dispatcher.use(FIRST_CONFIG, FIRST_KEY);
        dispatcher.use(SECOND_CONFIG);
        expect(dispatcher.collector.getKey(FIRST_CONFIG)).toBe(FIRST_KEY);
    });

    test('use nameless:', () => {
        dispatcher.use(SECOND_CONFIG);
        expect(dispatcher.collector.getKey(SECOND_CONFIG)).toBe(SECOND_KEY);
    });

    test('use public configs:', () => {
        dispatcher.usePublic({[FIRST_KEY]: FIRST_CONFIG});
        expect(dispatcher.collector.getKey(FIRST_CONFIG)).toBe(FIRST_KEY);
    });

    test('use private configs:', () => {
        dispatcher.usePrivate([SECOND_CONFIG]);
        expect(dispatcher.collector.getKey(SECOND_CONFIG)).toBe(SECOND_KEY);
    });

    test('resolve:', () => {
        const resolveAfterUse = dispatcher.use(FIRST_CONFIG, FIRST_KEY);
        const resolve = dispatcher.resolve(FIRST_KEY);
        const elem = 'elem';
        const modifiers = {
            sz: 'lg',
            main: ''
        };
        expect(resolveAfterUse(elem)(modifiers)).toEqual(resolve(elem)(modifiers));
    });

    test('toString:', () => {
        dispatcher.use(FIRST_CONFIG, FIRST_KEY);
        dispatcher.use(SECOND_CONFIG);
        expect('' + dispatcher).toEqual('<script class="effcss_init" type="application/json">{"first":{"c":{}},"pre2":{"c":{"_":{"width":"300px"}}}}</script>');
    });
});
