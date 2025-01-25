// join functions

/**
 * Join args with dash
 * @param args
 */
export const dash = (...args: (string | number)[]) => args.join('-');
/**
 * Join args with space
 * @param args
 */
export const space = (...args: (string | number)[]) => args.join(' ');
/**
 * Join args with comma
 * @param args
 */
export const comma = (...args: (string | number)[]) => args.join(',');
/**
 * Put value in parentheses
 * @param val
 */
export const parentheses = (val: string | number) => `(${val})`;

// basic transformers

/**
 * Transformer
 * @param target
 * @param transform 
 */
export const transformer = <K extends string, T extends (string | number), V extends (string | number)>(
    target: Record<K, T>,
    transform: (val: [string | number, T]) => [string | number, V]
) => Object.fromEntries(Object.entries(target).map((entry) => transform(entry as [string, T]))) as Record<K, V>;
/**
 * Value transformer
 * @param target
 * @param transformVal
 */
export const valTransformer = <K extends string, T extends (string | number), V extends (string | number)>(
    target: Record<K, T>,
    handler: (val: T) => V
) => transformer(target, (entry) => [entry[0], handler(entry[1])]);

// complex values

/**
 * Constructs `attr(val)` expression
 * @param val
 */
export const attr = (val: string | number) => 'attr' + parentheses(val);
/**
 * Constructs `url(val)` expression
 * @param val
 */
export const url = (val: string | number) => 'url' + parentheses(val);

// calc group

/**
 * Add a string inside `calc(val)` expression
 * @param val
 */
export const calcExp = (val: string) => 'calc' + parentheses(val);

// 'at' group

/**
 * Constructs `@keyframes key` expression
 * @param val
 */
export const atKeyframes = (val: string) => space('@keyframes', val);

// grid functions

/**
 * Constructs `fitContent(val)` expression
 * @param val
 */
export const fitContent = (val: string | number) => 'fit-content' + parentheses(val);
/**
 * Constructs `minmax(min, max)` expression
 * @param val
 */
export const minmax = (min: string | number, max: string | number) => 'minmax' + parentheses(comma(min, max));
/**
 * Constructs `repeat(count, tracks)` expression
 * @param val
 */
export const repeat = (count: string | number, tracks: string | number) => 'repeat' + parentheses(comma(count, tracks));

// transform functions

/**
 * Constructs `scale3d(val)` expression
 * @param val
 */
export const scale3d = (val: string | number) => 'scale3d' + parentheses(val);
/**
 * Constructs `scaleX(val)` expression
 * @param val
 */
export const scaleX = (val: string | number) => 'scaleX' + parentheses(val);
/**
 * Constructs `scaleY(val)` expression
 * @param val
 */
export const scaleY = (val: string | number) => 'scaleY' + parentheses(val);
/**
 * Constructs `scaleZ(val)` expression
 * @param val
 */
export const scaleZ = (val: string | number) => 'scaleZ' + parentheses(val);
/**
 * Constructs `scale(val)` expression
 * @param val
 */
export const scale = (val: string | number) => 'scale' + parentheses(val);
/**
 * Constructs `translate3d(x, y, z)` expression
 * @param x
 * @param y
 * @param z
 */
export const translate3d = (x: string | number, y: string | number, z: string | number) =>
    'translate3d' + parentheses(comma(x, y, z));
/**
 * Constructs `translateX(val)` expression
 * @param val
 */
export const translateX = (val: string | number) => 'translateX' + parentheses(val);
/**
 * Constructs `translateY(val)` expression
 * @param val
 */
export const translateY = (val: string | number) => 'translateY' + parentheses(val);
/**
 * Constructs `translateZ(val)` expression
 * @param val
 */
export const translateZ = (val: string | number) => 'translateZ' + parentheses(val);
/**
 * Constructs `translate(x, y)` expression
 * @param x
 * @param y
 */
export const translate = (x: string | number, y: string | number) => 'translate' + parentheses(comma(x, y));
/**
 * Constructs `rotate(val)` expression
 * @param val
 */
export const rotate = (val: string | number) => 'rotate' + parentheses(val);
/**
 * Constructs `rotateX(val)` expression
 * @param val
 */
export const rotateX = (val: string | number) => 'rotateX' + parentheses(val);
/**
 * Constructs `rotateX(val)` expression
 * @param val
 */
export const rotateY = (val: string | number) => 'rotateY' + parentheses(val);
/**
 * Constructs `rotateX(val)` expression
 * @param val
 */
export const rotateZ = (val: string | number) => 'rotateZ' + parentheses(val);
/**
 * Constructs `rotate3d(x, y, z)` expression
 * @param x
 * @param y
 * @param z
 * @param a
 */
export const rotate3d = (x: string | number, y: string | number, z: string | number, a: string | number) =>
    'rotate3d' + parentheses(comma(x, y, z, a));
/**
 * Constructs `skew(x, y)` expression
 * @param x
 * @param y
 */
export const skew = (x: string | number, y: string | number) => 'skew' + parentheses(comma(x, y));
/**
 * Constructs `skewX(val)` expression
 * @param val
 */
export const skewX = (val: string | number) => 'skewX' + parentheses(val);
/**
 * Constructs `skewY(val)` expression
 * @param val
 */
export const skewY = (val: string | number) => 'skewY' + parentheses(val);
/**
 * Constructs `perspective(val)` expression
 * @param val
 */
export const perspective = (val: string | number) => 'perspective' + parentheses(val);

// filter functions

/**
 * Constructs `opacity(val)` expression
 * @param val
 */
export const opacity = (val: string | number) => 'opacity' + parentheses(val);
/**
 * Constructs `blur(val)` expression
 * @param val
 */
export const blur = (val: string | number) => 'blur' + parentheses(val);
/**
 * Constructs `contrast(val)` expression
 * @param val
 */
export const contrast = (val: string | number) => 'contrast' + parentheses(val);
/**
 * Constructs `drop-shadow(val)` expression
 * @param val
 */
export const dropShadow = (val: string | number) => 'drop-shadow' + parentheses(val);
/**
 * Constructs `saturate(val)` expression
 * @param val
 */
export const saturate = (val: string | number) => 'saturate' + parentheses(val);
/**
 * Constructs `invert(val)` expression
 * @param val
 */
export const invert = (val: string | number) => 'invert' + parentheses(val);
/**
 * Constructs `sepia(val)` expression
 * @param val
 */
export const sepia = (val: string | number) => 'sepia' + parentheses(val);
/**
 * Constructs `hue-rotate(val)` expression
 * @param val
 */
export const hueRotate = (val: string | number) => 'hue-rotate' + parentheses(val);
/**
 * Constructs `grayscale(val)` expression
 * @param val
 */
export const grayscale = (val: string | number) => 'grayscale' + parentheses(val);
/**
 * Constructs `blur(val)` expression
 * @param val
 */
export const brightness = (val: string | number) => 'brightness' + parentheses(val);

// color functions
/**
 * Constructs `oklch(from f l c h / alpha)` expression
 * @param params
 */
export const oklchFrom = ({
    f,
    l = 'l',
    c = 'c',
    h = 'h',
    a = 'alpha'
}: {
    f: string;
    l?: string | number;
    c?: string | number;
    h?: string | number;
    a?: string | number;
}) => `oklch(from ${f} ${l} ${c} ${h} / ${a})`;
/**
 * Constructs `light-dark(val)` expression
 * @param val
 */
export const lightDark = (l: string, d: string) => 'light-dark' + parentheses(comma(l, d));
/**
 * Constructs `color-mix(m, c1 p1, c2, p2)` expression
 * @param val
 */
export const colorMix = ({ m, c1, c2, p1, p2 }: { m: string; c1: string; c2: string; p1?: number; p2?: number }) =>
    'color-mix' + parentheses(comma(space('in', m), c1 + (p1 ? ` ${p1}%` : ''), c2 + (p2 ? ` ${p2}%` : '')));
/**
 * Constructs `prefers-color-scheme: key` expression
 * @param params
 */
export const preferColorScheme = (val: string) => {
    return '@media' + parentheses('prefers-color-scheme:' + val);
};

// gradient functions

/**
 * Constructs `linear-gradient(val)` expression
 * @param val
 */
export const linearGradient = (val: string | number) => 'linear-gradient' + parentheses(val);
/**
 * Constructs `radial-gradient(val)` expression
 * @param val
 */
export const radialGradient = (val: string | number) => 'radial-gradient' + parentheses(val);

// pseudo functions

/**
 * Constructs `conic-gradient(val)` expression
 * @param val
 */
export const conicGradient = (val: string | number) => 'conic-gradient' + parentheses(val);
/**
 * Constructs `val:active` expression
 * @param val
 */
export const pseudoActive = (val: string) => val + ':active';
/**
 * Constructs `val:focus` expression
 * @param val
 */
export const pseudoFocus = (val: string) => val + ':focus';
/**
 * Constructs `val:hover` expression
 * @param val
 */
export const pseudoHover = (val: string) => val + ':hover';
/**
 * Constructs `val:visited` expression
 * @param val
 */
export const pseudoVisited = (val: string) => val + ':visited';
/**
 * Constructs `val:link` expression
 * @param val
 */
export const pseudoLink = (val: string) => val + ':link';
/**
 * Constructs `val::before` expression
 * @param val
 */
export const pseudoBefore = (val: string = '') => val + '::before';
/**
 * Constructs `val::after` expression
 * @param val
 */
export const pseudoAfter = (val: string = '') => val + '::after';
/**
 * Constructs `::part(val)` expression
 * @param val
 */
export const pseudoPart = (val: string) => '::part' + parentheses(val);
/**
 * Constructs `::slotted(val)` expression
 * @param val
 */
export const pseudoSlotted = (val: string) => '::slotted' + parentheses(val);
/**
 * Constructs `:has(val)` expression
 * @param val
 */
export const pseudoHas = (val: string) => ':has' + parentheses(val);
/**
 * Constructs `:is(val)` expression
 * @param val
 */
export const pseudoIs = (val: string) => ':is' + parentheses(val);
/**
 * Constructs `:not(val)` expression
 * @param val
 */
export const pseudoNot = (val: string) => ':not' + parentheses(val);
/**
 * Constructs `:nth-child(val)` expression
 * @param val
 */
export const pseudoNthChild = (val: string) => ':nth-child' + parentheses(val);
/**
 * Constructs `:nth-of-type(val)` expression
 * @param val
 */
export const pseudoNthOfType = (val: string) => ':nth-of-type' + parentheses(val);
/**
 * Constructs `:host(val)` expression
 * @param val
 */
export const pseudoHost = (val: string) => ':host' + parentheses(val);
/**
 * Constructs `:state(val)` expression
 * @param val
 */
export const pseudoState = (val: string) => ':state' + parentheses(val);
/**
 * Constructs `:where(val)` expression
 * @param val
 */
export const pseudoWhere = (val: string) => ':where' + parentheses(val);
export const pseudoOddChild = () => pseudoNthChild('odd');
export const pseudoEvenChild = () => pseudoNthChild('even');

// unit transformers

/**
 * Transform object values to `percents`
 * @param params
 */
export const toPercent = <T extends string>(params?: Record<string | number, string | number>) =>
    params && valTransformer(params, (val) => 100 * Number(val) + '%') as Record<T, string>;
/**
 * Transform args to `percent` object
 * @param params
 */
export const argsToPercent = <T extends number>(...args: T[]) =>
    toPercent(Object.fromEntries(args.map((val) => [val, val]))) as Record<T, string>;
/**
 * Transform object values to `rem`s
 * @param params
 */
export const toRem = <T extends string>(params?: Record<string | number, string | number>) =>
    params && valTransformer(params, (val) => val + 'rem') as Record<T, string>;
/**
 * Transform object values to `ms`s
 * @param params
 */
export const toMs = <T extends string>(params?: Record<string | number, string | number>) =>
    params && valTransformer(params, (val) => val + 'ms') as Record<T, string>;
/**
 * Transform object values to `px`s
 * @param params
 */
export const toPx = <T extends string>(params?: Record<string | number, string | number>) =>
    params && valTransformer(params, (val) => val + 'px') as Record<T, string>;
/**
 * Transform object values to `deg`s
 * @param params
 */
export const toDeg = <T extends string | number>(params?: Record<T, string | number>) =>
    params && valTransformer(params, (val) => val + 'deg') as Record<T, string>;

/**
 * Transform object values to `vw`s
 * @param params
 */
export const toVw = <T extends string | number>(params?: Record<T, string | number>) =>
    params && valTransformer(params, (val) => val + 'vw') as Record<T, string>;
/**
 * Transform object values to `vh`s
 * @param params
 */
export const toVh = <T extends string | number>(params?: Record<T, string | number>) =>
    params && valTransformer(params, (val) => val + 'vh') as Record<T, string>;
/**
 * Transform object values to `vmin`s
 * @param params
 */
export const toVmin = <T extends string | number>(params?: Record<T, string | number>) =>
    params && valTransformer(params, (val) => val + 'vmin') as Record<T, string>;
/**
 * Transform object values to `vmax`s
 * @param params
 */
export const toVmax = <T extends string | number>(params?: Record<T, string | number>) =>
    params && valTransformer(params, (val) => val + 'vmax') as Record<T, string>;

/**
 * Transform object values to `cqb`s
 * @param params
 */
export const toCqb = <T extends string | number>(params?: Record<T, string | number>) =>
    params && valTransformer(params, (val) => val + 'cqb') as Record<T, string>;
/**
 * Transform object values to `cqi`s
 * @param params
 */
export const toCqi = <T extends string | number>(params?: Record<T, string | number>) =>
    params && valTransformer(params, (val) => val + 'cqi') as Record<T, string>;
/**
 * Transform object values to `cqw`s
 * @param params
 */
export const toCqw = <T extends string | number>(params?: Record<T, string | number>) =>
    params && valTransformer(params, (val) => val + 'cqw') as Record<T, string>;
/**
 * Transform object values to `cqh`s
 * @param params
 */
export const toCqh = <T extends string | number>(params?: Record<T, string | number>) =>
    params && valTransformer(params, (val) => val + 'cqh') as Record<T, string>;
/**
 * Transform object values to `cqmin`s
 * @param params
 */
export const toCqmin = <T extends string | number>(params?: Record<T, string | number>) =>
    params && valTransformer(params, (val) => val + 'cqmin') as Record<T, string>;
/**
 * Transform object values to `cqmax`s
 * @param params
 */
export const toCqmax = <T extends string | number>(params?: Record<T, string | number>) =>
    params && valTransformer(params, (val) => val + 'cqmax') as Record<T, string>;
/**
 * Transform object values to `span`s
 * @param params
 */
export const toSpan = <T extends string | number>(params?: Record<T, string | number>) =>
    params && valTransformer(params, (val) => 'span ' + val) as Record<T, string>;
/**
 * Transform args to `deg` object
 * @param params
 */
export const argsToDeg = <T extends number>(...args: T[]) =>
    toDeg(Object.fromEntries(args.map((val) => [val, val]))) as Record<T, string>;
