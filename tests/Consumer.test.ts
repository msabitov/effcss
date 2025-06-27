import { beforeEach, describe, expect, test } from 'vitest';
import { createConsumer } from '../src/consumer';
import { TAG_NAME } from '../src/common';

const FIRST_MAKER = () => {
    return { div: { height: '300px' } };
};
const SECOND_MAKER = () => {
    return { body: { width: '300px' } };
};

const PREFIX = 'pre';
const FIRST_KEY = 'first';
const SECOND_KEY = PREFIX + 1;

describe('Consumer:', () => {
    let consumer;
    beforeEach(() => {
        consumer = createConsumer({
            prefix: PREFIX
        });
        return () => {
            consumer = undefined;
        };
    });

    test('use named:', () => {
        consumer.use(FIRST_MAKER, FIRST_KEY);
        consumer.use(SECOND_MAKER);
        expect(consumer.key(FIRST_MAKER)).toBe(FIRST_KEY);
    });

    test('use nameless:', () => {
        consumer.use(SECOND_MAKER);
        expect(consumer.key(SECOND_MAKER)).toBe(SECOND_KEY);
    });

    test('use public makers:', () => {
        consumer.usePublic({ [FIRST_KEY]: FIRST_MAKER });
        expect(consumer.key(FIRST_MAKER)).toBe(FIRST_KEY);
    });

    test('use private makers:', () => {
        consumer.usePrivate([SECOND_MAKER]);
        expect(consumer.key(SECOND_MAKER)).toBe(SECOND_KEY);
    });

    test('resolve:', () => {
        const resolveAfterUse = consumer.use(FIRST_MAKER, FIRST_KEY);
        const resolve = consumer.resolve(FIRST_KEY);
        const elem = 'elem';
        const modifiers = {
            '': {
                [elem]: {
                    sz: 'lg',
                    main: ''
                }
            }
        };
        expect(resolveAfterUse(modifiers)).toMatchObject(resolve(modifiers));
    });

    test('toString:', () => {
        consumer.use(FIRST_MAKER, FIRST_KEY);
        consumer.use(SECOND_MAKER);
        expect('' + consumer).toEqual(
            `<script is="${TAG_NAME}" prefix="pre" mode="a">document.currentScript.settings = {makers: {first: () => { return { div: { height: "300px" } }; },pre1: () => { return { body: { width: "300px" } }; }},}</script>`
        );
    });
});
8;
