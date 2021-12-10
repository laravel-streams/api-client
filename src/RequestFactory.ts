import { ClientConfiguration, Constructor, RequestConfig, URLSearchParamsInit } from './types';
import { IStringifyOptions, stringify } from 'qs';
import { Str } from './utils';
import deepmerge from 'deepmerge';
import { Client, ClientRequest } from './Client';
import { HeaderFactory } from './HeaderFactory';
import { CombinedHeaders } from './types/headers';

export function createRequestFactory<T extends Request>(clientConfig: ClientConfiguration, _Request: Constructor<T> = Request as any): RequestConfigSetter<T> {
    return new RequestFactory(clientConfig, _Request) as RequestConfigSetter<T>;
}

function mergeURLSearchParams(source: URLSearchParamsInit, destination: URLSearchParams) {
    (new URLSearchParams(source)).forEach((value, key) => destination.set(key, value));
    return destination;
}

export type RequestConfigSetter<T extends Request = Request, K extends keyof RequestConfig = keyof RequestConfig> =
    {
        [P in K]: (value: RequestConfig[P]) => RequestConfigSetter<T, K>
    }
    & RequestFactory<T>


/**
 * Provides a fluent way of configuring the {@link RequestConfig}
 * and creating a {@link Request}. This class is used in the {@link Client} class
 * and it's provided {@link Client.hooks.createRequest} hook.
 *
 * Using the {@link createRequestFactory} function is the preferred way of creating an instance of this class
 * as it returns the fluent {@link RequestConfigSetter} wrapper type that follows this class it's proxy behaviour.
 */
export class RequestFactory<T extends ClientRequest = ClientRequest> {
    protected _config: RequestConfig       = {};
    protected _params: Record<string, any> = {};
    protected _headers: HeaderFactory      = new HeaderFactory();

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
            if ( !this._headers.has('Accept') ) {
                this._headers.set('Accept', 'application/json');
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

    header<T extends keyof CombinedHeaders>(name: T, value: CombinedHeaders[T]) {
        this._headers.set(name, value);
        return this;
    }

    param(name: string, value: string) {
        this._params[ name ] = value;
        return this;
    }

    headers(headers: CombinedHeaders) {
        this._headers.merge(headers);
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
        return this._headers.basic(username, password); //authorization('Basic', btoa(username + ':' + password));
    }

    bearer(token: string) {
        return this._headers.bearer(token);
    }

    authorization(key: string, value: string) {
        this._headers.authorization(key, value);
        return this;
    }


    make(): T {
        const config = this.getConfig();
        let request = new this._Request(config.url, config);
        request.config = config;
        return request;
    }

}
