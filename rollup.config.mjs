import typescript from '@rollup/plugin-typescript';
import terser from '@rollup/plugin-terser';
import cleaner from 'rollup-plugin-cleaner';
import json from './package.json' with { type: 'json' };

const banner = `/*
* EffCSS v${json.version}
* {@link ${json.repository.url}}
* Copyright (c) Marat Sabitov
* @license ${json.license}
*/`;

export default [
    {
        input: {
            index: 'src/index.ts',
            constants: 'src/constants.ts',
            'utils/common': 'src/utils/common.ts',
            'utils/browser': 'src/utils/browser.ts'
        },
        output: {
            dir: 'dist',
            format: 'es',
            plugins: [
                terser(),
            ]
        },
        plugins: [
            cleaner({
                targets: [
                  './dist/'
                ]
            }),
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
            banner,
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
