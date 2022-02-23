import deepmerge from 'deepmerge';
export class Str {
    static random(length = 15) {
        let text = '';
        const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        for (let i = 0; i < length; i++) {
            text += possible.charAt(Math.floor(Math.random() * possible.length));
        }
        return text;
    }
    static ensureLeft(str, left) {
        if (false === str.startsWith(left)) {
            return left + str;
        }
        return str;
    }
    static ensureRight(str, right) {
        if (false === str.endsWith(right)) {
            return str + right;
        }
        return str;
    }
    static stripLeft(str, left) {
        if (str.startsWith(left)) {
            return str.substr(left.length);
        }
        return str;
    }
    static stripRight(str, right) {
        if (str.endsWith(right)) {
            return str.substr(0, str.length - right.length);
        }
        return str;
    }
    static ucfirst(string) {
        return string[0].toUpperCase() + string.slice(1);
    }
    static lcfirst(string) {
        return string[0].toLowerCase() + string.slice(1);
    }
    static parameters(str, params) {
        Object.entries(params).forEach(([key, value]) => str = str.replace(new RegExp(':' + key, 'g'), value));
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
export const objectify = (obj, [k, v]) => (Object.assign(Object.assign({}, obj), { [k]: v }));
export class Obj {
    static merge(...objs) {
        objs.unshift({});
        return deepmerge.all(objs, { clone: true });
    }
    static clone(obj) {
        return deepmerge({}, obj, { clone: true });
    }
    static exclude(obj, keys) {
        obj = this.clone(obj);
        for (let key of keys) {
            delete obj[key];
        }
        return obj;
    }
}
export function paramsToQueryString(params) {
    return encodeURIComponent(btoa(JSON.stringify(params)));
}
