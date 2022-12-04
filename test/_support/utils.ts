import 'reflect-metadata';
import { dirname, join } from 'path';
import { existsSync } from 'fs';
import { config } from 'dotenv';

export function getDotEnvPath(): string | false {
    let dirPath = __dirname;
    while ( true ) {
        let envPath = join(dirPath, '.env');
        if ( existsSync(envPath) ) {
            return envPath;
        }
        if ( dirname(dirPath) === dirPath ) {
            return false;
        }
        dirPath = dirname(dirPath);
    }
}

export function getDotEnv(): any {
    let dotEnvPath = getDotEnvPath();
    let parsed     = {};
    if ( dotEnvPath ) {
        let env = config({
            path    : dotEnvPath,
            encoding: 'utf8',
        });
        parsed  = env.parsed;
    }
    return parsed;
}

export function getEnv<T = any>(): ProxyEnv<T> {
    getDotEnv();
    return proxyEnv(process.env) as any;
}

export const enum ProxyFlags {
    IS_PROXY = '__s_is_proxy',
    UNPROXY  = '__s_unproxy'
}

export type ProxyEnv<T> =
    T
    & {
        [ key: string ]: any
        get<T>(key: string, defaultValue?: any): T
        set(key: string, value: any): boolean
        has(key: string): boolean

    }

export function proxyEnv<T extends object>(env: T): ProxyEnv<T> {
    const has = (key: string) => env[ key ] !== undefined;
    const get = (key: string, defaultValue?: any) => has(key) ? env[ key ] : defaultValue;
    const set = (key: string, value: any) => env[ key ] = value;
    return new Proxy(env, {
        get(target: any, p: string | symbol, receiver: any): any {
            if ( Reflect.has(target, p) ) {
                return Reflect.get(target, p, receiver);
            }
            let name = p.toString();
            if ( name === ProxyFlags.IS_PROXY ) return true;
            if ( name === ProxyFlags.UNPROXY ) return target;
            if ( name === 'get' ) return get;
            if ( name === 'has' ) return has;
            if ( name === 'set' ) return set;
        },
        set(target: any, p: string | symbol, value: any, receiver: any): boolean {
            return Reflect.set(target, p, value, receiver);
        },
        has(target: any, p: string | symbol): boolean {
            return Reflect.has(target, p);
        },
    }) as any;
}
