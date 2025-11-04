import { mergeObjects, Str } from './utils.js';
import { Streams } from './Streams.js';
import { Entries } from './Entries.js';
import { FetchRequest } from './FetchRequest.js';
import { FetchError } from './FetchError.js';
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
                mode: 'cors',
                headers: {
                    'X-Requested-With': 'XMLHttpRequest',
                },
            },
        };

        const { middlewares, defaultMiddlewares, ...opts } = options;
        this.options = mergeObjects(this.options, opts);
        this.middlewares = defaultMiddlewares.concat(middlewares);
        this.streams = new Streams(this);
        this.entries = new Entries(this);
    }

    /**
     * Add a middleware to the client
     */
    use(middleware) {
        this.middlewares.push(middleware);
    }

    /**
     * Make an HTTP request
     */
    async request(method, uri, config = {}) {
        let url = Str.ensureRight(this.options.baseURL, '/') + Str.stripLeft(uri, '/');
        config.method = method;
        config = mergeObjects(this.options.request, config);
        
        let request = new FetchRequest(url, config);
        request = await Middleware.run(this, request, 'request');
        
        return request
            .fetch()
            .then(async (request) => {
                if (!request.response.ok) {
                    throw new FetchError(request);
                }
                request.response = await Middleware.run(this, request.response, 'response');
                return request.response;
            })
            .catch(async error => {
                error = await Middleware.run(this, error, 'error');
                throw error;
            });
    }
}
