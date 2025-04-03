<p align="center">
  <a href="https://effcss.surge.sh">
    <img alt="effcss" src="https://effcss.surge.sh/logo.svg" height="256px" />
  </a>
</p>

<h1 align="center">EffCSS</h1>

<div align="center">

[![license](https://badgen.net/static/license/Apache%202.0/blue)](https://gitverse.ru/msabitov/effcss/content/master/LICENSE)
[![npm latest package](https://badgen.net/npm/v/effcss)](https://www.npmjs.com/package/effcss)
![minified size](https://flat-badgen.vercel.app/bundlephobia/min/effcss)
![minzipped size](https://flat-badgen.vercel.app/bundlephobia/minzip/effcss)

</div>

EffCSS is a self-confident CSS-in-JS library based only on the browser APIs.

## Some features

- zero-dependency
- framework agnostic
- runtime stylesheets generation
- built-in BEM support
- server-side rendering compatible

## Links

- [Docs](https://effcss.surge.sh)
- [Repository](https://gitverse.ru/msabitov/effcss)
- [Github mirror](https://github.com/msabitov/effcss)

## Use with

- [React](https://stackblitz.com/edit/vitejs-react-effcss?file=index.html)
- [React SSR](https://stackblitz.com/edit/vitejs-react-ssr-effcss?file=index.html)
- [Svelte](https://stackblitz.com/edit/vitejs-svelte-effcss?file=index.html)
- [Svelte SSR](https://stackblitz.com/edit/vitejs-svelte-ssr-effcss?file=index.html)
- [Vue](https://stackblitz.com/edit/vitejs-vue-effcss?file=index.html)
- [Preact](https://stackblitz.com/edit/vitejs-preact-effcss?file=index.html)
- [Qwik](https://stackblitz.com/edit/vitejs-qwik-effcss?file=index.html)
- [Solid js](https://stackblitz.com/edit/vitejs-solid-effcss?file=index.html)
- [Lit](https://stackblitz.com/edit/vitejs-lit-effcss?file=index.html)
- [Angular](https://stackblitz.com/edit/angular-effcss?file=src%2Findex.html)
- [HTML only](https://stackblitz.com/edit/static-effcss?file=index.html)

## Try with

- [Storybook](https://stackblitz.com/edit/storybook-react-effcss?file=src%2Findex.ts)
- [Vitest benchmarking](https://stackblitz.com/edit/vitest-bench-effcss?file=tests%2FPublic.bench.ts)

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

First you need to connect the `<style-provider>`:

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <!--app-head-->
    <script src="https://unpkg.com/effcss/dist/build/define-provider.min.js" crossorigin="anonymous"></script>
  </head>
  <body>
    <style-provider>
      <div id="root"></div>
    </style-provider>
    <!--app-body-->
  </body>
</html>
```

Then you only need to create the necessary styles before rendering. The easiest way to do this is via the `Style Dispatcher`:

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
      display: 'flex',
      justifyContent: 'center'
    },
    // element
    __logo: {
      padding: '2em'
    },
    // boolean element modifier
    __logo_c_: {
      color: '#888',
      ':hover': {
        color: 'black',
      }
    },
    // element modifier with value
    __logo_sz_lg: {
      width: '5rem'
    },
    // ordinary CSS
    '.square': {
      aspectRatio: 1,
      ':focus': {
        aspectRatio: '1/2'
      }
    },
    body: {
      boxSizing: 'border-box'
    }
  }
};

export const App = (props) => {
  const { css } = props;

  const stylesRef = useRef();
  if (!stylesRef.current) {
    const cardCSS = css.use(cardStyle);
    stylesRef.current = {
      // just block selector
      block: cardCSS()(),
      // element with modifiers
      logoMod: cardCSS('logo')({
        c: '',
        sz: 'lg'
      }),
    };
  }
  const styles = stylesRef.current;

  // apply attributes to appropriate nodes
  return <div {...styles.block}>
    <div {...styles.logoMod}>
      ...
    </div>
  </div>;
}
```

That's all. Enjoy simplicity.
