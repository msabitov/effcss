const objectReduce = <
    T extends object,
    F extends (previousValue: any, currentValue: [string, any], currentIndex: number, array: [string, any][]) => any
>(
    obj: T,
    callback: F,
    acc: any
) => Object.entries(obj).reduce(callback, acc);

const kebabCase = (str: string): string => str.replace(/[A-Z]/g, (v) => '-' + v.toLowerCase());
export const NO_PARSE_SYMBOL: symbol = Symbol('noParse');

/**
 * Stringify maker result
 * @param key - stylesheet key
 * @param value - stylesheet content
 * @param parent - parent rule key
 */
const stringify = (key: string, value: object | string | number | undefined | unknown, parent?: string): string => {
    let resKey = '' + key;
    if (value === null || value === undefined) return '';
    else if (typeof value === 'object' && !value.hasOwnProperty(NO_PARSE_SYMBOL))
        return (
            (!!parent && !parent.startsWith?.('@') && !resKey.startsWith?.('&') && !resKey.startsWith?.('@')
                ? '&'
                : '') +
            resKey +
            `{${objectReduce(value, (acc, item) => acc + stringify(...item, resKey), '')}}`
        );
    else return `${kebabCase(resKey)}:${'' + value};`;
};

export const parseStyles = (styles: object) => objectReduce(styles, (acc, item) => acc + stringify(...item), '');
