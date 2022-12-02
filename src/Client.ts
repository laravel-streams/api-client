import { mergeObjects, Str } from './utils';
import { Streams } from './Streams';
import { FetchRequest } from './fetch/FetchRequest';
import { ClientResponse, RequestConfig } from './types';
import { Middleware } from './middleware/Middleware';
import { RequestError } from './RequestError';

export interface ClientOptions {
    baseURL: string,
    request?: RequestInit;
}

export interface ClientConstructorOptions extends ClientOptions {
    middlewares?: Middleware[];
}

export class Client {
    public options: ClientOptions;
    public readonly streams: Streams;
    public readonly middlewares: Middleware[] = [];

    constructor(options: ClientConstructorOptions) {
        options                        = {
            middlewares: [],
            ...options,
        };
        this.options                   = {
            baseURL: '',
            request: {
                mode   : 'cors',
                headers: {
                    'X-Requested-With': 'XMLHttpRequest',
                },
            },
        };
        const { middlewares, ...opts } = options;
        this.options                   = mergeObjects(this.options, opts);
        this.middlewares               = middlewares;
        this.streams                   = new Streams(this);
    }

    public use(middleware: Middleware) {
        this.middlewares.push(middleware);
    }

    public async request(method: string, uri: string, config: RequestConfig = {}): Promise<ClientResponse> {
        let url     = Str.ensureRight(this.options.baseURL, '/') + Str.stripLeft(uri, '/');
        config      = {
            ...this.options.request,
            method,
            ...config,
        };
        let request = new FetchRequest(url, config);
        for ( const middleware of this.middlewares ) {
            if ( typeof middleware.request === 'function' ) {
                request = await middleware.request(request, this);
            }
        }
        return request.fetch().then(async (request) => {
            if ( !request.response.ok ) {
                throw new RequestError(request);
            }
            for ( const middleware of this.middlewares ) {
                if ( typeof middleware.response === 'function' ) {
                    request.response = await middleware.response(request.response, this);
                }
            }
            return request.response;
        })
        // return fetch(request.url, request)
        // .then<ClientResponse>(async (response: ClientResponse) => {
        //     request.setResponse(response);
        //     response.request = request;
        //     if ( !response.ok ) {
        //         throw new RequestError(request);
        //     }
        //     for ( const middleware of this.middlewares ) {
        //         if ( typeof middleware.response === 'function' ) {
        //             response = await middleware.response(response, this);
        //         }
        //     }
        //     return response;
        // })
                      .catch(error => {
                          for ( const middleware of this.middlewares ) {
                              if ( typeof middleware.error === 'function' ) {
                                  middleware.error(error, this);
                              }
                          }
                          return error.response;
                      });
    }

    public async requestJSON<T = any>(method: string, uri: string, config: RequestConfig = {}): Promise<T> {
        return new Promise((resolve, reject) => {
            this.request(method, uri, config)
                .then(async (response) => resolve(await response.json()))
                .catch(reason => reject(reason));
        });
    }
}