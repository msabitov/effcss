import {
    keySymbol,
    indexSymbol,
    dictSymbol
} from './constants';

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
} & Partial<Record<typeof keySymbol, string> & Record<typeof dictSymbol, Record<string, string>>>;

export type Contract = {
    [key: string]: string | number | boolean | Contract;
};

export type Scope = {
    key: string;
    // counters
    c: {
        // variables
        v: number;
        // animations
        a: number;
        // layers
        l: number;
        // fonts
        f: number;
        // layersDeclarations
        ld: number;
        // containers
        c: number;
        // selectors
        s: number;
    },
    // cssText
    t: {
        // variables
        v: string;
        // animations
        a: string;
        // layers
        l: string;
        // fonts
        f: string;
        // containers
        c: string;
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

export type VariableResolver = string & ((fallback?: any) => string) & ToPrimitive & GetIndex & {
    set(nextValue: any): void;
    get(): string;
};
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
export type LayersResolvers<T extends string> = Record<NoInfer<T>, LayerResolver>;
export type Layers = <T extends string>(description: T[]) => LayersResolvers<T>;

// containers
export type ContainerType = '' | 'normal' | 'inline-size' | 'size' | 'anchored' | 'scroll-state' | 'inline-size scroll-state' | 'size scroll-state';
export type ContainerResolver = string & (() => string) & ToPrimitive;
export type Container = (type?: ContainerType) => ContainerResolver;

export type ContainersResolvers<T extends Record<string, ContainerType>> = {
    [key in keyof T]: ContainerResolver;
};
export type Containers= <T extends Record<string, ContainerType>>(description: T) => ContainersResolvers<T>;

// fonts
export type FontGenericName = 'serif' | 'sans-serif' | 'monospace' | 'cursive' | 'fantasy' | 'system-ui' | 'ui-serif' | 'ui-sans-serif' | 'ui-monospace' | 'ui-rounded' | 'math' | 'fangsong';
export type FontConfig = {
    /**
     * References to font resources
     */
    src: string;
    /**
     * Generic font family fallback
     */
    genericName?: FontGenericName;
    /**
     * Font-display
     */
    display?: string;
    /**
     * Font-stretch 
     */
    stretch?: string;
    /**
     * Font-style
     */
    style?: string;
    /**
     * Font-weight
     */
    weight?: string | number;
    /**
     * Font-variant 
     */
    variant?: string;
    /**
     * Font-feature-settings
     */
    featureSettings?: string;
    /**
     * Font-variation-settings
     */
    variationSettings?: string;
    /**
     * Unicode-range
     */
    unicodeRange?: string;
    /**
     * Size-adjust
     */
    sizeAdjust?: string;
};
export type FontResolver = string & ((...fallbacks: any[]) => string) & ToPrimitive;
export type Font = (descriptors: FontConfig) => FontResolver;
export type FontsResolvers<T extends Record<string, FontConfig>> = Record<keyof T, FontResolver>;
export type Fonts = <T extends Record<string, FontConfig>>(description: T) => FontsResolvers<T>;

export type Update = {
    <T extends string>(
        argument: VariablesResolvers<Record<T, VariableConfig>>, value: {[key in T]?: string | number | boolean | null | undefined}
    ): void
    (argument: VariableResolver, value: string | number | boolean | null | undefined): void;
};

export type StyleSheetType = 'classNames' | 'attributes' | 'customStyles';
export type EffCSSEvent = {
    css: string;
} & (
      { fn: 'variable'; name: string; }
    | { fn: 'variables'; names: string[]; }
    | { fn: 'variable.set'; name: string; value: string; }
    | { fn: 'animation'; name: string; }
    | { fn: 'animations'; names: string[]; }
    | { fn: 'layer'; name: string; }
    | { fn: 'layers'; names: string[]; }
    | { fn: 'font'; name: string; }
    | { fn: 'fonts'; names: string[]; }
    | { fn: 'container'; name: string; type: string;}
    | { fn: 'containers'; items: {name: string; type: string;}[]}
    | { fn: 'className'; result: string; }
    | { fn: 'attribute'; result: object; }
    | { fn: 'classNames'; dict: Record<string, string>; key: string; }
    | { fn: 'attributes'; dict: Record<string, string>; key: string; }
    | { fn: 'customStyles'; dict: Record<string, string>; key: string; }
);
