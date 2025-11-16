type TStrOrNum = string | number;
type TJoinArr = (...val: TStrOrNum[]) => string;

const assign = Object.assign;
const entries = Object.entries;
const isArray = Array.isArray;
const isObject = (val: any) => typeof val === 'object';
export const range = (size: number, handler: (k: number) => object): object =>
    Array.from(Array(size).entries()).reduce((acc, [k]) => assign(acc, handler(k + 1)), {});
export const each = <V extends Record<TStrOrNum, any>>(
    rules: V,
    handler: (
        k: V extends ArrayLike<any> ? string : keyof V,
        v: V extends ArrayLike<any> ? NoInfer<V[number]> : NoInfer<V[keyof V]>
    ) => object
): object => entries(rules).reduce((acc, [k, v]) => assign(acc, handler(k as V extends ArrayLike<any> ? string : keyof V, v)), {} as Record<string, object>);
export const when = (condition: number | boolean | undefined | null, rules: object, otherwise: object = {}) => (condition ? rules : otherwise);
export const dash: TJoinArr = (...params) => params.join('-');
export const comma: TJoinArr = (...params) => params.join();
export const space: TJoinArr = (...params) => params.join(' ');

export const merge = (target: Record<string, any>, ...sources: any[]) =>
    !sources.length
        ? target
        : sources.reduce((acc, source) => {
              if (source && acc && isObject(source)) entries(source).forEach(([k, v]) => {
                  if (v && isObject(v)) {
                      if (!acc[k]) acc[k] = v;
                      else if (isArray(acc[k]) && isArray(v)) acc[k] = [...acc[k], ...v];
                      else merge(acc[k], v || {});
                  } else acc[k] = v;
              });
              return acc;
          }, target as Record<string, any>);
