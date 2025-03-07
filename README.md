<p align="center">
  <a href="https://effcss.surge.sh">
    <img alt="effcss" src="/logo.svg" height="256px" />
  </a>
</p>

<h1 align="center">Effcss</h1>

<div align="center">

[![license](https://badgen.net/static/license/Apache%202.0/blue)](https://gitverse.ru/msabitov/effcss/content/master/LICENSE)
[![npm latest package](https://badgen.net/npm/v/effcss)](https://www.npmjs.com/package/effcss)
![minified size](https://flat-badgen.vercel.app/bundlephobia/min/effcss)
![minzipped size](https://flat-badgen.vercel.app/bundlephobia/minzip/effcss)

</div>

Effcss is a self-confident CSS-in-JS library based only on the browser APIs.

## Links

- [Docs (in development)](https://effcss.surge.sh)
- [Repository](https://gitverse.ru/msabitov/effcss)
- [Github mirror](https://github.com/msabitov/effcss)

## Use with

- [React](https://stackblitz.com/edit/vitejs-react-effcss?file=index.html)
- [Svelte](https://stackblitz.com/edit/vitejs-svelte-effcss?file=index.html)
- [Vue](https://stackblitz.com/edit/vitejs-vue-effcss?file=index.html)
- [Preact](https://stackblitz.com/edit/vitejs-preact-effcss?file=index.html)
- [Qwik](https://stackblitz.com/edit/vitejs-qwik-effcss?file=index.html)
- [Solid js](https://stackblitz.com/edit/vitejs-solid-effcss?file=index.html)
- [Lit](https://stackblitz.com/edit/vitejs-lit-effcss?file=index.html)
- [Angular](https://stackblitz.com/edit/angular-effcss?file=src%2Findex.html)
- [HTML only](https://stackblitz.com/edit/static-effcs?file=index.html)

## Some features

- zero-dependency
- framework agnostic
- runtime stylesheets generation
- built-in BEM support
- customizable

## Installation

Type in your terminal:

```sh
# npm
npm i effcss

# pnpm
pnpm add effcss

# yarn
yarn add effcss
```

## Quick start

First you need to connect the `<style-provider>`. One script is all it takes:

```html
  <script src="https://unpkg.com/effcss/dist/build/define-provider.min.js" crossorigin="anonymous"></script>
```

Then you only need to create the necessary styles before rendering. The easiest way to do this is via the `createDispatcher`:

**main.js**

```jsx
import { createDispatcher } from "effcss/utils/browser";

const styleDispatcher = createDispatcher();

const root = createRoot(document.getElementById('root'));
root.render(<App css={styleDispatcher}/>);
```

**App.js**

```jsx
import { useRef } from 'react'

const cardStyle = {
  c: {
    // block
    _: {
      $dis: 'flex',
      $jc: 'center'
    },
    // element
    __logo: {
      $p: '2em'
    },
    // boolean element modifier
    __logo_c_: {
      $c: '#888'
    },
    // element modifier with value
    __logo_sz_lg: {
      $w: '5rem'
    }
  }
};

export const App = (props) => {
  const { css } = props;

  const attrsRef = useRef();
  if (!stylesRef.current) {
    const resolve = css.use(cardStyle);
    attrsRef.current = {
      // just block selector
      block: resolve()(),
      // element with modifiers
      logoMod: resolve('logo')({
        c: '',
        sz: 'lg'
      }),
    };
  }
  const styles = attrsRef.current;

  // apply attributes to appropriate nodes
  return <div {...styles.block}>
    <div {...styles.logoMod}>
      ...
    </div>
  </div>;
}
```

That's all. No plugins are needed.
