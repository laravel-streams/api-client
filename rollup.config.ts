import ts from 'rollup-plugin-typescript2';
import { defineConfig, OutputOptions, RollupOptions } from 'rollup';
import { sizeSnapshot } from 'rollup-plugin-size-snapshot';
import progress from 'rollup-plugin-progress';
import nodePolyfills from 'rollup-plugin-polyfill-node';
import deepmerge from 'deepmerge';
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
            file  : name,
            format: `es`,
        },
    },
    cjs          : {
        output: {
            file   : name,
            format : `cjs`,
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
});
export default packageConfigs;


function createConfig(format: string, options: Options = {}) {
    options          = deepmerge.all([ configs[ format ] as Options, (options as Options) || {} ], { clone: true });
    let output       = options.output;
    output.sourcemap = output.sourcemap === undefined ? false : output.sourcemap;
    const fileName   = `${output.file}.${format}.js`;
    output.file      = resolve(dir, fileName);

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
                exclude: [ '/.*/' ],
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
            progress({ clearLine: true }),
            sizeSnapshot({ printInfo: false }),
        ],
    });
    return deepmerge(config, options);
}

