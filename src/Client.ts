import deepmerge from 'deepmerge';
import { SyncWaterfallHook } from 'tapable';
import {
    ClientConfiguration,
    Method,
    MethodName,
    RequestConfig,
    URLSearchParamsInit,
} from './types';
import { HTTPError } from './HTTPError';
import { Str } from './utils';

export class Client {
    public readonly hooks = {
        createRequest: new SyncWaterfallHook<RequestConfigSetter>(['factory']),
        request: new SyncWaterfallHook<Request>(['request']),
        response: new SyncWaterfallHook<[Response, Request]>([
            'response',
            'request',
        ]),
    };
    public config: ClientConfiguration;

    constructor(config: ClientConfiguration) {
        this.config = deepmerge(
            {
                headers: {
                    'X-Requested-With': 'XMLHttpRequest',
                },
                request: {
                    method: 'GET',
                    credentials: 'include',
                },
            },
            config
        );
    }

    public async request(
        method: MethodName,
        uri: string,
        config: RequestConfig = {}
    ): Promise<Response> {
        
        let request = this.createRequest(method, uri, config);
        request = await this.hooks.request.promise(request);

        let response: Response = await fetch(request);
        response = await this.hooks.response.promise(response, request);
        
        if (!response.ok) {
            throw new HTTPError(response);
        }
        return response;
    }

    protected createRequest(
        method: MethodName,
        uri: string,
        config: RequestConfig = {}
    ): Request {
        let factory = this.createRequestFactory(method, uri, config);
        factory = this.hooks.createRequest.call(factory);
        return factory.make();
    }

    protected createRequestFactory(
        method: MethodName,
        uri: string,
        config: RequestConfig = {}
    ): RequestConfigSetter {
        config = this.getRequestConfig(config);
        config.method = Method[method];

        return createRequestFactory(this.config).merge(config);
    }

    protected getRequestConfig(config: RequestConfig = {}): RequestConfig {
        return deepmerge(this.config.request as any, config as any, {
            clone: true,
        }) as RequestConfig;
    }
}

export type Constructor<Type = any> = new (...args: any[]) => Type;
type RequestConfigSetter<
    T extends Request = Request,
    K extends keyof RequestConfig = keyof RequestConfig
> = {
    [P in K]: (value: RequestConfig[P]) => RequestConfigSetter<T, K>;
} & RequestFactory<T>;

export class RequestFactory<T extends Request = Request> {
    _config: RequestConfig = {};
    _params = new URLSearchParams();
    _headers = new Headers();

    constructor(
        protected _clientConfig: ClientConfiguration,
        protected _Request: Constructor<T>
    ) {
        const self = this;
        return new Proxy(this, {
            get<C extends keyof RequestConfig>(
                target: RequestFactory<T>,
                p: C,
                receiver: any
            ): any {
                if (Reflect.has(target, p)) {
                    return Reflect.get(target, p, receiver);
                }
                //@formatter:on
                return (value: RequestConfig[C]) => {
                    target._config[p] = value;
                    return target;
                };
            },
            set(
                target: RequestFactory<T>,
                p: string | symbol,
                value: any,
                receiver: any
            ): boolean {
                if (typeof target[p] === 'function') {
                    return target[p](value);
                }
                return Reflect.set(target, p, value, receiver);
            },
        });
    }

    merge(config: Partial<RequestConfig>) {
        Object.entries(config).forEach(([key, value]) => this[key](value));
        return this;
    }

    getConfig(): RequestConfig {
        return {
            ...this._config,
            headers: this._headers,
            params: this._params,
            url: this._config.url
                ? this.getUri(this._config.url)
                : this._config.url,
        };
    }

    header(name: string, value: string) {
        this._headers.set(name, value);
        return this;
    }

    param(name: string, value: string) {
        this._headers.set(name, value);
        return this;
    }

    headers(headers: HeadersInit) {
        mergeHeaders(headers, this._headers);
        return this;
    }

    params(params: URLSearchParamsInit) {
        mergeURLSearchParams(params, this._params);
        return this;
    }

    data(value: object) {
        this._headers.set('Content-Type', 'application/json');
        this._config.body = JSON.stringify(value);
        return this;
    }

    protected getUri(uri: string) {
        let params = this._params.toString();
        if (params.length) {
            params = '?' + params;
        }
        return (
            Str.ensureRight(this._clientConfig.baseURL, '/') +
            Str.stripLeft(uri, '/') +
            params
        );
    }

    basic(username: string, password: string) {
        return this.authorization('Basic', btoa(username + ':' + password));
    }

    bearer(token: string) {
        return this.authorization('Bearer', token);
    }

    authorization(key: string, value: string) {
        this._headers.set('Authorization', key + ' ' + value);
        return this;
    }

    make(): T {
        const config = this.getConfig();
        return new this._Request(config.url, config);
    }
}

function createRequestFactory<T extends Request>(
    clientConfig: ClientConfiguration,
    _Request: Constructor<T> = Request as any
): RequestConfigSetter<T> {
    return new RequestFactory(clientConfig, _Request) as RequestConfigSetter<T>;
}

function mergeHeaders(source: HeadersInit, destination: Headers) {
    new Headers(source).forEach((value, key) => destination.set(key, value));
    return destination;
}

function mergeURLSearchParams(
    source: URLSearchParamsInit,
    destination: URLSearchParams
) {
    new URLSearchParams(source).forEach((value, key) =>
        destination.set(key, value)
    );
    return destination;
}
