const fromEntries = Object.fromEntries;
const entries = Object.entries;

const AFTER = 'after';
const BEFORE = 'before';
const COLON_FIRST = ':first-';
const COLON_LAST = ':last-';
const COLON_ONLY = ':only-';
const CHILD = 'child';
const NTH = ':nth-';
const OF_TYPE = 'of-type';
const NTH_OF_TYPE = NTH + OF_TYPE;
const NTH_CHILD = NTH + CHILD;
const COLON_AFTER = '::' + AFTER;
const COLON_BEFORE = '::' + BEFORE;
const _FOCUS = ':focus';
const VALID = 'valid';
const INVALID = 'in' + VALID;
const USER = ':user-';
const PH = 'placeholder';

const SIMPLE_PSEUDO = {
    // simple

    r: ':root',
    h: ':hover',
    f: _FOCUS,
    fv: _FOCUS + '-visible',
    a: ':active',
    v: ':visited',
    val: ':' + VALID,
    inv: ':' + INVALID,
    uval: USER + VALID,
    uinv: USER + INVALID,
    e: ':empty',
    d: ':disabled',
    rq: ':required',
    o: ':optional',
    m: ':modal',
    l: ':link',
    phs: `:${PH}-shown`,
    ch: ':checked',
    po: ':popover-open',

    // collections

    fc: COLON_FIRST + CHILD,
    lc: COLON_LAST + CHILD,
    oc: COLON_ONLY + CHILD,
    odd: NTH_CHILD + '(odd)',
    even: NTH_CHILD + '(even)',
    ft: COLON_FIRST + OF_TYPE,
    lt: COLON_LAST + OF_TYPE,
    ot: COLON_ONLY + OF_TYPE,

    // pseudoelements

    bef: COLON_BEFORE,
    aft: COLON_AFTER,
    ph: `::${PH}`,
    bd: '::backdrop',
    fl: '::first-line',
    dc: '::details-content',
    sel: '::selection'
};

const COMPLEX_PSEUDO = {
    has: ':has',
    not: ':not',
    is: ':is',
    wh: ':where',
    st: ':state',
    nthc: NTH_CHILD,
    ntho: NTH_OF_TYPE,
    dir: ':dir',
    lang: ':lang'
};

type TSimplePseudo = {
    (val?: string | number): string;
    (val: object): object;
}
type TComplexPseudo = {
    (content: string | number, val?: string | number): string;
    (content: string | number, val: object): object;
}
type TPseudo = {
    /**
     * :root
     */
    r: TSimplePseudo;
    /**
     * :hover
     */
    h: TSimplePseudo;
    /**
     * :focus
     */
    f: TSimplePseudo;
    /**
     * :focus-visible
     */
    fv: TSimplePseudo;
    /**
     * :active
     */
    a: TSimplePseudo;
    /**
     * :visited
     */
    v: TSimplePseudo;
    /**
     * :valid
     */
    val: TSimplePseudo;
    /**
     * :invalid
     */
    inv: TSimplePseudo;
    /**
     * :user-valid
     */
    uval: TSimplePseudo;
    /**
     * :user-invalid
     */
    uinv: TSimplePseudo;
    /**
     * :empty
     */
    e: TSimplePseudo;
    /**
     * :disabled
     */
    d: TSimplePseudo;
    /**
     * :required
     */
    rq: TSimplePseudo;
    /**
     * :optional
     */
    o: TSimplePseudo;
    /**
     * :modal
     */
    m: TSimplePseudo;
    /**
     * :link
     */
    l: TSimplePseudo;
    /**
     * :placeholder-shown
     */
    phs: TSimplePseudo;
    /**
     * :checked
     */
    ch: TSimplePseudo;
    /**
     * :popover-open
     */
    po: TSimplePseudo;

    // collections

    /**
     * :first-child
     */
    fc: TSimplePseudo;
    /**
     * :last-child
     */
    lc: TSimplePseudo;
    /**
     * :obly-child
     */
    oc: TSimplePseudo;
    /**
     * :nth-child(odd)
     */
    odd: TSimplePseudo;
    /**
     * :nth-child(even)
     */
    even: TSimplePseudo;
    /**
     * :first-of-type
     */
    ft: TSimplePseudo;
    /**
     * :last-of-type
     */
    lt: TSimplePseudo;
    /**
     * :only-of-type
     */
    ot: TSimplePseudo;

    // pseudoelements

    /**
     * ::before
     */
    bef: TSimplePseudo;
    /**
     * ::after
     */
    aft: TSimplePseudo;
    /**
     * ::backdrop
     */
    bd: TSimplePseudo;
    /**
     * ::placeholder
     */
    ph: TSimplePseudo;
    /**
     * ::first-line
     */
    fl: TSimplePseudo;
    /**
     * ::details-content
     */
    dc: TSimplePseudo;
    /**
     * ::selection
     */
    sel: TSimplePseudo;

    // complex

    /**
     * :has
     */
    has: TComplexPseudo;
    /**
     * :not
     */
    not: TComplexPseudo;
    /**
     * :is
     */
    is: TComplexPseudo;
    /**
     * :where
     */
    wh: TComplexPseudo;
    /**
     * :state
     */
    st: TComplexPseudo;
    /**
     * :nth-child
     */
    nthc: TComplexPseudo;
    /**
     * :nth-of-type
     */
    ntho: TComplexPseudo;
    /**
     * :dir
     */
    dir: TComplexPseudo;
    /**
     * :lang
     */
    lang: TComplexPseudo;
};

export const resolvePseudo = (): TPseudo =>
    Object.assign(
        fromEntries(
            entries(SIMPLE_PSEUDO).map(([k, v]) => {
                function transform(val: string | object = '') {
                    if (val && typeof val === 'object') return {[v]: val};
                    return val + v;
                }
                transform.toString = () => v;
                return [k, transform];
            })
        ),
        fromEntries(
            entries(COMPLEX_PSEUDO).map(([k, v]) => {
                function transform(content: string | number, val: string | object = '') {
                    const key = v + `(${content})`;
                    if (val && typeof val === 'object') return {[key]: val};
                    return val + key;
                }
                transform.toString = () => v;
                return [k, transform];
            })
        )
    ) as TPseudo;
