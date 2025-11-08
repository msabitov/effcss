import { TScope } from './scope';
import {
    merge,
} from './utils';

type TThemeParams<T extends object> = Partial<T> & {
    $light?: Partial<T>;
    $dark?: Partial<T>;
};
type TThemeAction = {
    type: 'delete';
    payload: {name: string};
} | {
    type: 'update';
    payload: {params: object, name?: string}
} | {
    type: 'add';
    payload: {params: object, name: string}
};

export type TThemeValue = {
    [key in (string | number)]: string | number | boolean | TThemeValue;
};
export type TThemeController = {
    get(name?: string): TThemeValue;
    add(params: TThemeValue, name: string): void;
    delete(name: string): void;
    update(params: TThemeValue, name?: string): void;
    switch(name?: string): void;
    vars<T extends object = object>(theme?: string): TThemeParams<T>;
    get list(): string[];
    get current(): string | '';
    get all(): Record<string, object>;
    get actions(): TThemeAction[];
}

const assign = Object.assign;
const entries = Object.entries;

const THEME_ATTR = 'theme';
const BASE_HUE = 184;
const computeHue = (val: number) => Number((0.1 * BASE_HUE + 0.9 * val).toFixed(2));
const DEFAULT_THEME = {
    time: 200,
    size: 16,
    angle: 30,
    coef: {
        0: 0,
        1: 0.0625,
        2: 0.125,
        3: 0.25,
        4: 0.5,
        5: 0.75,
        6: 0.875,
        7: 0.9375,
        8: 1,
        9: 1.0625,
        10: 1.125,
        11: 1.25,
        12: 1.5,
        13: 1.75,
        14: 1.875,
        15: 1.9375,
        16: 2,
        17: 2.5,
        18: 4,
        19: 5,
        20: 7.5,
        21: 10,
        22: 12,
        23: 15,
        24: 16,
        25: 20,
        26: 28,
        27: 36,
        28: 48,
        29: 64,
        30: 80,
        31: 120,
        32: 150
    },
    hue: {
        pri: BASE_HUE,
        sec: 290,
        suc: computeHue(142),
        inf: computeHue(264),
        war: computeHue(109),
        dan: computeHue(29)
    },
    $light: {
        lightness: {
            bg: {
                xl: 0.98,
                l: 0.93,
                m: 0.88,
                s: 0.83,
                xs: 0.78
            },
            fg: {
                xl: 0,
                l: 0.12,
                m: 0.24,
                s: 0.36,
                xs: 0.48
            }
        },
        chroma: {
            bg: {
                gray: 0,
                pale: 0.01,
                base: 0.04,
                rich: 0.7
            },
            fg: {
                gray: 0,
                pale: 0.07,
                base: 0.11,
                rich: 0.15
            }
        }
    },
    $dark: {
        lightness: {
            bg: {
                xl: 0.24,
                l: 0.3,
                m: 0.36,
                s: 0.42,
                xs: 0.48
            },
            fg: {
                xl: 0.98,
                l: 0.93,
                m: 0.86,
                s: 0.79,
                xs: 0.72
            }
        },
        chroma: {
            bg: {
                pale: 0.02,
                base: 0.06,
                rich: 0.1
            },
            fg: {
                pale: 0.06,
                base: 0.10,
                rich: 0.14
            }
        }
    }
};

export const createThemeController = ({
    provider,
    init,
    scope,
    onChange
}: {
    provider: {
        getAttribute(name: string): string | null;
        removeAttribute(name: string): void;
        setAttribute(name: string, value: string): void
    },
    init?: TThemeAction[],
    onChange: () => void;
    scope: TScope;
}): TThemeController => {
    const themes: Record<string, object> = {
        '': DEFAULT_THEME
    };
    const actions: TThemeAction[] = [];
    const getThemeVars = <T extends object>({$light = {}, $dark = {}, ...rest}: TThemeParams<T>): TThemeValue => {
        function parseParams(params: object, parents: string[] = []): Record<string, string | number | boolean> {
            return entries(params).reduce((acc, [key, val]) => {
                if (val && typeof val === 'object') return assign(acc, parseParams(val, [...parents, key]));
                else {
                    acc[scope.varName([...parents, key])] = val;
                    return acc;
                }
            }, {} as Record<string, string | number | boolean>);
        }
        return {
            ...parseParams(rest),
            $light: parseParams($light),
            $dark: parseParams($dark)
        };
    };
    const ctx = {
        get(name: string = '') {
            return themes[name] as TThemeValue;
        },
        add(params: object, name: string) {
            if (!themes[name]) {
                themes[name] = merge({$light: {}, $dark: {}}, params);
                actions.push({type: 'add', payload: {params, name} });
                onChange?.();
            }
        },
        delete(name: string) {
            if (!themes[name] || name === '') return;
            if (this.current === name) this.switch();
            delete themes[name];
            actions.push({type: 'delete', payload: {name}});
            onChange?.();
        },
        update(params: object, name: string = '') {
            if (themes[name]) {
                themes[name] = merge({$light: {}, $dark: {}}, themes[name], params);
                actions.push({type: 'update', payload: {params, name} });
                onChange?.();
            }
        },
        switch(name: string = '') {
            if (themes[name]) provider.setAttribute(THEME_ATTR, name);
        },
        vars<T extends TThemeValue>(theme: string = ''): TThemeParams<T> {
            const params = this.get(theme);
            return params ? getThemeVars<T>(params as TThemeParams<T>) as TThemeParams<T> : {$light: {}, $dark: {}} as TThemeParams<T>;
        },
        get list() {
            const {'': def, ...rest} = themes;
            return Object.keys(rest);
        },
        get current() {
            return provider.getAttribute(THEME_ATTR) || '';
        },
        get all() {
            return themes;
        },
        get actions() {
            return actions;
        }
    };
    init?.forEach(({type, payload}) => {
        switch(type) {
            case 'add':
                ctx.add(payload.params, payload.name);
                break;
            case 'delete':
                ctx.delete(payload.name);
                break;
            case 'update':
                ctx.update(payload.params, payload.name);
                break;
        }
    });
    return ctx as TThemeController;
};
