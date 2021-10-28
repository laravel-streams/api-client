import { AsyncSeriesWaterfallHook, SyncWaterfallHook } from 'tapable';
import { ClientConfiguration, Constructor, MethodName, RequestConfig } from './types';
import { HTTPError } from './HTTPError';
import { IStringifyOptions } from 'qs';
export interface ClientHeaders extends Headers {
    [key: string]: any;
}
export interface ClientResponse<T = any> extends Response {
    readonly headers: ClientHeaders;
    data: T;
    request: Request;
    config: RequestConfig;
    error?: HTTPError;
    errorText?: string;
}
export declare class Client {
    readonly hooks: {
        createRequest: SyncWaterfallHook<RequestConfigSetter<Request, keyof RequestConfig>, import("tapable").UnsetAdditionalOptions>;
        request: SyncWaterfallHook<Request, import("tapable").UnsetAdditionalOptions>;
        response: AsyncSeriesWaterfallHook<[ClientResponse<any>, Request], import("tapable").UnsetAdditionalOptions>;
    };
    config: ClientConfiguration;
    constructor(config: ClientConfiguration);
    request<T>(method: MethodName, uri: string, config?: RequestConfig): Promise<ClientResponse<T>>;
    protected createRequest(config?: RequestConfig): Request;
    protected createRequestFactory(config?: RequestConfig): RequestConfigSetter;
    protected getRequestConfig(method: MethodName, url: string, config?: RequestConfig): RequestConfig;
    protected mergeRequestConfig(...config: RequestConfig[]): RequestConfig;
}
export declare type RequestConfigSetter<T extends Request = Request, K extends keyof RequestConfig = keyof RequestConfig> = {
    [P in K]: (value: RequestConfig[P]) => RequestConfigSetter<T, K>;
} & RequestFactory<T>;
export declare class RequestFactory<T extends Request = Request> {
    protected _clientConfig: ClientConfiguration;
    protected _Request: Constructor<T>;
    protected _config: RequestConfig;
    protected _params: Record<string, any>;
    protected _headers: Headers;
    constructor(_clientConfig: ClientConfiguration, _Request: Constructor<T>);
    protected getConfig(): RequestConfig;
    protected hasParams(): boolean;
    protected stringifyParams(options?: IStringifyOptions): string;
    protected getUri(uri: string): string;
    merge(config: Partial<RequestConfig>): this;
    header(name: string, value: string): this;
    param(name: string, value: string): this;
    headers(headers: HeadersInit): this;
    params(params: Record<string, any>): this;
    data(value: object): this;
    basic(username: string, password: string): this;
    bearer(token: string): this;
    authorization(key: string, value: string): this;
    make(): T;
}
