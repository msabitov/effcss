import { beforeEach, describe, expect, test } from 'vitest';
import { createManager as createStyleManager } from '../src/_provider/manage';
import { IStyleManager } from '../src/types';

describe('Manager:', () => {
    const cssText = '.cls{padding:2px;}';
    const nextCssText = '.cls{padding:4px;}';
    const firstId = 'first';
    const secondId = 'second';

    let manager: IStyleManager;
    let firstStylesheet;
    let secondStylesheet;
    let stylesheets;
    beforeEach(async () => {
        manager = createStyleManager({});
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
        expect(stylesheet === firstStylesheet && !!stylesheet && [
            ...stylesheet?.cssRules
        ].map(i=>i.cssText).join('').replaceAll(' ','') === nextCssText).toBeTruthy();
    });

    test('add & getAll', () => {
        manager.add(firstId, firstStylesheet);
        manager.add(secondId, firstStylesheet);
        expect(manager.getAll()).toEqual(stylesheets);
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

    test('add & registerNode & off', () => {
        manager.add(firstId, firstStylesheet);
        manager.registerNode(document);
        manager.off(firstId);
        expect(document.adoptedStyleSheets.findIndex((stylesheet) => stylesheet === firstStylesheet)).toBe(-1);
    });

    test('add & registerNode & off & on', () => {
        manager.add(firstId, firstStylesheet);
        manager.registerNode(document);
        manager.off(firstId);
        manager.on(firstId);
        expect(document.adoptedStyleSheets).toContain(firstStylesheet);
    });

    test('add & add & registerNode & off many', () => {
        manager.add(firstId, firstStylesheet);
        manager.add(secondId, secondStylesheet);
        manager.registerNode(document);
        manager.off([firstId, secondId]);
        expect(
            document.adoptedStyleSheets.findIndex((stylesheet) => stylesheet === firstStylesheet) === -1 &&
            document.adoptedStyleSheets.findIndex((stylesheet) => stylesheet === secondStylesheet) === -1
        ).toBeTruthy();
    });

    test('add & add & registerNode & off many & on many', () => {
        manager.add(firstId, firstStylesheet);
        manager.add(secondId, secondStylesheet);
        manager.registerNode(document);
        manager.off([firstId, secondId]);
        manager.on([secondId, firstId]);
        expect(
            document.adoptedStyleSheets.findIndex((stylesheet) => stylesheet === firstStylesheet) !== -1 &&
            document.adoptedStyleSheets.findIndex((stylesheet) => stylesheet === secondStylesheet) !== -1
        ).toBeTruthy();
    });

    test('add & registerNode & status & off & status', () => {
        manager.add(firstId, firstStylesheet);
        manager.registerNode(document);
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
        expect([
            ...rules
        ].map(i=>i.cssText).join('').replaceAll(' ','')).toBe(cssText);
    });

    test('registerNode & add', () => {
        manager.registerNode(document);
        manager.add(firstId, firstStylesheet);
        expect(document.adoptedStyleSheets).toContain(firstStylesheet);
    });

    test('add & registerNode & remove', () => {
        manager.add(firstId, firstStylesheet);
        manager.registerNode(document);
        manager.remove(firstId);
        expect(document.adoptedStyleSheets).toEqual([]);
    });

    test('registerNode & unregisterNode & add', () => {
        manager.registerNode(document);
        manager.unregisterNode(document);
        manager.add(secondId, firstStylesheet);
        expect(document.adoptedStyleSheets).not.toContain(secondStylesheet);
    });
});
