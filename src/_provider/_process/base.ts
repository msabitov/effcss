type TStrOrNum = string | number;
type TJoinArr = (...val: TStrOrNum[]) => string;

const assign = Object.assign;
const entries = Object.entries;

const range = (size: number, handler: (k: number) => object): object =>
    Array.from(Array(size).entries()).reduce((acc, [k]) => assign(acc, handler(k + 1)), {});
const each = <V extends Record<TStrOrNum, any>>(
    rules: V,
    handler: (
        k: V extends ArrayLike<any> ? string : keyof V,
        v: V extends ArrayLike<any> ? NoInfer<V[number]> : NoInfer<V[keyof V]>
    ) => object
): object => entries(rules).reduce((acc, [k, v]) => assign(acc, handler(k as V extends ArrayLike<any> ? string : keyof V, v)), {} as Record<string, object>);
const when = (condition: boolean | undefined, rules: object, otherwise: object = {}) => (condition ? rules : otherwise);
const dash: TJoinArr = (...params) => params.join('-');
const comma: TJoinArr = (...params) => params.join();
const space: TJoinArr = (...params) => params.join(' ');

export const getBaseHandlers = () => ({
    // primitive handlers
    dash,
    comma,
    space,
    // object handlers
    range,
    each,
    when
});
