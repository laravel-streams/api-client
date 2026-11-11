import { mergeObjects, Str } from './utils.js';
import { Streams } from './Streams.js';
import { Entries } from './Entries.js';
import { Endpoint } from './Endpoint.js';
import { FetchRequest } from './FetchRequest.js';
import { FetchError } from './FetchError.js';
import { requestPolicy, requestScope, canRetry, retryDelay, withSignal, backoff } from './RequestPolicy.js';
import {
    CriteriaMiddleware,
    Middleware,
    QueryMiddleware,
    RequestDataMiddleware,
    ResponseDataMiddleware
} from './middleware/index.js';

/**
 * Main API Client class
 */
export class Client {
    constructor(options) {
        options = {
            middlewares: [],
            defaultMiddlewares: [
                new RequestDataMiddleware(),
                new CriteriaMiddleware(),
                new QueryMiddleware(),
                new ResponseDataMiddleware(),
            ],
            ...options,
        };

        this.options = {
            baseURL: '',
            request: {
                mode: 'same-origin',
                headers: {
                    'X-Requested-With': 'XMLHttpRequest',
                },
            },
        };

        const { middlewares, defaultMiddlewares, ...opts } = options;
        this.options = mergeObjects({}, this.options, opts);
        this.middlewares = defaultMiddlewares.concat(middlewares);
        this.streams = new Streams(this);
        this.entries = new Entries(this);
        this.endpoints = new Map();
    }

    /**
     * Add a middleware to the client
     */
    use(middleware) {
        this.middlewares.push(middleware);
    }

    /**
     * Register a named endpoint definition.
     *
     * @param {string} name - Endpoint name, e.g. "groups.members".
     * @param {{ method: string, uri: string }} definition - HTTP method and URI template.
     * @returns {this}
     */
    register(name, definition) {
        if (typeof name !== 'string' || name.length === 0) {
            throw new Error('Endpoint name must be a non-empty string.');
        }
        if (!definition || typeof definition !== 'object') {
            throw new Error(`Endpoint "${name}" definition must be an object with a method and uri.`);
        }
        if (typeof definition.method !== 'string' || typeof definition.uri !== 'string') {
            throw new Error(`Endpoint "${name}" requires a method and a uri string.`);
        }
        this.endpoints.set(name, { name, ...definition });
        return this;
    }

    /**
     * Resolve a registered endpoint into a callable resource.
     *
     * @param {string} name - Endpoint name previously passed to register().
     * @returns {Endpoint}
     */
    endpoint(name) {
        const definition = this.endpoints.get(name);
        if (!definition) {
            throw new Error(
                `Endpoint "${name}" is not registered. Call client.register("${name}", { method, uri }) first.`
            );
        }
        return new Endpoint(this, definition);
    }

    /**
     * Make an HTTP request
     */
    async request(method, uri, config = {}) {
        const url = Str.ensureRight(this.options.baseURL, '/') + Str.stripLeft(uri, '/');
        const headers = new Headers(this.options.request.headers);
        new Headers(config.headers).forEach((value, key) => headers.set(key, value));
        config = mergeObjects({}, this.options.request, config, { method, headers });
        const policy = requestPolicy(config);
        const scope = requestScope(config.signal, policy.timeout);

        try {
            let request = new FetchRequest(url, { ...config, signal: scope.signal });
            request = await withSignal(() => Middleware.run(this, request, 'request'), scope.signal);
            if (config.idempotencyKey !== undefined) {
                request.headers.set('Idempotency-Key', config.idempotencyKey);
            }

            for (let attempt = 0; ; attempt++) {
                let networkError;
                try {
                    await withSignal(() => request.fetch(scope.signal), scope.signal);
                } catch (error) {
                    scope.signal.throwIfAborted();
                    if (!(error instanceof TypeError)) throw error;
                    networkError = error;
                }
                const response = networkError ? null : request.response;
                if (attempt < policy.retries && canRetry(request, response) && (networkError || !response.ok)) {
                    const delay = retryDelay(policy, attempt, response);
                    if (response?.body) await withSignal(() => response.body.cancel(), scope.signal);
                    await backoff(delay, scope.signal);
                    continue;
                }
                if (networkError) throw networkError;
                if (!response.ok) {
                    const error = new FetchError(request);
                    await withSignal(() => error.mapValidationErrors(), scope.signal);
                    throw error;
                }
                request.response = await withSignal(() => Middleware.run(this, response, 'response'), scope.signal);
                return request.response;
            }
        } catch (error) {
            // Notify error middleware even on abort, but never let it hold up cancellation.
            error = await withSignal(() => Middleware.run(this, error, 'error'), scope.signal, true);
            throw error;
        } finally {
            scope.dispose();
        }
    }

    /**
     * Make a GET request
     */
    async get(uri, config = {}) {
        return this.request('GET', uri, config);
    }

    /**
     * Make a POST request
     */
    async post(uri, config = {}) {
        return this.request('POST', uri, config);
    }

    /**
     * Make a PATCH request
     */
    async patch(uri, config = {}) {
        return this.request('PATCH', uri, config);
    }

    /**
     * Make a PUT request
     */
    async put(uri, config = {}) {
        return this.request('PUT', uri, config);
    }

    /**
     * Make a DELETE request
     */
    async delete(uri, config = {}) {
        return this.request('DELETE', uri, config);
    }
}
