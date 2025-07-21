import { beforeEach, describe, expect, test } from 'vitest';
import { createManager as createStyleManager } from '../src/_provider/manage';

describe('Manager:', () => {
    const cssText = '.cls{padding:2px;}';
    const nextCssText = '.cls{padding:4px;}';
    const firstId = 'first';
    const secondId = 'second';

    let manager: ReturnType<typeof createStyleManager>;
    let firstStylesheet;
    let secondStylesheet;
    let stylesheets;
    beforeEach(async () => {
        manager = createStyleManager();
        firstStylesheet = new CSSStyleSheet();
        firstStylesheet.replaceSync(cssText);
        secondStylesheet = new CSSStyleSheet();
        secondStylesheet.replaceSync(cssText);
        stylesheets = {
            [firstId]: firstStylesheet,
            [secondId]: secondStylesheet
        };
        return async () => {
            document.adoptedStyleSheets = [];
        };
    });

    test('add & get', () => {
        manager.add(firstId, firstStylesheet);
        expect(manager.get(firstId)).toBe(firstStylesheet);
    });

    test('add & replace & get', () => {
        manager.add(firstId, firstStylesheet);
        manager.replace(firstId, nextCssText);
        const stylesheet = manager.get(firstId);
        expect(
            stylesheet === firstStylesheet &&
                !!stylesheet &&
                [...stylesheet?.cssRules]
                    .map((i) => i.cssText)
                    .join('')
                    .replaceAll(' ', '') === nextCssText
        ).toBeTruthy();
    });

    test('add & getAll', () => {
        manager.add(firstId, firstStylesheet);
        manager.add(secondId, firstStylesheet);
        const all = manager.getAll();
        expect(!!all[firstId] && !!all[secondId]).toBeTruthy();
    });

    test('add & apply', () => {
        manager.add(firstId, firstStylesheet);
        manager.apply(document);
        expect(document.adoptedStyleSheets).toContain(firstStylesheet);
    });

    test('add & remove', () => {
        manager.add(firstId, firstStylesheet);
        manager.remove(firstId);
        expect(manager.get(firstId)).toBeUndefined();
    });

    test('add & register & off', () => {
        manager.add(firstId, firstStylesheet);
        manager.register(document);
        manager.off(firstId);
        expect(document.adoptedStyleSheets.findIndex((stylesheet) => stylesheet === firstStylesheet)).toBe(-1);
    });

    test('add & register & off & on', () => {
        manager.add(firstId, firstStylesheet);
        manager.register(document);
        manager.off(firstId);
        manager.on(firstId);
        expect(document.adoptedStyleSheets).toContain(firstStylesheet);
    });

    test('add & add & register & off many', () => {
        manager.add(firstId, firstStylesheet);
        manager.add(secondId, secondStylesheet);
        manager.register(document);
        manager.off(firstId, secondId);
        const arr = [...document.adoptedStyleSheets];
        expect(
            arr.findIndex((stylesheet) => stylesheet === firstStylesheet) === -1 &&
                arr.findIndex((stylesheet) => stylesheet === secondStylesheet) === -1
        ).toBeTruthy();
    });

    test('add & add & register & off many & on many', () => {
        manager.add(firstId, firstStylesheet);
        manager.add(secondId, secondStylesheet);
        manager.register(document);
        manager.off(firstId, secondId);
        manager.on(secondId, firstId);
        expect(
            document.adoptedStyleSheets.findIndex((stylesheet) => stylesheet === firstStylesheet) !== -1 &&
                document.adoptedStyleSheets.findIndex((stylesheet) => stylesheet === secondStylesheet) !== -1
        ).toBeTruthy();
    });

    test('add & register & status & off & status', () => {
        manager.add(firstId, firstStylesheet);
        manager.register(document);
        const initStatus = manager.status(firstId);
        manager.off(firstId);
        const resultStatus = manager.status(firstId);
        expect(initStatus && !resultStatus).toBeTruthy();
    });

    test('add & removeAll', () => {
        manager.add(firstId, firstStylesheet);
        manager.add(secondId, firstStylesheet);
        manager.removeAll();
        expect(manager.getAll()).toEqual({});
    });

    test('pack & get', () => {
        manager.pack(firstId, cssText);
        const rules = manager.get(firstId)?.cssRules || [];
        expect(
            [...rules]
                .map((i) => i.cssText)
                .join('')
                .replaceAll(' ', '')
        ).toBe(cssText);
    });

    test('register & add', () => {
        manager.register(document);
        manager.add(firstId, firstStylesheet);
        expect(document.adoptedStyleSheets).toContain(firstStylesheet);
    });

    test('add & register & remove', () => {
        manager.add(firstId, firstStylesheet);
        manager.register(document);
        manager.remove(firstId);
        expect(document.adoptedStyleSheets).toEqual([]);
    });

    test('register & unregister & add', () => {
        manager.register(document);
        manager.unregister(document);
        manager.add(secondId, firstStylesheet);
        expect(document.adoptedStyleSheets).not.toContain(secondStylesheet);
    });

    test('use outer stylesheet & register & add & removeAll & unregister', () => {
        const outer = new CSSStyleSheet();
        outer.replaceSync('.outer {box-sizing: border-box;}');
        document.adoptedStyleSheets = [outer];
        manager.add(firstId, firstStylesheet);
        manager.add(secondId, secondStylesheet);
        manager.register(document);
        manager.removeAll();
        manager.unregister(document);
        expect(document.adoptedStyleSheets).toContain(outer);
    });
});
