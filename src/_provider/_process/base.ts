type TStrOrNum = string | number;
type TJoinArr = (...val: TStrOrNum[]) => string;

const assign = Object.assign;
const entries = Object.entries;
const isArray = Array.isArray;

const range = (size: number, handler: (k: number) => object): object =>
    Array.from(Array(size).entries()).reduce((acc, [k]) => assign(acc, handler(k + 1)), {});
const each = <V extends Record<string | number, any>>(
    rules: V,
    handler: (
        k: V extends ArrayLike<any> ? string : keyof V,
        v: V extends ArrayLike<any> ? NoInfer<V[number]> : NoInfer<V[keyof V]>
    ) => object
): object => entries(rules).reduce((acc, [k, v]) => assign(acc, handler(k as V extends ArrayLike<any> ? string : keyof V, v)), {} as Record<string, object>);
const when = (condition: boolean | undefined, rules: object, otherwise: object = {}) => (condition ? rules : otherwise);
const merge = (target: Record<string, any>, ...sources: Record<string, any>[]) =>
    !sources.length
        ? target
        : sources.reduce((acc, source) => {
              entries(source).forEach(([k, v]) => {
                  if (v && typeof v === 'object') {
                      if (!acc[k]) acc[k] = v;
                      else if (isArray(acc[k]) && isArray(v)) acc[k] = [...acc[k], ...v];
                      else merge(acc[k], v || {});
                  } else acc[k] = v;
              });
              return acc;
          }, target as Record<string, any>);

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
    merge,
    when
});
