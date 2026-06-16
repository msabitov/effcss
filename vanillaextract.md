# Vanilla Extract CSS — Полный анализ

## Что это такое

**Vanilla Extract** — это zero-runtime CSS-in-JS (точнее, CSS-in-TS) библиотека, которая компилирует стили, написанные на TypeScript, в статические CSS-файлы на этапе сборки. Никакого рантайма в браузере — только готовый CSS.

Файлы стилей имеют расширение `.css.ts` и обрабатываются плагинами для Vite, Webpack, esbuild, Rollup, Next.js, Parcel, Remix, Astro.

---

## Особенности API

### 1. `style()` — базовый строительный блок

```ts
import { style } from '@vanilla-extract/css';

export const button = style({
  backgroundColor: 'blue',
  padding: '8px 16px',
  selectors: {
    '&:hover': { opacity: 0.9 },
    '&:disabled': { opacity: 0.5 }
  },
  '@media': {
    'screen and (min-width: 768px)': {
      padding: '16px 24px'
    }
  }
});
```

На выходе — уникальный хэшированный класс. Поддерживаются все CSS-свойства, псевдоклассы, медиа-, контейнерные и feature-запросы.

### 2. `styleVariants()` — коллекции вариантов

```ts
export const size = styleVariants({
  small: { padding: '4px 8px', fontSize: '12px' },
  medium: { padding: '8px 16px', fontSize: '14px' },
  large: { padding: '12px 24px', fontSize: '18px' }
});
// Использование: className={size[props.size]}
```

Генерирует объект с именованными классами — никаких switch/case или условных конструкций.

### 3. `createVar()` — CSS-переменные с типизацией

```ts
const shadowColor = createVar();

export const shadow = style({
  boxShadow: `0 0 10px ${shadowColor}`,
  selectors: {
    '.light &': { vars: { [shadowColor]: 'black' } },
    '.dark &':  { vars: { [shadowColor]: 'white' } }
  }
});
```

Позволяет объявлять локальные CSS-кастомные свойства и переопределять их через селекторы — без глобального загрязнения.

### 4. `createTheme()` / `createThemeContract()` — темизация

```ts
// Контракт — структура токенов
export const [themeClass, vars] = createTheme({
  color: { primary: 'blue', secondary: 'gray' },
  space: { small: '4px', medium: '8px' }
});

// Использование
export const hero = style({
  backgroundColor: vars.color.primary,
  padding: vars.space.medium
});
```

`createTheme` генерирует CSS-переменные и класс-неймспейс. Можно создать несколько тем (light/dark) на одном контракте. TypeScript выдаст ошибку, если обратиться к несуществующему токену.

### 5. `globalStyle()` — глобальные стили

```ts
import { globalStyle } from '@vanilla-extract/css';

globalStyle('html, body', {
  margin: 0,
  padding: 0,
  fontFamily: 'sans-serif'
});
```

### 6. `keyframes()` / `fontFace()` / `createContainer()` / `layer()`

Полный набор для анимаций, шрифтов, container queries и каскадных слоёв (`@layer`).

### 7. Экосистемные пакеты

| Пакет | Назначение |
|---|---|
| `@vanilla-extract/sprinkles` | Atomic CSS-генератор (аналог Tailwind, но типизированный) |
| `@vanilla-extract/recipes` | Вариантные стили с runtime-логикой (аналог `cva`) |
| `@vanilla-extract/dynamic` | Динамическое переопределение переменных в рантайме |
| `@vanilla-extract/css-utils` | Утилиты для работы с CSS |

---

## Плюсы

### ✅ Zero runtime — 0 КБ JS-оверхеда
Стили компилируются в `.css`-файлы. В браузер не попадает ни строчки JavaScript для CSS-движка. Это напрямую влияет на FCP, LCP, CLS и размер бандла.

### ✅ Полная типобезопасность
TypeScript проверяет имена токенов, значения свойств, структуру темы. Ошибка в `vars.color.primry` — ошибка компиляции, не баг в продакшене.

### ✅ Предсказуемый SSR
Стили — это статические CSS-файлы. Они корректно работают с React Server Components, Next.js App Router, Remix, Astro без дополнительных настроек. Никаких FOUC, никаких `ServerStyleSheet`.

### ✅ Изоляция стилей (как CSS Modules)
Каждый класс получает уникальный хэш. Конфликты имён исключены.

### ✅ Вся мощь CSS + JS
Можно использовать JS-логику внутри `.css.ts`:
```ts
export const responsive = style({
  padding: someCondition ? '16px' : '8px'
});
```
При этом на выходе — статический CSS, условная логика выполнилась на этапе сборки.

### ✅ Гибкая темизация
Контракты тем гарантируют, что все темы имеют одинаковую структуру. Переключение темы — смена CSS-класса на корневом элементе.

### ✅ Фреймворк-агностичность
Официальные плагины под все популярные сборщики. Не привязан к React — работает с любым фреймворком.

### ✅ Расширяемость
Sprinkles, Recipes, Dessert Box — надстройки, которые решают конкретные задачи (atomic CSS, variant props, composition).

---

## Минусы

### ❌ Нет динамических стилей на основе пропсов
В отличие от styled-components или Emotion, нельзя написать:
```ts
style({ color: props => props.isActive ? 'blue' : 'gray' })
```
Любая динамика требует либо CSS-переменных (через `createVar`), либо переключения классов (через `styleVariants`), либо использования `@vanilla-extract/dynamic`. Это накладывает архитектурные ограничения.

### ❌ Порог входа для простых задач
Для маленького проекта или прототипа настройка плагина сборки, создание `.css.ts`-файлов, контрактов тем — избыточно. Tailwind или CSS Modules дадут результат быстрее.

### ❌ Нет PostCSS-миксинов
Если вы привыкли к `postcss-preset-env`, `autoprefixer` или кастомным PostCSS-плагинам — их придётся настраивать отдельно. Vanilla Extract не заменяет PostCSS, а работает параллельно.

### ❌ Усложнённая отладка в DevTools
Хэшированные классы (`.Button_primary__xY2z9`) менее читаемы, чем BEM-имена. Частично решается настройкой `process.env.NODE_ENV` для человекочитаемых имён в dev-режиме.

### ❌ Зависимость от системы сборки
Без плагина (Vite/Webpack/esbuild) библиотека не работает. Это не «просто подключил скрипт». Для каждого сборщика — своя конфигурация.

### ❌ Сложность с динамическими темами
Если тема формируется на лету (пользовательский кастомный цвет), `createTheme` не подходит — он работает на этапе сборки. Приходится использовать `@vanilla-extract/dynamic` и CSS-переменные в рантайме, что нивелирует часть преимуществ zero-runtime.

### ❌ Размер экосистемы
Сообщество меньше, чем у Emotion или styled-components. Меньше готовых решений, статей, ответов на Stack Overflow.

---

## Итоговое резюме

**Когда выбирать Vanilla Extract:**
- Крупные проекты с дизайн-системой и строгими токенами
- Высокие требования к производительности (FCP, LCP, CLS)
- Использование React Server Components / SSR-фреймворков
- Желание получить типобезопасность стилей на уровне компилятора
- Многотемные приложения (light/dark/custom)

**Когда НЕ стоит:**
- Прототип или MVP на пару недель
- Проект, где стили сильно зависят от динамических пропсов
- Команда не готова к дополнительной конфигурации сборки
- Нужна максимальная скорость разработки «из коробки» (тут Tailwind выигрывает)

Vanilla Extract — это эволюция CSS Modules в сторону TypeScript, а не замена runtime CSS-in-JS. Он закрывает нишу «типизированный, производительный, предсказуемый CSS для серьёзных проектов».