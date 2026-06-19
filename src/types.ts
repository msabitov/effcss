export const keySymbol = Symbol('effcss-key');
export const indexSymbol = Symbol('effcss-index');

type GetIndex = {[key in typeof indexSymbol]: number;};
type ToPrimitive = {[key in typeof Symbol.toPrimitive]: () => string;};
type DeepPartial<T> = T extends object
    ? {
          [P in keyof T]?: DeepPartial<T[P]>;
      }
    : T;

export type EffCSSStyleSheet = {
    disabled: boolean;
    cssRules: Iterable<{cssText: string}> & {length: number;} & {[index: number]: {cssText: string}};
    insertRule(rule: string, index: number): number;
    deleteRule(index: number): void;
    replaceSync(rules: string): void;
} & Record<typeof keySymbol, string | undefined>;

export type Contract = {
    [key: string]: string | number | boolean | Contract;
};

export type Scope = {
    key: string;
    counters: {
        variables: number;
        keyframes: number;
        layers: number;
        containers: number;
        selectors: number;
    },
    cssText: {
        variables: string;
        keyframes: string;
        layers: string;
        containers: string;
        styles: string;
    }
};

export type Selectors<T> = {
    [K in keyof T]: T[K] extends string | number ? {
        [S in T[K]]: string;
    } : T[K] extends boolean ? {
        [key in `${T[K]}`]: string;
    } : T[K] extends object ? string & Selectors<T[K]> : never;
}

export type Generator<T extends Contract> = (selectors: Selectors<T>) => object;

// selectors

export type ClassName = (rule: object) => string;
export type ClassNamesResolver<T extends Contract> = (params: DeepPartial<T>) => string;
export type ClassNames = <T extends Contract>(generator: Generator<T>) => ClassNamesResolver<T>;

export type Attribute = (rule: object) => object;
export type AttributesResolver<T extends Contract> = (params: DeepPartial<T>) => object;
export type Attributes = <T extends Contract>(generator: Generator<T>) => AttributesResolver<T>;

// custom

export type CustomStyles = (generator: () => object) => (() => null);

// variables
export type VariableDescription = {
    syntax?: string;
    inherits?: boolean;
    initialValue?: string | number | boolean | null;
};
export type VariableConfig = string | number | boolean | VariableDescription;

export type VariableResolver = string & ((fallback?: any) => string) & ToPrimitive & GetIndex;
export type Variable = <T extends VariableConfig>(description?: T) => VariableResolver;

export type VariablesResolvers<T extends Record<string, VariableConfig>> = {
    [key in keyof T]: VariableResolver;
};
export type Variables = <T extends Record<string, VariableConfig>>(description: T) => VariablesResolvers<T>;

// animations
export type AnimationConfig = Record<string, object>;

export type AnimationResolver = string & (() => string) & ToPrimitive;
export type Animation = <T extends Record<string, object>>(description: T) => AnimationResolver;

export type AnimationsResolvers<T extends Record<string, VariableConfig>> = Record<keyof T, AnimationResolver>;
export type Animations = <T extends Record<string, AnimationConfig>>(description: T) => AnimationsResolvers<T>;
// layers
export type LayerResolver = string & (() => string) & ToPrimitive;
export type Layer = () => LayerResolver;

export type Layers = <T extends string>(description: T[]) => Record<NoInfer<T>, LayerResolver>;

// containers
export type ContainerType = '' | 'normal' | 'inline-size' | 'size' | 'anchored' | 'scroll-state' | 'inline-size scroll-state' | 'size scroll-state';
export type ContainerResolver = string & (() => string) & ToPrimitive;
export type Container = (type?: ContainerType) => ContainerResolver;

export type ContainersResolvers<T extends Record<string, ContainerType>> = {
    [key in keyof T]: ContainerResolver;
};
export type Containers= <T extends Record<string, ContainerType>>(description: T) => ContainersResolvers<T>;

export type Update = {
    <T extends string>(
        argument: VariablesResolvers<Record<T, VariableConfig>>, value: {[key in T]?: string | number | boolean | null | undefined}
    ): void
    (argument: VariableResolver, value: string | number | boolean | null | undefined): void;
};
