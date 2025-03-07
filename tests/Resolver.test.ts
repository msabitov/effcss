import { describe, expect, test } from 'vitest';
import { createResolver } from '../src/utils/common';

type TCustomStyleSheet = {
  '': {
    /**
     * Block modifier
     */
    w: 's' | 'l';
    /**
     * Block boolean modifier
     */
    sm: '';
  };
  elem: {
    /**
     * Element modifier
     */
    w: 's' | 'm' | 'l';
    /**
     * Element boolean modifier
     */
    lg: '';
  };
  elem2: {
    /**
     * Element modifier
     */
    h: 's' | 'm' | 'l';
    /**
     * Element boolean modifier
     */
    md: '';
  };
};

const attrResolver = createResolver({mode: 'a'});
const clsResolver = createResolver({mode: 'c'});

describe('BEM data-attribute resolver:', () => {
    test('Block:', () => {
      const styleAttr = attrResolver.attr('cust')()();
      expect(styleAttr['data-cust']).toBe('');
    });
  
    test('Block modifiers:', () => {
      const styleAttr = attrResolver.attr('cust')()('w-z sm');
      expect(styleAttr['data-cust']).toBe('w-z sm');
    });
  
    test('Block object modifiers:', () => {
      const styleAttr = attrResolver.attr('cust')()({
        w: 's',
        sm: ''
      } as TCustomStyleSheet['']);
      expect(styleAttr['data-cust']).toBe('w-s sm');
    });
  
    test('Element:', () => {
      const styleAttr = attrResolver.attr('cust')('elem')();
      expect(styleAttr['data-cust-elem']).toBe('');
    });
  
    test('Element modifiers:', () => {
      const styleAttr = attrResolver.attr('cust')('elem')('w-s sm');
      expect(styleAttr['data-cust-elem']).toBe('w-s sm');
    });
  
    test('Element object modifiers:', () => {
      const styleAttr = attrResolver.attr('cust')('elem')({
        w: 's',
        lg: ''
      } as TCustomStyleSheet['elem']);
      expect(styleAttr['data-cust-elem']).toBe('w-s lg');
    });
  
    test('Resolved `v`:', () => {
      const styleAttr = attrResolver.attr('cust')('elem')({
        w: 's',
        lg: ''
      } as TCustomStyleSheet['elem']);
      expect(styleAttr.v).toBe('w-s lg');
    });
  
    test('Resolved `k`:', () => {
      const styleAttr = attrResolver.attr('cust')('elem')({
        w: 's',
        lg: ''
      } as TCustomStyleSheet['elem']);
      expect(styleAttr.k).toBe('data-cust-elem');
    });
  
    test('Resolved destruction:', () => {
      const styleAttr = attrResolver.attr('cust')('elem')({
        w: 's',
        lg: ''
      } as TCustomStyleSheet['elem']);
      const dest = {...styleAttr};
      expect(!('k' in dest) && !('v' in dest)).toBeTruthy();
    });
  
    test('Undefined modifiers:', () => {
      const styleAttr = attrResolver.attr('cust')('elem')({
        w: 's',
        lg: undefined
      } as Partial<TCustomStyleSheet['elem']>);
      expect(styleAttr.v).toBe('w-s');
    });
  });
  
  describe('BEM className resolver:', () => {
    test('Block:', () => {
      const styleAttr = clsResolver.attr('cust')()();
      expect(styleAttr.class).toBe('cust');
    });
  
    test('Block modifiers:', () => {
      const styleAttr = clsResolver.attr('cust')()('w-s sm');
      expect(styleAttr.class).toBe('cust cust_w_s cust_sm');
    });
  
    test('Block object modifiers:', () => {
      const styleAttr = clsResolver.attr('cust')()({
        w: 's',
        sm: ''
      } as TCustomStyleSheet['']);
      expect(styleAttr.class).toBe('cust cust_w_s cust_sm');
    });
  
    test('Element:', () => {
      const styleAttr = clsResolver.attr('cust')('elem')();
      expect(styleAttr.class).toBe('cust__elem');
    });
  
    test('Element modifiers:', () => {
      const styleAttr = clsResolver.attr('cust')('elem')('w-s lg');
      expect(styleAttr.class).toBe('cust__elem cust__elem_w_s cust__elem_lg');
    });
  
    test('Element object modifiers:', () => {
      const styleAttr = clsResolver.attr('cust')('elem')({
        w: 's',
        lg: ''
      } as TCustomStyleSheet['elem']);
      expect(styleAttr.class).toBe('cust__elem cust__elem_w_s cust__elem_lg');
    });
  
    test('Resolved `v`:', () => {
      const styleAttr = clsResolver.attr('cust')('elem')({
        w: 's',
        lg: ''
      } as TCustomStyleSheet['elem']);
      expect(styleAttr.v).toBe('cust__elem cust__elem_w_s cust__elem_lg');
    });
  
    test('Resolved `k`:', () => {
      const styleAttr = clsResolver.attr('cust')('elem')({
        w: 's',
        lg: ''
      } as TCustomStyleSheet['elem']);
      expect(styleAttr.k).toBe('class');
    });
  
    test('Resolved destruction:', () => {
      const styleAttr = clsResolver.attr('cust')('elem')({
        w: 's',
        lg: ''
      } as TCustomStyleSheet['elem']);
      const dest = {...styleAttr};
      expect(!('k' in dest) && !('v' in dest)).toBeTruthy();
    });
  
    test('Undefined modifiers:', () => {
      const styleAttr = clsResolver.attr('cust')('elem')({
        w: 's',
        lg: undefined
      } as Partial<TCustomStyleSheet['elem']>);
      expect(styleAttr.v).toBe('cust__elem cust__elem_w_s');
    });
  });
  