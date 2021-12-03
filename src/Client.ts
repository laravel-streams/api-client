import deepmerge from 'deepmerge';
import { AsyncSeriesWaterfallHook, SyncWaterfallHook } from 'tapable';
import { ClientConfiguration, MethodName, RequestConfig } from './types';
import { HTTPError } from './HTTPError';
import { objectify, Str } from './utils';
import camelcase from 'camelcase';
import { createRequestFactory, RequestConfigSetter } from './RequestFactory';

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


    public async request<T>(method: MethodName, url: string, config: RequestConfig = {}): Promise<ClientResponse<T>> {
        config       = this.mergeRequestConfig(config, { method, url });
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
        let factory = createRequestFactory(this.config).merge(config);
        factory.headers(this.config.headers);
        factory = this.hooks.createRequest.call(factory);
        return factory.make();
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
