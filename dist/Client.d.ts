import { AsyncSeriesWaterfallHook, SyncWaterfallHook } from 'tapable';
import { ClientConfiguration, MethodName, RequestConfig } from './types';
import { HTTPError } from './HTTPError';
import { RequestConfigSetter } from './RequestFactory';
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
/**
 * Used for creating requests using fetch.
 * It handles the extra options in the {@linkcode RequestConfig} class and
 * improves the default {@linkcode Response} by transforming it into {@linkcode ClientResponse}.
 *
 * This class contains 3 {@linkcode Client.hooks}, these are provided by the [tapable](https://github.com/webpack/tapable) library and is known
 * for powering webpack plugins. A few examples of this:
 * @example
 * ```ts
 * client.hooks.createRequest.tap('NAME', factory => {
 *     factory.headers({
 *
 *     }).mode('cors').bearer('token')
 *     return factory;
 * })
 * client.hooks.request.tap('NAME', request => {
 *
 *     return request;
 * })
 * client.hooks.response.tap('NAME', (response,request) => {
 *     if(response.headers.has('Content-Type')){
 *         const contentType = response.headers.get('Content-Type')
 *         if(contentType === 'application/json'){
 *             response.json()
 *         }
 *     }
 *     return response;
 * })
 * ```
 */
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
