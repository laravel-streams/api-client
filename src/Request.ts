import Axios, { AxiosError, AxiosInstance, CancelTokenSource, CancelTokenStatic } from 'axios';
import { MimeType, RequestConfig, RequestHeader, RequestHeaderValue } from './types';
import deepmerge from 'deepmerge';
import {AsyncSeriesWaterfallHook, SyncWaterfallHook } from 'tapable';
import { Response } from './Response';

interface BackendException {
    exception: string;
    message: string;
    file: string;
    line: number;
    trace: Array<{ class: string, file: string, function: string, line: number, type: string }>;
}

const isAxiosError = (val: any): val is AxiosError => val && val.isAxiosError;
const hasException = (val: any): val is AxiosError<BackendException> => isAxiosError(val) && val?.response?.data?.exception !== undefined;

export class Request<T = any, D = any> {
    public readonly hooks = {
        createAxios: new SyncWaterfallHook<[ AxiosInstance, Request ]>([ 'axios', 'request' ]),
        send       : new AsyncSeriesWaterfallHook<[ RequestConfig, AxiosInstance, Request ]>([ 'config', 'axios', 'request' ]),
        response   : new SyncWaterfallHook<[ Response, RequestConfig, Request ]>([ 'response', 'config', 'request' ]),
    };
    public config: RequestConfig;
    protected CancelToken: CancelTokenStatic;
    protected CancelTokenSource: CancelTokenSource;

    get cancelToken() {return this.CancelTokenSource.token; }

    protected constructor(config: RequestConfig) {
        this.CancelToken             = Axios.CancelToken;
        this.CancelTokenSource       = this.CancelToken.source();
        this.config                  = deepmerge.all<RequestConfig>([
            Request.getDefaultConfig(),
            config,

        ], { clone: true });
        this.config.cancelToken      = this.CancelTokenSource.token;
        // this.config.paramsSerializer = params => stringify(params);
        // this.config.paramsSerializer = params => this.stringifyFunction(params, this.stringifyOptions)
    }

    static create<T = any, D = any>(config: RequestConfig<D>) {
        return new Request<T, D>(config);
    }

    async send(config: Partial<RequestConfig> = {}): Promise<Response<T, D>> {
        const axios = this.createAxios();
        config      = await this.hooks.send.promise(config, axios, this);
        let response;
        try {
            let axiosResponse = await axios.request<T>(config as any);
            response          = Response.fromAxiosResponse<T>(axiosResponse);
        } catch (e) {
            if ( isAxiosError(e) && hasException(e) ) {
                let { message, exception, file, line } = e.response.data;
                e.message += `:\n${exception}: ${message}\n${line}:${file}`;
            }
            throw e;
        }
        response = this.hooks.response.call(response, config, this);
        return response;
    }

    public createAxios(): AxiosInstance {
        let axios = Axios.create(this.config as any);
        axios     = this.hooks.createAxios.call(axios, this);
        return axios;
    }

    mergeConfig(config: Partial<RequestConfig>) {
        this.config = deepmerge(this.config, config, { clone: true });
        return this;
    }

    cancel(message: string) {
        this.CancelTokenSource.cancel(message);
        return this;
    }

    header(key: RequestHeader, value: RequestHeaderValue) {
        this.config.headers[ key ] = value;
        return this;
    }

    Accept(mime: MimeType) {
        this.header('Accept', mime);
        return this;
    }

    ContentType(mime: MimeType) {
        this.header('Content-Type', mime);
        return this;
    }

    IfNoneMatch(etag: string) {
        this.header('If-None-Match', etag);
        return this;
    }

    basic(username: string, password: string) {
        return this.authorization('Basic', btoa(username + ':' + password));
    }

    bearer(token: string) {
        return this.authorization('Bearer', token);
    }

    authorization(key: 'Basic' | 'Bearer', value: string) {
        this.header('Authorization', key + ' ' + value);
        return this;
    }
}

export namespace Request {
    export const getDefaultConfig = (): RequestConfig => ({
        baseURL:'',
        headers: {
            'X-Requested-With': 'XMLHttpRequest',
        },
        // `responseType` indicates the type of data that the server will respond with
        // options are: 'arraybuffer', 'document', 'json', 'text', 'stream'
        //   browser only: 'blob'
        responseType: 'json', // default

        // `xsrfCookieName` is the name of the cookie to use as a value for xsrf token
        xsrfCookieName: 'XSRF-TOKEN', // default

        // `xsrfHeaderName` is the name of the http header that carries the xsrf token value
        xsrfHeaderName: 'X-XSRF-TOKEN', // default

        withCredentials: false,

        validateStatus: function (status) {
            return status >= 200 && status < 300; // default
        },


        // `decompress` indicates whether or not the response body should be decompressed
        // automatically. If set to `true` will also remove the 'content-encoding' header
        // from the responses objects of all decompressed responses
        // - Node only (XHR cannot turn off decompression)
        decompress: true, // default
    });
}
