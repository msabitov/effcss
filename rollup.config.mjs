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

const output =  {
    dir: 'dist',
    banner,
    format: 'es',
    plugins: [
        terser(),
    ]
};
const tsPlugin = typescript({
    tsconfig: 'tsconfig.json'
});

export default [
    {
        input: {
            index: 'src/index.ts',
        },
        output,
        plugins: [
            cleaner({
                targets: [
                  './dist/'
                ]
            }),
            tsPlugin
        ]
    },
    {
        input: {
            consumer: 'src/consumer.ts'
        },
        output,
        plugins: [
            tsPlugin
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
