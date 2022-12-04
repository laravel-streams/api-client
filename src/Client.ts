import { mergeObjects, Str } from './utils';
import { Streams } from './Streams';
import { FetchRequest } from './FetchRequest';
import { ClientResponse, RequestConfig } from './types';
import { CriteriaMiddleware, Middleware, QueryMiddleware, RequestDataMiddleware, ResponseDataMiddleware } from './middleware';
import { FetchError } from './FetchError';
import { Entries } from './Entries';

export interface ClientOptions {
    baseURL: string,
    request?: RequestConfig;
}

export interface ClientConstructorOptions extends ClientOptions {
    middlewares?: Middleware[];
    defaultMiddlewares?: Middleware[];
}

export class Client {
    public options: ClientOptions;
    public readonly streams: Streams;
    public readonly entries: Entries;
    public readonly middlewares: Middleware[] = [];

    constructor(options: ClientConstructorOptions) {
        options                                            = {
            middlewares       : [],
            defaultMiddlewares: [
                new RequestDataMiddleware(),
                new CriteriaMiddleware(),
                new QueryMiddleware(),
                new ResponseDataMiddleware(),
            ],
            ...options,
        };
        this.options                                       = {
            baseURL: '',
            request: {
                mode   : 'cors',
                headers: {
                    'X-Requested-With': 'XMLHttpRequest',
                },
            },
        };
        const { middlewares, defaultMiddlewares, ...opts } = options;
        this.options                                       = mergeObjects(this.options, opts);
        this.middlewares                                   = defaultMiddlewares.concat(middlewares);
        this.streams                                       = new Streams(this);
        this.entries                                       = new Entries(this);
    }

    public use(middleware: Middleware) {
        this.middlewares.push(middleware);
    }

    public async request(method: string, uri: string, config: RequestConfig = {}): Promise<ClientResponse> {
        let url       = Str.ensureRight(this.options.baseURL, '/') + Str.stripLeft(uri, '/');
        config.method = method;
        config        = mergeObjects(this.options.request, config);
        let request   = new FetchRequest(url, config);
        request       = await Middleware.run(this, request, 'request');
        return request
        .fetch()
        .then(async (request) => {
            if ( !request.response.ok ) {
                throw new FetchError(request);
            }
            request.response = await Middleware.run(this, request.response, 'response');
            return request.response;
        })
        .catch(async error => {
            error = await Middleware.run(this, error, 'error');
            return error;
        });
    }
}