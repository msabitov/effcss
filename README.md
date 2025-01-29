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

- [Docs](https://effcss.surge.sh)
- [Repository](https://gitverse.ru/msabitov/effcss)
- [Github mirror](https://github.com/msabitov/effcss)

## Use in

- [React](https://stackblitz.com/edit/vitejs-react-effcss?file=index.html)
- [Svelte](https://stackblitz.com/edit/vitejs-svelte-effcss?file=index.html)
- [Vue](https://stackblitz.com/edit/vitejs-vue-effcss?file=index.html)
- [Preact](https://stackblitz.com/edit/vitejs-preact-effcss?file=index.html)
- [Qwik](https://stackblitz.com/edit/vitejs-qwik-effcss?file=index.html)
- [Solid js](https://stackblitz.com/edit/vitejs-solid-effcss?file=index.html)
- [static project without framework](https://stackblitz.com/edit/static-effcs?file=index.html)

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

## Concepts

Effcss consists of two parts - **style provider** and **style config**.

**Style provider** is the static part that defines special web component (by default, `<style-provider>`). One script is all it takes:

```html
  <script src="https://unpkg.com/effcss/dist/build/define-provider.min.js" crossorigin="anonymous"></script>
```

**Style config** is the dynamic part that configures the behavior of the web component and defines the initial styles of the page. **Style config** consists of 3 optional fields:
- styles - initial stylesheets configs;
- ext - initial expanded rules for stylesheets;
- params - custom global values for interpolation, separated by display modes, the mandatory mode is `root`;

This **style config** can be defined in at least two ways:
- it can be passed to the `<style-provider>` definition function;
- it can be specified inside a separate script tag  in the JSON forma (more flexible as it allows to collect the config both on the server side and on the client side).

After the first render, styles can be added/changed via the `StyleDispatcher` class or directly via `<style-provider>` methods:

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

For more information, see the [documentation](https://effcss.surge.sh)