import { OutputOptions, RollupOptions } from 'rollup';


export interface SizeSnapshot {
    bundled: number;
    minified: number;
    gzipped: number;
    treeshaked?: {
        rollup?: {
            code: number
            import_statements: number
        },
        webpack?: {
            code: number
        }
    };
}

export interface AnalyzeSnapshot {
    bundled: string;
    minified: string;
    gzipped: string;
    rollup?: string;
    import_statements?: number;
    webpack?: string;
}
export type Analysis=Record<string, AnalyzeSnapshot>

export interface FileSizeOptions {
    /**
     * Number base, default is 10
     */
    base?: number;
    /**
     * Enables bit sizes, default is false
     */
    bits?: boolean;
    /**
     * Specifies the SI suffix via exponent, e.g. 2 is MB for bytes, default is -1
     */
    exponent?: number;
    /**
     * Enables full form of unit of measure, default is false
     */
    fullform?: boolean;
    /**
     * Array of full form overrides, default is []
     */
    fullforms?: string[];
    /**
     * BCP 47 language tag to specify a locale, or true to use default locale, default is ""
     */
    locale?: string | boolean;
    /**
     * ECMA-402 number format option overrides, default is "{}"
     */
    localeOptions?: Intl.NumberFormatOptions;
    /**
     * Output of function (array, exponent, object, or string), default is string
     */
    output?: 'array' | 'exponent' | 'object' | 'string';
    /**
     * Decimal place, default is 2
     */
    round?: number;
    /**
     * Decimal separator character, default is `.`
     */
    separator?: string;
    /**
     * Character between the result and suffix, default is ` `
     */
    spacer?: string;
    /**
     * Standard unit of measure, can be iec or jedec, default is iec; can be overruled by base
     */
    standard?: 'iec' | 'jedec';
    /**
     * Dictionary of SI/JEDEC symbols to replace for localization, defaults to english if no match is found
     */
    symbols?: any;
    /**
     *  Enables unix style human readable output, e.g ls -lh, default is false
     */
    unix?: boolean;
    /**
     * Rounding method, can be round, floor, or ceil, default is round
     */
    roundingMethod?: 'round' | 'floor' | 'ceil';
}

export interface Options extends Partial<RollupOptions> {
    output?: OutputOptions;
}
