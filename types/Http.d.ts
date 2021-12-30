import { ApiDataResponse, IBaseStream, IEntries, IStream, IStreamPost, RequestConfig, StreamID, StreamsConfiguration } from './types';
import { Streams } from './Streams';
import { Method } from 'axios';
import { Response } from './Response';
export declare class Http {
    protected streams: Streams;
    constructor(streams: Streams);
    get config(): StreamsConfiguration;
    getStreams<T = IBaseStream[], R = ApiDataResponse<T, 'streams', 'list'>>(params?: any, config?: RequestConfig): Promise<Response<R, any>>;
    postStream<T, R = ApiDataResponse<IStreamPost<T>, 'streams', 'post'>>(data: T, config?: RequestConfig): Promise<Response<R, any>>;
    getStream<ID extends StreamID, R = ApiDataResponse<IStream<ID>, 'streams', 'get'>>(stream: ID, params?: any, config?: RequestConfig): Promise<Response<R, any>>;
    patchStream<ID extends StreamID, R = ApiDataResponse<IStream<ID>, 'streams', 'patch'>>(stream: ID, data?: any, config?: RequestConfig): Promise<Response<R, any>>;
    putStream<ID extends StreamID, R = ApiDataResponse<IStream<ID>, 'streams', 'put'>>(stream: ID, data?: any, config?: RequestConfig): Promise<Response<R, any>>;
    deleteStream(stream: string | number, config?: RequestConfig): Promise<Response<boolean, any>>;
    getEntries<ID extends StreamID, T = IEntries[ID], R = ApiDataResponse<T[], 'entries', 'list'>>(stream: ID, params?: any, config?: RequestConfig): Promise<Response<R, any>>;
    postEntry<ID extends StreamID, T = IEntries[ID], R = ApiDataResponse<T, 'entries', 'post'>>(stream: ID, data?: any, config?: RequestConfig): Promise<Response<R, any>>;
    getEntry<ID extends StreamID, T = IEntries[ID], R = ApiDataResponse<T, 'entries', 'get'>>(stream: ID, entry: string | number, config?: RequestConfig): Promise<Response<R, any>>;
    patchEntry<ID extends StreamID, T = IEntries[ID], R = ApiDataResponse<T, 'entries', 'patch'>>(stream: ID, entry: string | number, data?: any, config?: RequestConfig): Promise<Response<R, any>>;
    putEntry<ID extends StreamID, T = IEntries[ID], R = ApiDataResponse<T, 'entries', 'put'>>(stream: ID, entry: string | number, data?: any, config?: RequestConfig): Promise<Response<R, any>>;
    deleteEntry<ID extends StreamID, T = any, R = boolean>(stream: ID, entry: string | number, config?: RequestConfig): Promise<Response<R, any>>;
    protected request<T = any, D = any>(method: Method, url: string, config?: RequestConfig): Promise<Response<T, D>>;
    protected request<T = any, D = any>(method: Method, url: string, config: RequestConfig, data: D): Promise<Response<T, D>>;
}
