export declare class Str {
    static random(length?: number): string;
    static ensureLeft(str: string, left: string): string;
    static ensureRight(str: string, right: string): string;
    static stripLeft(str: string, left: string): string;
    static stripRight(str: string, right: string): string;
    static ucfirst(string: any): any;
    static lcfirst(string: any): any;
    static parameters(str: string, params: Record<string, string>): string;
}
/**
 *
 * @param obj
 * @param k
 * @param v
 * @example
 *
 * params = Object.entries(params).filter(([ key, value ]) => {
 *     return value.toString().length > 0;
 * }).reduce(utils.objectify, {});
 *
 */
export declare const objectify: (obj: any, [k, v]: [any, any]) => any;
export declare class Obj {
    static merge(...objs: any[]): object;
    static clone<T extends object>(obj: T): T;
    static exclude<T extends object, K extends keyof T>(obj: T, keys: K[]): T;
}
