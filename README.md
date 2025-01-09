# Effcss

Effcss is a next generation CSS-in-JS library based only on the browser APIs.

## Some features

- zero-dependency
- framework agnostic
- customizable
- runtime stylesheets generation
- built-in BEM support
- concise style description format
- support switching style modes (dark mode, light mode, etc.)

## Installation

Install it from npm:

```
npm i effcss
```

## Usage example

See simple usage example in `demo` folder

## Concepts

Effcss consists of two parts - **style provider** and **style config**.

**Style provider** is the static part that defines special web component (by default, `<style-provider>`). It should be connected in separate script-tag inside html head or manually defined in page scripts.

**Style config** is the dynamic part that configures the behavior of the web component and defines the initial styles of the page. **Styles config** consists of 3 fields:
- styles - initial style objects;
- ext - initial expanded rules for style objects;
- params - custom global values for interpolation. Params contains style modes, the mandatory mode is `root`;

This **style config** can be defined in at least two ways:
- it can be passed to the `<style-provider>` definition function;
- it can be specified in a separate script tag text content in the JSON format;

The second option is more flexible as it allows you to collect the config both on the server side and on the client side.

After the first render, styles can be added/changed via the `StyleDispatcher` class or directly via `<style-provider>` methods:

```jsx
import { defineStyleProvider } from "effcss/utils";

const styleDispatcher = new StyleDispatcher(document);

const root = createRoot(document.getElementById('root'));
root.render(<App styleDispatcher={styleDispatcher}/>);
```

## Customization

You can add your own style configs. While you can write arbitrary rules and selectors, the recommended way is to use the **BEM methodology**. Block key for each style config is its key inside `styles` provider settings. A style config is an object like this:

```js
// in style config it is in 'block' field,
// so in BEM selector block will be 'block'
export default {
  // vars
	_: {
    // it will create variable, add key in `k._ar`, add value in `v._.ar`
    // by default variable doesnt inherits and has syntax '"*"'
    ar: {
      // initial value
      ini: 0.5
    },
    back: {
      // creates `oklch()` components variables: l, c, h, a,
      // so there will be 5 vars: --eff-block-backl, --eff-block-backc, ...
    	type: 'c'
    }
  },
  // local keys for interpolation
  k: {
  	ct: 'container-type'
  },
  // local values for interpolation
  v: {
  	h: {
      s: 25,
      m: 50,
      l: 75
    }
  },
  // rules config
  c: {
    // block root selector - [data-block] {...}
  	_: {
        // keys which starts with '$' will be replaced by interpolation;
        // there is no 'bgc' in local keys so it will be used from global dictionary;
        // result will be `background-color: transparent;`
        // you can find global dictionary in `effcss/css/dict`
        $bgc: 'transparent',
      	// variable names starts with '$_'
      	// result will be `--eff-block-ar: 1;`
      	$_ar: 1,
        // special dict keys and with '_'
        // nested selectors except starting with '@' will be prefixed by '&'
        // result will be `[data-`block`] {&:hover {...}}`
        $h_: {
        	border: '2px solid black'
        }
    },
    // block element selector - [data-`block`-e] {...}
  	__e: {
      // values which contains "{" will be replaced by interpolation;
      // there is no 'uni' in local values so it will be used from global dictionary;
      // result will be `width: inherit;`
      // you can find global dictionary in `effcss/css/dict`
    	width: '{uni.inh}',
      // CSS properties must be written with dashes!
      // interpolation from '_.ar' will get CSS variable value
      // result will be `aspect-ratio: var(--eff-block-ar);`
      'aspect-ratio': '{_.ar}'
    },
    // block boolean modifier - [data-block~="sm"] {...}
    _sm_: {
    	...
    },
    // element boolean modifier - [data-block-e~="lg"] {...}
    __e_lg_: {
    	...
    },
    // multiple block modifiers
    // result will be `[data-block~="sz-s"] {...};[data-`block`~="sz-m"] {...};`
    _sz: {
    	s: {
      	$w: '20px'
      },
      m: {
      	$w: '40px'
      }
    },
    // multiple block modifiers from transformed value
    // transformer string always starts with '&'
    // h[s,m] means to get `h` value, filter it with keys [s,m]
    // in the right side {0} - is entry key, {1} - is entry value,
    // other {..} - interpolation keys/values
    // transformed entry splitted by '|', if there is no '|', only value will be evaluated
    // result will be `[data-block~="csz-sh"] {height:25px;}...`
    _csz: '&h[s,m]=>{0}h|{h}:{1}px'
  }
}
```

## Docs

Coming soon
