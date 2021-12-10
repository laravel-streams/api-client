import { ClientConfiguration, Constructor, RequestConfig } from './types';
import { IStringifyOptions } from 'qs';
import { ClientRequest } from './Client';
import { HeaderFactory } from './HeaderFactory';
import { CombinedHeaders } from './types/headers';
export declare function createRequestFactory<T extends Request>(clientConfig: ClientConfiguration, _Request?: Constructor<T>): RequestConfigSetter<T>;
export declare type RequestConfigSetter<T extends Request = Request, K extends keyof RequestConfig = keyof RequestConfig> = {
    [P in K]: (value: RequestConfig[P]) => RequestConfigSetter<T, K>;
} & RequestFactory<T>;
/**
 * Provides a fluent way of configuring the {@link RequestConfig}
 * and creating a {@link Request}. This class is used in the {@link Client} class
 * and it's provided {@link Client.hooks.createRequest} hook.
 *
 * Using the {@link createRequestFactory} function is the preferred way of creating an instance of this class
 * as it returns the fluent {@link RequestConfigSetter} wrapper type that follows this class it's proxy behaviour.
 */
export declare class RequestFactory<T extends ClientRequest = ClientRequest> {
    protected _clientConfig: ClientConfiguration;
    protected _Request: Constructor<T>;
    protected _config: RequestConfig;
    protected _params: Record<string, any>;
    protected _headers: HeaderFactory;
    constructor(_clientConfig: ClientConfiguration, _Request: Constructor<T>);
    protected getConfig(): RequestConfig;
    protected hasParams(): boolean;
    protected stringifyParams(options?: IStringifyOptions): string;
    protected getUri(uri: string): string;
    merge(config: Partial<RequestConfig>): this;
    header<T extends keyof CombinedHeaders>(name: T, value: CombinedHeaders[T]): this;
    param(name: string, value: string): this;
    headers(headers: CombinedHeaders): this;
    params(params: Record<string, any>): this;
    data(value: object): this;
    basic(username: string, password: string): HeaderFactory;
    bearer(token: string): HeaderFactory;
    authorization(key: string, value: string): this;
    make(): T;
}
