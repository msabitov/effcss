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

EffCSS is a self-confident CSS-in-TS library based only on the browser APIs. Use the full power of JS and TS to create styles.

## Some features

-   zero-dependency,
-   framework agnostic,
-   selectors isolation and minification out of the box,
-   TypeScript contract-based autocompletion of stylesheet selectors,
-   compatible with any rendering (CSR, SSR, SSG).

## Links

-   [Docs](https://effnd.tech/css/)
-   [SourceCraft](https://sourcecraft.dev/msabitov/effcss)
-   [GitFlic](https://gitflic.ru/project/msabitov/effcss)
-   [GitVerse](https://gitverse.ru/msabitov/effcss)
-   [GitHub](https://github.com/msabitov/effcss)
-   [GitLab](https://gitlab.com/msabitov/effcss)
-   [NPM](https://www.npmjs.com/package/effcss)

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

## Usage

Just declare stylesheet contract, implement it and apply ready selectors:

**App.tsx**

```tsx
import {
    classNames, attributes,
    variable, variables,
    animation, animations
} from 'effcss';

// 1. declare

/**
 * Components stylesheet
 */
type Components = {
    /**
     * Is rounded
     */
    rounded: true;
    /**
     * Height
     */
    h: 'full' | 'half';
    /**
     * Card
     */
    card: {
        /**
         * Card background
         */
        bg: 'primary' | 'secondary';
        /**
         * Is card disabled
         */
        disabled: boolean;
        
    };
    /**
     * Spinner component
     */
    spinner: {};
};

/**
 * Utils stylesheet
 */
type Utils = {
    /**
     * Width
     */
    w: 's' | 'm' | 'l';
    /**
     * Spacing
     */
    spacing: 0 | 1 | 2;
    /**
     * Blink animation
     */
    blink: true;
};

// 2. implement

// single global variable
const shadowColor = variable('#58666d');

// multiple global variables
const widthVars = variables({
    s: '12px',
    m: '16px',
    l: '20px'
});

// single global animation
const spinAnimation = animation({
    from: {
        transform: 'rotate(0deg)',
    },
    to: {
        transform: 'rotate(360deg)',
    },
});

// creates a stylesheet with attribute selectors
const styleComponents = attributes<Components>((selectors) => {
    const { rounded, card, spinner } = selectors;

    // multiple local variables
    const colors = variables({
        primary: {
            inherits: false,
            initialValue: '#2192a7'
        },
        secondary: {
            inherits: false,
            initialValue: '#425158'
        }
    });
   
    return {
        [rounded.true]: {
            borderRadius: '50%'
        },
        [spinner]: {
            animation: `${spinAnimation} infinite 6s linear`,
        },
        [card]: {
            display: 'flex',
            justifyContent: 'center',
            '&:hover': {
                filter: `drop-shadow(0 0 2em ${shadowColor()})`
            }
        },
        [card.bg.primary]: {
            background: colors.primary()
        },
        [card.bg.secondary]: {
            // with fallback value
            background: colors.secondary('cyan')
        },
        '@media(prefers-color-scheme: dark)': {
            [card + ':hover']: {
                filter: `drop-shadow(0 0 2em #ffffff)`
            }
        },
        // ... and so on
    };
});

// creates a stylesheet with class selectors
const styleUtils = classNames<Utils>((selectors) => {
    const { w, spacing, blink } = selectors;

    // local animations
    const blinkAnimations = animations({
        simple: {
            '50%': {
                visibility: 'hidden'
            }
        },
        smooth: {
            '0%': {
                opacity: 1
            },
            '50%': {
                opacity: 0
            },
            '100%': {
                opacity: 1
            }
        }
    });

    return {
        [blink.true]: {
            animation: `${blinkAnimations.smooth} 2s infinite`
        },
        [w.s]: {
            width: widthVars.s()
        },
        [w.m]: {
            width: widthVars.m()
        },
        [w.l]: {
            width: widthVars.l()
        },
        // ... and so on
    };
});

// 3. apply

// returns an object as it is created using `attributes`
const cardAttrs = styleComponents({
    card: {
        bg: 'primary',
        disabled: true
    }
});

// returns a string as it is created using `classNames`
const utilsCls = styleUtils({
    w: 'm'
})

export const App = () => {
    return <div {...cardAttrs} className={utilsCls}>
        ...
    </div>
};
```

That's all. Enjoy simplicity.
