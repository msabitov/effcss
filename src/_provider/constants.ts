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
    root: values
};
