import { NO_PARSE_SYMBOL } from './utils';

type TScalableVariable  = (coef?: number | string | object) => string;
type TProxyVariable = {
    [index: number]: TScalableVariable;
};
type TProxyScalableVariable = TProxyVariable  & TScalableVariable;

export const scalableVariable = (
    name: string,
    resolver: (val: string, fallback?: string | number) => string,
    unit: string | object = ''
): TProxyScalableVariable => {
    const configure = (pos: number = 0) => {
        const baseName = resolver(name);
        const indName = pos ? resolver(name + '-' + pos, baseName) : baseName;
        const variable = (coef = 1): string => {
            return `calc(${indName} * ${coef}${unit})`;
        };
        return Object.defineProperties(variable, {
            toString: {
                value: () => `calc(${indName} * 1${unit})`
            },
            [NO_PARSE_SYMBOL]: {
                value: true
            }
        }) as TProxyScalableVariable;
    };

    const handler = {
        get(target: TProxyScalableVariable, pos: string | symbol, receiver: object) {
            if (typeof pos !== 'symbol' && !Number.isNaN(+pos)) return configure(+pos);
            return Reflect.get(target, pos, receiver)
        }
    };

    return new Proxy<TProxyScalableVariable>(configure(), handler);
};

export const simpleVariable = (
    name: string,
    resolver: (val: string, fallback?: string | number) => string
): TProxyVariable => {
    const configure = (pos: number = 0) => {
        const baseName = resolver(name);
        const indName = pos ? resolver(name + '-' + pos, baseName) : baseName;
        return Object.defineProperties({}, {
            toString: {
                value: () => indName
            },
            [NO_PARSE_SYMBOL]: {
                value: true
            }
        }) as TProxyVariable;
    };

    const handler = {
        get(target: TProxyVariable, pos: string | symbol, receiver: object) {
            if (typeof pos !== 'symbol' && !Number.isNaN(+pos)) return configure(+pos);
            return Reflect.get(target, pos, receiver)
        }
    };

    return new Proxy<TProxyVariable>(configure(), handler);
};
