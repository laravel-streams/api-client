import { isObject, mergeObjects } from '../utils.js';

/**
 * Base Middleware class
 */
export class Middleware {
    static defaultOptions = {
        priority: {
            request: 50,
            response: 50,
            error: 50,
        }
    };

    constructor(options = {}) {
        this.options = this.constructor.getDefaultOptions(this.constructor, options);
    }

    /**
     * Get middlewares for a specific kind sorted by priority
     */
    static get(middlewares, kind) {
        return middlewares
            .filter(middleware => typeof middleware[kind] === 'function')
            .sort((a, b) => {
                return a.options.priority[kind] - b.options.priority[kind];
            });
    }

    /**
     * Run all middlewares of a specific kind
     */
    static async run(client, target, kind) {
        const middlewares = Middleware.get(client.middlewares, kind);
        for (const middleware of middlewares) {
            target = await middleware[kind](target, client);
        }
        return target;
    }

    /**
     * Get default options with inheritance
     */
    static getDefaultOptions(t, options = {}) {
        if (isObject(t.defaultOptions)) {
            options = mergeObjects(t.defaultOptions, options);
        }
        let parent = Object.getPrototypeOf(t);
        if (parent && isObject(parent.defaultOptions)) {
            options = this.getDefaultOptions(parent, options);
        }
        return options;
    }

    /**
     * Set priority for middleware execution
     */
    priority(priority, kind = false) {
        let kinds = ['request', 'response', 'error'];
        kind = kind !== undefined && kinds.includes(kind?.toString()) ? kind : false;

        if (!kind) {
            kinds.forEach(kind => this.options[kind] = priority);
        } else {
            this.options[kind] = priority;
        }
        return this;
    }

    // Optional methods to be implemented by subclasses:
    // async request(request, client) { return request; }
    // async response(response, client) { return response; }
    // async error(error, client) { return error; }
}
