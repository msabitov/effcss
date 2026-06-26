import { beforeAll, describe, expect, test, vi } from 'vitest';
import {
    type Generator,
    serialize,
    classNames, attributes,
    customStyles,
    stylesheet,
    variables,
    variable,
    variablesStylesheet,
    animation,
    animations,
    animationsStylesheet,
    layersStylesheet,
    layer,
    layers,
    sharedStylesheet,
    className,
    attribute
} from '../src/index';

type Card = {
    w: 's' | 'm' | 'l';
    blur: true;
    card: {
        variant: 1 | 2;
        rounded: true;
    }
}

const generators: {
    classNames: Generator<Card>;
    attributes: Generator<Card>;
    customStyles: () => object;
} = {
    classNames: (selectors) => {
        const {w, card, blur} = selectors;
        return {
            [w.s]: {
                width: '12px'
            },
            [w.m]: {
                width: '24px'
            },
            [w.l]: {
                width: '26px'
            },
            [blur.true]: {
                filter: 'blur(5px)'
            },
            [card]: {
                background: 'white'
            },
            [card.variant[1]]: {
                width: 'auto',
                display: 'block',
                padding: '12px',
                '&:hover': {
                    cursor: 'pointer'
                }
            },
            [card.variant[2]]: {
                width: 'auto',
                display: 'flex',
                flexDirection: 'column',
                padding: '16px',
                '&:hover': {
                    outline: '2px solid black'
                }
            },
            [card.rounded.true]: {
                borderRadius: '1rem'
            }
        }
    },
    attributes: (selectors) => {
        const {w, card, blur} = selectors;
        return {
            [w.s]: {
                width: '12px'
            },
            [w.m]: {
                width: '24px'
            },
            [w.l]: {
                width: '26px'
            },
            [blur.true]: {
                filter: 'blur(5px)'
            },
            [card]: {
                background: 'white'
            },
            [card.variant[1]]: {
                width: 'auto',
                display: 'block',
                padding: '12px',
                '&:hover': {
                    cursor: 'pointer'
                }
            },
            [card.variant[2]]: {
                width: 'auto',
                display: 'flex',
                flexDirection: 'column',
                padding: '16px',
                '&:hover': {
                    outline: '2px solid black'
                }
            },
            [card.rounded.true]: {
                borderRadius: '1rem'
            }
        }
    },
    customStyles: () => ({
        'body': {
            padding: '1rem'
        },
        '.class': {
            background: 'transparent',
            width: '100%',
            '&:focus': {
                borderWidth: '0px'
            }
        },
        'button:hover': {
            outline: '2px solid black'
        },
        '@media screen and (max-width: 768px)': {
            '.class': {
                width: '50%'
            }
        }
    })
};

const SERVER_META = (
    `<script type="application/json" data-effcss-key="f0">` +
    `{"w":"f0_0","card":"f0_1","blur":"f0_2","w_s":"f0_3","w_m":"f0_4","w_l":"f0_5","blur_true":"f0_6","card_variant":"f0_7",` +
    `"card_variant_1":"f0_8","card_variant_2":"f0_9","card_rounded":"f0_a","card_rounded_true":"f0_b"}` +
    `</script>`
) + (
    `<script type="application/json" data-effcss-key="f1">` +
    `{"w":"0","card":"1","blur":"2","w_s":"3","w_m":"4","w_l":"5","blur_true":"6","card_variant":"7",` +
    `"card_variant_1":"8","card_variant_2":"9","card_rounded":"a","card_rounded_true":"b"}` +
    `</script>`
) + (
    `<script type="application/json" data-effcss-key="f2">{}</script>`
);

const SERVER_CSS = (
    `<style data-effcss-key="f0">` +
    `.f0_3{width:12px;}.f0_4{width:24px;}.f0_5{width:26px;}.f0_6{filter:blur(5px);}` +
    `.f0_1{background:white;}` +
    `.f0_8{width:auto;display:block;padding:12px;&:hover{cursor:pointer;}}` +
    `.f0_9{width:auto;display:flex;flex-direction:column;padding:16px;&:hover{outline:black solid 2px;}}` +
    `.f0_b{border-radius: 1rem;}` +
    `</style>`
) + (
    `<style data-effcss-key="f1">` +
    `[data-f1~="3"]{width:12px;}[data-f1~="4"]{width:24px;}[data-f1~="5"]{width:26px;}[data-f1~="6"]{filter:blur(5px);}`+
    `[data-f1~="1"]{background:white;}`+
    `[data-f1~="8"]{width:auto;display:block;padding:12px;&:hover{cursor:pointer;}\n}[data-f1~="9"]{width:auto;display:flex;flex-direction:column;padding:16px;` +
    `&:hover{outline:black solid 2px;}}`+
    `[data-f1~="b"]{border-radius:1rem;}`+
`</style>`
)+(
    `<style data-effcss-key="f2">`+
    `@property --f2-0{syntax:"*";inherits:true;}@property --f2-1{syntax:"*";inherits:true;initial-value:black;}`+
    `@property --f2-2{syntax:"*";inherits:true;initial-value:grey;}`+
    `body{padding:var(--f2-0,1rem);}.class{background:var(--f2-2,transparent);color:var(--f2-1);}`+
    `</style>`
)+(
    `<style data-effcss-layers>@layer f2-0;@layer f2-1,f2-2;</style>`
)+(
    `<style data-effcss-variables>@property --f3-0{syntax:"*";inherits:true;initial-value:12px;}`+
    `@property --f3-1{syntax:"<color>";inherits:false;initial-value:red;}`+
    `@property --f3-2{syntax:"*";inherits:true;initial-value:green;}</style>`
)+(
    `<style data-effcss-animations>@keyframes f3-0{0%{width:100px;}100%{width:200px;}}`+
    `@keyframes f3-1{0%{width:100px;}100%{width:200px;}}`+
    `@keyframes f3-2{0%{opacity:0;}50%{opacity:0.6;}100%{opacity:1;}}</style>`
)+(
    `<style data-effcss-shared>.f3_0{margin:auto;&:hover{outline:black solid 2px;&.child{background:grey;}}}`+
    `[data-f3~="1"]{margin:auto;&:hover{outline:black solid 2px;&.child{background:grey;}}}`+
    `</style>`
);

describe('Utils:', () => {
    beforeAll(() => {
        document.head.insertAdjacentHTML('beforeend', SERVER_META + SERVER_CSS)
    });

    describe('User stylesheets:', () => {
        test('classNames:', () => {
            const classNamesSpy = vi.spyOn(generators, 'classNames');

            expect(classNamesSpy).not.toHaveBeenCalled();

            const card = classNames<Card>(classNamesSpy);
            const cls = card({
                card: {
                    rounded: true
                },
                w: 's'
            });

            expect(classNamesSpy).not.toHaveBeenCalled();
            expect(cls).toBe('f0_1 f0_b f0_3');

            const cssText = serialize(stylesheet(card));
            expect(cssText).toContain(
                `.f0_3 { width: 12px; }.f0_4 { width: 24px; }.f0_5 { width: 26px; }` +
                `.f0_6 { filter: blur(5px); }.f0_1 { background: white; }` +
                `.f0_8 {\n  width: auto; display: block; padding: 12px;\n  &:hover { cursor: pointer; }\n}` +
                `.f0_9 {\n  width: auto; display: flex; flex-direction: column; padding: 16px;\n  &:hover { outline: black solid 2px; }\n}.f0_b { border-radius: 1rem; }`
            );
        });

        test('attributes:', () => {
            const attributesSpy = vi.spyOn(generators, 'attributes');

            expect(attributesSpy).not.toHaveBeenCalled();

            const card = attributes(attributesSpy);
            const attrs = card({
                card: {
                    rounded: true
                },
                w: 's'
            });

            expect(attributesSpy).not.toHaveBeenCalled();
            expect(attrs).toEqual({
                'data-f1': '1 b 3'
            });

            const cssText = serialize(stylesheet(card));
            expect(cssText).toContain(
                `[data-f1~="3"] { width: 12px; }[data-f1~="4"] { width: 24px; }[data-f1~="5"] { width: 26px; }` +
                `[data-f1~="6"] { filter: blur(5px); }` +
                `[data-f1~="1"] { background: white; }` +
                `[data-f1~="8"] {\n  width: auto; display: block; padding: 12px;\n  &:hover { cursor: pointer; }\n}` +
                `[data-f1~="9"] {\n  width: auto; display: flex; flex-direction: column; padding: 16px;\n  &:hover { outline: black solid 2px; }\n}` +
                `[data-f1~="b"] { border-radius: 1rem; }`
            );
        });

        test('customStyles', () => {
            const customStylesSpy = vi.spyOn(generators, 'customStyles');

            expect(customStylesSpy).not.toHaveBeenCalled();

            const custom = customStyles(customStylesSpy);

            expect(customStylesSpy).not.toHaveBeenCalled();

            const cssText = serialize(stylesheet(custom));
            expect(cssText).toContain(
                `@property --f2-0 { syntax: "*"; inherits: true; }` +
                `@property --f2-1 { syntax: "*"; inherits: true; initial-value: black; }` +
                `@property --f2-2 { syntax: "*"; inherits: true; initial-value: grey; }` +
                `body { padding: var(--f2-0,1rem); }.class { background: var(--f2-2,transparent); color: var(--f2-1); }`
            );
        })
    });

    describe('Special stylesheets', () => {
        test('variables', () => {
            const stylesheet = variablesStylesheet();
            const insertRuleSpy = vi.spyOn(stylesheet, 'insertRule');

            expect(stylesheet.cssRules?.length).toBe(3);
            expect(insertRuleSpy).not.toHaveBeenCalled();

            const size = variable('12px');
            const colors = variables({
                primary: {
                    syntax: 'color',
                    inherits: false,
                    initialValue: 'red'
                },
                secondary: 'green'
            });

            expect(size + '').toBe('--f3-0');
            expect(colors.primary + '').toBe('--f3-1');
            expect(colors.secondary + '').toBe('--f3-2');
            expect(stylesheet.cssRules?.length).toBe(3);
            expect(insertRuleSpy).not.toHaveBeenCalled();

            const radius = variable('1rem');

            expect(radius + '').toBe('--f3-3');
            expect(stylesheet.cssRules?.length).toBe(4);
            expect(insertRuleSpy).toHaveBeenCalledOnce();
        });

        test('animations', () => {
            const stylesheet = animationsStylesheet();
            const insertRuleSpy = vi.spyOn(stylesheet, 'insertRule');

            expect(stylesheet.cssRules?.length).toBe(3);
            expect(insertRuleSpy).not.toHaveBeenCalled();

            const size = animation({
                from: {
                    width: '100px'
                },
                to: {
                    width: '200px'
                }
            });
            const variants = animations({
                size: {
                    from: {
                        width: '100px'
                    },
                    to: {
                        width: '200px'
                    }
                },
                opacity: {
                    '0%': {
                        opacity: 0
                    },
                    '50%': {
                        opacity: 0.6
                    },
                    '100%': {
                        opacity: 1
                    }
                }
            });

            expect(size + '').toBe('f3-0');
            expect(variants.size + '').toBe('f3-1');
            expect(variants.opacity + '').toBe('f3-2');
            expect(stylesheet.cssRules?.length).toBe(3);
            expect(insertRuleSpy).not.toHaveBeenCalled();

            const opacity = animation({
                '0%': {
                    opacity: 0
                },
                '50%': {
                    opacity: 0.6
                },
                '100%': {
                    opacity: 1
                }
            });

            expect(opacity + '').toBe('f3-3');
            expect(stylesheet.cssRules?.length).toBe(4);
            expect(insertRuleSpy).toHaveBeenCalledOnce();
        });

        test('layers', () => {
            const stylesheet = layersStylesheet();
            const insertRuleSpy = vi.spyOn(stylesheet, 'insertRule');

            expect(stylesheet.cssRules?.length).toBe(2);
            expect(insertRuleSpy).not.toHaveBeenCalled();
    
            const base = layer();
            const group = layers(['bottom', 'top']);
    
            expect(base + '').toBe('@layer f3-0');
            expect(group.bottom + '').toBe('@layer f3-1');
            expect(group.top + '').toBe('@layer f3-2');
            expect(stylesheet.cssRules?.length).toBe(2);
            expect(insertRuleSpy).not.toHaveBeenCalled();
    
            const components = layer();
    
            expect(components + '').toBe('@layer f3-3');
            expect(stylesheet.cssRules?.length).toBe(3);
            expect(insertRuleSpy).toHaveBeenCalledOnce();
        });

        test('className/attribute', () => {
            const stylesheet = sharedStylesheet();
            const insertRuleSpy = vi.spyOn(stylesheet, 'insertRule');
    
            expect(stylesheet.cssRules?.length).toBe(2);
            expect(insertRuleSpy).not.toHaveBeenCalled();
    
            const cls = className({
                margin: 'auto',
                '&:hover': {
                    outline: '2px solid black',
                    '.child': {
                        background: 'grey'
                    }
                }
            });
            const attr = attribute({
                margin: 'auto',
                '&:hover': {
                    outline: '2px solid black',
                    '.child': {
                        background: 'grey'
                    }
                }
            });

            expect(cls).toBe('f3_0');
            expect(attr).toEqual({
                'data-f3': '1'
            });
            expect(stylesheet.cssRules?.length).toBe(2);
            expect(insertRuleSpy).not.toHaveBeenCalled();
    
            const nextCls = className({
                padding: '10px',
                '&:focus': {
                    color: 'orange'
                }
            });
            const nextAttr = attribute({
                padding: '10px',
                '&:focus': {
                    color: 'orange'
                }
            });
    
            expect(nextCls).toBe('f3_2');
            expect(nextAttr).toEqual({
                'data-f3': '3'
            });
            expect(stylesheet.cssRules?.length).toBe(4);
            expect(insertRuleSpy).toHaveBeenCalledTimes(2);
        });
    });
});
