<p align="center">
  <a href="https://effnd.tech/css/">
    <img alt="effcss" src="https://effnd.tech/css/logo.svg" height="256px" />
  </a>
</p>

<h1 align="center">EffCSS</h1>

<div align="center">

[![license](https://badgen.net/static/license/Apache%202.0/blue)](https://gitverse.ru/msabitov/effcss/content/master/LICENSE)
[![npm latest package](https://badgen.net/npm/v/effcss)](https://www.npmjs.com/package/effcss)
![minified size](https://flat-badgen.vercel.app/bundlephobia/min/effcss)
![minzipped size](https://flat-badgen.vercel.app/bundlephobia/minzip/effcss)

</div>

EffCSS is a self-confident CSS-in-JS library based only on the browser APIs. Use the full power of JS and TS to create styles.

## Some features

-   zero-dependency,
-   framework agnostic,
-   selectors isolation and minification out of the box,
-   BEM based stylesheet types,
-   compatible with any rendering (CSR, SSR, SSG).

## Links

-   [Docs](https://effnd.tech/css/)
-   [Repository](https://gitverse.ru/msabitov/effcss)
-   [Github mirror](https://github.com/msabitov/effcss)

## Devtools

- [Mozilla Firefox](https://addons.mozilla.org/ru/firefox/addon/effcss-developer-tools/)
- [zip for Chromium based browsers](https://storage.yandexcloud.net/effcss-devtools/chromium-based.zip), that can be installed using [chrome://extensions](https://www.geeksforgeeks.org/installation-guide/how-to-add-extensions-in-google-chrome-browser/)

## v3 Examples

Coming soon.

## v3 Examples

-   [Vanilla TS](https://stackblitz.com/edit/effcss-3-ts-vitejs?file=index.html)
-   [React](https://stackblitz.com/edit/effcss-3-react-vitejs?file=index.html)
-   [React SSR](https://stackblitz.com/edit/effcss-3-react-ssr-vitejs?file=index.html)
-   [Svelte](https://stackblitz.com/edit/effcss-3-svelte-vitejs?file=index.html)
-   [Svelte SSR](https://stackblitz.com/edit/effcss-3-svelte-ssr-vitejs?file=index.html)
-   [Vue](https://stackblitz.com/edit/effcss-3-vue-vitejs?file=index.html)
-   [Vue SSR](https://stackblitz.com/edit/effcss-3-vue-ssr-vitejs?file=index.html)
-   [Angular](https://stackblitz.com/edit/effcss-3-angular-vitejs?file=src%2Findex.html)
-   [SolidJS](https://stackblitz.com/edit/effcss-3-solidjs-vitejs?file=index.html)
-   [Preact](https://stackblitz.com/edit/effcss-3-preact-vitejs?file=index.html)
-   [Qwik](https://stackblitz.com/edit/effcss-3-qwik-vitejs?file=index.html)
-   [Lit](https://stackblitz.com/edit/effcss-3-lit-vitejs?file=index.html)
-   [Astro](https://stackblitz.com/edit/effcss-3-ts-astro?file=src%2Fpages%2Findex.astro)

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

Just call `useStyleProvider` in your code:

**main.js**

```jsx
import { useStyleProvider } from "effcss";

const consumer = useStyleProvider();

const root = createRoot(document.getElementById("root"));
root.render(<App css={consumer} />);
```

Each CSS stylesheet corresponds to a single `Stylesheet maker`. `Stylesheet maker` is a JS function that should return object with style rules:

**App.tsx**

```tsx
import { useRef } from 'react';
import { IStyleProvider, TStyleSheetMaker } from 'effcss';

// you can describe your styles using BEM notation
// so that other people can use them via TypeScript generics
export interface TCardMaker {
    /**
     * Card block
     */
    card: {
        /**
         * Card modifiers
         */
        '': {
            /**
             * Card border radius
             */
            rounded: '';
            /**
             * Card height
             */
            h: 'full' | 'half';
        };
        /**
         * Card logo
         */
        logo: {},
        /**
         * Card footer
         */
        footer: {
            /**
             * Footer visibility
             */
            visible: '';
            /**
             * Footer size
             */
            sz: 's' | 'm' | 'l';
        };
    };
}

const myStyleSheetMaker: TStyleSheetMaker = ({ bem, pseudo, at: { keyframes }, merge, palette, coef, size }) = {
    // specify selector variants via generic
    const selector = bem<TCardMaker>;
    // creates unique keyframes identifier
    const spin = keyframes({
        from: {
            transform: 'rotate(0deg)',
        },
        to: {
            transform: 'rotate(360deg)',
        },
    });
    // deeply merges objects
    const cardLogoStyles = merge({
        animation: `20s linear infinite ${spin}`,
        [pseudo.h()]: {
            filter: "drop-shadow(0 0 2em #61dafbaa)",
        }
    }, {
        border: 'none',
        background: palette.pale.xl.alpha(0.8),
        aspectRatio: 1,
        [pseudo.h()]: {
            opacity: 0.5
        }
    });
    return {
        ...spin,
        [selector('card')]: { ... },
        [selector('card.logo')]: cardLogoStyles,
        [selector('card..rounded')]: { ... },
        [selector('card..h.full')]: { ... },
        [selector('card.footer')]: { ... },
        [selector('card.footer.visible')]: { ... },
        ...each(coef.short, (k, v) => ({
            [selector(`card.footer.sz.${k}`)]: {
                height: size(v)
            }
        }))
    };
};

export const App = (props: {
    css: IStyleProvider;
}) => {
    const { css } = props;
    const stylesRef = useRef();
    if (!stylesRef.current) {
        const [card] = css.use(myStyleSheetMaker)<TCardMaker>;
        // thanks to the TCardMaker type,
        // you don't need to look at the implementation - just create the necessary attributes
        stylesRef.current = {
            card: card('card..rounded'),
            // element with modifiers
            footer: card({
                card: {
                    footer: {
                        visible: '',
                        size: 'm'
                    }
                }
            })
        };
    }
    const styles = stylesRef.current;
    // just apply attributes to appropriate elements
    return (
        <div {...styles.card}>
            <div {...styles.footer}>...</div>
        </div>
    );
};
```

That's all. Enjoy simplicity.
