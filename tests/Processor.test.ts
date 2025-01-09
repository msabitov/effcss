import { describe, expect, test } from 'vitest';
import { Processor } from '../src/_provider/process';

describe('BEM selectors:', () => {
  test('block:', () => {
    const processor = new Processor({params: {}});
    const styleString = processor.compile('cust', {c: {_: {
      color: 'transparent'
    }}});
    expect(styleString).toBe('[data-cust]{color:transparent;}')
  });

  test('element:', () => {
    const processor = new Processor({params: {}});
    const styleString = processor.compile('cust', {c: {__elem: {
      width: '20px'
    }}});
    expect(styleString).toBe('[data-cust-elem]{width:20px;}')
  });

  test('block modifier:', () => {
    const processor = new Processor({params: {}});
    const styleString = processor.compile('cust', {c: {_w_s: {
      width: '1rem'
    }}});
    expect(styleString).toBe('[data-cust~="w-s"]{width:1rem;}')
  });

  test('block boolean modifier:', () => {
    const processor = new Processor({params: {}});
    const styleString = processor.compile('cust', {c: {_fw_: {
      width: '100%'
    }}});
    expect(styleString).toBe('[data-cust~="fw"]{width:100%;}')
  });

  test('element modifier:', () => {
    const processor = new Processor({params: {}});
    const styleString = processor.compile('cust', {c: {__elem_w_s: {
      width: '1rem'
    }}});
    expect(styleString).toBe('[data-cust-elem~="w-s"]{width:1rem;}')
  });

  test('element boolean modifier:', () => {
    const processor = new Processor({params: {}});
    const styleString = processor.compile('cust', {c: {__elem_fw_: {
      width: '100%'
    }}});
    expect(styleString).toBe('[data-cust-elem~="fw"]{width:100%;}')
  });

  test('multiple block modifiers:', () => {
    const processor = new Processor({params: {}});
    const styleString = processor.compile('cust', {c: {_w: {
      s: {width: '20px'}, m: {width: '30px'}
    }}});
    expect(styleString).toBe('[data-cust~="w-s"]{width:20px;}[data-cust~="w-m"]{width:30px;}')
  });

  test('multiple element modifiers:', () => {
    const processor = new Processor({params: {}});
    const styleString = processor.compile('cust', {c: {__elem_w: {
      s: {width: '20px'}, m: {width: '30px'}
    }}});
    expect(styleString).toBe('[data-cust-elem~="w-s"]{width:20px;}[data-cust-elem~="w-m"]{width:30px;}')
  });
});

describe('Interpolation:', () => {
  test('global keys dict:', () => {
    const processor = new Processor({params: {}});
    const styleString = processor.compile('cust', {c: {
      '.custom': {
        $c: 'transparent'
      }
    }});
    expect(styleString).toBe('.custom{color:transparent;}')
  });

  test('local keys dict:', () => {
    const processor = new Processor({params: {}});
    const styleString = processor.compile('cust', {
      k: {
        c: 'background-color'
      },
      c: {
      '.custom': {
        $c: 'transparent'
      }
    }});
    expect(styleString).toBe('.custom{background-color:transparent;}')
  });

  test('local values dict:', () => {
    const processor = new Processor({params: {}});
    const styleString = processor.compile('cust', {
      v: {sz: {a: 'auto'}},
      c: {_fw_: {
        width: '{sz.a}'
      }
    }});
    expect(styleString).toBe('[data-cust~="fw"]{width:auto;}');
  });

  test('local vars dict:', () => {
    const processor = new Processor({params: {}});
    const styleString = processor.compile('cust', {
      _: {sz: {}},
      c: {_sz: '&uni=>{_sz}:{1}'
    }});
    expect(styleString.includes('[data-cust~="sz-a"]{--eff-cust-sz:auto;}')).toBeTruthy();
  });
});

describe('Object values:', () => {
  test('Nested selector:', () => {
    const processor = new Processor({params: {}});
    const styleString = processor.compile('cust', {c: {'.custom': {
      '.nested': {color: 'green'}
    }}});
    expect(styleString).toBe('.custom{&.nested{color:green;}}')
  });

  test('Values transform:', () => {
    const processor = new Processor({params: {}});
    const styleString = processor.compile('cust', {
      v: {sz: {
        s: 20,
        m: 40,
        l: 60
      }},
      c: {_w: '&sz=>width:{1}px'
    }});
    expect(styleString.includes('[data-cust~="w-s"]{width:20px;}')).toBeTruthy();
  });

  test('Values identifier transform:', () => {
    const processor = new Processor({params: {}});
    const styleString = processor.compile('cust', {
      v: {sz: {
        s: 20,
        m: 40,
        l: 60
      }},
      c: {_w: '&sz=>{0}Sm|width:{1}px'
    }});
    expect(styleString.includes('[data-cust~="w-sSm"]{width:20px;}')).toBeTruthy();
  });

  test('Values filter:', () => {
    const processor = new Processor({params: {}});
    const styleString = processor.compile('cust', {
      v: {sz: {
        s: 20,
        m: 40,
        l: 60
      }},
      c: {_w: '&sz[s,m]=>width:{1}px'
    }});
    expect(styleString.includes('[data-cust~="w-s"]{width:20px;}') && !styleString.includes('[data-cust~="w-l"]')).toBeTruthy();
  });
});
