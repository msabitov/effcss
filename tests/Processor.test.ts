import { describe, expect, test } from 'vitest';
import { Processor } from '../src/_provider/process';

const processor = new Processor({params: {}});
const classProcessor = new Processor({params: {}, mode: 'c'});

describe('BEM selectors:', () => {
  test('block:', () => {
    const styleString = processor.compile('cust', {c: {_: {
      color: 'transparent'
    }}});
    expect(styleString).toBe('[data-cust]{color:transparent;}')
  });

  test('element:', () => {
    const styleString = processor.compile('cust', {c: {__elem: {
      width: '20px'
    }}});
    expect(styleString).toBe('[data-cust-elem]{width:20px;}')
  });

  test('block modifier:', () => {
    const styleString = processor.compile('cust', {c: {_w_s: {
      width: '1rem'
    }}});
    expect(styleString).toBe('[data-cust~="w-s"]{width:1rem;}')
  });

  test('block boolean modifier:', () => {
    const styleString = processor.compile('cust', {c: {_fw_: {
      width: '100%'
    }}});
    expect(styleString).toBe('[data-cust~="fw"]{width:100%;}')
  });

  test('element modifier:', () => {
    const styleString = processor.compile('cust', {c: {__elem_w_s: {
      width: '1rem'
    }}});
    expect(styleString).toBe('[data-cust-elem~="w-s"]{width:1rem;}')
  });

  test('element boolean modifier:', () => {
    const styleString = processor.compile('cust', {c: {__elem_fw_: {
      width: '100%'
    }}});
    expect(styleString).toBe('[data-cust-elem~="fw"]{width:100%;}')
  });

  test('multiple block modifiers:', () => {
    const styleString = processor.compile('cust', {c: {_w: {
      s: {width: '20px'}, m: {width: '30px'}
    }}});
    expect(styleString).toBe('[data-cust~="w-s"]{width:20px;}[data-cust~="w-m"]{width:30px;}')
  });

  test('multiple element modifiers:', () => {
    const styleString = processor.compile('cust', {c: {__elem_w: {
      s: {width: '20px'}, m: {width: '30px'}
    }}});
    expect(styleString).toBe('[data-cust-elem~="w-s"]{width:20px;}[data-cust-elem~="w-m"]{width:30px;}')
  });
});

describe('BEM class selectors:', () => {
  test('block:', () => {
    const styleString = classProcessor.compile('cust', {c: {_: {
      color: 'transparent'
    }}});
    expect(styleString).toBe('.cust{color:transparent;}')
  });

  test('element:', () => {
    const styleString = classProcessor.compile('cust', {c: {__elem: {
      width: '20px'
    }}});
    expect(styleString).toBe('.cust__elem{width:20px;}')
  });

  test('block modifier:', () => {
    const styleString = classProcessor.compile('cust', {c: {_w_s: {
      width: '1rem'
    }}});
    expect(styleString).toBe('.cust_w_s{width:1rem;}')
  });

  test('block boolean modifier:', () => {
    const styleString = classProcessor.compile('cust', {c: {_fw_: {
      width: '100%'
    }}});
    expect(styleString).toBe('.cust_fw{width:100%;}')
  });

  test('element modifier:', () => {
    const styleString = classProcessor.compile('cust', {c: {__elem_w_s: {
      width: '1rem'
    }}});
    expect(styleString).toBe('.cust__elem_w_s{width:1rem;}')
  });

  test('element boolean modifier:', () => {
    const styleString = classProcessor.compile('cust', {c: {__elem_fw_: {
      width: '100%'
    }}});
    expect(styleString).toBe('.cust__elem_fw{width:100%;}')
  });

  test('multiple block modifiers:', () => {
    const styleString = classProcessor.compile('cust', {c: {_w: {
      s: {width: '20px'}, m: {width: '30px'}
    }}});
    expect(styleString).toBe('.cust_w_s{width:20px;}.cust_w_m{width:30px;}')
  });

  test('multiple element modifiers:', () => {
    const styleString = classProcessor.compile('cust', {c: {__elem_w: {
      s: {width: '20px'}, m: {width: '30px'}
    }}});
    expect(styleString).toBe('.cust__elem_w_s{width:20px;}.cust__elem_w_m{width:30px;}')
  });
});

describe('Interpolation:', () => {
  test('global keys dict:', () => {
    const styleString = processor.compile('cust', {c: {
      '.custom': {
        $c: 'transparent'
      }
    }});
    expect(styleString).toBe('.custom{color:transparent;}')
  });

  test('local keys dict:', () => {
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
    const styleString = processor.compile('cust', {
      v: {sz: {a: 'auto'}},
      c: {_fw_: {
        width: '{sz.a}'
      }
    }});
    expect(styleString).toBe('[data-cust~="fw"]{width:auto;}');
  });

  test('local vars dict:', () => {
    const styleString = processor.compile('cust', {
      _: {sz: {}},
      c: {_sz: '&uni=>{_sz}:{1}'
    }});
    expect(styleString.includes('[data-cust~="sz-a"]{--eff-cust-sz:auto;}')).toBeTruthy();
  });

  test('Keyframes:', () => {
    const styleString = processor.compile('block', {
      kf: {main: {0: {width: '10px'}, 100: {width: '20px'}}},
      c: {_main_: {$an: '{kf_main}'}}
    });
    expect(styleString.includes('@keyframes eff-block-main {0%{width:10px;}100%{width:20px;}}[data-block~="main"]{animation-name:eff-block-main;}')).toBeTruthy();
  });
});

describe('Object values:', () => {
  test('Nested selector:', () => {
    const styleString = processor.compile('cust', {c: {'.custom': {
      '.nested': {color: 'green'}
    }}});
    expect(styleString).toBe('.custom{&.nested{color:green;}}')
  });

  test('Nested at-rules:', () => {
    const styleString = processor.compile('block', {c: {
      '.small': {width: '5rem', $min_md_: {'.large': {width: '15rem'}}}}}
    );
    expect(styleString).toBe('.small{width:5rem;@media (min-width:48rem){.large{width:15rem;}}}')
  });

  test('Selector starting with `&`:', () => {
    const styleString = processor.compile('block', {c: {
      '.small': {width: '5rem', '& > .large': {width: '15rem'}}}}
    );
    expect(styleString).toBe('.small{width:5rem;& > .large{width:15rem;}}')
  });

  test('First-level nested selector inside at-rules:', () => {
    const styleString = processor.compile('block', {c: {
      $min_md_:{'.small': {width: '5rem'}, '.large': {width: '15rem'}}}}
    );
    expect(styleString).toBe('@media (min-width:48rem){.small{width:5rem;}.large{width:15rem;}}')
  });

  test('Values transform:', () => {
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
