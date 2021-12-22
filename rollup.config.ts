import ts from 'rollup-plugin-typescript2';
import { defineConfig, OutputOptions, RollupOptions } from 'rollup';
import { visualizer } from 'rollup-plugin-visualizer';
import { sizeSnapshot } from 'rollup-plugin-size-snapshot';
import progress from 'rollup-plugin-progress';
// import dts from 'rollup-plugin-dts'
import nodePolyfills from 'rollup-plugin-polyfill-node';
import deepmerge from 'deepmerge';
import { terser } from 'rollup-plugin-terser';
import { existsSync, mkdirSync } from 'fs';
import path from 'path';

export const ensureDirSync = (...parts: string[]) => {
    let path = resolve(...parts);
    if ( !existsSync(path) ) {
        mkdirSync(path, { recursive: true });
    }
    return path;
};
export const resolve       = (...parts) => path.join(...parts);

export interface Options extends Partial<RollupOptions> {
    output?: OutputOptions;
}

const name           = 'streams-api';
const dir            = 'dist';
const packageConfigs = [];


const configs: Record<string, Options> = {
    'esm-bundler': {
        output: {
            file  : name, //resolve(`dist/${name}.esm-bundler.js`),
            format: `es`,
        },
    },
    'esm-browser': {
        output: {
            file  : name, //resolve(`dist/${name}.esm-browser.js`),
            format: `es`,
        },
    },
    cjs          : {
        output: {
            file   : name, //resolve(`dist/${name}.cjs.js`),
            format : `cjs`,
            exports: 'named',
        },
    },
    global       : {
        output: {
            file   : name, //resolve(`dist/${name}.global.js`),
            format : `iife`,
            name   : 'streamsApi',
            exports: 'named',
        },
    },
};

const formats = Object.keys(configs);

formats.forEach(format => {
    let config = configs[ format ];
    packageConfigs.push(createConfig(format, {
        output: {
            sourcemap: true,
        },
    }));
    packageConfigs.push(createConfig(format, {
        external: [ 'axios', 'qs' ],
        output  : {
            file     : config.output.file + '.nodedeps',
            sourcemap: true,
            globals  : {
                axios: 'Axios',
                qs   : 'qs',
            },
        },
    }));
    packageConfigs.push(createMinifiedConfig(format, {
        output: {
            file: config.output.file + '.min',
        },
    }));
    packageConfigs.push(createMinifiedConfig(format, {
        external: [ 'axios', 'qs' ],
        output  : {
            file     : config.output.file + '.nodedeps.min',
            sourcemap: true,
            globals  : {
                axios: 'Axios',
                qs   : 'qs',
            },
        },
    }));
});
export default packageConfigs;


function createConfig(format: string, options: Options = {}) {
    options          = deepmerge.all([ configs[ format ] as Options, (options as Options) || {} ], { clone: true });
    let output       = options.output;
    output.sourcemap = output.sourcemap === undefined ? false : output.sourcemap;
    output.file      = resolve(dir, `${output.file}.${format}.js`);

    const config = defineConfig({
        input  : 'src/index.ts',
        output,
        onwarn : (msg, warn) => {
            if ( !/Circular/.test(msg as any) ) {
                warn(msg);
            }
        },
        plugins: [
            nodePolyfills({
                baseDir: resolve('../../../node_modules'),
                include: [ 'util' ],
                exclude: ['/.*/']
            }),
            require('@rollup/plugin-node-resolve').nodeResolve({
                    moduleDirectories: [ resolve('node_modules'), resolve('../../../node_modules') ],
                    preferBuiltins   : true,
                },
            ),
            require('@rollup/plugin-commonjs')({
                sourceMap: output.sourcemap,
            }),
            ts({
                check           : false,
                tsconfig        : resolve(__dirname, 'tsconfig.build.json'),
                cacheRoot       : resolve(__dirname, 'node_modules/.rts2_cache'),
                tsconfigOverride: {

                    compilerOptions: {
                        module     : 'esnext',
                        sourceMap  : output.sourcemap,
                        declaration: false,
                    },
                    exclude        : [ '**/__tests__', 'test-dts' ],
                },
            }),
            visualizer({
                filename: `docs/visualizer/${output.file}-${format}.html`,
                gzipSize: true,
                open    : false,
            }),
            progress({
                clearLine: true,
            }),
            sizeSnapshot({ printInfo: false }),
        ],
    });
    return deepmerge(config, options);
}


function createMinifiedConfig(format, options: Partial<Options> = {}) {
    const { terser } = require('rollup-plugin-terser');
    options          = deepmerge(configs[ format ], options, { clone: true });
    options          = deepmerge(options, {
        output : {
            format   : options.output.format,
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
    }, { clone: true });
    return createConfig(format, options);
}
