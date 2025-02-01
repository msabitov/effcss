<p align="center">
  <a href="https://effcss.surge.sh">
    <img alt="effcss" src="https://effcss.surge.sh/logo.svg" height="72px" />
  </a>
</p>

<h1 align="center">Effcss</h1>

<div align="center">

[![license](https://badgen.net/static/license/Apache%202.0/blue)](https://gitverse.ru/msabitov/effcss/content/master/LICENSE)
[![npm latest package](https://badgen.net/npm/v/effcss)](https://www.npmjs.com/package/effcss)

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
- [html only](https://stackblitz.com/edit/static-effcs?file=index.html)

## Some features

- zero-dependency
- framework agnostic
- runtime stylesheets generation
- built-in BEM support
- customizable
- support style switching

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

Then you only need to create the necessary styles before rendering. The easiest way to do this is via the `StyleDispatcher`:

**main.js**

```jsx
import { StyleDispatcher } from "effcss/utils";

const styleDispatcher = new StyleDispatcher(document);

const root = createRoot(document.getElementById('root'));
root.render(<App styleDispatcher={styleDispatcher}/>);
```

**App.js**

```jsx
import { useRef } from 'react'

const cardStyle = {
  c: {
    _: {
      $dis: 'flex',
      $jc: 'center'
    },
    __logo: {
      $p: '2em'
    },
    __logo_c_: {
      $c: '#888'
    }
  }
};

export const App = (props) => {
  const { styleDispatcher } = props;

  const stylesRef = useRef();
  if (!stylesRef.current) {
    const bem = styleContext.use(cardStyle);
    stylesRef.current = {
      // just block selector
      block: bem()(),
      // element selector
      logo: bem('logo')(),
      // element with modifiers
      logoC: bem('logo')('c'),
    };
  }
  const styles = stylesRef.current;

  // apply attributes to appropriate nodes
  return <div {...styles.block}>
    <div {...styles.logo}>
      ...
    </div>
  </div>

}
```

That's all. No preprocessors or plugins
