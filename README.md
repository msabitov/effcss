<p align="center">
  <a href="https://effnd.tech/css/">
    <img alt="effcss" src="https://effnd.tech/css/logo.svg" height="256px" />
  </a>
</p>

<h1 align="center">EffCSS</h1>

<div align="center">

[![license](https://badgen.net/static/license/Apache%202.0/blue)](https://sourcecraft.dev/msabitov/effcss/browse/LICENSE?rev=master)
[![npm latest package](https://badgen.net/npm/v/effcss)](https://www.npmjs.com/package/effcss)
![minified size](https://badgen.net/bundlephobia/min/effcss)
![minzipped size](https://badgen.net/bundlephobia/minzip/effcss)
![install size](https://badgen.net/packagephobia/install/effcss)

</div>

EffCSS is a self-confident CSS-in-JS library based only on the browser APIs. Use the full power of JS and TS to create styles.

## Some features

-   zero-dependency,
-   framework agnostic,
-   selectors isolation and minification out of the box,
-   flexible stylesheets types that can suggest available selectors (BEM and Atomic CSS compatible),
-   compatible with any rendering (CSR, SSR, SSG).

## Links

-   [Docs](https://effnd.tech/css/)
-   [SourceCraft](https://sourcecraft.dev/msabitov/effcss)
-   [GitFlic](https://gitflic.ru/project/msabitov/effcss)
-   [GitVerse](https://gitverse.ru/msabitov/effcss)
-   [GitHub](https://github.com/msabitov/effcss)
-   [GitLab](https://gitlab.com/msabitov/effcss)
-   [NPM](https://www.npmjs.com/package/effcss)

## Devtools

- [Mozilla Firefox](https://addons.mozilla.org/ru/firefox/addon/effcss-developer-tools/)
- [zip for Chromium based browsers](https://storage.yandexcloud.net/effcss-devtools/chromium-based.zip), that can be installed using [chrome://extensions](https://www.geeksforgeeks.org/installation-guide/how-to-add-extensions-in-google-chrome-browser/)

## Examples

-   [Vanilla TS](https://stackblitz.com/edit/effcss-ts-vitejs?file=src%2Fmain.ts)
-   [React](https://stackblitz.com/edit/effcss-react-vitejs?file=src%2FApp.tsx)
-   [Svelte](https://stackblitz.com/edit/effcss-svelte-vitejs?file=src%2FApp.svelte)
-   [Vue](https://stackblitz.com/edit/effcss-vue-vitejs?file=src%2FApp.vue)
-   [Angular](https://stackblitz.com/edit/effcss-angular-vitejs?file=src%2Fmain.ts)
-   [SolidJS](https://stackblitz.com/edit/effcss-solidjs-vitejs?file=src%2FApp.tsx)
-   [Preact](https://stackblitz.com/edit/effcss-preact-vitejs?file=src%2Fapp.tsx)
-   [Qwik](https://stackblitz.com/edit/effcss-qwik-vitejs?file=src%2Fapp.tsx)
-   [Lit](https://stackblitz.com/edit/effcss-lit-vitejs?file=src%2Fmy-element.ts)
-   [React SSR](https://stackblitz.com/edit/effcss-react-ssr-vitejs?file=src%2FApp.tsx)
-   [Svelte SSR](https://stackblitz.com/edit/effcss-svelte-ssr-vitejs?file=src%2FApp.svelte)
-   [Vue SSR](https://stackblitz.com/edit/effcss-vue-ssr-vitejs?file=src%2FApp.vue)
-   [Astro SSG](https://stackblitz.com/edit/effcss-ts-astro?file=src%2Fpages%2Findex.astro)

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

const consumer = useStyleProvider({
    attrs: {
        min: true // to create minified selectors
    }
});

const root = createRoot(document.getElementById("root"));
root.render(<App css={consumer} />);
```

Each CSS stylesheet corresponds to a single `Stylesheet maker`. `Stylesheet maker` is a JS function that should return object or string with style rules:

**maker.ts**

```ts
import { TStyleSheetMaker } from 'effcss';

// you can describe your styles
// so that other people can use them via TypeScript generics
export type TMyMaker = {
    /**
     * Font-size utility
     */
    fsz: 16 | 20 | 24;
    /**
     * Card scope
     */
    card: {
        /**
         * Card border radius
         */
        rounded: '';
        /**
         * Card height
         */
        h: 'full' | 'half';
        /**
         * Card logo scope
         */
        logo: {
            /**
             * Logo width
             */
            w: 's' | 'l';
        },
        /**
         * Card footer scope
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

const HEIGHT_COEFS = {
    s: 1,
    m: 2,
    l: 4
};

export const myMaker: TStyleSheetMaker = ({
    select, merge,
    pseudo: {h},
    at: { keyframes, property },
    theme: { neutral, size },
    units: { px }
}) = {
    // specify selector variants via generic
    const selector = select<TCardMaker>;
    // create property with unique identifier
    const widthProperty = property({
        ini: px(200),
        inh: false,
        def: px(200) // will be used as fallback value in `var()` expression
    });
    // create keyframes with unique identifier
    const spin = keyframes({
        from: {
            transform: 'rotate(0deg)',
        },
        to: {
            transform: 'rotate(360deg)',
        },
    });
    // deeply merge objects
    const cardLogoStyles = merge({
        width: widthProperty,
        animation: `20s linear infinite ${spin}`,
        ...h({
            filter: "drop-shadow(0 0 2em #61dafbaa)",
        })
    }, {
        border: 'none',
        background: neutral,
        aspectRatio: 1,
        ...h({
            opacity: 0.5
        })
    });
    return {
        ...sizeProperty,
        ...spin,
        [selector('fsz:16')]: { ... },
        [selector('card')]: { ... },
        [selector('card.logo')]: cardLogoStyles,
        [selector('card.logo.w:s')]: {
            ...widthProperty(px(100))
        },
        [selector('card.logo.w:l')]: widthProperty(px(300)),
        [selector('card.rounded:')]: { ... },
        [selector('card.h:full')]: { ... },
        [selector('card.footer')]: { ... },
        [selector('card.footer.visible:')]: { ... },
        ...each(HEIGHT_COEFS, (k, v) => ({
            [selector(`card.footer.sz:${k}`)]: {
                height: size(v)
            }
        }))
    };
};
```

To use `Stylesheet maker` just pass it to `cx` (creates classnames string) or `dx` (creates data attributes object) methods of `Style provider`:

**App.tsx**

```tsx
import { useRef } from 'react';
import { useStyleProvider } from 'effcss';
import type { TMyMaker } from './maker';
import { myMaker } from './maker';

export const App = (props: {
    css: IStyleProvider;
}) => {
    const styleProvider = useStyleProvider();
    const stylesRef = useRef();
    // put it inside ref to avoid recalculations
    if (!stylesRef.current) {
        const [card] = css.use(myStyleSheetMaker);
        // thanks to the TMyMaker type,
        // you don't need to look at the implementation - just create the necessary attributes
        stylesRef.current = {
            // you can apply list of selectors
            card: styleProvider.dx<TMyMaker>('card.rounded:', 'fsz:24'),
            // or you can apply object with selectors
            footer: styleProvider.dx<TMyMaker>({
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
