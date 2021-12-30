import { AxiosInstance, CancelTokenSource, CancelTokenStatic } from 'axios';
import { MimeType, RequestConfig, RequestHeader, RequestHeaderValue, StreamsConfiguration } from './types';
import { SyncWaterfallHook } from 'tapable';
import { Response } from './Response';
export declare class Request<T = any, D = any> {
    readonly hooks: {
        createAxios: SyncWaterfallHook<[AxiosInstance, Request<any, any>], import("tapable").UnsetAdditionalOptions>;
        send: SyncWaterfallHook<[RequestConfig<any>, AxiosInstance, Request<any, any>], import("tapable").UnsetAdditionalOptions>;
        response: SyncWaterfallHook<[Response<any, any>, RequestConfig<any>, Request<any, any>], import("tapable").UnsetAdditionalOptions>;
    };
    config: RequestConfig;
    protected CancelToken: CancelTokenStatic;
    protected CancelTokenSource: CancelTokenSource;
    get cancelToken(): import("axios").CancelToken;
    protected constructor(config: RequestConfig);
    static create<T = any, D = any>(config: RequestConfig<D>): Request<T, D>;
    send(config?: Partial<RequestConfig>): Promise<Response<T, D>>;
    protected createAxios(): AxiosInstance;
    mergeConfig(config: Partial<RequestConfig>): this;
    cancel(message: string): this;
    header(key: RequestHeader, value: RequestHeaderValue): this;
    Accept(mime: MimeType): this;
    ContentType(mime: MimeType): this;
    IfNoneMatch(etag: string): this;
    basic(username: string, password: string): this;
    bearer(token: string): this;
    authorization(key: 'Basic' | 'Bearer', value: string): this;
}
export declare namespace Request {
    const getDefaultConfig: () => StreamsConfiguration;
}
