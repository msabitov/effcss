import { describe, expect, test } from 'vitest';
import { createProcessor } from '../src/_provider/process';

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

const processor = createProcessor({params: {}});
const classProcessor = createProcessor({params: {}, mode: 'c'});

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
    expect(styleString.includes('[data-cust~="sz-u"]{--eff-cust-sz:unset;}')).toBeTruthy();
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


describe('BEM data-attribute resolver:', () => {
  test('Block:', () => {
    const styleAttr = processor.bem.attr('cust')()();
    expect(styleAttr['data-cust']).toBe('');
  });

  test('Block modifiers:', () => {
    const styleAttr = processor.bem.attr('cust')()('w-z sm');
    expect(styleAttr['data-cust']).toBe('w-z sm');
  });

  test('Block object modifiers:', () => {
    const styleAttr = processor.bem.attr('cust')()({
      w: 's',
      sm: ''
    } as TCustomStyleSheet['']);
    expect(styleAttr['data-cust']).toBe('w-s sm');
  });

  test('Element:', () => {
    const styleAttr = processor.bem.attr('cust')('elem')();
    expect(styleAttr['data-cust-elem']).toBe('');
  });

  test('Element modifiers:', () => {
    const styleAttr = processor.bem.attr('cust')('elem')('w-s sm');
    expect(styleAttr['data-cust-elem']).toBe('w-s sm');
  });

  test('Element object modifiers:', () => {
    const styleAttr = processor.bem.attr('cust')('elem')({
      w: 's',
      lg: ''
    } as TCustomStyleSheet['elem']);
    expect(styleAttr['data-cust-elem']).toBe('w-s lg');
  });

  test('Resolved `v`:', () => {
    const styleAttr = processor.bem.attr('cust')('elem')({
      w: 's',
      lg: ''
    } as TCustomStyleSheet['elem']);
    expect(styleAttr.v).toBe('w-s lg');
  });

  test('Resolved `k`:', () => {
    const styleAttr = processor.bem.attr('cust')('elem')({
      w: 's',
      lg: ''
    } as TCustomStyleSheet['elem']);
    expect(styleAttr.k).toBe('data-cust-elem');
  });

  test('Resolved destruction:', () => {
    const styleAttr = processor.bem.attr('cust')('elem')({
      w: 's',
      lg: ''
    } as TCustomStyleSheet['elem']);
    const dest = {...styleAttr};
    expect(!('k' in dest) && !('v' in dest)).toBeTruthy();
  });

  test('Undefined modifiers:', () => {
    const styleAttr = processor.bem.attr('cust')('elem')({
      w: 's',
      lg: undefined
    } as Partial<TCustomStyleSheet['elem']>);
    expect(styleAttr.v).toBe('w-s');
  });
});

describe('BEM className resolver:', () => {
  test('Block:', () => {
    const styleAttr = classProcessor.bem.attr('cust')()();
    expect(styleAttr.class).toBe('cust');
  });

  test('Block modifiers:', () => {
    const styleAttr = classProcessor.bem.attr('cust')()('w-s sm');
    expect(styleAttr.class).toBe('cust cust_w_s cust_sm');
  });

  test('Block object modifiers:', () => {
    const styleAttr = classProcessor.bem.attr('cust')()({
      w: 's',
      sm: ''
    } as TCustomStyleSheet['']);
    expect(styleAttr.class).toBe('cust cust_w_s cust_sm');
  });

  test('Element:', () => {
    const styleAttr = classProcessor.bem.attr('cust')('elem')();
    expect(styleAttr.class).toBe('cust__elem');
  });

  test('Element modifiers:', () => {
    const styleAttr = classProcessor.bem.attr('cust')('elem')('w-s lg');
    expect(styleAttr.class).toBe('cust__elem cust__elem_w_s cust__elem_lg');
  });

  test('Element object modifiers:', () => {
    const styleAttr = classProcessor.bem.attr('cust')('elem')({
      w: 's',
      lg: ''
    } as TCustomStyleSheet['elem']);
    expect(styleAttr.class).toBe('cust__elem cust__elem_w_s cust__elem_lg');
  });

  test('Resolved `v`:', () => {
    const styleAttr = classProcessor.bem.attr('cust')('elem')({
      w: 's',
      lg: ''
    } as TCustomStyleSheet['elem']);
    expect(styleAttr.v).toBe('cust__elem cust__elem_w_s cust__elem_lg');
  });

  test('Resolved `k`:', () => {
    const styleAttr = classProcessor.bem.attr('cust')('elem')({
      w: 's',
      lg: ''
    } as TCustomStyleSheet['elem']);
    expect(styleAttr.k).toBe('class');
  });

  test('Resolved destruction:', () => {
    const styleAttr = classProcessor.bem.attr('cust')('elem')({
      w: 's',
      lg: ''
    } as TCustomStyleSheet['elem']);
    const dest = {...styleAttr};
    expect(!('k' in dest) && !('v' in dest)).toBeTruthy();
  });

  test('Undefined modifiers:', () => {
    const styleAttr = classProcessor.bem.attr('cust')('elem')({
      w: 's',
      lg: undefined
    } as Partial<TCustomStyleSheet['elem']>);
    expect(styleAttr.v).toBe('cust__elem cust__elem_w_s');
  });
});
