import { beforeAll, beforeEach, describe, expect, test } from 'vitest';
import { page } from '@vitest/browser/context';
import { defineProvider } from '../src/index';
import { createConsumer } from '../src/consumer';
import { TAG_NAME } from '../src/common';

const PROVIDER_ID = 'provider';
const FIRST_ID = 'first';
const SECOND_ID = 'second';
const prefix = 'f';
const FIRST_MAKER = ({ bem }) => {
    return {
        [bem('')]: {
            width: '100%',
            'flex-shrink': 0
        }
    };
};
const SECOND_MAKER = ({ bem, units: { px, vh } }) => {
    return {
        [bem('')]: {
            height: vh(100),
            borderTopLeftRadius: px(14),
            flexGrow: 10
        }
    };
};

const PROVIDER_PARAMS = {
    vars: {
        '': {
            rem: 16,
            l: {
                def: 0.4
            },
            h: {
                def: 261.35,
                // brand
                b: 261.35,
                // info
                i: 194.77,
                // error
                e: 29.23,
                // warning
                w: 70.66,
                // success
                s: 142.49
            },
            c: {
                def: 0.03,
                xs: 0.03,
                s: 0.06,
                m: 0.1,
                l: 0.15,
                xl: 0.25
            },
            a: {
                def: 1,
                min: 0,
                xs: 0.1,
                s: 0.25,
                m: 0.5,
                l: 0.75,
                xl: 0.9,
                max: 1
            },
            t: {
                def: 300,
                xs: 100,
                s: 200,
                m: 300,
                l: 450
            },
            sz: {
                s: 10,
                m: 20,
                l: 30
            }
        }
    }
};

describe('Provider utils:', () => {
    let consumer;
    beforeAll(() => {
        defineProvider(PROVIDER_PARAMS);
    });

    beforeEach(() => {
        const element = document.createElement('script', {
            is: TAG_NAME
        });
        element.dataset.testid = PROVIDER_ID;
        element.setAttribute('is', TAG_NAME);
        document.head.append(element);
        consumer = createConsumer({});
        return () => element.remove();
    });

    test('get provider', () => {
        const provider = page.getByTestId(PROVIDER_ID).query();
        expect(consumer).toBe(provider);
    });

    test('get collected stylesheets', () => {
        const makers = { [FIRST_ID]: FIRST_MAKER, [SECOND_ID]: SECOND_MAKER };
        consumer.usePublic(makers);
        const stylesheets = consumer.stylesheets();
        expect(stylesheets.length).toBe(3);
    });

    test('use stylesheet', () => {
        const resolve = consumer.use(FIRST_MAKER);
        const attrs = resolve('');
        expect(attrs + '').toBe(`data-${prefix}1=""`);
    });

    test('use public stylesheets', () => {
        const resolvers = consumer.usePublic({ [FIRST_ID]: FIRST_MAKER });
        const resolver = resolvers[FIRST_ID];
        const attrs = resolver('');
        expect(attrs[`data-${FIRST_ID}`]).toBe('');
    });

    test('use private stylesheets', () => {
        const resolvers = consumer.usePrivate([SECOND_MAKER]);
        const resolver = resolvers[0];
        const attrs = resolver('');
        expect(attrs + '').toBe(`data-${prefix}1=""`);
    });

    test('resolve stylesheet', () => {
        consumer.use(FIRST_MAKER, FIRST_ID);
        expect(consumer.resolve(FIRST_ID)('') + '').toBe(`data-${FIRST_ID}=""`);
    });

    test('get provider settings', () => {
        expect(consumer.settings.vars).toMatchObject(PROVIDER_PARAMS.vars);
    });
});
