import { TModeValues } from 'types';
import { values } from '../css/dict';

/**
 * Default style params
 */
export const defaultParams: TModeValues = {
    /**
     * Light mode
     */
    light: {
        // lightness
        lig: {
            def: 0.75,
            // contrast
            c: 0.05,
            s: 0.65,
            m: 0.75,
            l: 0.85,
            // neutral
            n: 0.9
        }
    },
    /**
     * Dark mode
     */
    dark: {
        // lightness
        lig: {
            def: 0.4,
            n: 0.25,
            s: 0.3,
            m: 0.4,
            l: 0.5,
            c: 0.95
        }
    },
    /**
     * Default root mode
     */
    root: {
        /**
         * lightness
         */
        lig: {
            /**
             * 
             */
            def: 0.75,
            // contrast
            c: 0.05,
            s: 0.65,
            m: 0.75,
            l: 0.85,
            // neutral
            n: 0.9
        },
        /**
         * hue
         */
        hue: {
            def: 261.35,
            // brand
            b: 261.35,
            // info
            i: 194.77,
            // error
            e: 29.23,
            // warning
            w: 70.66,
            // success
            s: 142.49
        },
        /**
         * chroma
         */
        chr: {
            def: 0.03,
            xs: 0.03,
            s: 0.06,
            m: 0.1,
            l: 0.15,
            xl: 0.25
        },
        /**
         * alpha
         */
        alp: {
            def: 1,
            min: 0,
            xs: 0.1,
            s: 0.25,
            m: 0.5,
            l: 0.75,
            xl: 0.9,
            max: 1
        },
        /**
         * Root font-size
         */
        rem: {
            def: 16
        },
        /**
         * font-family
         */
        ff: {
            def: 'Roboto, sans-serif',
            b: 'Georgia, serif'
        },
        /**
         * Font-weight
         */
        fwg: {
            xs: 100,
            s: 200,
            m: 400,
            l: 600,
            xl: 700
        },
        /**
         * Time
         */
        time: {
            def: 300,
            xs: 100,
            s: 200,
            m: 300,
            l: 450,
            xl: 600,
            no: 0,
            min: 50,
            max: 750
        },
        /**
         * Coefficients
         */
        coef: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].reduce((acc, val) => {
            acc[val] = val;
            return acc;
        }, {}),
        /**
         * Ratio coefficients
         */
        rat: {
            1: 1,
            '2/1': 2,
            '1/2': 0.5,
            '4/3': 1.3333,
            '3/4': 0.75,
            '9/16': 0.5625,
            '16/9': 1.7778
        },
        /**
         * Spacing
         */
        sp: {
            '3xs': 0.125,
            '2xs': 0.25,
            xs: 0.5,
            s: 0.75,
            m: 1,
            l: 1.25,
            xl: 1.5,
            '2xl': 2,
            '3xl': 4
        },
        /**
         * Size
         */
        sz: {
            '3xs': 1,
            '2xs': 1.5,
            xs: 2,
            s: 5,
            m: 10,
            l: 15,
            xl: 20,
            '2xl': 25,
            '3xl': 30
        },
        /**
         * Universal size units
         */
        szu: {
            a: 'auto',
            no: 0
        },
        /**
         * Breakpoints
         */
        bp: {
            xs: 30,
            sm: 40,
            md: 48,
            lg: 64,
            xl: 80
        },
        /**
         * Opacity
         */
        o: {
            min: 0,
            xs: 0.1,
            s: 0.25,
            m: 0.5,
            l: 0.75,
            xl: 0.9,
            max: 1
        },
        /**
         * Viewport units
         */
        vu: {
            0: 0,
            '1/4': 25,
            '1/2': 50,
            '3/4': 75,
            1: 100
        },
        /**
         * Container query units
         */
        cqu: {
            0: 0,
            '1/4': 25,
            '1/2': 50,
            '3/4': 75,
            1: 100
        },
        /**
         * Fractions (between 0 and 1)
         */
        fr: {
            0: 0,
            '1/12': '0.0833',
            '1/10': '0.1',
            '1/6': '0.1667',
            '1/5': '0.2',
            '1/4': '0.25',
            '3/10': '0.3',
            '1/3': '0.3333',
            '2/5': '0.4',
            '5/12': '0.4167',
            '1/2': '0.5',
            '7/12': '0.5833',
            '3/5': '0.6',
            '2/3': '0.6667',
            '7/10': '0.7',
            '3/4': '0.75',
            '4/5': '0.8',
            '5/6': '0.8333',
            '9/10': '0.9',
            '11/12': '0.9167',
            1: '1'
        },
        /**
         * Radius
         */
        rad: {
            s: 0.5,
            m: 1,
            l: 2
        },
        /**
         * Thickness
         */
        th: {
            s: 0.1,
            m: 0.25,
            l: 0.5
        },
        /**
         * Scale coefficients
         */
        sc: {
            xs: 0.5,
            s: 0.67,
            m: 1,
            l: 1.5,
            xl: 2
        },
        /**
         * Translate coefficients
         */
        tr: {
            xs: 0.25,
            s: 0.5,
            m: 1,
            l: 1.5,
            xl: 2
        },
        /**
         * Skew coefficients
         */
        sk: {
            xs: -15,
            s: -10,
            m: 0,
            l: 10,
            xl: 15
        },
        /**
         * Rotate coefficients
         */
        rot: {
            xs: -180,
            s: -90,
            m: 0,
            l: 90,
            xl: 180
        },
        /**
         * Zoom coefficients
         */
        zm: {
            s: 0.8,
            m: 1,
            l: 1.2
        },
        /**
         * Perspective coefficients
         */
        pers: {
            s: '100px',
            m: '200px'
        },
        /**
         * Font-size coefficients
         */
        fsz: {
            xs: 0.25,
            s: 0.5,
            m: 1,
            l: 1.5,
            xl: 2
        },
        /**
         * Line-height coefficients
         */
        lh: {
            xs: 1,
            s: 1.25,
            m: 1.5,
            l: 1.75,
            xl: 2
        },
        /**
         * Letter-spacing coefficients
         */
        lsp: {
            no: 0,
            s: 0.05,
            m: 0.1,
            l: 0.2
        },
        /**
         * Z-index coefficients
         */
        zi: {
            1: 1,
            2: 2,
            3: 3,
            4: 4,
            5: 5
        },
        /**
         * Animation-iteration-count coefficients
         */
        ic: {
            inf: 'infinite',
            1: 1,
            2: 2
        },
        ...values
    }
};
