import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';// rollup.config.js
import typescript from '@rollup/plugin-typescript';
import pkg from './package.json';
import {defineConfig} from 'rollup'


export default defineConfig([
    // browser-friendly UMD build
    {
        input: 'src/index.ts',
        output: [ {
            dir: 'dist',
            format: 'cjs',
            file: 'api.js',
        },{
            dir: 'dist',
            format: 'module',
            file: 'api.esm.js',
        }],
        plugins: [
            typescript({ tsconfig: './tsconfig.build.json' }),
            resolve(), // so Rollup can find `ms`
            commonjs() // so Rollup can convert `ms` to an ES module
        ]
    },

    // CommonJS (for Node) and ES module (for bundlers) build.
    // (We could have three entries in the configuration array
    // instead of two, but it's quicker to generate multiple
    // builds from a single configuration where possible, using
    // an array for the `output` option, where we can specify
    // `file` and `format` for each target)
    {
        input: 'src/main.js',
        external: ['ms'],
        output: [
            { file: pkg.main, format: 'cjs' },
            { file: pkg.module, format: 'es' }
        ]
    }
])
