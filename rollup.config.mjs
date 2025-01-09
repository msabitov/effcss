import typescript from '@rollup/plugin-typescript';
import terser from '@rollup/plugin-terser';

export default [
    {
        input: {
            index: 'src/index.ts',
            utils: 'src/utils.ts',
            'configs/basic': 'src/configs/basic.ts',
            'configs/ext': 'src/configs/ext.ts',
            'css/dict': 'src/css/dict.ts',
            'css/functions': 'src/css/functions.ts'
        },
        output: {
            dir: 'dist',
            format: 'es',
            plugins: [
                terser(),
            ]
        },
        plugins: [
            typescript({
                tsconfig: 'tsconfig.json'
            }),
        ]
    },
    {
        input: 'build/defineProvider.ts',
        output: {
            file: 'dist/build/define-provider.min.js',
            format: 'es',
            plugins: [
                terser(),
            ]
        },
        plugins: [
            typescript({
                compilerOptions: {
                    declaration: false
                }
            }),
        ]
    },
    {
        input: 'build/defineProviderWithConfigs.ts',
        output: {
            file: 'dist/build/define-provider-with-configs.min.js',
            format: 'es',
            plugins: [
                terser(),
            ]
        },
        plugins: [
            typescript({
                compilerOptions: {
                    declaration: false
                }
            }),
        ]
    }
];
