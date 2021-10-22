import { SyncWaterfallHook } from 'tapable';
import { ClientConfiguration, MethodName, RequestConfig, URLSearchParamsInit } from './types';
export declare class Client {
    readonly hooks: {
        createRequest: SyncWaterfallHook<RequestConfigSetter<Request, keyof RequestConfig>, import("tapable").UnsetAdditionalOptions>;
        request: SyncWaterfallHook<Request, import("tapable").UnsetAdditionalOptions>;
        response: SyncWaterfallHook<[Response, Request], import("tapable").UnsetAdditionalOptions>;
    };
    config: ClientConfiguration;
    constructor(config: ClientConfiguration);
    request(method: MethodName, uri: string, config?: RequestConfig): Promise<Response>;
    protected createRequest(method: MethodName, uri: string, config?: RequestConfig): Request;
    protected createRequestFactory(method: MethodName, uri: string, config?: RequestConfig): RequestConfigSetter;
    protected getRequestConfig(config?: RequestConfig): RequestConfig;
}
export declare type Constructor<Type = any> = new (...args: any[]) => Type;
declare type RequestConfigSetter<T extends Request = Request, K extends keyof RequestConfig = keyof RequestConfig> = {
    [P in K]: (value: RequestConfig[P]) => RequestConfigSetter<T, K>;
} & RequestFactory<T>;
export declare class RequestFactory<T extends Request = Request> {
    protected _clientConfig: ClientConfiguration;
    protected _Request: Constructor<T>;
    _config: RequestConfig;
    _params: URLSearchParams;
    _headers: Headers;
    constructor(_clientConfig: ClientConfiguration, _Request: Constructor<T>);
    merge(config: Partial<RequestConfig>): this;
    getConfig(): RequestConfig;
    header(name: string, value: string): this;
    param(name: string, value: string): this;
    headers(headers: HeadersInit): this;
    params(params: URLSearchParamsInit): this;
    data(value: object): this;
    protected getUri(uri: string): string;
    basic(username: string, password: string): this;
    bearer(token: string): this;
    authorization(key: string, value: string): this;
    make(): T;
}
export {};
