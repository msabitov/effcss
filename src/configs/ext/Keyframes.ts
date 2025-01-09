import { comma, space, atKeyframes } from '../../css/functions';
import { argsToDeg, argsToPercent, rotateX, rotateY, scale, scale3d, scaleX, translate3d, translateZ, perspective } from '../../css/functions';
import { TStyleConfig } from 'types';

export interface IKeyframesConfig {
    an:
        | 'zoomIn'
        | 'zoomOut'
        | 'pulse'
        | 'heartbeat'
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

const PER = argsToPercent(0, 0.5, 0.15, 0.45, 0.30, 0.70, 0.20, 0.40, 0.80, 0.60, 0.55, 1, -1);

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

const TO = 'to';

const PERSP_25REM = perspective(25 + 'rem');

const getAnimations = (names: string[]) => ({
    $an: names.reduce((acc, name) => {
        acc[name] = name;
        return acc;
    }, {})
});

export default {
    k: {
        0: '0%',
        20: '20%',
        30: '30%',
        40: '40%',
        50: '50%',
        60: '60%',
        80: '80%'
    },
    c: {
        [atKeyframes(ZOOM_IN)]: {
            $0: {
                $o: 0,
                $tf: scale3d(comma(0.25, 0.25, 0.25))
            },
            $50: {
                $o: 1
            }
        },
        [atKeyframes(ZOOM_OUT)]: {
            $0: {
                $o: 1
            },
            $50: {
                $o: 0,
                $tf: scale3d(comma(0.25, 0.25, 0.25))
            },
            to: {
                $o: 0
            }
        },
        [atKeyframes(PULSE)]: {
            $0: {
                $tf: scaleX(1)
            },
            $50: {
                $tf: scale3d(comma(1.05, 1.05, 1.05))
            },
            to: {
                $tf: scaleX(1)
            }
        },
        [atKeyframes(HEARTBEAT)]: {
            $0: {
                $tf: scale(1)
            },
            [PER[15]]: {
                $tf: scale(1.25)
            },
            $30: {
                $tf: scale(1)
            },
            [PER[45]]: {
                $tf: scale(1.25)
            },
            [PER[70]]: {
                $tf: scale(0)
            }
        },
        [atKeyframes(BOUNCE_IN)]: {
            [comma(PER[0], PER[20], PER[40], PER[60], PER[80], TO)]: {
                $atf: 'cubic-bezier(.215,.61,.355,1)'
            },
            $0: {
                $o: 0,
                $tf: scale3d(comma(0.25, 0.25, 0.25))
            },
            [PER[20]]: {
                $tf: scale3d(comma(1.1, 1.1, 1.1))
            },
            $40: {
                $tf: scale3d(comma(0.9, 0.9, 0.9))
            },
            $60: {
                $o: 1,
                $tf: scale3d(comma(1.05, 1.05, 1.05))
            },
            $80: {
                $tf: scale3d(comma(0.95, 0.95, 0.95))
            },
            to: {
                $o: 1,
                $tf: scaleX(1)
            }
        },
        [atKeyframes(BOUNCE_OUT)]: {
            [PER[20]]: {
                $tf: scale3d(comma(0.9, 0.9, 0.9))
            },
            [comma(PER[50], PER[55])]: {
                $o: 1,
                $tf: scale3d(comma(1.1, 1.1, 1.1))
            },
            to: {
                $o: 0,
                $tf: scale3d(comma(0.3, 0.3, 0.3))
            }
        },
        [atKeyframes(FADE_IN)]: {
            $0: {
                $o: 0
            },
            to: {
                $o: 1
            }
        },
        [atKeyframes(FADE_IN_DOWN)]: {
            $0: {
                $o: 0,
                $tf: translate3d(0, PER[100], 0)
            },
            to: {
                $o: 1,
                $tf: translateZ(0)
            }
        },
        [atKeyframes(FADE_IN_LEFT)]: {
            $0: {
                $o: 0,
                $tf: translate3d(PER[-100], 0, 0)
            },
            to: {
                $o: 1,
                $tf: translateZ(0)
            }
        },
        [atKeyframes(FADE_IN_RIGHT)]: {
            $0: {
                $o: 0,
                $tf: translate3d(PER[-100], 0, 0)
            },
            to: {
                $o: 1,
                $tf: translateZ(0)
            }
        },
        [atKeyframes(FADE_IN_UP)]: {
            $0: {
                $o: 0,
                $tf: translate3d(0, PER[100], 0)
            },
            to: {
                $o: 1,
                $tf: translateZ(0)
            }
        },
        [atKeyframes(FADE_OUT)]: {
            $0: {
                $o: 1
            },
            to: {
                $o: 0
            }
        },
        [atKeyframes(FADE_OUT_DOWN)]: {
            $0: {
                $o: 1
            },
            to: {
                $o: 0,
                $tf: translate3d(0, PER[-100], 0)
            }
        },
        [atKeyframes(FADE_OUT_LEFT)]: {
            $0: {
                $o: 1
            },
            to: {
                $o: 0,
                $tf: translate3d(PER[-100], 0, 0)
            }
        },
        [atKeyframes(FADE_OUT_RIGHT)]: {
            $0: {
                $o: 1
            },
            to: {
                $o: 0,
                $tf: translate3d(PER[100], 0, 0)
            }
        },
        [atKeyframes(FADE_OUT_UP)]: {
            $0: {
                $o: 1
            },
            to: {
                $o: 0,
                $tf: translate3d(0, PER[-100], 0)
            }
        },
        [atKeyframes(FLIP_IN_X)]: {
            $0: {
                $atf: '{ttf.ei}',
                $o: 0,
                $tf: space(PERSP_25REM, rotateX(DEG[90]))
            },
            $40: {
                $atf: '{ttf.ei}',
                $tf: space(PERSP_25REM, rotateX(DEG[-20]))
            },
            $60: {
                $o: 1,
                $tf: space(PERSP_25REM, rotateX(DEG[10]))
            },
            $80: {
                $tf: space(PERSP_25REM, rotateX(DEG[-5]))
            },
            to: {
                $tf: PERSP_25REM
            }
        },
        [atKeyframes(FLIP_IN_Y)]: {
            $0: {
                $atf: '{ttf.ei}',
                $o: 0,
                $tf: space(PERSP_25REM, rotateY(DEG[90]))
            },
            $40: {
                $atf: '{ttf.ei}',
                $tf: space(PERSP_25REM, rotateY(DEG[-20]))
            },
            $60: {
                $o: 1,
                $tf: space(PERSP_25REM, rotateY(DEG[10]))
            },
            $80: {
                $tf: space(PERSP_25REM, rotateY(DEG[-5]))
            },
            to: {
                $tf: PERSP_25REM
            }
        },
        [atKeyframes(FLIP_OUT_X)]: {
            $0: {
                $tf: PERSP_25REM
            },
            $30: {
                $o: 1,
                $tf: space(PERSP_25REM, rotateX(DEG[-20]))
            },
            to: {
                $o: 0,
                $tf: space(PERSP_25REM, rotateX(DEG[90]))
            }
        },
        [atKeyframes(FLIP_OUT_Y)]: {
            $0: {
                $tf: PERSP_25REM
            },
            $30: {
                $o: 1,
                $tf: space(PERSP_25REM, rotateY(DEG[-15]))
            },
            to: {
                $o: 0,
                $tf: space(PERSP_25REM, rotateY(DEG[90]))
            }
        },
        [atKeyframes(SLIDE_IN_DOWN)]: {
            $0: {
                $tf: translate3d(0, PER[-100], 0),
                $v: '{v.v}'
            },
            to: {
                $tf: translateZ(0)
            }
        },
        [atKeyframes(SLIDE_IN_LEFT)]: {
            $0: {
                $tf: translate3d(PER[-100], 0, 0),
                $v: '{v.v}'
            },
            to: {
                $tf: translateZ(0)
            }
        },
        [atKeyframes(SLIDE_IN_RIGHT)]: {
            $0: {
                $tf: translate3d(PER[100], 0, 0),
                $v: '{v.v}'
            },
            to: {
                $tf: translateZ(0)
            }
        },
        [atKeyframes(SLIDE_IN_UP)]: {
            $0: {
                $tf: translate3d(0, PER[100], 0),
                $v: '{v.v}'
            },
            to: {
                $tf: translateZ(0)
            }
        },
        [atKeyframes(SLIDE_OUT_DOWN)]: {
            $0: {
                $tf: translateZ(0)
            },
            to: {
                $tf: translate3d(0, PER[100], 0),
                $v: '{v.h}'
            }
        },
        [atKeyframes(SLIDE_OUT_LEFT)]: {
            $0: {
                $tf: translateZ(0)
            },
            to: {
                $tf: translate3d(PER[-100], 0, 0),
                $v: '{v.h}'
            }
        },
        [atKeyframes(SLIDE_OUT_RIGHT)]: {
            $0: {
                $tf: translateZ(0)
            },
            to: {
                $tf: translate3d(PER[100], 0, 0),
                $v: '{v.h}'
            }
        },
        [atKeyframes(SLIDE_OUT_UP)]: {
            $0: {
                $tf: translateZ(0)
            },
            to: {
                $tf: translate3d(0, PER[-100], 0),
                $v: '{v.h}'
            }
        },
        ...getAnimations([
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
    }
} as TStyleConfig;
