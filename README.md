<p align="center">
  <a href="https://effnd.tech/css/">
    <img alt="effcss" src="https://effnd.tech/css/logo.svg" height="256px" />
  </a>
</p>

<h1 align="center">EffCSS</h1>

<div align="center">

[![license](https://badgen.net/static/license/Apache%202.0/blue)](https://github.com/msabitov/effcss/blob/master/LICENSE)
[![npm latest package](https://badgen.net/npm/v/effcss)](https://www.npmjs.com/package/effcss)
[![Coverage Status](https://coveralls.io/repos/github/msabitov/effcss/badge.svg?branch=master)](https://coveralls.io/github/msabitov/effcss?branch=master)
![npm package minimized gzipped size](https://img.shields.io/bundlejs/size/effcss?cacheSeconds=0)
![install size](https://badgen.net/packagephobia/install/effcss)
![NPM Downloads](https://img.shields.io/npm/dm/effcss)
![GitHub Repo stars](https://img.shields.io/github/stars/msabitov/effcss)

</div>

EffCSS is a self-confident CSS-in-TS library based only on the browser APIs. Use the full power of JS and TS to create styles.

## Some features

- zero-dependency,
- framework agnostic,
- small and tree-shakeable,
- lazy by default,
- native CSS nesting,
- selectors isolation and minification out of the box,
- compatible with any rendering (CSR, SSR, SSG).

## Links

- [Docs](https://effnd.tech/css/)
- [SourceCraft](https://sourcecraft.dev/msabitov/effcss)
- [GitHub](https://github.com/msabitov/effcss)
- [NPM](https://www.npmjs.com/package/effcss)
- [vite-plugin-effcss (v2)](https://www.npmjs.com/package/vite-plugin-effcss) - CSR tool injecting generated CSS into HTML. It allows to eliminate FOUC and speed up the first rendering due to style hydration just like for SSR/SSG.

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

> **Note:** EffCSS is **ESM-only** — it ships a single ES module build and does not provide a CommonJS/`require` entry.

## CSS types & TS autocompletion

By default EffCSS is permissive: styles accept any object. To enable strict CSS-typing (autocompletion + validation of invalid values), define `EffCSS.Properties` once in your project via global namespace augmentation.

For example, you can install [`csstype`](https://www.npmjs.com/package/csstype)

```sh
npm i -D csstype
```

Then combine with EffCSS

```ts
// env.d.ts
import type { Properties as CSSProperties } from 'csstype';

declare global {
    namespace EffCSS {
        interface Properties extends CSSProperties {}
    }
}

export {};
```

Now every style rule gets full TS autocompletion for CSS properties.

## Principles

EffCSS is built on a few simple ideas that stay consistent across every utility:

- **Lazy by default.** Styles are materialized only when a resolver is first used (`resolver()` or `resolver + ''`). If a rule references other tokens, wrap it in a function `() => ({...})` so it stays lazy.
- **Native CSS nesting.** Style objects support nested selectors out of the box — `&` refers to the current selector, so pseudo-classes, attributes, children and combinators are just nested keys.
- **Tree-shakeable.** Each utility is a standalone export; importing only what you need keeps the bundle small.

## Usage

### Selectors

`id` and `className` return a **selector resolver**. Call it to materialize the unique token, or coerce it to a string — both give the same result:

```ts
import { id, className } from 'effcss';

const btn = className({ color: 'white' });
btn(); // 'f_6-0'
'' + btn; // 'f_6-0'

const badge = id({ backgroundColor: 'red' });
badge(); // 'f_5-0'
'' + badge; // 'f_5-0'

// function form when styles reference tokens (see "Lazy styles & tokens")
const size = variable('12px');
const padded = className(() => ({ padding: size() }));
padded(); // 'f_6-1'
```

#### Tailwind-style modifiers

Pass one or more **modifiers** to the selector resolver to create variants of the same base rule. Each variant gets its own token, cached per modifier set. Pseudo-classes are appended to the selector; at-rules (`@media`, `@container`) wrap the rule at a different nesting level:

```ts
const box = className(() => ({ color: 'red' }));

box(); // 'f_6-0' -> `.f_6-0 { color: red; }`
box(':hover'); // 'f_6-1' -> `.f_6-1:hover { color: red; }`
box('@media (max-width: 700px)'); // 'f_6-2' -> `@media (max-width: 700px) { .f_6-2 { ... } }`
box('@media (max-width: 700px)', ':hover'); // 'f_6-3' -> `@media (...) { .f_6-3:hover { ... } }`

// a modifier may contain another token (coerced to its selector)
const list = className(() => ({ ['& > ' + box]: { margin: 0 } }));
```

The same base rule is reused across variants — conditions are applied **where the rule is used**, not baked into its definition. This is the key difference from writing conditions via native CSS nesting, which fixes them within the rule.

### Lazy styles & tokens

If your styles reference other **tokens** (resolvers), wrap them in a function `() => ({...})`. Passing an already-materialized token in a plain object throws a `TypeError` because it breaks lazyness and creates module side-effects:

```ts
const size = variable('12px');

// ❌ throws: rule contains a resolver result
// so it creates module side-effect
className({ padding: size() });

// ✅ lazy: token is resolved only when the rule is used
className(() => ({ padding: size() }));
```

The function form keeps styles lazy — nothing is generated until the resolver is first called or coerced to a string.

This applies to every utility that accepts an object with tokens: `className`, `id`, `style` and `animation`.

### At-rules

**variable** — returns a variable resolver with `var()` and can apply fallback in functional form:

```ts
const accent = variable('#ff0');
'' + accent; // '--f_2-0'
accent(); // 'var(--f_2-0)'
accent('green'); // 'var(--f_2-0, green)'
```

**animation** — returns a keyframes name resolver:

```ts
const spin = animation({ from: { transform: 'rotate(0)' }, to: { transform: 'rotate(360deg)' } });
spin(); // 'f_3-0'
'' + spin; // 'f_3-0'

// function form when keyframes reference EffCSS tokens
const grow = animation(() => ({ from: { height: size() }, to: { height: '100px' } }));
grow(); // 'f_3-1'
```

**container** — returns a container resolver, string coercion gives the `@container` rule, calling gives `name / type`:

```ts
const card = container('inline-size');
'' + card; // '@container f_4-0'
card(); // 'f_4-0 / inline-size'
```

**font** — callable string with the bare family name and optional fallbacks:

```ts
const Inter = font({ src: "url('/inter.woff2')" });
Inter(); // 'f_1-0'
Inter('sans-serif'); // 'f_1-0, sans-serif'
```

**layers** — returns an object of callable strings, one per layer name:

```ts
const myLayers = layers(['reset', 'base']);
myLayers.reset(); // '@layer f_0-0'
'' + myLayers.reset; // '@layer f_0-0'
```

### Complex styles

```ts
import { style, theme } from 'effcss';
```

**style** — returns an empty string resolver that injects arbitrary styles on the first usage:

```ts
const custom = style({ body: { margin: 0 } });
custom(); // ''
'' + custom; // ''

// use function when using tokens inside style
const themed = style(() => ({ body: { color: accent(), ['& > ' + btn]: { marginTop: '1rem' } } }));
themed(); // ''
```

**Native CSS nesting** — any style object supports nested selectors, so you can add pseudo-classes, attributes, children and combinators:

```ts
const card = className({
    padding: '1rem',
    '&:hover': { boxShadow: '0 0 8px' }, // `.f_6-0:hover`
    '&[data-active]': { borderColor: 'blue' }, // `.f_6-0[data-active]`
    '& > .title': { fontWeight: 600 } // `.f_6-0 > .title`
});
```

Nested keys are emitted as-is (native CSS nesting), so `&` refers to the current selector.

Inside **functional forms** you can even pass whole selectors (tokens) as nested keys — they are resolved lazily when the rule is used:

```ts
const card = className(() => ({
    padding: '1rem',
    ['& > ' + btn]: { marginTop: '1rem' } // `& > .f_6-0`
}));
```

**theme** — returns a controller object with `vars`, `list`, `get` and `set`. `options` is required; `initial` is optional (if omitted, no theme is active until `set` is called):

```ts
const myTheme = theme({
    vars: { bg: '#eff' },
    options: { light: { bg: '#eff' }, dark: { bg: '#111' } },
    initial: 'light'
});
myTheme.get(); // 'light'
myTheme.set('dark'); // true
```

### Isolated contexts

`context()` creates an isolated style generation context with its own key, counters and stylesheets. Tokens never collide across contexts:

```ts
import { context, getContexts } from 'effcss';

const ctx = context({ key: 'app' });
const btn = ctx.className({ color: 'white' });
btn(); // 'app_6-0'

ctx.serialize(); // '<style data-effcss-key="app-6" data-effcss-count="1">...</style>'
ctx.clear(); // wipes styles, keeps the context usable
ctx.dispose(); // permanently destroys the context
```

`getContexts()` returns object with all active contexts excluding global one:

```ts
const ctx = context({ key: 'app' });
getContexts(); // { app: ctx }
```

### SSR

```ts
import { className, serialize } from 'effcss';

className({ color: 'white' })();

// render the generated `<style>` tags into HTML string
const html = serialize();
```

### Global config

```ts
import { setConfig, getConfig } from 'effcss';

setConfig({ key: 'app' }); // must be called before the first usage
getConfig(); // { key: 'app' }
```

That's all. Enjoy simplicity.
