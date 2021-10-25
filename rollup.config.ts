import ts from 'rollup-plugin-typescript2';
import { defineConfig, OutputOptions, RollupOptions } from 'rollup';
import path from 'path';
import { visualizer } from 'rollup-plugin-visualizer';
import { sizeSnapshot } from 'rollup-plugin-size-snapshot';
import progress from 'rollup-plugin-progress';
// import dts from 'rollup-plugin-dts'
import deepmerge from 'deepmerge';
// dts({})
const resolve = (...parts) => path.resolve(__dirname, ...parts);

const name = 'streams-api';

const outputConfigs: Record<string, OutputOptions> = {
    'esm-bundler': {
        file  : resolve(`dist/${name}.esm-bundler.js`),
        format: `es`,
    },
    'esm-browser': {
        file  : resolve(`dist/${name}.esm-browser.js`),
        format: `es`,
    },
    cjs          : {
        file  : resolve(`dist/${name}.cjs.js`),
        format: `cjs`,
    },
    global       : {
        file  : resolve(`dist/${name}.global.js`),
        format: `iife`,
        name  : 'streamsApi',
    },
};
const globalPlugins                                = [
    visualizer({
        filename: 'dist/stats.html',
        gzipSize: true,
        open    : false,
    }),
    sizeSnapshot({
        printInfo: true,
    }),
    progress({
        clearLine: true,
    }),
];
const packageConfigs                               = [];

const formats = Object.keys(outputConfigs);

formats.forEach(format => {
    packageConfigs.push(createConfig(format, { output: { sourcemap: true } }));
    packageConfigs.push(createMinifiedConfig(format));
});
export default packageConfigs;

function createConfig(format: string, options: Partial<RollupOptions> = {}) {
    const output: OutputOptions = deepmerge(outputConfigs[ format ], (options.output as OutputOptions) || {});
    output.sourcemap            = output.sourcemap === undefined ? false : output.sourcemap;
    const config                = defineConfig({
        input  : 'src/index.ts',
        output,
        onwarn : (msg, warn) => {
            if ( !/Circular/.test(msg as any) ) {
                warn(msg);
            }
        },
        plugins: [
            require('@rollup/plugin-node-resolve').nodeResolve({
                    moduleDirectories: [ resolve('node_modules'), resolve('../../../node_modules') ],
                    preferBuiltins   : true,
                },
            ),
            require('rollup-plugin-polyfill-node')(),
            require('@rollup/plugin-commonjs')({
                sourceMap: output.sourcemap,
            }),
            ts({
                check           : false,
                tsconfig        : resolve(__dirname, 'tsconfig.build.json'),
                cacheRoot       : resolve(__dirname, 'node_modules/.rts2_cache'),
                tsconfigOverride: {

                    compilerOptions: {
                        module: 'esnext',
                        sourceMap  : output.sourcemap,
                        declaration: false,
                    },
                    exclude        : [ '**/__tests__', 'test-dts' ],
                },
            }),
            visualizer({
                filename: `dist/stats-${format}.html`,
                gzipSize: true,
                open    : false,
            }),
            progress({
                clearLine: true,
            }),
            sizeSnapshot({
                printInfo: true,
            }),
        ],
    });
    return deepmerge(config, options);
}


function createMinifiedConfig(format) {
    const { terser } = require('rollup-plugin-terser');
    return createConfig(format, {
        output : {
            file     : outputConfigs[ format ].file.replace(/\.js$/, '.prod.js'),
            format   : outputConfigs[ format ].format,
            sourcemap: false,
        },
        plugins: [
            terser({
                module  : /^esm/.test(format),
                compress: {
                    ecma        : 2015,
                    pure_getters: true,
                },
                safari10: true,
            }),
        ],
    });
}
