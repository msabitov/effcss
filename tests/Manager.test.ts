import { beforeEach, describe, expect, test } from 'vitest';
import { createStyleManager } from '../src/index';
import { IStyleManager } from '../src/types';

describe('Style manager:', () => {
    const cssText = '.cls{padding:2px;}';
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

    test('cacheRules & getExpandedSelectors', () => {
        manager.cacheRules(firstId, firstStylesheet);
        const expanded = manager.getExpandedSelectors(firstId);
        expect(expanded.size).toBe(0);
    });
    
    test('cacheRules & expandRule & getExpandedSelectors', () => {
        manager.cacheRules(firstId, firstStylesheet);
        manager.expandRule(firstId, '.cls', '.cls{&:hover')
        const expanded = manager.getExpandedSelectors(firstId);
        expect(expanded.size).toBe(1);
    });

    test('expandRule of non-existent stylesheet', () => {
        manager.expandRule(firstId, '.cls', '.cls:hover')
        const expanded = manager.getExpandedSelectors(firstId);
        expect(expanded).toBe(undefined);
    });
});
