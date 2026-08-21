# Changelog

All notable changes to [EffCSS](https://github.com/msabitov/effcss) are documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [5.4.5] - 2026-08-21

### Added
- added hydration tests for stylesheets without meta

### Fixed
- fixed a bug with creating objects using the `attribute` function - previously, selectors used one attribute and erased each other with spreading syntax; now attributes are unique
- reduced duplication of string constants
- minor improvement of types

## [5.4.4] - 2026-08-14

### Fixed
- kebabcase property conversion now uses internal cache to improve performance
- stringification and style parsing now use a pre-allocated array instead of dynamically allocating new ones
- removed incorrect require export from package.json

## [5.4.3] - 2026-08-07

### Fixed
- the hydration now only makes three calls to `querySelectoAll`, reducing the cost of precomputed styles' detection (tests updated)
- server-side stylesheets are not disabled but reused on the client side, eliminating duplicate server work. Therefore, during client-side hydration, only selectors are calculated based on the received metadata

## [5.4.2] - 2026-07-31

### Added
- section about vite-plugin-effcss has been added to the README

### Fixed
- the logic for hydrating user stylesheets has been corrected - now server stylesheet is not replaced by the new constructed one. It should increase styles hydration performance (tests updated)

## [5.4.1] - 2026-07-24

### Added
- utility types exports
- variable tests for short and long syntax forms
- serialization tests for arbitrary stylesheets

### Fixed
- metadata serialization for an arbitrary stylesheet - now it returns an empty string (test added)

### Changed
- usage example in the README

## [5.4.0] - 2026-07-17

### Added
- `subscribe` utility that tracks the EffCSS style creation events (types and tests added)

### Changed
- minor adjustments to coverage settings

## [5.3.1] - 2026-07-10

### Added
- Vitest coverage scripts and deps
- tests for serialization of disabled stylesheets and arbitrary functions

### Changed
- Vitest config now contains `coverage`
- minor edits to README including a link to Coverage Status

## [5.3.0] - 2026-07-03

### Added
- `font` and `fonts` utilities which create CSS @font-face rules (tests added)
- `fontsStylesheet` utility which returns a stylesheet for global fonts
- CONTRIBUTING.md
- CHANGELOG.md
- Product Hunt link added to README

### Fixed
- bug in the `configure` utility - special stylesheets were not taken into account (test added)
- bug with `customStyles` hydration (test updated)

### Changed
- the resolved variable now contains `get` and `set` methods, allowing to get and set the variable's initial value directly (tests added)
- `serialize` and `serializeMeta` can use both stylesheets and stylesheets resolvers (tests updated)

## [5.2.0] - 2026-06-26

### Added
- `lazyClassNames`, `lazyAttributes` and `lazyCustomStyles` utilities added, they create stylesheets only when they are used for the first time (tests added)
- `serializeMeta` utility added, it serializes the metadata of the stylesheets, so that they will not be executed on the client (tests added)
- `Generator` type export
- implemented the ability to define multiple object values ​​in an array for single selector (tests added)

### Fixed
- the hydration of global rules, variables, animations, and layers has been fixed - they will not be recreated if they come from the server (tests added)

## [5.1.0] - 2026-06-20

### Added
- `className` utility which creates an anonymous rule with a class selector within the global scope (with tests)
- `attribute` utility which creates an anonymous rule with an attribute selector within the global scope (with tests)
- `sharedStylesheet` utility which returns a stylesheet of global rules (created using `className` and `attribute`)
- links to examples in README

### Fixed
- typos in README
- automatic insertion of the `&` character to nested selectors (tests updated)

## [5.0.0] - 2026-06-17

### Added
- `classNames` utility which creates a stylesheet and returns a function for deriving classnames
- `attributes` utility which creates stylesheet and returns a function for deriving attributes
- `customStyles` utility which creates stylesheet without derived selectors
- `variable` and `variables` utilities which create CSS @property rules
- `animation` and `animations` utilities which create CSS @keyframes rules
- `layer` and `layers` utilities which create CSS @layer rules
- `container` and `containers` utilities which create CSS @container rules
- `update` utility which refreshes initial value of global variable/variables
- `stylesheet` utility which returns the created stylesheet by resolver
- `configure` utility which configures style generation
- `serialize` utility which converts its argument or all created stylesheets to an HTML string
- `layersStylesheet` utility which returns a stylesheet for global layers
- `variablesStylesheet` utility which returns a stylesheet for global variables
- `animationsStylesheet` utility which returns a stylesheet for global animations

### Changed
- no longer uses web components
- all styles are now generated through utility calls, no providers are needed.
- updated versions of development dependencies

## [4.15.0] - 2026-05-16

### Changed
- the `TStyleSheetMaker` is now generic, it takes the type of public selectors as a parameter (README updated). There is no longer any need to pass the type of public selectors to the `select` utility and to the `dx` and `cx` provider methods if the `TStyleSheetMaker` has specified parameter (tests updated)

## [4.14.0] - 2026-04-12

### Added
- `radius` property added to the Style provider, it allows to set root variable with the same name. Also it is added as attribute both to `<script is="effcss-provider">` and `<effcss-override>` (tests added)
- `radius` function added to the theme utils group (test updated)
- `sans`, `serif` and `mono` properties added to the Style provider, they allows to set root variables for font families. Also they are added as attribute both to `<script is="effcss-provider">` and `<effcss-override>` (tests added)
- `sans`, `serif` and `mono` functions added to the theme utils group (test updated)
- added the ability to pass arrays of values to attributes via the `useStyleProvider` (test added)
- added the ability to change document color scheme property via the `scheme` attribute (test added)

### Fixed
- bug with updating a theme variable containing a primitive value to an object value

### Changed
- TypeScript types and interfaces for Style provider utils and attributes have been updated

## [4.13.0] - 2026-03-11

### Added
- `space` property added to the Style provider, it allows to set theme root variable with the same name Also it is added as attribute both to `<script is="effcss-provider">` and `<effcss-override>` (tests added)
- `space` function added to the `theme` utils group (test updated)
- `tuning` utility added to the `theme` utils group, it allows to use public stylesheet variables which can tune stylesheet rules (tests added)
- `tune` method added to the Style provider, it allows to tune any EffCSS stylesheet via its tuning variables (tests added)

### Changed
- `update` method of theme controller now can apply transformer function as the first argument (test added)
- the global variable prefix is now used as is without a zero index (tests updated)
- README example has been simplified

## [4.12.0] - 2026-02-22

### Added
- `theme` utils group added, it contains base theme variables proxies to access base theme CSS properties via index (test added)

### Changed
- theme property now can use array value. In that case values will be added to CSS variables with different postfix excluding value at zero index (tests added)
- all `effcss-provider` theme attributes now can use several values splitted with `;` character (tests added).
- all `effcss-provider` theme properties setters now can use array values (tests added)
- all `effcss-override` theme attributes now can use several values splitted with `;` character (tests added)
- `themeVar` and all theme variable utilities marked as deprecated, you should use `theme` group utilities instead
- `color.oklch` utility now can use object parameter (test added)
- README updated

## [4.11.0] - 2026-02-08

### Added
- `join` utility added to `dx` and `cx` selector resolvers, it allows to merge objects and strings respectively (tests added)

### Changed
- `mode` provider parameter marked as deprecated, use `dx` and `cx` methods to to explicitly create the necessary selectors
- README updated

## [4.10.0] - 2026-02-01

### Added
- `cx` method added to Style provider, it can resolve classNames directly despite the selectors generation mode (tests added)
- `dx` method added to Style provider, it can resolve data attributes directly despite the selectors generation mode (tests added)
- `TDetails` type exported from `effcss`, it can be usefull to check predefined style variants of specific stylesheet maker using `satisfies` TypeScript  operator

## [4.9.0] - 2026-01-25

### Added
- `scheme` attribute added to `<effcss-override>` component, it changes color-scheme and enables dependent theme vars (tests added)
- `TOverrideAttrs` type added, it describes attributes of `<effcss-override>` component

### Changed
- `bem` maker utility marked as deprecated, you should use `select` utility instead

## [4.8.0] - 2026-01-18

### Added
- `contrast` and `neutral` properties added to the `Style provider`, they allows to set theme root variables with the same name (tests added)
- `contrast` and `neutral` added to the `color` utils group (tests added)

### Changed
-`effcss-override` now can be configured with `Style provider` root variable attributes such as `size`, `color`, `angle`, etc. (tests added)

## [4.7.0] - 2026-01-11

### Added
- `complement` and `grayscale` color utils created (tests added)
- several pseudo utils added (ph, phs, fl, dc, sel)

### Fixed
- bug with `ph` psuedo utility

### Changed
- `pseudo` utils can take an object with styles and wrap it. This makes their use more intuitive (tests added)

## [4.6.2] - 2026-01-04

### Fixed
- bug with transferring aliases of minified selectors from the server (test updated)
- bug with saving the global provider after deleting it from the DOM (test added)

### Fixed
- Patch fixes

## [4.6.1] - 2026-12-27

### Fixed
- bug with incorrect selectors obtained from the `select` utility (tests added)

## [4.6.0] - 2025-12-26

### Added
- coefficient and palette types export added

### Fixed
- default palette values fixed.

### Changed
- `at.property` utility improved - now it can be initialized via default value only (test updated)
- stylesheet types improved - now you can use `select` utility to create scoped selectors with any nesting. To infer them you can use `list` and `obj` resolver methods (tests added, README updated)

## [4.5.1] - 2025-12-19

### Added
- `TMonoBlock` and `TMonoElement` TypeScript generic types

### Changed
- README

## [4.5.0] - 2025-12-13

### Added
- `<effcss-override>` web component added. It allows to override global EffCSS variables for nested scope (tests added)

### Changed
- Stylesheet maker can return string now. It is usefull when you have prepared styles and want to use it as is (test added)

## [4.4.0] - 2025-12-06

### Added
- `easing` attribute added to the provider to define the root CSS easing function
- `easing` utility added - it resolves the root CSS easing function when called without an argument and the `cubic-bezier` function otherwise (tests added)

## [4.3.0] - 2025-11-29

### Added
- `:user-valid` (pseudo.uval) and `:user-invalid` (pseudo.uinv) pseudoclass utils added
- `color` attribute added to the provider to define root color
- `color.root` utility added - it resolves root color with or without modified oklch params (test added)

### Fixed
- bug with an extra parenthesis in the color utils (test updated)

## [4.2.0] - 2025-11-23

### Added
- the `global` parameter has been added to the `useStyleProvider` function, it allows you to use a global style provider. This can be useful for accessing the provider outside of the rendering process, as well as in the absence of context access tools

### Changed
- the CSS property value can now be an array. This will allow you to generate multiple value options in separate rows for properties that have different browser support (test added)

## [4.1.0] - 2025-11-16

### Added
- `$height`, `$block` and `$size` condition makers added to the `at` utility group (tests updated)

## [4.0.1] - 2025-11-09

### Chnaged
- updated links to examples

## [4.0.0] - 2025-11-08

### Added
- the `remake` method, which allows you to replace makers
- `$width` and `$logic` function groups to define conditions for @container and @media rules

### Changed
- now the `useStyleProvider` function is the only way to connect the library
- all the names of the stylesheets are now generated only by the library itself
- theme controller has been added to the Style provider, through which you can add, update, and delete custom themes
- the `prefix` attribute has been renamed to `pre`
- `use` method now can process sequence of makers and returns an array of resolvers
- coefficient ranges are now token sizes starting with `$` ($xxs, ..., $xxl)
- unit utils now base on `calc`

### Removed
- `usePublic` and `usePrivate` methods of Style provider

### Changed
- Complete API redesign — moved from simple `classNames`/`attributes` calls to provider-based architecture
- Selector isolation and minification out of the box
- BEM and Atomic CSS compatible types
- Updated `rollup.config.mjs` for new build pipeline

### Removed
- Old direct stylesheet creation approach (replaced by `useStyleProvider`)

## [3.12.1] - 2025-11-03

### Added
- `Astro` example link added

### Changed
- each stylesheet maker executed on the server will be hydrated on the client without calling (test added)
- `property` utility returns resolver including `fallback` method, that allows to use different fallback values (test improved)

## [3.12.0] - 2025-10-30

### Added
- the `useStyleProvider` function, which allows you to define and create a provider in one step. The function can be called on both the client and the server, and serves as a replacement for the `createConsumer` function (tests added)
- added the ability to send only CSS during static site generation using the `noscript` parameter (tests added)

### Changed
- during server rendering, all stylesheets are now packed in separate `<style>` tags

## [3.11.0] - 2025-10-26

### Added
- `startingStyle` utility added in `at` group (test added)
- `em`, `rad`, `turn` and `s` functions added in `units` group

### Changed
- bug when using named blocks and an empty block together for `Style provider` with `a` mode (tests updated)

## [3.10.1] - 2025-10-25

### Fixed
- bug with empty block selectors for `Style provider` with `c`-mode (test added)

## [3.10.0] - 2025-10-23

### Added
- new examples added to README (Angular, SolidJS, Preact).
- BEM-selectors minification implemented - it can be enabled using `min` attribute of `Style provider` (tests added)

### Changed
- resolved BEM-attributes object now can return attribute value via `$` property (tests added)

## [3.9.0] - 2025-10-19

### Added
- `container` utility added in the `at` group. It allows to use complex @container selectors and will replace `cq` utility in the next major version (test added)

## [3.8.1] - 2025-10-13

### Fixed
- bug with `at.media` utility (test improved)

## [3.8.0] - 2025-10-12

### Added
- `Devtools` section added to README
- overload to the`stylesheets` provider method - it can now accept a set of parameters as on/off methods (test added)
- `media` utility added in the `at` group. It allows to use complex `@media` selectors and will replace `mq` utility in the next major version (test added)

## [3.7.0] - 2025-10-05

### Added
- `scope` utility added in the `at` group. It allows to refine the rule selector and will replace `sc` utility in the next major version (test added)

### Changed
- docs and homepage links

## [3.6.0] - 2025-09-25

### Added
- `property` and `keyframes` utilities added in the `at` group. They allow to create scoped rules and identifiers with more comfort then `kf` and `pr` (tests added)
- `makers` property added to the style provider. It allows to get all processed stylesheet makers (test added)

## [3.5.3] - 2025-09-21

### Added
- tests for different BEM resolver parameters.

### Changed
- BEM attribute resolver improved - now it can be used with single block/element (tests added). When you call the result of  `use` method without arguments, it returns you special `mono resolver` object. This object can specify block (`b`), element (`e`) and modifiers (`m`) separetly and returns new object for each method call. Style attributes can be got via `$` getter

## [3.5.2] - 2025-09-16

### Added
- `TStyleSheetUtils` type added

### Fixed
- bugs in `coef` and `palette` uitility types

## [3.5.1] - 2025-09-15

### Added
- `main` range getter added to the `coef` utility (test added)

### Fixed
- bug with max coef value
- bug with custom coef merging (test added)

## [3.5.0] - 2025-09-14

### Added
- `coef` utility - it allows to use predefined coefficients and its ranges to vary CSS properties (tests added).
- `size` and `angle` utilities, they allow to use scalable size and angle values depending on `rem` and `rangle` global vars. Both `size` and `angle` can be changed dynamically via Style provider setters (tests added)

### Changed
- style provider code was refactored.

## [3.4.0] - 2025-09-10

### Added
- `palette` utility added -  it allows to use wide set of colors with predefined lightness, chroma, hue values and arbitrary alpha value in `oklch` form (tests added)
- `palette`setting added to Style Provider, so it can be customized for using with associated utility (test added)

### Fixed
- bug with updating settings on the server-side

## [3.3.0] - 2025-08-24

### Added
- `size` and `time` style provider attributes added, they control value of global `rem` and `rtime` variables respectively. It allows to control all size and time values and manually replace them at any time (tests added)

### Fixed
- bug with rem global var value (test added)
- bug with vars overriding via `settings` field of Style provider

### Changed
- `use` method improved - now it can replace stylesheet content when called with `force` argument.
- `time` utility improved - now it can be called without argument (`1` used by default).

## [3.2.0] - 2025-08-08

### Added
- `time` utility added, it allows to use scalable time values depending on `rtime` global var, therefore, it becomes similar to using rem (test added)
- `vmin` and `vmax` unit utilities added

## [3.1.0] - 2025-07-21

### Changed
- the provider no longer overwrites document.adoptedStyleSheets property - it will only interact with CSSStyleSheets created through `add` and `pack` methods. All other custom constructed stylesheets will be preserved

## [3.0.4] - 2025-07-14

### Changed
- README
- several types simplified

## [3.0.3] - 2025-07-12

### Changed
- README (V3 examples added, V2 examples removed)
- several pseudo-classes added

## [3.0.2] - 2025-07-05

### Changed
- README (Vue examples added)
- several types simplified.

## [3.0.1] - 2025-06-29

### Fixed
- several typos in IStyleProvider fields description
- the types of handler in the `each`-utility

### Changed
- README (new examples, docs page updated)

## [3.0.0] - 2025-06-27

### Changed
- the new version for stylesheet generation Style maker functions are used
- all utilities and global variables come in the parameters of Style maker functions
- to use styles on both the client and the server, you need to use Style Consumer\
- Style provider extends script HTML element
- simple parameters can be set as attributes of Style provider
- complex parameters can be set inside Style provider script content
- the basic methods of Style provider have retained the previous API

## [2.2.1] - 2025-05-21

### Fixed
- large-scale refactoring - shortened names of private properties and methods, simplified types

## [2.2.0] - 2025-04-27

### Added
- provider params are stored in `window.__EFFCSS_PARAMS__` (test added). This is necessary primarily for debugging
- `getIndex` method added to the Style Manager.
- several global keys

## [2.1.2] - 2025-04-14

### Changed
- the provider's `on` and `off` methods can apply multiple targets and will notify once when called (tests added).

## [2.1.1] - 2025-04-06

### Fixed
- bug with notifier ref destroyed by garbage collector

## [2.1.0] - 2025-04-06

### Added
- `subscribe` and `unsubscribe` methods added to provider - it allows to update styles for subscribed elements
- `eventname` attribute added to provider - it allows to react on styles changes with event listener (test added)

## [2.0.5] - 2025-04-03

### Added
- `alter` method added to provider - it allows to mutate stylesheet config and to replace stylesheet content (test added)
- `replace` method added to manager (test added)
- `mutate` method added to collector (test added)

## [2.0.4] - 2025-03-23

### Added
- configs getter added to provider (test added)
- status method added to provider and manager (test added)

### Changed
- attribute resolver is now generic

## [2.0.3] - 2025-03-16

### Changed
- README

### Fixed
- bug with new sets inside themes (test added)

## [2.0.2] - 2025-03-08

### Added
- Storybook and VItest benchmarking examples links added
- Svelte SSR example link added

## [2.0.1] - 2025-03-08

### Added
- React SSR example link added to README

### Fixed
- bug with light and dark themes in main stylesheet config

### Changed
- the quick start example modified
- global keys test improved

## [2.0.0] - 2025-03-07

### Added
- hydration mode for transferring configs during server rendering
- the ability to redefine global keys and key sets
- more tests

### Changed
- no stylesheet configs inside, just tool.
- the browser utilities are separated from the general ones
- different scripts are responsible for settings and initial styles
- stylesheets are immutable. There is no way to expand them anymore
- he prefix now only affects the names of private stylesheets
- no CSS transformers exported
- some of the provider's utilities and methods have been renamed, and some of the functions are no longer exported

## [1.3.6] - 2025-02-24

### Added
- `themes` option added to `defineStyleProvider` config parameter. It is an analogue of the `params` with a more appropriate name (test added)
- `rootStyle`  option added to `defineStyleProvider` config parameter (test added)
- `keygen` parameter added to `defineStyleProvider`. It allows you to control the creation of stylesheet keys (test added)
- `getBEMResolver` function added to utils
- `generateStyleSheetKey` function added to utils
- `defaultRootStyle` added to constants

### Fixed
- bug with incorrect generation of variables in root theme

## [1.3.5] - 2025-02-20

### Added
- several global keys
- provider tests

### Changed
- `expandSelector` method improved - now it can process block, element and boolean modifier selectors (processor tests added)

## [1.3.4] - 2025-02-16

### Added
- several global keys

### Changed
- README
- manager's `expandRule` method improved - now it supports both nested and plain `exp` parameter (appropriate tests added)


## [1.3.3] - 2025-02-12

### Added
- the ability to specify CSS properties in the lowerCamelCase style in the stylesheet config (test added)
- Style manager tests

### Fixed
- bug with getRulesCount function - now it takes into account nested rule
- bug with style processor expandSelector function (tests added)


## [1.3.2] - 2025-02-08

### Added
- BEM resolver now ignores modifiers with undefined value (also tests added)
- several global keys

### Removed
- redundant convertable utility

## [1.3.1] - 2025-02-03

### Added
- `resolveStyleSheet` method added to style provider
- several global keys added

## Removed
- demo folder

## [1.3.0] - 2025-02-01

### Added
- units field to IStyleConfig. You can now manage the units of measurement for global values
- several media queries and pseudo selectors added to global keys
- computed container queries selectors realized

## [1.2.4] - 2025-01-29

### Added
- banners for minified provider scripts

## [1.2.3] - 2025-01-29

### Added
- README new examples
- IStyleDispatcher interface
- the ability to pass a modifier object to the BEM resolver and get key/value from result object
- new tests to test the changes in paragraph 3

### Changed
- package description changed

## [1.2.2] - 2025-01-26

### Added
- several pseudo-classes to global keys.

### Changed
- README

## [1.2.1] - 2025-01-25

### Fixed
- type imports

### Changed
- types are described in detail
- `createStyleProcessor` and `createStyleManager` functions exported from index

## [1.2.0] - 2025-01-22

### Added
- the ability to change the name of the initializing stylesheet has been implemented
- the ability to connect stylesheets with an auto-generated key has been implemented
- the BEM attribute resolver has been implemented
- the BEM attribute resolver tests

### Changed
- the processor and manager creation functions have been exported

## [1.1.4] - 2025-01-19

### Added
- Several keys and values added to global dictionaries

### Fixed
- typos in global dictionaries
- typos in reset stylesheet

## [1.1.3] - 2025-01-19

### Added
- tests for BEM CSS class generation

### Changed
- README edited

## [1.1.2] - 2025-01-17

### Changed
- homepage url edited
- README edited

## [1.1.1] - 2025-01-15

## Added
- Tests added

### Fixed
- typos in README
- typos in AgentColor config
- unnecessary prefix `&` in first-level selectors inside at-rules
- calculated breakpoint selectors are made explicit
- return type in manager `pack` method
- keyframes names scoped for objects generated via `kf` field
- Keyframes config fixed

### Changed
- Provider script in demo updated

## [1.1.0] - 2025-01-11

### Added
- `registerNode`, `unregisterNode` and `notify` methods of Style Manager
- StackBlitz React demo
- new attribute `isolated` for style provider that allows register document as dependent at component connection

## [1.0.1] - 2025-01-10

### Fixed
- IStyleProvider interface duplication
- provider script connection in demo
- transition property in dict
- package.json corrected
- keyframes config field fixed

## [1.0.0] - 2025-01-09

### Added
- Initial release of EffCSS
- `classNames` utility — creates stylesheets with class selectors
- TypeScript type contracts for stylesheet selectors
- Zero-dependency CSS-in-TS approach
- Basic selector isolation
- Project structure: `src/`, `tests/`, build configuration
- `.gitignore`, `.prettierrc.json`, `tsconfig.json`, `rollup.config.mjs`
- `package.json` with initial dependencies
- README with basic usage examples

---

[5.4.5]: https://github.com/msabitov/effcss
[5.4.4]: https://github.com/msabitov/effcss/commit/a15f952f02d5c972a1a63846eb6fd1ba87f18e7e
[5.4.3]: https://github.com/msabitov/effcss/commit/ea9a1248abf7bb7711cef9379fd51fa1caada3c2
[5.4.2]: https://github.com/msabitov/effcss/commit/3950a03c8577fe87a9c91d2f6f9c1e1ca17a520f
[5.4.1]: https://github.com/msabitov/effcss/commit/8ede6d0d7ab58c8d80a4f6bb375a4147b51e893b
[5.4.0]: https://github.com/msabitov/effcss/commit/1d606649b4c0b32b28810ea9ea6faabbfc6831c0
[5.3.1]: https://github.com/msabitov/effcss/commit/f4d3b36045c1d2f11337c8f5489ce8521ba41dec
[5.3.0]: https://github.com/msabitov/effcss/commit/ea8e29f4a2cfe3d0b9e2a82a49d7c9317df25c5f
[5.2.0]: https://github.com/msabitov/effcss/commit/583f58540b402507a3573de8658cd7b3d6529415
[5.1.0]: https://github.com/msabitov/effcss/commit/7f5f831225fe8b4b5ba5f67c9568f3bd798a1ce8
[5.0.0]: https://github.com/msabitov/effcss/commit/f9892c3a6c7d7026ce42279cad391ee01896ac5e
[4.15.0]: https://github.com/msabitov/effcss/commit/e15bc77ffd43404546d7515fbb31f846addedbb8
[4.14.0]: https://github.com/msabitov/effcss/commit/7afec28327a6915a8ef2032238cc45f3072ed659
[4.13.0]: https://github.com/msabitov/effcss/commit/c0277f951650df099ecdf2e884b589e938cab650
[4.12.0]: https://github.com/msabitov/effcss/commit/9998fad2f5edcea506aee43ad2ea37717b779b7f
[4.11.0]: https://github.com/msabitov/effcss/commit/edcfe00c8a80daf98688ed9e017bcb94612ff4b6
[4.10.0]: https://github.com/msabitov/effcss/commit/7305849b89157ebf5078629adb7b78bca1941027
[4.9.0]: https://github.com/msabitov/effcss/commit/73f4612d180a1b2a409d5c89a6396f51e1e3fb7d
[4.8.0]: https://github.com/msabitov/effcss/commit/54bb0f7baf9e807b3078d6eb2e6f058fe3d0c6f5
[4.7.0]: https://github.com/msabitov/effcss/commit/2a4791b868c821a7b64f1a3927bbae7ff8f0ec10
[4.6.2]: https://github.com/msabitov/effcss/commit/515febc2fd20455f86ef84fdb51126c1c7c3d933
[4.6.1]: https://github.com/msabitov/effcss/commit/743f963ed070985b55f8bcb5e04881e9695b0797
[4.6.0]: https://github.com/msabitov/effcss/commit/916ef79448f53e604521b38d787fcb21604730f1
[4.5.1]: https://github.com/msabitov/effcss/commit/b7d1b0fb2d1599a351df12fb39cca0e441209c62
[4.5.0]: https://github.com/msabitov/effcss/commit/21101bb25e240900e5cb51939121617870974116
[4.4.0]: https://github.com/msabitov/effcss/commit/673316997c100ef395839816cb5fba246bdc3766
[4.3.0]: https://github.com/msabitov/effcss/commit/c9edf85013f06847db367866262bac5ceae817ab
[4.2.0]: https://github.com/msabitov/effcss/commit/b75adc9db163a47b0932071e65c4a00952eb2d08
[4.1.0]: https://github.com/msabitov/effcss/commit/af78d65ce1852417a839150aad6c1ce7858d62ab
[4.0.1]: https://github.com/msabitov/effcss/commit/197702df5cd45072f6f4b50780dd5d538acc2f88
[4.0.0]: https://github.com/msabitov/effcss/commit/281bb25f32a839ed23aadcb03f293d711c377d85
[3.12.1]: https://github.com/msabitov/effcss/commit/68305e2c0f88cec889a22775499b6975ab97e523
[3.12.0]: https://github.com/msabitov/effcss/commit/57d13a972432ab7efa93c7b87c22446a65e4c7b7
[3.11.0]: https://github.com/msabitov/effcss/commit/87a37d2148ca5688f0115b6a512c01dd277faa8d
[3.10.1]: https://github.com/msabitov/effcss/commit/03d4cf18f5ca33f26773bd18ed6e7c275d263a21
[3.10.0]: https://github.com/msabitov/effcss/commit/71ada4d68ce7ec3586e8167bf9c55e93f8080be5
[3.9.0]: https://github.com/msabitov/effcss/commit/33dab7bb7fff8b0b40265b49d7e56c9e3087deb6
[3.8.1]: https://github.com/msabitov/effcss/commit/1ffa09f9bcba24843feca9b93f940170dc224383
[3.8.0]: https://github.com/msabitov/effcss/commit/dc8b1434092929a427f450a8438e503f892aa651
[3.7.0]: https://github.com/msabitov/effcss/commit/6212371e74048f1cb422933a8ef8d0d261a4a7c1
[3.6.0]: https://github.com/msabitov/effcss/commit/0d0b2dbfbad77bc5d6a6829f9628b297de218249
[3.5.3]: https://github.com/msabitov/effcss/commit/398ac9f1e55ccda2a0f7b6c2b704c3a1fbbaa4e7
[3.5.2]: https://github.com/msabitov/effcss/commit/a498b2bcf952e80886803c89d0218a91077fe762
[3.5.1]: https://github.com/msabitov/effcss/commit/2a408cb8981c174c7e59d8b512c7e63d49bbc817
[3.5.0]: https://github.com/msabitov/effcss/commit/dd769c061d423fc593fd3dade5739c542f2c2271
[3.4.0]: https://github.com/msabitov/effcss/commit/6398688ad88d39cae23e695b5c241da2497e86b9
[3.3.0]: https://github.com/msabitov/effcss/commit/9ffda212aec1f5d6918a2a4eb023d95e8262b2c8
[3.2.0]: https://github.com/msabitov/effcss/commit/24725b1453fe02bfcee38bf728ffd257975bbfe3
[3.1.0]: https://github.com/msabitov/effcss/commit/d24ebdd662d254092969c9ab772f0ba42341d485
[3.0.4]: https://github.com/msabitov/effcss/commit/d3ae709a11c34fbd411b424dcf4a3633c3fa78b1
[3.0.3]: https://github.com/msabitov/effcss/commit/2f88fff0650cc1c2cb4c1b602da44d8207d26dd4
[3.0.2]: https://github.com/msabitov/effcss/commit/a2e9bc1214712d5966648d09bad522a77577f797
[3.0.1]: https://github.com/msabitov/effcss/commit/cce547d84d384eb420bb2de50a12eebfb277cdb8
[3.0.0]: https://github.com/msabitov/effcss/commit/c3f70c115ead662957bf18a6b2a817a1e7da0e9e
[2.2.1]: https://github.com/msabitov/effcss/commit/d6028e1e3d005586cd722a79d43245cec7af9505
[2.2.0]: https://github.com/msabitov/effcss/commit/c8b54d4ea425bf9bd1d0fc4b98921b4a18809e94
[2.1.2]: https://github.com/msabitov/effcss/commit/b1fd5940b193e3800ff4bab9dcaaf2448bfe8414
[2.1.1]: https://github.com/msabitov/effcss/commit/5927795d9e392d3474c7a99485c0b4fea4737fad
[2.1.0]: https://github.com/msabitov/effcss/commit/e09e034cceb33b8f835980d979c7ab137d116759
[2.0.5]: https://github.com/msabitov/effcss/commit/c94b75dc0fb805c25d8bb40bf11e48185716ee92
[2.0.4]: https://github.com/msabitov/effcss/commit/cffe124c14901ccef6c260f5ac42776fabac941f
[2.0.3]: https://github.com/msabitov/effcss/commit/2ea0dd2984bfbefc57af8038649f2a30600154dc
[2.0.2]: https://github.com/msabitov/effcss/commit/a694a1a05c3ce94f4ab91548461da2b1efbdd76c
[2.0.1]: https://github.com/msabitov/effcss/commit/dfb85095020eb6e403864f82db2d87a3c03735ee
[2.0.0]: https://github.com/msabitov/effcss/commit/c72dea0b9c9f9943567e8cfb24e7d5bd6fa808d0
[1.3.6]: https://github.com/msabitov/effcss/commit/770e39127d6ec6a40eaa16b9e468566fb193fe96
[1.3.5]: https://github.com/msabitov/effcss/commit/2c354d0a4502e7ec8c89a1cf680075f6694770b7
[1.3.4]: https://github.com/msabitov/effcss/commit/16aba80203c073ef14f311d2842d2dbb8de8d526
[1.3.3]: https://github.com/msabitov/effcss/commit/617241ef993406be701178a9f4b88ac1a7b20f1d
[1.3.2]: https://github.com/msabitov/effcss/commit/0ac1286d9c77526d7997655579b4e6f78327cbd4
[1.3.1]: https://github.com/msabitov/effcss/commit/b939d4a166d748534278281b0283ee001c9fec3c
[1.3.0]: https://github.com/msabitov/effcss/commit/f0f641770b190af2d6c313c1d1a6cc5a250efc49
[1.2.4]: https://github.com/msabitov/effcss/commit/1d628fd9d202c6da9115f1c03acb56e37746329d
[1.2.3]: https://github.com/msabitov/effcss/commit/c7e01f511cffd8b277900e886188d2386737fc77
[1.2.2]: https://github.com/msabitov/effcss/commit/044ced2a3a83c43558190961899b05a7c82bd140
[1.2.1]: https://github.com/msabitov/effcss/commit/2c35ba6f994f34068323573e317d34ebc326d892
[1.2.0]: https://github.com/msabitov/effcss/commit/be73e843ad43e91926ba1a98a911b62a59038fc3
[1.1.4]: https://github.com/msabitov/effcss/commit/1bac2665bf6d6efa0eba8261b4f2b07010a06db7
[1.1.3]: https://github.com/msabitov/effcss/commit/048c1eff2ec5a81ddf83fbfadfa65f3992175b9b
[1.1.2]: https://github.com/msabitov/effcss/commit/f041ac92ecc5e3f01f0069916c2e7ee39203da67
[1.1.1]: https://github.com/msabitov/effcss/commit/1cbffc9175edd2d0f4e083b7b822c0f1963996ec
[1.1.0]: https://github.com/msabitov/effcss/commit/329eedef191e097fadc66f21506978e31a2dfea9
[1.0.1]: https://github.com/msabitov/effcss/commit/84977c9037bdf523ada9a76397e1486e48b2e611
[1.0.0]: https://github.com/msabitov/effcss/commit/d31cdf89c8a429b34020a1093181a0caf8d9f02e