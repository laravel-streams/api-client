/**
 * String utility class
 */
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
        if (!str.startsWith(left)) {
            return left + str;
        }
        return str;
    }

    static ensureRight(str, right) {
        if (!str.endsWith(right)) {
            return str + right;
        }
        return str;
    }

    static stripLeft(str, left) {
        if (str.startsWith(left)) {
            return str.substring(left.length);
        }
        return str;
    }

    static stripRight(str, right) {
        if (str.endsWith(right)) {
            return str.substring(0, str.length - right.length);
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
        Object.entries(params).forEach(([key, value]) => {
            str = str.replace(new RegExp(':' + key, 'g'), value);
        });
        return str;
    }
}

/**
 * Convert array of [key, value] pairs to object
 */
export const objectify = (obj, [k, v]) => ({ ...obj, [k]: v });

/**
 * Convert parameters to query string
 */
export function paramsToQueryString(params) {
    return encodeURIComponent(btoa(JSON.stringify(params)));
}

/**
 * Deep merge objects
 */
export const mergeObjects = (target, ...sources) => {
    if (!sources.length) {
        return target;
    }
    const source = sources.shift();
    if (source === undefined) {
        return target;
    }

    if (isMergeableObject(target) && isMergeableObject(source)) {
        Object.keys(source).forEach(function (key) {
            if (isMergeableObject(source[key])) {
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

/**
 * Check if value is an object
 */
export const isObject = (item) => {
    return item !== null && typeof item === 'object';
};

/**
 * Check if object is mergeable
 */
const isMergeableObject = (item) => {
    return isObject(item) && !Array.isArray(item);
};

/**
 * Create a custom Map with additional utility methods
 */
export function createCustomMap(obj = {}) {
    const map = new (class extends Map {
        toObject() {
            return Array.from(this.entries())
                .map(kv => [kv[0], kv[1]])
                .reduce(objectify, {});
        }

        toKeys() {
            return Array.from(this.keys());
        }

        merge(obj) {
            obj = mergeObjects(this.toObject(), obj);
            Object.entries(obj).forEach(([k, v]) => this.set(k, v));
            return this;
        }

        empty() {
            return this.size === 0;
        }
    })();
    
    map.merge(obj);
    return map;
}

/**
 * Simple query string builder (replaces 'qs' dependency)
 */
export function stringify(obj, options = {}) {
    const encodeValuesOnly = options.encodeValuesOnly !== false;
    
    const encode = (str) => {
        if (encodeValuesOnly) {
            return String(str);
        }
        return encodeURIComponent(str);
    };

    const buildParams = (prefix, value) => {
        if (value === null || value === undefined) {
            return '';
        }

        if (Array.isArray(value)) {
            return value.map((v, i) => buildParams(`${prefix}[${i}]`, v)).join('&');
        }

        if (typeof value === 'object') {
            return Object.keys(value)
                .map(key => buildParams(`${prefix}[${key}]`, value[key]))
                .join('&');
        }

        return `${prefix}=${encode(value)}`;
    };

    return Object.keys(obj)
        .map(key => {
            const value = obj[key];
            if (value === null || value === undefined) {
                return '';
            }
            if (Array.isArray(value) || typeof value === 'object') {
                return buildParams(key, value);
            }
            return `${key}=${encode(value)}`;
        })
        .filter(Boolean)
        .join('&');
}
