
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


export function paramsToQueryString(params:any):string{
    return encodeURIComponent(btoa(JSON.stringify(params)));
}
export const mergeObjects = <T extends object = object>(target: T, ...sources: T[]): T  => {
    if (!sources.length) {
        return target;
    }
    const source = sources.shift();
    if (source === undefined) {
        return target;
    }

    if (isMergebleObject(target) && isMergebleObject(source)) {
        Object.keys(source).forEach(function(key: string) {
            if (isMergebleObject(source[key])) {
                if (!target[key]) {
                    target[key] = {};
                }
                mergeObjects(target[key], source[key]);
            } else {
                target[key] = source[key];
            }
        });
    }

    return mergeObjects(target, ...sources);
};

const isObject = (item: any): item is object => {
    return item !== null && typeof item === 'object';
};

const isMergebleObject = (item): boolean => {
    return isObject(item) && !Array.isArray(item);
};