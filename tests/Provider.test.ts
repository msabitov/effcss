import { beforeAll, beforeEach, describe, expect, onTestFinished, test } from 'vitest';
import { page } from '@vitest/browser/context';
import { defineProvider } from '../src/index';
import {
    getProvider,
    measureOne, measureMany,
    resolveStyleSheet,
    stringifyOne, stringifyMany,
    useStyleSheet,
    usePublicStyleSheets,
    usePrivateStyleSheets
} from '../src/utils/browser';
import {
    SETTINGS_SCRIPT_ID, PROVIDER_TAG_NAME, STYLES_SCRIPT_CLS
} from '../src/constants';

const CUSTOME_EVENT_NAME = 'effcsschangecustom';
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
const SETTINGS = {
    rootStyle: {
        fontSize: '24px'
    },
    sets: {
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
    keys: {
        custo: 'border-bottom'
    },
    themes: {
        custom: {
            mysz: {
                s: 1,
                m: 2,
                l: 3
            },
            myrem: {
                s: 10,
                l: 20
            },
            newsz: {
                s: '1rem',
                l: '2rem'
            }
        } 
    },
    units: {
        myrem: '{1}rem'
    }
};

const STYLES = {
    [FIRST_ID]: FIRST_CONFIG,
    [SECOND_ID]: SECOND_CONFIG
};

describe('Provider utils:', () => {
    beforeAll(() => {
        defineProvider();
    });

    beforeEach(() => {
        const element = document.createElement(PROVIDER_TAG_NAME, {is: PROVIDER_TAG_NAME});
        element.dataset.testid = PROVIDER_ID;
        document.body.append(element);
        return () => element.remove();
    });

    test('get provider', () => {
        const provider = page.getByTestId(PROVIDER_ID).query();
        expect(getProvider()).toBe(provider);
    });

    test('get collected configs', () => {
        const configs = {[FIRST_ID]: FIRST_CONFIG, [SECOND_ID]: SECOND_CONFIG};
        usePublicStyleSheets(configs);
        const providerConfigs = getProvider().configs;
        expect(
            providerConfigs[FIRST_ID] === FIRST_CONFIG && providerConfigs[SECOND_ID] === SECOND_CONFIG
        ).toBeTruthy();
    });

    test('use stylesheet', () => {
        const resolver = useStyleSheet(FIRST_CONFIG);
        const attrs = resolver()();
        expect(attrs.k.startsWith('data-') && attrs.v === '').toBeTruthy();
    });

    test('use public stylesheets', () => {
        const resolvers = usePublicStyleSheets({[FIRST_ID]: FIRST_CONFIG});
        const resolver = resolvers[FIRST_ID];
        const attrs = resolver()();
        expect(attrs.k.startsWith('data-') && attrs.v === '').toBeTruthy();
    });

    test('use private stylesheets', () => {
        const resolvers = usePrivateStyleSheets([SECOND_CONFIG]);
        const resolver = resolvers[0];
        const attrs = resolver()();
        expect(attrs.k.startsWith('data-') && attrs.v === '').toBeTruthy();
    });

    test('resolve stylesheet', () => {
        useStyleSheet(FIRST_CONFIG, FIRST_ID);
        expect(resolveStyleSheet(FIRST_ID)()().k).toBe('data-' + FIRST_ID);
    });

    test('stringify stylesheet', () => {
        useStyleSheet(FIRST_CONFIG, FIRST_ID);
        const str = stringifyOne(FIRST_ID);
        expect(str).toBe(FIRST_STR);
    });

    test('stringify many stylesheets', () => {
        useStyleSheet(FIRST_CONFIG, FIRST_ID);
        useStyleSheet(SECOND_CONFIG, SECOND_ID);
        const allStr = stringifyMany([FIRST_ID, SECOND_ID]);
        expect(allStr.includes(FIRST_STR) && allStr.includes(SECOND_STR)).toBeTruthy();
    });

    test('measure stylesheet', () => {
        useStyleSheet(FIRST_CONFIG, FIRST_ID);
        const count = measureOne(FIRST_ID);
        expect(count).toBe(1);
    });

    test('measure many stylesheets', () => {
        useStyleSheet(FIRST_CONFIG, FIRST_ID);
        useStyleSheet(SECOND_CONFIG, SECOND_ID);
        const count = measureMany([FIRST_ID, SECOND_ID]);
        expect(count).toBe(2);
    });
});

describe('Provider scripts:', () => {
    beforeAll(() => {
        defineProvider();
    });

    test('JSON settings', () => {
        const script = document.createElement('script');
        script.type = 'application/json';
        script.id = SETTINGS_SCRIPT_ID;
        script.innerHTML = JSON.stringify(SETTINGS);
        document.head.append(script);
        const element = document.createElement(PROVIDER_TAG_NAME, {is: PROVIDER_TAG_NAME});
        element.dataset.testid = PROVIDER_ID;
        document.body.append(element);
        onTestFinished(() => {
            element.remove();
            script.remove();
        })
        const provider = getProvider();
        expect(provider.settingsContent).toEqual(SETTINGS);
    });

    test('JS settings', () => {
        const script = document.createElement('script');
        script.id = SETTINGS_SCRIPT_ID;
        script.innerHTML = `document.currentScript.effcss = ${JSON.stringify(SETTINGS)};`;
        document.head.append(script);
        const element = document.createElement(PROVIDER_TAG_NAME, {is: PROVIDER_TAG_NAME});
        element.dataset.testid = PROVIDER_ID;
        document.body.append(element);
        onTestFinished(() => {
            element.remove();
            script.remove();
        })
        const provider = getProvider();
        expect(provider.settingsContent).toEqual(SETTINGS);
    });

    test('JSON styles', () => {
        const script = document.createElement('script');
        script.type = 'application/json';
        script.classList.add(STYLES_SCRIPT_CLS);
        script.innerHTML = JSON.stringify(STYLES);
        document.head.append(script);
        const element = document.createElement(PROVIDER_TAG_NAME, {is: PROVIDER_TAG_NAME});
        element.dataset.testid = PROVIDER_ID;
        document.body.append(element);
        onTestFinished(() => {
            element.remove();
            script.remove();
        })
        const provider = getProvider();
        expect(provider.initContent).toEqual(STYLES);
    });

    test('JS styles', () => {
        const script = document.createElement('script');
        script.classList.add(STYLES_SCRIPT_CLS);
        script.innerHTML = `document.currentScript.effcss = ${JSON.stringify(STYLES)};`;
        document.head.append(script);
        const element = document.createElement(PROVIDER_TAG_NAME, {is: PROVIDER_TAG_NAME});
        element.dataset.testid = PROVIDER_ID;
        document.body.append(element);
        onTestFinished(() => {
            element.remove();
            script.remove();
        })
        const provider = getProvider();
        expect(provider.initContent).toEqual(STYLES);
    });

    test('several JS styles', () => {
        const firstScript = document.createElement('script');
        firstScript.classList.add(STYLES_SCRIPT_CLS);
        firstScript.innerHTML = `document.currentScript.effcss = ${JSON.stringify({[FIRST_ID]: FIRST_CONFIG})};`;
        document.head.append(firstScript);
        const secondScript = document.createElement('script');
        secondScript.classList.add(STYLES_SCRIPT_CLS);
        secondScript.innerHTML = `document.currentScript.effcss = ${JSON.stringify({[SECOND_ID]: SECOND_CONFIG})};`;
        document.head.append(secondScript);
        const element = document.createElement(PROVIDER_TAG_NAME, {is: PROVIDER_TAG_NAME});
        element.dataset.testid = PROVIDER_ID;
        document.body.append(element);
        onTestFinished(() => {
            element.remove();
            firstScript.remove();
            secondScript.remove();
        })
        const provider = getProvider();
        expect(provider.initContent).toEqual(STYLES);
    });
})

const PROVIDER_PARAMS = {
    name: CUSTOM_NAME,
    styles: STYLES,
    settings: SETTINGS
};

describe('Provider params:', () => {
    let count;
    beforeAll(() => {
        count = 3;
        defineProvider(PROVIDER_PARAMS);
        return () => count = 3;
    });

    beforeEach(() => {
        const element = document.createElement(CUSTOM_NAME, {is: CUSTOM_NAME});
        element.dataset.testid = PROVIDER_ID;
        element.setAttribute('eventname', CUSTOME_EVENT_NAME);
        document.body.append(element);
        return () => element.remove();
    });

    test('name', () => {
        const provider = getProvider(document, CUSTOM_NAME);
        expect(provider?.tagName === CUSTOM_NAME.toUpperCase() && provider.settingsContent).toEqual(SETTINGS);
    });

    test('settings.rootStyle', () => {
        const provider = getProvider(document, CUSTOM_NAME);
        expect([
            ...(provider?.get?.()?.cssRules || [])
        ].find((rule) => rule?.selectorText === ':root')?.cssText).toContain('font-size: 24px;');
    });

    test('existing sets in settings.themes.custom', () => {
        const provider = getProvider(document, CUSTOM_NAME);
        expect([
            ...(provider.get()?.cssRules || [])
        ].find((rule) => rule?.selectorText.includes('theme-custom'))?.cssText).toContain('--eff-mysz-s: 1; --eff-mysz-m: 2;');
    });

    test('new sets in settings.themes.custom', () => {
        const provider = getProvider(document, CUSTOM_NAME);
        expect([
            ...(provider.get()?.cssRules || [])
        ].find((rule) => rule?.selectorText.includes(':root'))?.cssText).toContain('--eff-newsz-s: unset; --eff-newsz-l: unset;');
    });

    test('settings.units', () => {
        const provider = getProvider(document, CUSTOM_NAME);
        expect([
            ...(provider.get()?.cssRules || [])
        ].find((rule) => rule?.selectorText.includes(':root'))?.cssText).toContain('--eff-myrem-s: 12rem; --eff-myrem-l: 24rem;');
    });

    test('eventname', () => {
        let styles = [];
        document.addEventListener(CUSTOME_EVENT_NAME, function(event) {
            styles = event.detail.styles;
        });
        const provider = getProvider(document, CUSTOM_NAME);
        provider.use({...FIRST_CONFIG});
        expect(provider.getMany()).toEqual(styles);
    });

    test('provider params in window.__EFFCSS_PARAMS__', () => {
        expect(window.__EFFCSS_PARAMS__).toEqual(PROVIDER_PARAMS);
    });
});
