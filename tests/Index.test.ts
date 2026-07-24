import { describe, expect, test } from 'vitest';
import {
    serialize,
    stylesheet, layersStylesheet, variablesStylesheet, animationsStylesheet,
    classNames, attributes, customStyles,
    container, containers,
    variable, variables,
    layer, layers,
    animation, animations,
    update,
    className,
    sharedStylesheet,
    attribute,
    serializeMeta,
    lazyAttributes,
    lazyClassNames,
    lazyCustomStyles,
    font,
    fontsStylesheet,
    fonts
} from '../src/index';

type Card = {
    w: 's' | 'm' | 'l';
    blur: true;
    card: {
        variant: 1 | 2;
        rounded: true;
        header: {
            mini: true;
        };
    }
}

describe('Utils:', () => {
    describe('Selectors:', () => {
        test('classNames:', () => {
            const card = classNames<Card>((selectors) => {
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
                        background: 'white',
                        border: 'none'
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
            })
            const cls = card({
                card: {
                    rounded: true
                },
                w: 's'
            });
            expect(cls).toBe('f0_1 f0_b f0_3');
            expect(serialize(card)).toBe(serialize(stylesheet(card)));
        });

        test('attributes:', () => {
            const card = attributes<Card>((selectors) => {
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
                        background: 'white',
                        border: 'none'
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
            })
            const attrs = card({
                card: {
                    rounded: true
                },
                w: 's'
            });
            expect(attrs).toEqual({
                'data-f1': '1 b 3'
            });
            expect(serialize(card)).toBe(serialize(stylesheet(card)));
        });
    });

    describe('At-rules:', () => {
        describe('single rule:', () => {
            describe('variable:', () => {
                test('global', () => {
                    const size = variable('12px')
                    const color = variable({
                        syntax: '*',
                        inherits: false,
                        initialValue: 'red'
                    });
                    
                    const card = classNames<Card>((selectors) => {
                        const {w, card} = selectors;
                        return {
                            [w.s]: {
                                width: size()
                            },
                            [w.m]: {
                                width: size('18px')
                            },
                            [w.l]: {
                                width: '26px'
                            },
                            [card]: {
                                [size]: '10px',
                                color: color(),
                                border: 'none',
                                background: `oklch(from ${color('grey')} l c h / 0.2)`
                            },
                            [card.rounded.true]: {
                                borderRadius: '1rem'
                            }
                        };
                    });
            
                    card({
                        card: {
                            rounded: true
                        },
                        w: 's'
                    });

                    const varsCSS = serialize(variablesStylesheet());
                    const cardCSS = serialize(stylesheet(card));
                    expect(varsCSS).toContain('@property --f2-0');
                    expect(varsCSS).toContain('@property --f2-1');
                    expect(cardCSS).toContain('--f2-0: 10px;');
                    expect(cardCSS).toContain('var(--f2-0)');
                    expect(cardCSS).toContain('var(--f2-0)');
                    expect(cardCSS).toContain('var(--f2-0,18px)');
                    expect(cardCSS).toContain('var(--f2-1)');
                    expect(cardCSS).toContain('var(--f2-1,grey)');
                });
        
                test('local', () => {
                    const card = classNames<Card>((selectors) => {
                        const {w, card} = selectors;
                        const size = variable('12px')
                        const color = variable({
                            syntax: '*',
                            inherits: false,
                            initialValue: 'red'
                        });
                        return {
                            [w.s]: {
                                width: size()
                            },
                            [w.m]: {
                                width: size('18px')
                            },
                            [w.l]: {
                                width: '26px'
                            },
                            [card]: {
                                [size]: '10px',
                                color: color(),
                                border: 'none',
                                background: `oklch(from ${color('grey')} l c h / 0.2)`
                            },
                            [card.rounded.true]: {
                                borderRadius: '1rem'
                            }
                        };
                    });
            
                    card({
                        card: {
                            rounded: true
                        },
                        w: 's'
                    });
            
                    const cardCSS = serialize(stylesheet(card));
                    expect(cardCSS).toContain('@property --f4-0');
                    expect(cardCSS).toContain('@property --f4-1');
                    expect(cardCSS).toContain('--f4-0: 10px;');
                    expect(cardCSS).toContain('var(--f4-0)');
                    expect(cardCSS).toContain('var(--f4-0,18px)');
                    expect(cardCSS).toContain('var(--f4-1)');
                    expect(cardCSS).toContain('var(--f4-1,grey)');
                });

                test('short and long syntax forms', () => {
                    const angleShortSyntax = variable({
                        syntax: 'angle',
                        initialValue: '45deg'
                    });

                    const lengthLongSyntax = variable({
                        syntax: '"<length> | <percentage>"',
                        initialValue: '200px'
                    });

                    const varsCSS = serialize(variablesStylesheet());
                    expect(varsCSS).toContain('syntax: "<angle>"; inherits: true; initial-value: 45deg;');
                    expect(varsCSS).toContain('syntax: "<length> | <percentage>"; inherits: true; initial-value: 200px;');
                });
            });

            describe('animation:', () => {
                test('global', () => {
                    const size = animation({
                        from: {
                            width: '100px'
                        },
                        to: {
                            width: '200px'
                        }
                    });
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
            
                    const card = classNames<Card>((selectors) => {
                        const {w, card} = selectors;
                        return {
                            [w.s]: {
                                animation: `200ms ${size}`
                            },
                            [card]: {
                                ':hover': {
                                    animationName: opacity,
                                    animationDuration: '3s'
                                }
                            }
                        };
                    });
            
                    card({
                        card: {
                            rounded: true
                        },
                        w: 's'
                    });
            
                    const cardCSS = serialize(stylesheet(card));
                    const kfCSS = serialize(animationsStylesheet());
                    expect(kfCSS).toContain('@keyframes f2-0');
                    expect(kfCSS).toContain('@keyframes f2-1');
                    expect(cardCSS).toContain('f2-0');
                    expect(cardCSS).toContain('animation-name: f2-1;');
                });

                test('local', () => {
                    const card = classNames<Card>((selectors) => {
                        const {w, card} = selectors;
            
                        const size = animation({
                            from: {
                                width: '100px'
                            },
                            to: {
                                width: '200px'
                            }
                        });
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
                        return {
                            [w.s]: {
                                animation: `200ms ${size}`
                            },
                            [card]: {
                                ':hover': {
                                    animationName: opacity,
                                    animationDuration: '3s'
                                }
                            }
                        };
                    });
            
                    card({
                        card: {
                            rounded: true
                        },
                        w: 's'
                    });
            
                    const cardCSS = serialize(stylesheet(card));
                    expect(cardCSS).toContain('@keyframes f6-0');
                    expect(cardCSS).toContain('@keyframes f6-1');
                    expect(cardCSS).toContain('f6-0');
                    expect(cardCSS).toContain('animation-name: f6-1;');
                });
            });

            describe('layer:', () => {
                test('global', () => {
                    const startLayer = layer();
                    const middleLayer = layer();
                    const topLayer = layer();
            
                    const card = classNames<Card>((selectors) => {
                        const {w, card} = selectors;
                        return {
                            [startLayer]: {
                                button: {
                                    border: 'none'
                                }
                            },
                            [topLayer]: {
                                [w.s]: {
                                    width: '12px'
                                },
                                [w.m]: {
                                    width: '24px'
                                },
                                [w.l]: {
                                    width: '26px'
                                },
                            },
                            [middleLayer]: {
                                [card]: {
                                    background: 'white',
                                    border: 'none'
                                }
                            }
                        };
                    });
            
                    card({
                        card: {
                            rounded: true
                        },
                        w: 's'
                    });
            
                    const cardCSS = serialize(stylesheet(card));
                    const layersCSS = serialize(layersStylesheet());
                    expect(layersCSS).toContain('@layer f2-0;');
                    expect(layersCSS).toContain('@layer f2-1;');
                    expect(layersCSS).toContain('@layer f2-2;');
                    expect(cardCSS).toContain('@layer f2-0 {');
                    expect(cardCSS).toContain('@layer f2-1 {');
                    expect(cardCSS).toContain('@layer f2-2 {');
                });

                test('local', () => {
                    const card = classNames<Card>((selectors) => {
                        const {w, card} = selectors;
            
                        const startLayer = layer();
                        const middleLayer = layer();
                        const topLayer = layer();
                        return {
                            [startLayer]: {
                                button: {
                                    border: 'none'
                                }
                            },
                            [topLayer]: {
                                [w.s]: {
                                    width: '12px'
                                },
                                [w.m]: {
                                    width: '24px'
                                },
                                [w.l]: {
                                    width: '26px'
                                },
                            },
                            [middleLayer]: {
                                [card]: {
                                    background: 'white',
                                    border: 'none'
                                }
                            }
                        };
                    });
            
                    card({
                        card: {
                            rounded: true
                        },
                        w: 's'
                    });
            
                    const cardCSS = serialize(stylesheet(card));
                    expect(cardCSS).toContain('@layer f8-0;');
                    expect(cardCSS).toContain('@layer f8-1;');
                    expect(cardCSS).toContain('@layer f8-2;');
                    expect(cardCSS).toContain('@layer f8-0 {');
                    expect(cardCSS).toContain('@layer f8-1 {');
                    expect(cardCSS).toContain('@layer f8-2 {');
                });
            });

            describe('container:', () => {
                test('global', () => {
                    const normalContainer = container();
                    const inlineSizeContainer = container('inline-size');
                    const scrollStateContainer = container('size scroll-state');
                    const card = classNames<Card>((selectors) => {
                        const {w, card} = selectors;
                        return {
                            '.container': {
                                container: normalContainer()
                            },
                            '.container-inline': {
                                container: inlineSizeContainer()
                            },
                            '.container-scroll': {
                                container: scrollStateContainer()
                            },
                            // @container condition must include a parenthesised query
                            [normalContainer + ' not scroll-state(scrollable: none)']: {
                                button: {
                                    border: 'none'
                                }
                            },
                            [inlineSizeContainer + ' (max-width: 768px)']: {
                                [w.s]: {
                                    width: '12px'
                                },
                                [w.m]: {
                                    width: '24px'
                                },
                                [w.l]: {
                                    width: '26px'
                                },
                            },
                            [scrollStateContainer + ' (height > 30rem)']: {
                                [card]: {
                                    background: 'white',
                                    border: 'none'
                                }
                            }
                        };
                    });
            
                    card({
                        card: {
                            rounded: true
                        },
                        w: 's'
                    });
            
                    const cardCSS = serialize(stylesheet(card));
                    expect(cardCSS).toContain('@container f2-0 not scroll-state(scrollable: none)');
                    expect(cardCSS).toContain('@container f2-1 (max-width: 768px)');
                    expect(cardCSS).toContain('@container f2-2 (height > 30rem)');
                    expect(cardCSS).toContain('container: f2-0');
                    expect(cardCSS).toContain('container: f2-1 / inline-size;');
                    expect(cardCSS).toContain('container: f2-2 / size scroll-state;');
                });

                test('local', () => {
                    const card = classNames<Card>((selectors) => {
                        const {w, card} = selectors;

                        const normalContainer = container();
                        const inlineSizeContainer = container('inline-size');
                        const scrollStateContainer = container('size scroll-state');
                        return {
                            '.container': {
                                container: normalContainer()
                            },
                            '.container-inline': {
                                container: inlineSizeContainer()
                            },
                            '.container-scroll': {
                                container: scrollStateContainer()
                            },
                            // @container condition must include a parenthesised query
                            [normalContainer + ' not scroll-state(scrollable: none)']: {
                                button: {
                                    border: 'none'
                                }
                            },
                            [inlineSizeContainer + ' (max-width: 768px)']: {
                                [w.s]: {
                                    width: '12px'
                                },
                                [w.m]: {
                                    width: '24px'
                                },
                                [w.l]: {
                                    width: '26px'
                                },
                            },
                            [scrollStateContainer + ' (height > 30rem)']: {
                                [card]: {
                                    background: 'white',
                                    border: 'none'
                                }
                            }
                        };
                    });
            
                    card({
                        card: {
                            rounded: true
                        },
                        w: 's'
                    });
            
                    const cardCSS = serialize(stylesheet(card));
                    expect(cardCSS).toContain('@container fa-0 not scroll-state(scrollable: none)');
                    expect(cardCSS).toContain('@container fa-1 (max-width: 768px)');
                    expect(cardCSS).toContain('@container fa-2 (height > 30rem)');
                    expect(cardCSS).toContain('container: fa-0');
                    expect(cardCSS).toContain('container: fa-1 / inline-size;');
                    expect(cardCSS).toContain('container: fa-2 / size scroll-state;');
                });
            });

            describe('font:', () => {
                test('global', () => {
                    const first = font({
                        src: `url("/fonts/roboto-regular.woff2") format("woff2"), url("/fonts/roboto-regular.woff") format("woff")`,
                        weight: 400,
                        style: 'normal',
                        display: 'swap'
                    });
                    const second = font({
                        src: `url("https://mdn.github.io/shared-assets/fonts/FiraSans-Regular.woff2")`,
                        genericName: 'sans-serif'
                    });
            
                    const card = classNames<Card>((selectors) => {
                        const {card} = selectors;
                        return {
                            body: {
                                fontFamily: first()
                            },
                            [card]: {
                                fontFamily: second(first)
                            }
                        };
                    });

                    const cardCSS = serialize(stylesheet(card));
                    const fontCSS = serialize(fontsStylesheet());
                    expect(fontCSS).toContain('@font-face { font-family: f2-0;');
                    expect(fontCSS).toContain('@font-face { font-family: f2-1;');
                    expect(cardCSS).toContain('font-family: f2-0;');
                    expect(cardCSS).toContain('font-family: f2-1, f2-0, sans-serif;');
                });

                test('local', () => {
                    const card = classNames<Card>((selectors) => {
                        const {card} = selectors;
            
                        const first = font({
                            src: `url("/fonts/roboto-regular.woff2") format("woff2"), url("/fonts/roboto-regular.woff") format("woff")`,
                            weight: 400,
                            style: 'normal',
                            display: 'swap'
                        });
                        const second = font({
                            src: `url("https://mdn.github.io/shared-assets/fonts/FiraSans-Regular.woff2")`
                        });
                        return {
                            body: {
                                fontFamily: first()
                            },
                            [card]: {
                                fontFamily: second(first)
                            }
                        };
                    });

                    const cardCSS = serialize(stylesheet(card));
                    expect(cardCSS).toContain('@font-face { font-family: fc-0;');
                    expect(cardCSS).toContain('@font-face { font-family: fc-1;');
                    expect(cardCSS).toContain('font-family: fc-0;');
                    expect(cardCSS).toContain('font-family: fc-1, fc-0;');
                });
            });
        });

        describe('multiple rules:', () => {
            describe('variables:', () => {
                test('global', () => {
                    const vars = variables({
                        size: '12px',
                        color: {
                            syntax: '*',
                            inherits: false,
                            initialValue: 'red'
                        }
                    });
                    
                    const card = classNames<Card>((selectors) => {
                        const {w, card} = selectors;
                        return {
                            [w.s]: {
                                width: vars.size()
                            },
                            [w.m]: {
                                width: vars.size('18px')
                            },
                            [w.l]: {
                                width: '26px'
                            },
                            [card]: {
                                [vars.size]: '10px',
                                color: vars.color(),
                                border: 'none',
                                background: `oklch(from ${vars.color('grey')} l c h / 0.2)`
                            },
                            [card.rounded.true]: {
                                borderRadius: '1rem'
                            }
                        };
                    });
            
                    card({
                        card: {
                            rounded: true
                        },
                        w: 's'
                    });
                    const varsCSS = serialize(variablesStylesheet());
                    const cardCSS = serialize(stylesheet(card));
                    expect(varsCSS).toContain('@property --f2-4');
                    expect(varsCSS).toContain('@property --f2-5');
                    expect(cardCSS).toContain('--f2-4: 10px;');
                    expect(cardCSS).toContain('var(--f2-4)');
                    expect(cardCSS).toContain('var(--f2-4)');
                    expect(cardCSS).toContain('var(--f2-4,18px)');
                    expect(cardCSS).toContain('var(--f2-5)');
                    expect(cardCSS).toContain('var(--f2-5,grey)');
                });

                test('local', () => {
                    const card = classNames<Card>((selectors) => {
                        const {w, card} = selectors;
                        const vars = variables({
                            size: '12px',
                            color: {
                                syntax: '*',
                                inherits: false,
                                initialValue: 'red'
                            }
                        });
                        return {
                            [w.s]: {
                                width: vars.size()
                            },
                            [w.m]: {
                                width: vars.size('18px')
                            },
                            [w.l]: {
                                width: '26px'
                            },
                            [card]: {
                                [vars.size]: '10px',
                                color: vars.color(),
                                border: 'none',
                                background: `oklch(from ${vars.color('grey')} l c h / 0.2)`
                            },
                            [card.rounded.true]: {
                                borderRadius: '1rem'
                            }
                        };
                    });
            
                    card({
                        card: {
                            rounded: true
                        },
                        w: 's'
                    });
            
                    const cardCSS = serialize(stylesheet(card));
                    expect(cardCSS).toContain('@property --fe-0');
                    expect(cardCSS).toContain('@property --fe-1');
                    expect(cardCSS).toContain('--fe-0: 10px;');
                    expect(cardCSS).toContain('var(--fe-0)');
                    expect(cardCSS).toContain('var(--fe-0,18px)');
                    expect(cardCSS).toContain('var(--fe-1)');
                    expect(cardCSS).toContain('var(--fe-1,grey)');
                });
            });

            describe('animations:', () => {
                test('global', () => {
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
            
                    const card = classNames<Card>((selectors) => {
                        const {w, card} = selectors;
                        return {
                            [w.s]: {
                                animation: `200ms ${variants.size}`
                            },
                            [card]: {
                                ':hover': {
                                    animationName: variants.opacity,
                                    animationDuration: '3s'
                                }
                            }
                        };
                    });
            
                    card({
                        card: {
                            rounded: true
                        },
                        w: 's'
                    });
            
                    const cardCSS = serialize(stylesheet(card));
                    const kfCSS = serialize(animationsStylesheet());
                    expect(kfCSS).toContain('@keyframes f2-2');
                    expect(kfCSS).toContain('@keyframes f2-3');
                    expect(cardCSS).toContain('f2-2');
                    expect(cardCSS).toContain('animation-name: f2-3;');
                });

                test('local', () => {
                    const card = classNames<Card>((selectors) => {
                        const {w, card} = selectors;
            
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
                        return {
                            [w.s]: {
                                animation: `200ms ${variants.size}`
                            },
                            [card]: {
                                ':hover': {
                                    animationName: variants.opacity,
                                    animationDuration: '3s'
                                }
                            }
                        };
                    });
            
                    card({
                        card: {
                            rounded: true
                        },
                        w: 's'
                    });
            
                    const cardCSS = serialize(stylesheet(card));
                    expect(cardCSS).toContain('@keyframes fg-0');
                    expect(cardCSS).toContain('@keyframes fg-1');
                    expect(cardCSS).toContain('fg-0');
                    expect(cardCSS).toContain('animation-name: fg-1;');
                });
            });

            describe('layers:', () => {
                test('global', () => {
                    const globalLayers = layers(['start', 'middle', 'top']);
            
                    const card = classNames<Card>((selectors) => {
                        const {w, card} = selectors;
                        return {
                            [globalLayers.start]: {
                                button: {
                                    border: 'none'
                                }
                            },
                            [globalLayers.top]: {
                                [w.s]: {
                                    width: '12px'
                                },
                                [w.m]: {
                                    width: '24px'
                                },
                                [w.l]: {
                                    width: '26px'
                                },
                            },
                            [globalLayers.middle]: {
                                [card]: {
                                    background: 'white',
                                    border: 'none'
                                }
                            }
                        };
                    });
            
                    card({
                        card: {
                            rounded: true
                        },
                        w: 's'
                    });
            
                    const cardCSS = serialize(stylesheet(card));
                    const layersCSS = serialize(layersStylesheet());
                    expect(layersCSS).toContain('@layer f2-3, f2-4, f2-5;');
                    expect(cardCSS).toContain('@layer f2-3 {');
                    expect(cardCSS).toContain('@layer f2-4 {');
                    expect(cardCSS).toContain('@layer f2-5 {');
                });

                test('local', () => {
                    const card = classNames<Card>((selectors) => {
                        const {w, card} = selectors;
            
                        const localLayers = layers(['start', 'middle', 'top']);
                        return {
                            [localLayers.start]: {
                                button: {
                                    border: 'none'
                                }
                            },
                            [localLayers.top]: {
                                [w.s]: {
                                    width: '12px'
                                },
                                [w.m]: {
                                    width: '24px'
                                },
                                [w.l]: {
                                    width: '26px'
                                },
                            },
                            [localLayers.middle]: {
                                [card]: {
                                    background: 'white',
                                    border: 'none'
                                }
                            }
                        };
                    });
            
                    card({
                        card: {
                            rounded: true
                        },
                        w: 's'
                    });
            
                    const cardCSS = serialize(stylesheet(card));
                    expect(cardCSS).toContain('@layer fi-0, fi-1, fi-2;');
                    expect(cardCSS).toContain('@layer fi-0 {');
                    expect(cardCSS).toContain('@layer fi-1 {');
                    expect(cardCSS).toContain('@layer fi-2 {');
                });
            });

            describe('containers:', () => {
                test('global', () => {
                    const globalContainers = containers({
                        normal: '',
                        inline: 'inline-size',
                        scrollState: 'size scroll-state'
                    });
            
                    const card = classNames<Card>((selectors) => {
                        const {w, card} = selectors;
                        return {
                            '.container': {
                                container: globalContainers.normal()
                            },
                            '.container-inline': {
                                container: globalContainers.inline()
                            },
                            '.container-scroll': {
                                container: globalContainers.scrollState()
                            },
                            // @container condition must include a parenthesised query
                            [globalContainers.normal + ' not scroll-state(scrollable: none)']: {
                                button: {
                                    border: 'none'
                                }
                            },
                            [globalContainers.inline + ' (max-width: 768px)']: {
                                [w.s]: {
                                    width: '12px'
                                },
                                [w.m]: {
                                    width: '24px'
                                },
                                [w.l]: {
                                    width: '26px'
                                },
                            },
                            [globalContainers.scrollState + ' (height > 30rem)']: {
                                [card]: {
                                    background: 'white',
                                    border: 'none'
                                }
                            }
                        };
                    });
            
                    card({
                        card: {
                            rounded: true
                        },
                        w: 's'
                    });
            
                    const cardCSS = serialize(stylesheet(card));
                    expect(cardCSS).toContain('@container f2-3 not scroll-state(scrollable: none)');
                    expect(cardCSS).toContain('@container f2-4 (max-width: 768px)');
                    expect(cardCSS).toContain('@container f2-5 (height > 30rem)');
                    expect(cardCSS).toContain('container: f2-3');
                    expect(cardCSS).toContain('container: f2-4 / inline-size;');
                    expect(cardCSS).toContain('container: f2-5 / size scroll-state;');
                });

                test('local', () => {
                    const card = classNames<Card>((selectors) => {
                        const {w, card} = selectors;

                        const localContainers = containers({
                            normal: '',
                            inline: 'inline-size',
                            scrollState: 'size scroll-state'
                        });
                        return {
                            '.container': {
                                container: localContainers.normal()
                            },
                            '.container-inline': {
                                container: localContainers.inline()
                            },
                            '.container-scroll': {
                                container: localContainers.scrollState()
                            },
                            [localContainers.normal + ' not scroll-state(scrollable: none)']: {
                                button: {
                                    border: 'none'
                                }
                            },
                            [localContainers.inline + ' (max-width: 768px)']: {
                                [w.s]: {
                                    width: '12px'
                                },
                                [w.m]: {
                                    width: '24px'
                                },
                                [w.l]: {
                                    width: '26px'
                                },
                            },
                            [localContainers.scrollState + ' (height > 30rem)']: {
                                [card]: {
                                    background: 'white',
                                    border: 'none'
                                }
                            }
                        };
                    });
            
                    card({
                        card: {
                            rounded: true
                        },
                        w: 's'
                    });
            
                    const cardCSS = serialize(stylesheet(card));
                    expect(cardCSS).toContain('@container fk-0 not scroll-state(scrollable: none)');
                    expect(cardCSS).toContain('@container fk-1 (max-width: 768px)');
                    expect(cardCSS).toContain('@container fk-2 (height > 30rem)');
                    expect(cardCSS).toContain('container: fk-0');
                    expect(cardCSS).toContain('container: fk-1 / inline-size;');
                    expect(cardCSS).toContain('container: fk-2 / size scroll-state;');
                });
            });

            describe('fonts:', () => {
                test('global', () => {
                    const globalFonts = fonts({
                        first: {
                            src: `url("/fonts/roboto-regular.woff2") format("woff2"), url("/fonts/roboto-regular.woff") format("woff")`,
                            weight: 400,
                            style: 'normal',
                            display: 'swap'
                        },
                        second: {
                            src: `url("https://mdn.github.io/shared-assets/fonts/FiraSans-Regular.woff2")`,
                            genericName: 'sans-serif'
                        }
                    });
            
                    const card = classNames<Card>((selectors) => {
                        const {card} = selectors;
                        return {
                            body: {
                                fontFamily: globalFonts.first()
                            },
                            [card]: {
                                fontFamily: globalFonts.second()
                            }
                        };
                    });

                    const cardCSS = serialize(stylesheet(card));
                    const fontCSS = serialize(fontsStylesheet());
                    expect(fontCSS).toContain('@font-face { font-family: f2-2;');
                    expect(fontCSS).toContain('@font-face { font-family: f2-3;');
                    expect(cardCSS).toContain('font-family: f2-2;');
                    expect(cardCSS).toContain('font-family: f2-3, sans-serif;');
                });

                test('local', () => {
                    const card = classNames<Card>((selectors) => {
                        const {card} = selectors;
            
                        const localFonts = fonts({
                            first: {
                                src: `url("/fonts/roboto-regular.woff2") format("woff2"), url("/fonts/roboto-regular.woff") format("woff")`,
                                weight: 400,
                                style: 'normal',
                                display: 'swap'
                            },
                            second: {
                                src: `url("https://mdn.github.io/shared-assets/fonts/FiraSans-Regular.woff2")`
                            }
                        });
                        return {
                            body: {
                                fontFamily: localFonts.first()
                            },
                            [card]: {
                                fontFamily: localFonts.second('sans-serif')
                            }
                        };
                    });

                    const cardCSS = serialize(card);
                    expect(cardCSS).toContain('@font-face { font-family: fm-0;');
                    expect(cardCSS).toContain('@font-face { font-family: fm-1;');
                    expect(cardCSS).toContain('font-family: fm-0;');
                    expect(cardCSS).toContain('font-family: fm-1, sans-serif;');
                });
            });
        });
    });

    describe('Update', () => {
        test('single variable', () => {
            const size = variable('12px');
            const color = variable({
                syntax: 'color',
                inherits: false,
                initialValue: 'red'
            });
            const empty = variable();

            expect(size.get()).toBe('12px');
            expect(color.get()).toBe('red');
            expect(empty.get()).toBe('');

            update(size, '24px');
            update(color, 'black');

            let varsCSS = serialize(variablesStylesheet());
            expect(varsCSS).toContain(`@property ${size} { syntax: "*"; inherits: true; initial-value: 24px; }`);
            expect(varsCSS).toContain(`@property ${color} { syntax: "<color>"; inherits: false; initial-value: black; }`);
            expect(varsCSS).toContain(`@property ${empty} { syntax: "*"; inherits: true; }`);

            expect(size.get()).toBe('24px');
            expect(color.get()).toBe('black');

            size.set('28px');
            color.set('#fefefe');
            empty.set('45deg');

            expect(size.get()).toBe('28px');
            expect(color.get()).toBe('#fefefe');
            expect(empty.get()).toBe('45deg');

            varsCSS = serialize(variablesStylesheet());
            expect(varsCSS).toContain(`@property ${size} { syntax: "*"; inherits: true; initial-value: 28px; }`);
            expect(varsCSS).toContain(`@property ${color} { syntax: "<color>"; inherits: false; initial-value: #fefefe; }`);
            expect(varsCSS).toContain(`@property ${empty} { syntax: "*"; inherits: true; initial-value: 45deg; }`);

            empty.set('');
            expect(empty.get()).toBe('');
        });

        test('multiple variables', () => {
            const vars = variables({
                size: '12px',
                color: {
                    syntax: 'color',
                    inherits: false,
                    initialValue: 'red'
                }
            });

            update(vars, {
                size: '24px',
                color: 'black'
            });

            let varsCSS = serialize(variablesStylesheet());
            expect(varsCSS).toContain(`@property ${vars.size} { syntax: "*"; inherits: true; initial-value: 24px; }`);
            expect(varsCSS).toContain(`@property ${vars.color} { syntax: "<color>"; inherits: false; initial-value: black; }`);

            vars.size.set('28px');
            vars.color.set('grey');

            varsCSS = serialize(variablesStylesheet());
            expect(varsCSS).toContain(`@property ${vars.size} { syntax: "*"; inherits: true; initial-value: 28px; }`);
            expect(varsCSS).toContain(`@property ${vars.color} { syntax: "<color>"; inherits: false; initial-value: grey; }`);
        });
    });

    describe('Custom styles', () => {
        test('arbitrary', () => {
            const custom = customStyles(() => ({
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
            }));

            const customCSS = serialize(stylesheet(custom));;
            expect(customCSS).toBe(serialize(custom));
            expect(customCSS).toContain(
                `body { padding: 1rem; }` +
                `.class {\n  background: transparent; width: 100%;\n  &:focus { border-width: 0px; }\n}` +
                `button:hover { outline: black solid 2px; }` +
                `@media screen and (max-width: 768px) {\n  .class { width: 50%; }\n}`
            );
        });

        test('variables', () => {
            const custom = customStyles(() => {
                const size = variable();
                const colors = variables({
                    text: 'black',
                    bg: 'grey'
                });
                return {
                    'body': {
                        padding: size('1rem')
                    },
                    '.class': {
                        background: colors.bg('transparent'),
                        color: colors.text()
                    }
                };
            });

            const customCSS = serialize(stylesheet(custom));;
            expect(customCSS).toContain(
                `@property --fo-0 { syntax: "*"; inherits: true; }` +
                `@property --fo-1 { syntax: "*"; inherits: true; initial-value: black; }` +
                `@property --fo-2 { syntax: "*"; inherits: true; initial-value: grey; }`
            );
            expect(customCSS).toContain('padding: var(--fo-0,1rem);');
            expect(customCSS).toContain('background: var(--fo-2,transparent);');
            expect(customCSS).toContain('color: var(--fo-1);');
        });
    });

    describe('Anonymous rules', () => {
        test('className', () => {
            const cls = className({
                margin: 'auto',
                '&:hover': {
                    outline: '2px solid black',
                    '.child': {
                        background: 'grey'
                    }
                }
            });

            const styles = serialize(sharedStylesheet());
            expect(cls).toBe('f2_0')
            expect(styles).toContain(`.f2_0 {` +
                `\n  margin: auto;` +
                `\n  &:hover {\n  outline: black solid 2px;` +
                `\n  & .child { background: grey; }\n}` +
            `\n}`);
        });

        test('attribute', () => {
            const attr = attribute({
                margin: 'auto',
                '&:hover': {
                    outline: '2px solid black',
                    '.child': {
                        background: 'grey'
                    }
                }
            });

            const styles = serialize(sharedStylesheet());
            expect(attr).toEqual({
                'data-f2': '1'
            });

            expect(styles).toContain(`[data-f2~="1"] {` +
                `\n  margin: auto;` +
                `\n  &:hover {\n  outline: black solid 2px;` +
                `\n  & .child { background: grey; }\n}` +
            `\n}`);
        });
    });

    describe('Serialize', () => {
        test('classNames stylesheet', () => {
            const styles = serialize();
            expect(styles).toContain(
                `<style data-effcss-key="f0">` +
                `.f0_3 { width: 12px; }.f0_4 { width: 24px; }.f0_5 { width: 26px; }.f0_6 { filter: blur(5px); }` +
                `.f0_1 { background: white; border-width: medium; border-style: none; border-color: currentcolor; border-image: initial; }` +
                `.f0_8 {\n  width: auto; display: block; padding: 12px;\n  &:hover { cursor: pointer; }\n}.f0_9 {\n  width: auto; display: flex; flex-direction: column; padding: 16px;\n  &:hover { outline: black solid 2px; }\n}` +
                `.f0_b { border-radius: 1rem; }` +
                `</style>`
            );
        });

        test('attributes stylesheet', () => {
            const styles = serialize();
            expect(styles).toContain(
                `<style data-effcss-key="f1">` +
                `[data-f1~="3"] { width: 12px; }[data-f1~="4"] { width: 24px; }[data-f1~="5"] { width: 26px; }[data-f1~="6"] { filter: blur(5px); }` +
                `[data-f1~="1"] { background: white; border-width: medium; border-style: none; border-color: currentcolor; border-image: initial; }` +
                `[data-f1~="8"] {\n  width: auto; display: block; padding: 12px;\n  &:hover { cursor: pointer; }\n}[data-f1~="9"] {\n  width: auto; display: flex; flex-direction: column; padding: 16px;\n  &:hover { outline: black solid 2px; }\n}` +
                `[data-f1~="b"] { border-radius: 1rem; }` +
                `</style>`
            );
        });

        test('custom stylesheet', () => {
            const styles = serialize();
            expect(styles).toContain(
                `<style data-effcss-key="fo">` +
                `@property --fo-0 { syntax: "*"; inherits: true; }@property --fo-1 { syntax: "*"; inherits: true; initial-value: black; }` +
                `@property --fo-2 { syntax: "*"; inherits: true; initial-value: grey; }` +
                `body { padding: var(--fo-0,1rem); }.class { background: var(--fo-2,transparent); color: var(--fo-1); }` +
                `</style>`
            );
        });

        test('disabled stylesheet', () => {
            const custom = customStyles(() => ({
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
            }));

            expect(serialize(custom)).toBe(
                `<style data-effcss-key="fp">body { padding: 1rem; }.class {\n  background: transparent; width: 100%;\n  &:focus { border-width: 0px; }` +
                `\n}button:hover { outline: black solid 2px; }@media screen and (max-width: 768px) {\n  .class { width: 50%; }\n}` +
                `</style>`
            );

            const customStylesheet = stylesheet(custom);
            if (customStylesheet) customStylesheet.disabled = true
            expect(serialize(custom)).toBe('');
            expect(serialize(customStylesheet)).toBe('');
        });

        test('arbitrary function', () => {
            const custom = () => {};
            expect(serialize(custom)).toBe('');
        });

        test('arbitrary stylesheet', () => {
            const customStylesheet = new CSSStyleSheet();
            customStylesheet.replaceSync('.cls {width: 100%;} [data-vh] {height: 100vh;}');
            expect(serialize(customStylesheet)).toBe('<style>.cls { width: 100%; }[data-vh] { height: 100vh; }</style>');
        });
    });

    describe('Serialize meta', () => {
        test('classNames stylesheet', () => {
            const meta = serializeMeta();
            expect(meta).toContain(
                `<script type="application/json" data-effcss-key="f0">` +
                `{"w":"f0_0","card":"f0_1","blur":"f0_2","w_s":"f0_3","w_m":"f0_4","w_l":"f0_5","blur_true":"f0_6","card_variant":"f0_7",` +
                `"card_variant_1":"f0_8","card_variant_2":"f0_9","card_rounded":"f0_a","card_rounded_true":"f0_b"}` +
                `</script>`
            );
        });

        test('attributes stylesheet', () => {
            const meta = serializeMeta();
            expect(meta).toContain(
                `<script type="application/json" data-effcss-key="f1">` +
                `{"w":"0","card":"1","blur":"2","w_s":"3","w_m":"4","w_l":"5","blur_true":"6","card_variant":"7",` +
                `"card_variant_1":"8","card_variant_2":"9","card_rounded":"a","card_rounded_true":"b"}` +
                `</script>`
            );
        });

        test('custom stylesheet', () => {
            const meta = serializeMeta();
            expect(meta).toContain(
                `<script type="application/json" data-effcss-key="fo"></script>`
            );
        });

        test('disabled stylesheet', () => {
            const custom = customStyles(() => ({
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
            }));

            expect(serializeMeta(custom)).toBe(
                `<script type="application/json" data-effcss-key="fq"></script>`
            );

            const customStylesheet = stylesheet(custom);
            if (customStylesheet) customStylesheet.disabled = true
            expect(serializeMeta(custom)).toBe('');
        });

        test('arbitrary function', () => {
            const custom = () => {};
            expect(serializeMeta(custom)).toBe('');
        });

        test('arbitrary stylesheet', () => {
            const customStylesheet = new CSSStyleSheet();
            customStylesheet.replaceSync('.cls {width: 100%;} [data-vh] {height: 100vh;}')
            expect(serializeMeta(customStylesheet)).toBe('');
        });
    });

    describe('Lazy stylesheets', () => {
        test('classNames:', () => {
            const card = lazyClassNames<Card>((selectors) => {
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
                        background: 'white',
                        border: 'none'
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
            });
            expect(stylesheet(card)).toBeUndefined();

            const cls = card({
                card: {
                    rounded: true
                },
                w: 's'
            });
            expect(stylesheet(card)).toBeDefined();
            expect(cls).toBe('fr_1 fr_b fr_3');
        });

        test('attributes:', () => {
            const card = lazyAttributes<Card>((selectors) => {
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
                        background: 'white',
                        border: 'none'
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
            });
            expect(stylesheet(card)).toBeUndefined();

            const attrs = card({
                card: {
                    rounded: true
                },
                w: 's'
            });
            expect(stylesheet(card)).toBeDefined();
            expect(attrs).toEqual({
                'data-fs': '1 b 3'
            });
        });

        test('customStyles', () => {
            const custom = lazyCustomStyles(() => ({
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
            }));
            expect(stylesheet(custom)).toBeUndefined();

            custom();
            expect(stylesheet(custom)).toBeDefined();
        });
    });

    describe('Special value syntax', () => {
        test('object array', () => {
            const custom = customStyles(() => ({
                '@font-face': [
                    {
                        fontFamily: '"Bitstream Vera Serif Bold"',
                        src: 'url("https://mdn.github.io/shared-assets/fonts/FiraSans-Regular.woff2")'
                    },
                    {
                        fontFamily: '"MyHelvetica"',
                        src: 'local("Helvetica Neue Bold"), local("HelveticaNeue-Bold"), url("MgOpenModernaBold.woff2")',
                        fontWeight: 'bold'
                    }
                ]
            }));

            expect(serialize(stylesheet(custom))).toContain(
                `@font-face { font-family: "Bitstream Vera Serif Bold"; src: url("https://mdn.github.io/shared-assets/fonts/FiraSans-Regular.woff2"); }` +
                `@font-face { font-family: MyHelvetica; src: local("Helvetica Neue Bold"), local("HelveticaNeue-Bold"), url("MgOpenModernaBold.woff2"); font-weight: bold; }`
            );
        });

        test('string array', () => {
            const custom = customStyles(() => ({
                '.cls': {
                    textDecoration: ['underline', 'underline dotted']
                }
            }));

            expect(serialize(stylesheet(custom))).toContain('.cls { text-decoration: underline dotted; }');
        });

        test('statement rules', () => {
            const custom = customStyles(() => ({
                '@layer base, utils': '',
                '@layer base': {
                    '.cls': {
                        fontWeight: 'bold'
                    }
                }
            }));

            expect(serialize(stylesheet(custom))).toContain('@layer base, utils;');
        });
    });
});
