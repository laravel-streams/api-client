import deepmerge from 'deepmerge';
import { AsyncSeriesWaterfallHook, SyncHook, SyncWaterfallHook } from 'tapable';
import { ClientConfiguration, MethodName, RequestConfig } from './types';
import { HTTPError } from './HTTPError';
import { createRequestFactory, RequestConfigSetter } from './RequestFactory';
import { HeaderFactory } from './HeaderFactory';

export interface ClientHeaders extends Headers {
    [ key: string ]: any;
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
export class Client {
    public readonly hooks = {
        createRequest: new SyncWaterfallHook<RequestConfigSetter>([ 'factory' ]),
        request      : new SyncWaterfallHook<Request>([ 'request' ]),
        response     : new AsyncSeriesWaterfallHook<[ ClientResponse, Request ]>([ 'response', 'request' ]),
        error        : new SyncHook<[ HTTPError, ClientResponse ]>([ 'error', 'response' ]),
    };
    public readonly config: ClientConfiguration;
    public readonly headers: HeaderFactory;

    constructor(config: ClientConfiguration) {
        this.config = deepmerge({
            headers: {
                'X-Requested-With': 'XMLHttpRequest',
            },
            request: {
                method       : 'GET',
                errorHandling: 'throw',
                responseType : 'json',
            },
        }, config);

        this.headers = new HeaderFactory(this.config.headers as any);
    }


    public async request<T>(method: MethodName, url: string, config: RequestConfig = {}): Promise<ClientResponse<T>> {
        config      = this.mergeRequestConfig(config, { method, url });
        let request = this.createRequest(config);
        return this.fetch(request);
    }

    async fetch<T>(request: ClientRequest): Promise<ClientResponse<T>> {
        request      = this.hooks.request.call(request);
        let res      = await fetch(request);
        let response = await transformResponse(res, request, request.config);
        response     = await this.hooks.response.promise(response, request);
        if ( response.error ) {
            this.hooks.error.call(response.error, response);
            if ( request.config.errorHandling === 'throw' ) {
                throw response.error;
            }
        }
        return response;
    }

    createRequestFactory<T extends ClientRequest>(): RequestConfigSetter<ClientRequest> {
        return createRequestFactory<T>(this.config).headers(this.config.headers);
    }

    protected createRequest(config: RequestConfig = {}): ClientRequest {
        let factory = createRequestFactory<ClientRequest>(this.config).merge(config);
        factory.headers(this.headers.make());
        return this.hooks.createRequest.call(factory).make();
    }

    protected mergeRequestConfig(...config: RequestConfig[]): RequestConfig {
        return deepmerge.all([
            this.config.request as any,
            ...config as any[] || [],
        ], { clone: true }) as RequestConfig;
    }
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
    const proto                       = Object.getPrototypeOf(transformed);
    const oldHeaders                  = transformed.headers;
    delete proto.headers;
    proto.headers       = new HeaderFactory(oldHeaders);
    transformed.request = request;
    transformed.config  = config;
    transformed.data    = await getResponseData(response, config);

    try {
        let data         = JSON.parse(transformed.data);
        transformed.data = data;
    } catch (e) {

    }

    // Include error if needed
    if ( !response.ok ) {
        try {
            transformed.errorText = await response.text();
        } catch (e) {
            transformed.errorText = '';
        }
        transformed.error = new HTTPError(transformed);
    }

    return transformed;
}
