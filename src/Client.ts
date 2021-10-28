import deepmerge from 'deepmerge';
import { AsyncSeriesWaterfallHook, SyncWaterfallHook } from 'tapable';
import { ClientConfiguration, Constructor, MethodName, RequestConfig, URLSearchParamsInit } from './types';
import { HTTPError } from './HTTPError';
import { objectify, Str } from './utils';
import camelcase from 'camelcase';
import { IStringifyOptions, stringify } from 'qs';

export interface ClientHeaders extends Headers {
    [ key: string ]: any;
}

export interface ClientResponse<T = any> extends Response {
    readonly headers: ClientHeaders;
    data: T;
    request: Request;
    config: RequestConfig;
    error?: HTTPError;
    errorText?: string;

}

async function getResponseData(response: Response, config: RequestConfig) {

    try {
        if ( config.responseType ) {
            switch(config.responseType){ //@formatter:off
            case 'blob': return await response.blob();
            case 'arraybuffer': return await response.arrayBuffer();
            case 'document': return await response.text()
            case 'json': return await response.json()
            case 'stream': return (await response.blob()).stream()
            case 'text': return await response.text()
        }//@formatter:on
        }

        if ( response.headers.get('content-type') === 'application/json' ) {
            return response.json();
        }

        return response.text();
    } catch (e) {
        return {};
    }
}

async function transformResponse(response: Response, request: Request, config: RequestConfig): Promise<ClientResponse> {
    const transformed: ClientResponse = response.clone() as any;

    transformed.request = request;
    transformed.config  = config;
    transformed.data    = await getResponseData(response, config);

    // handle headers
    let headerEntries = Array.from(response.headers[ 'entries' ]());
    Object.entries(deepmerge.all([
        headerEntries.map(([ key, value ]) => ([ camelcase(key), value ])).reduce(objectify, {}),
        headerEntries.map(([ key, value ]) => ([ key.split('-').map(seg => Str.ucfirst(seg)).join('-'), value ])).reduce(objectify, {}),
        headerEntries.reduce(objectify, {}),
    ])).forEach(([ key, value ]) => {
        transformed.headers[ key ] = value;
        transformed.headers.set(key, value);
    });

    // Include error if needed
    if ( !response.ok ) {
        try {
            transformed.errorText = await response.text();
        } catch (e) {
            transformed.errorText = '';
        }
        transformed.error = new HTTPError(response, request);
    }

    return transformed;
}

export class Client {
    public readonly hooks = {
        createRequest: new SyncWaterfallHook<RequestConfigSetter>([ 'factory' ]),
        request      : new SyncWaterfallHook<Request>([ 'request' ]),
        response     : new AsyncSeriesWaterfallHook<[ ClientResponse, Request ]>([ 'response', 'request' ]),
    };
    public config: ClientConfiguration;

    constructor(config: ClientConfiguration) {
        this.config = deepmerge({
            headers: {
                'X-Requested-With': 'XMLHttpRequest',
            },
            request: {
                method       : 'GET',
                credentials  : 'include',
                errorHandling: 'throw',
            },
        }, config);
    }


    public async request<T>(method: MethodName, uri: string, config: RequestConfig = {}): Promise<ClientResponse<T>> {
        config       = this.getRequestConfig(method, uri, config);
        let request  = this.createRequest(config);
        request      = this.hooks.request.call(request);
        let res      = await fetch(request);
        let response = await transformResponse(res, request, config);
        response     = await this.hooks.response.promise(response, request);
        if ( response.error && config.errorHandling === 'throw' ) {
            throw response.error;
        }
        return response;
    }

    protected createRequest(config: RequestConfig = {}): Request {
        let factory = this.createRequestFactory(config);
        factory.headers(this.config.headers);
        factory = this.hooks.createRequest.call(factory);
        return factory.make();
    }

    protected createRequestFactory(config: RequestConfig = {}): RequestConfigSetter {
        return createRequestFactory(this.config).merge(config);
    }

    protected getRequestConfig(method: MethodName, url: string, config: RequestConfig = {}): RequestConfig {
        return this.mergeRequestConfig(config, { method, url });
    }

    protected mergeRequestConfig(...config: RequestConfig[]): RequestConfig {
        return deepmerge.all([
            this.config.request as any,
            ...config as any[] || [],
        ], { clone: true }) as RequestConfig;
    }
}

export type RequestConfigSetter<T extends Request = Request, K extends keyof RequestConfig = keyof RequestConfig> =
    {
        [P in K]: (value: RequestConfig[P]) => RequestConfigSetter<T, K>
    }
    & RequestFactory<T>

export class RequestFactory<T extends Request = Request> {
    protected _config: RequestConfig       = {};
    protected _params: Record<string, any> = {};
    protected _headers                     = new Headers();

    constructor(protected _clientConfig: ClientConfiguration, protected _Request: Constructor<T>) {
        const self = this;
        return new Proxy(this, {
            get<C extends keyof RequestConfig>(target: RequestFactory<T>, p: C, receiver: any): any {
                if ( Reflect.has(target, p) ) {
                    return Reflect.get(target, p, receiver);
                }
                //@formatter:on
                return (value: RequestConfig[C]) => {
                    target._config[ p ] = value;
                    return target;
                };
            },
            set(target: RequestFactory<T>, p: string | symbol, value: any, receiver: any): boolean {
                if ( typeof target[ p ] === 'function' ) {
                    return target[ p ](value);
                }
                return Reflect.set(target, p, value, receiver);

            },
        });
    }

    protected getConfig(): RequestConfig {
        if ( this._config.responseType === 'json' ) {
            if ( !this._headers.has('accept') ) {
                this._headers.set('accept', 'application/json');
            }
        }
        return {
            ...this._config,
            headers: this._headers,
            url    : this._config.url ? this.getUri(this._config.url) : this._config.url,
        };
    }

    protected hasParams() {
        return Object.keys(this._params).length > 0;
    }

    protected stringifyParams(options: IStringifyOptions = {}) {
        return stringify(this._params, {
            ...options,
            arrayFormat: 'indices',
        });
    }

    protected getUri(uri: string) {
        let params = '';
        if ( this.hasParams() ) {
            params = this.stringifyParams({ addQueryPrefix: true });
        }
        return Str.ensureRight(this._clientConfig.baseURL, '/') + Str.stripLeft(uri, '/') + params;
    }

    merge(config: Partial<RequestConfig>) {
        Object.entries(config).forEach(([ key, value ]) => this[ key ](value));
        return this;
    }

    header(name: string, value: string) {
        this._headers.set(name, value);
        return this;
    }

    param(name: string, value: string) {
        this._params[ name ] = value;
        return this;
    }

    headers(headers: HeadersInit) {
        mergeHeaders(headers, this._headers);
        return this;
    }

    params(params: Record<string, any>) {
        this._params = deepmerge.all([
            this._params,
            params,
        ]);
        return this;
    }

    data(value: object) {
        this._headers.set('Content-Type', 'application/json');
        this._config.body = JSON.stringify(value);
        return this;
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

function createRequestFactory<T extends Request>(clientConfig: ClientConfiguration, _Request: Constructor<T> = Request as any): RequestConfigSetter<T> {
    return new RequestFactory(clientConfig, _Request) as RequestConfigSetter<T>;
}

function mergeHeaders(source: HeadersInit, destination: Headers) {
    (new Headers(source)).forEach((value, key) => destination.set(key, value));
    return destination;
}

function mergeURLSearchParams(source: URLSearchParamsInit, destination: URLSearchParams) {
    (new URLSearchParams(source)).forEach((value, key) => destination.set(key, value));
    return destination;
}

