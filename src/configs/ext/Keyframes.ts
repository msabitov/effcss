import { comma, space, atKeyframes } from '../../css/functions';
import { argsToDeg, rotateX, rotateY, scale, scale3d, scaleX, translate3d, translateZ, perspective } from '../../css/functions';
import { TStyleConfig } from 'types';

export interface IKeyframesConfig {
    an:
        | 'zoomIn'
        | 'zoomOut'
        | 'pulse'
        | 'heartBeat'
        | 'bounceIn'
        | 'bounceOut'
        | 'fadeIn'
        | 'fadeInRight'
        | 'fadeInLeft'
        | 'fadeInDown'
        | 'fadeInUp'
        | 'fadeOut'
        | 'fadeOutRight'
        | 'fadeOutLeft'
        | 'fadeOutDown'
        | 'fadeOutUp'
        | 'flipInX'
        | 'flipInY'
        | 'flipOutX'
        | 'flipOutY'
        | 'slideInDown'
        | 'slideInLeft'
        | 'slideInRight'
        | 'slideInUp'
        | 'slideOutDown'
        | 'slideOutLeft'
        | 'slideOutRight'
        | 'slideOutUp';
}

const DEG = argsToDeg(-20, -15, -5, 10, 90);

const IN = 'In';
const OUT = 'Out';
const DOWN = 'Down';
const UP = 'Up';
const LEFT = 'Left';
const RIGHT = 'Right';

// keyframes
const X = 'x';
const Y = 'y';
const ZOOM = 'zoom';
const ZOOM_IN = ZOOM + IN;
const ZOOM_OUT = ZOOM + OUT;
const PULSE = 'pulse';
const BOUNCE = 'bounce';
const BOUNCE_IN = BOUNCE + IN;
const BOUNCE_OUT = BOUNCE + OUT;
const FADE = 'fade';
const FADE_IN = FADE + IN;
const FADE_IN_DOWN = FADE_IN + DOWN;
const FADE_IN_UP = FADE_IN + UP;
const FADE_IN_LEFT = FADE_IN + LEFT;
const FADE_IN_RIGHT = FADE_IN + RIGHT;
const FADE_OUT = FADE + OUT;
const FADE_OUT_DOWN = FADE_OUT + DOWN;
const FADE_OUT_UP = FADE_OUT + UP;
const FADE_OUT_LEFT = FADE_OUT + LEFT;
const FADE_OUT_RIGHT = FADE_OUT + RIGHT;
const FLIP = 'flip';
const FLIP_IN_X = FLIP + IN + X;
const FLIP_IN_Y = FLIP + IN + Y;
const FLIP_OUT_X = FLIP + OUT + X;
const FLIP_OUT_Y = FLIP + OUT + Y;
const SLIDE = 'slide';
const SLIDE_IN = SLIDE + IN;
const SLIDE_IN_DOWN = SLIDE_IN + DOWN;
const SLIDE_IN_UP = SLIDE_IN + UP;
const SLIDE_IN_RIGHT = SLIDE_IN + RIGHT;
const SLIDE_IN_LEFT = SLIDE_IN + LEFT;
const SLIDE_OUT = SLIDE + OUT;
const SLIDE_OUT_DOWN = SLIDE_OUT + DOWN;
const SLIDE_OUT_UP = SLIDE_OUT + UP;
const SLIDE_OUT_RIGHT = SLIDE_OUT + RIGHT;
const SLIDE_OUT_LEFT = SLIDE_OUT + LEFT;
const HEARTBEAT = 'heartBeat';

const PERSP_25REM = perspective(25 + 'rem');

const getAnimations = (names: string[]) => ({
    $an: names.reduce((acc, name) => {
        acc[name] = name;
        return acc;
    }, {})
});

export default {
    kf: {
        [ZOOM_IN]: {
            0: {
                $o: 0,
                $tf: scale3d(comma(0.25, 0.25, 0.25))
            },
            50: {
                $o: 1
            }
        },
        [ZOOM_OUT]: {
            0: {
                $o: 1
            },
            50: {
                $o: 0,
                $tf: scale3d(comma(0.25, 0.25, 0.25))
            },
            to: {
                $o: 0
            }
        },
        [PULSE]: {
            0: {
                $tf: scaleX(1)
            },
            50: {
                $tf: scale3d(comma(1.05, 1.05, 1.05))
            },
            to: {
                $tf: scaleX(1)
            }
        },
        [HEARTBEAT]: {
            0: {
                $tf: scale(1)
            },
            15: {
                $tf: scale(1.25)
            },
            30: {
                $tf: scale(1)
            },
            45: {
                $tf: scale(1.25)
            },
            70: {
                $tf: scale(0)
            }
        },
        [BOUNCE_IN]: {
            '0, 20%, 40%, 60%, 80%, to': {
                $atf: 'cubic-bezier(.215,.61,.355,1)'
            },
            0: {
                $o: 0,
                $tf: scale3d(comma(0.25, 0.25, 0.25))
            },
            20: {
                $tf: scale3d(comma(1.1, 1.1, 1.1))
            },
            40: {
                $tf: scale3d(comma(0.9, 0.9, 0.9))
            },
            60: {
                $o: 1,
                $tf: scale3d(comma(1.05, 1.05, 1.05))
            },
            80: {
                $tf: scale3d(comma(0.95, 0.95, 0.95))
            },
            to: {
                $o: 1,
                $tf: scaleX(1)
            }
        },
        [BOUNCE_OUT]: {
            20: {
                $tf: scale3d(comma(0.9, 0.9, 0.9))
            },
            '50%, 55%': {
                $o: 1,
                $tf: scale3d(comma(1.1, 1.1, 1.1))
            },
            to: {
                $o: 0,
                $tf: scale3d(comma(0.3, 0.3, 0.3))
            }
        },
        [FADE_IN]: {
            0: {
                $o: 0
            },
            to: {
                $o: 1
            }
        },
        [FADE_IN_DOWN]: {
            0: {
                $o: 0,
                $tf: translate3d(0, '100%', 0)
            },
            to: {
                $o: 1,
                $tf: translateZ(0)
            }
        },
        [FADE_IN_LEFT]: {
            0: {
                $o: 0,
                $tf: translate3d('-100%', 0, 0)
            },
            to: {
                $o: 1,
                $tf: translateZ(0)
            }
        },
        [FADE_IN_RIGHT]: {
            0: {
                $o: 0,
                $tf: translate3d('-100%', 0, 0)
            },
            to: {
                $o: 1,
                $tf: translateZ(0)
            }
        },
        [FADE_IN_UP]: {
            0: {
                $o: 0,
                $tf: translate3d(0, '100%', 0)
            },
            to: {
                $o: 1,
                $tf: translateZ(0)
            }
        },
        [FADE_OUT]: {
            0: {
                $o: 1
            },
            to: {
                $o: 0
            }
        },
        [FADE_OUT_DOWN]: {
            0: {
                $o: 1
            },
            to: {
                $o: 0,
                $tf: translate3d(0, '-100%', 0)
            }
        },
        [FADE_OUT_LEFT]: {
            0: {
                $o: 1
            },
            to: {
                $o: 0,
                $tf: translate3d('-100%', 0, 0)
            }
        },
        [FADE_OUT_RIGHT]: {
            0: {
                $o: 1
            },
            to: {
                $o: 0,
                $tf: translate3d('100%', 0, 0)
            }
        },
        [FADE_OUT_UP]: {
            0: {
                $o: 1
            },
            to: {
                $o: 0,
                $tf: translate3d(0, '-100%', 0)
            }
        },
        [FLIP_IN_X]: {
            0: {
                $atf: '{ttf.ei}',
                $o: 0,
                $tf: space(PERSP_25REM, rotateX(DEG[90]))
            },
            40: {
                $atf: '{ttf.ei}',
                $tf: space(PERSP_25REM, rotateX(DEG[-20]))
            },
            60: {
                $o: 1,
                $tf: space(PERSP_25REM, rotateX(DEG[10]))
            },
            80: {
                $tf: space(PERSP_25REM, rotateX(DEG[-5]))
            },
            to: {
                $tf: PERSP_25REM
            }
        },
        [FLIP_IN_Y]: {
            0: {
                $atf: '{ttf.ei}',
                $o: 0,
                $tf: space(PERSP_25REM, rotateY(DEG[90]))
            },
            40: {
                $atf: '{ttf.ei}',
                $tf: space(PERSP_25REM, rotateY(DEG[-20]))
            },
            60: {
                $o: 1,
                $tf: space(PERSP_25REM, rotateY(DEG[10]))
            },
            80: {
                $tf: space(PERSP_25REM, rotateY(DEG[-5]))
            },
            to: {
                $tf: PERSP_25REM
            }
        },
        [FLIP_OUT_X]: {
            0: {
                $tf: PERSP_25REM
            },
            30: {
                $o: 1,
                $tf: space(PERSP_25REM, rotateX(DEG[-20]))
            },
            to: {
                $o: 0,
                $tf: space(PERSP_25REM, rotateX(DEG[90]))
            }
        },
        [FLIP_OUT_Y]: {
            0: {
                $tf: PERSP_25REM
            },
            30: {
                $o: 1,
                $tf: space(PERSP_25REM, rotateY(DEG[-15]))
            },
            to: {
                $o: 0,
                $tf: space(PERSP_25REM, rotateY(DEG[90]))
            }
        },
        [SLIDE_IN_DOWN]: {
            0: {
                $tf: translate3d(0, '-100%', 0),
                $v: '{v.v}'
            },
            to: {
                $tf: translateZ(0)
            }
        },
        [SLIDE_IN_LEFT]: {
            0: {
                $tf: translate3d('-100%', 0, 0),
                $v: '{v.v}'
            },
            to: {
                $tf: translateZ(0)
            }
        },
        [SLIDE_IN_RIGHT]: {
            0: {
                $tf: translate3d('100%', 0, 0),
                $v: '{v.v}'
            },
            to: {
                $tf: translateZ(0)
            }
        },
        [SLIDE_IN_UP]: {
            0: {
                $tf: translate3d(0, '100%', 0),
                $v: '{v.v}'
            },
            to: {
                $tf: translateZ(0)
            }
        },
        [SLIDE_OUT_DOWN]: {
            0: {
                $tf: translateZ(0)
            },
            to: {
                $tf: translate3d(0, '100%', 0),
                $v: '{v.h}'
            }
        },
        [SLIDE_OUT_LEFT]: {
            0: {
                $tf: translateZ(0)
            },
            to: {
                $tf: translate3d('-100%', 0, 0),
                $v: '{v.h}'
            }
        },
        [SLIDE_OUT_RIGHT]: {
            0: {
                $tf: translateZ(0)
            },
            to: {
                $tf: translate3d('100%', 0, 0),
                $v: '{v.h}'
            }
        },
        [SLIDE_OUT_UP]: {
            0: {
                $tf: translateZ(0)
            },
            to: {
                $tf: translate3d(0, '-100%', 0),
                $v: '{v.h}'
            }
        },
    },
    c: getAnimations([
        ZOOM_IN,
        ZOOM_OUT,
        PULSE,
        HEARTBEAT,
        BOUNCE_IN,
        BOUNCE_OUT,
        FADE_IN,
        FADE_IN_DOWN,
        FADE_IN_LEFT,
        FADE_IN_RIGHT,
        FADE_IN_UP,
        FADE_OUT,
        FADE_OUT_DOWN,
        FADE_OUT_LEFT,
        FADE_OUT_RIGHT,
        FADE_OUT_UP,
        FLIP_IN_X,
        FLIP_IN_Y,
        FLIP_OUT_X,
        FLIP_OUT_Y,
        SLIDE_IN_DOWN,
        SLIDE_IN_LEFT,
        SLIDE_IN_RIGHT,
        SLIDE_IN_UP,
        SLIDE_OUT_DOWN,
        SLIDE_OUT_LEFT,
        SLIDE_OUT_RIGHT,
        SLIDE_OUT_UP
    ])
} as TStyleConfig;
