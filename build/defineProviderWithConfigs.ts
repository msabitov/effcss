import { defineStyleProvider } from '../src/index';
import * as configsExt from '../src/configs/ext';
import * as configsBasic from '../src/configs/basic';

defineStyleProvider({
    config: {
        styles: {
            ...configsBasic,
            ...configsExt
        }
    }
});
