import { beforeAll, beforeEach, describe, expect, test } from 'vitest';
import { page } from '@vitest/browser/context';
import { defineStyleProvider } from '../src/index';
import {
    compileStyleSheet, expandStyleSheet, getProvider, getRulesCount,
    getTotalRulesCount, resolveStyleSheet, stringifyAllStyles,
    stringifyStyleSheet, useStyleSheet
} from '../src/utils';

const PROVIDER_ID = 'provider';
const FIRST_ID = 'first';
const SECOND_ID = 'second';
const FIRST_CONFIG = {
    c: {
        _: {
            $w: '100%',
            borderRadius: '12px',
            'flex-shrink': 0
        }
    }
};
const FIRST_STR = `[data-${FIRST_ID}] { width: 100%; border-radius: 12px; flex-shrink: 0; }`;
const SECOND_CONFIG = {
    c: {
        _: {
            $h: '100vh',
            borderTopLeftRadius: '14px',
            'flex-grow': 10
        }
    }
};
const SECOND_STR = `[data-${SECOND_ID}] { height: 100vh; border-top-left-radius: 14px; flex-grow: 10; }`;
const CUSTOM_NAME = 'my-provider';

describe('Style provider utils:', () => {
    beforeAll(() => {
        defineStyleProvider();
    });

    beforeEach(() => {
        const element = document.createElement('style-provider', {is: 'style-provider'});
        element.dataset.testid = PROVIDER_ID;
        element.setAttribute('initkey', '');
        document.body.append(element);
        return () => element.remove();
    });

    test('getProvider', () => {
        const provider = page.getByTestId(PROVIDER_ID).query();
        expect(getProvider()).toBe(provider);
    });

    test('compileStyleSheet', () => {
        const provider = getProvider();
        compileStyleSheet(FIRST_ID, FIRST_CONFIG);
        expect(provider.manager.get(FIRST_ID) instanceof CSSStyleSheet).toBeTruthy();
    });

    test('useStyleSheet', () => {
        const resolver = useStyleSheet(FIRST_CONFIG);
        const attrs = resolver()();
        expect(attrs.k.startsWith('data-') && attrs.v === '').toBeTruthy();
    });

    test('expandStyleSheet', () => {
        const provider = getProvider();
        compileStyleSheet(FIRST_ID, FIRST_CONFIG);
        expandStyleSheet(FIRST_ID, ['_:h']);
        expect(provider.manager.get(FIRST_ID)?.cssRules?.[1]?.cssRules?.[0]?.selectorText).toBe('&:hover');
    });

    test('resolveStyleSheet', () => {
        compileStyleSheet(FIRST_ID, FIRST_CONFIG);
        expect(resolveStyleSheet(FIRST_ID)()().k).toBe('data-' + FIRST_ID);
    });

    test('stringifyStyleSheet', () => {
        compileStyleSheet(FIRST_ID, FIRST_CONFIG);
        expect(stringifyStyleSheet(FIRST_ID)).toBe(FIRST_STR);
    });

    test('stringifyAllStyles', () => {
        compileStyleSheet(FIRST_ID, FIRST_CONFIG);
        compileStyleSheet(SECOND_ID, SECOND_CONFIG);
        const allStr = stringifyAllStyles();
        expect(allStr.includes(FIRST_STR) && allStr.includes(SECOND_STR)).toBeTruthy();
    });

    test('getRulesCount', () => {
        compileStyleSheet(FIRST_ID, FIRST_CONFIG);
        expect(getRulesCount(FIRST_ID)).toBe(1);
    });

    test('getTotalRulesCount', () => {
        compileStyleSheet(FIRST_ID, FIRST_CONFIG);
        compileStyleSheet(SECOND_ID, SECOND_CONFIG);
        expect(getTotalRulesCount()).toBe(2);
    });
});

describe('Style provider params:', () => {
    let count = 3;
    beforeAll(() => {
        count = 3;
        defineStyleProvider({
            name: CUSTOM_NAME,
            config: {
                rootStyle: {
                    fontSize: '24px'
                },
                themes: {
                    root: {
                        mysz: {
                            s: 10,
                            m: 20,
                            l: 30
                        },
                        myrem: {
                            s: 12,
                            l: 24
                        }
                    },
                    custom: {
                        mysz: {
                            s: 1,
                            m: 2,
                            l: 3
                        },
                        myrem: {
                            s: 10,
                            l: 20
                        }
                    } 
                },
                units: {
                    myrem: '{1}rem'
                }
            },
            keygen: () => 'cust' + (count+=2)
        });
        return () => count = 3;
    });

    beforeEach(() => {
        const element = document.createElement(CUSTOM_NAME, {is: CUSTOM_NAME});
        element.dataset.testid = PROVIDER_ID;
        document.body.append(element);
        return () => element.remove();
    });

    test('name', () => {
        const provider = getProvider(document, CUSTOM_NAME);
        expect(!!provider.manager && !!provider.processor).toBeTruthy();
    });

    test('keygen', () => {
        const provider = getProvider(document, CUSTOM_NAME);
        const firstResolver = useStyleSheet(FIRST_CONFIG, provider);
        const firstAttr = firstResolver()().k;
        const secondResolver = useStyleSheet(SECOND_CONFIG, provider);
        const secondAttr = secondResolver()().k;
        expect(firstAttr === 'data-effcust5' && secondAttr === 'data-effcust7').toBeTruthy();
    });

    test('config.rootStyle', () => {
        const provider = getProvider(document, CUSTOM_NAME);
        expect([
            ...(provider?.manager?.get?.('init')?.cssRules || [])
        ].find((rule) => rule?.selectorText === ':root')?.cssText).toContain('font-size: 24px;');
    });

    test('config.themes.root', () => {
        const provider = getProvider(document, CUSTOM_NAME);
        expect([
            ...(provider?.manager?.get?.('init')?.cssRules || [])
        ].find((rule) => rule?.selectorText.includes('theme-root'))?.cssText).toContain('--eff-mysz-s: 10; --eff-mysz-m: 20;');
    });

    test('config.themes.custom', () => {
        const provider = getProvider(document, CUSTOM_NAME);
        expect([
            ...(provider?.manager?.get?.('init')?.cssRules || [])
        ].find((rule) => rule?.selectorText.includes('theme-custom'))?.cssText).toContain('--eff-mysz-s: 1; --eff-mysz-m: 2;');
    });

    test('config.units', () => {
        const provider = getProvider(document, CUSTOM_NAME);
        expect([
            ...(provider?.manager?.get?.('init')?.cssRules || [])
        ].find((rule) => rule?.selectorText.includes(':root'))?.cssText).toContain('--eff-myrem-s: 12rem; --eff-myrem-l: 24rem;');
    });
});