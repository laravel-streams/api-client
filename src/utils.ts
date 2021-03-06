import deepmerge from 'deepmerge';

export class Str {
    public static random(length = 15) {
        let text       = '';
        const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        for ( let i = 0; i < length; i ++ ) {
            text += possible.charAt(Math.floor(Math.random() * possible.length));
        }
        return text;
    }

    public static ensureLeft(str: string, left: string): string {
        if ( false === str.startsWith(left) ) {
            return left + str;
        }
        return str;
    }

    public static ensureRight(str: string, right: string): string {
        if ( false === str.endsWith(right) ) {
            return str + right;
        }
        return str;
    }

    public static stripLeft(str: string, left: string): string {
        if ( str.startsWith(left) ) {
            return str.substr(left.length);
        }
        return str;
    }

    public static stripRight(str: string, right: string): string {
        if ( str.endsWith(right) ) {
            return str.substr(0, str.length - right.length);
        }
        return str;
    }

    public static ucfirst(string) {
        return string[ 0 ].toUpperCase() + string.slice(1);
    }

    public static lcfirst(string) {
        return string[ 0 ].toLowerCase() + string.slice(1);
    }

    public static parameters(str: string, params: Record<string, string>) {
        Object.entries(params).forEach(([ key, value ]) => str = str.replace(new RegExp(':' + key, 'g'), value));
        return str;
    }

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
export const objectify = (obj, [ k, v ]) => ({ ...obj, [ k ]: v });

export class Obj {
    public static merge(...objs) {
        objs.unshift({});
        return deepmerge.all(objs, { clone: true });
    }

    public static clone<T extends object>(obj: T): T {
        return deepmerge({}, obj, { clone: true }) as any;
    }

    public static exclude<T extends object, K extends keyof T>(obj: T, keys: K[]) {
        obj = this.clone(obj);
        for ( let key of keys ) {
            delete obj[ key ];
        }
        return obj;
    }
}

export function paramsToQueryString(params:any):string{
    return encodeURIComponent(btoa(JSON.stringify(params)));
}
