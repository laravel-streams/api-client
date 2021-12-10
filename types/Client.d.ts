import { AsyncSeriesWaterfallHook, SyncHook, SyncWaterfallHook } from 'tapable';
import { ClientConfiguration, MethodName, RequestConfig } from './types';
import { HTTPError } from './HTTPError';
import { RequestConfigSetter } from './RequestFactory';
import { HeaderFactory } from './HeaderFactory';
export interface ClientHeaders extends Headers {
    [key: string]: any;
}
export interface ClientResponse<T = any> extends Response {
    readonly headers: HeaderFactory;
    data: T;
    request: Request;
    config: RequestConfig;
    error?: HTTPError;
    errorText?: string;
}
export interface ClientRequest extends Request {
    config?: RequestConfig;
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
        error: SyncHook<[HTTPError, ClientResponse<any>], void, import("tapable").UnsetAdditionalOptions>;
    };
    readonly config: ClientConfiguration;
    readonly headers: HeaderFactory;
    constructor(config: ClientConfiguration);
    request<T>(method: MethodName, url: string, config?: RequestConfig): Promise<ClientResponse<T>>;
    fetch<T>(request: ClientRequest): Promise<ClientResponse<T>>;
    createRequestFactory<T extends ClientRequest>(): RequestConfigSetter<ClientRequest>;
    protected createRequest(config?: RequestConfig): ClientRequest;
    protected mergeRequestConfig(...config: RequestConfig[]): RequestConfig;
}
