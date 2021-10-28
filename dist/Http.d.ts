import { IEntriesLinks, IEntriesMeta, IPaginatedEntriesLinks, IPaginatedEntriesMeta } from './EntryCollection';
import { ApiConfiguration, ApiDataResponse, IBaseStream, IStream, IStreamLinks, IStreamMeta, IStreamPost, IStreamResponse, MethodName, RequestConfig } from './types';
import { Streams } from './Streams';
import { Client, ClientResponse } from './Client';
export declare class Http {
    protected streams: Streams;
    constructor(streams: Streams);
    get client(): Client;
    get config(): ApiConfiguration;
    getStreams<T = IBaseStream[], R = ApiDataResponse<T>>(params?: any, config?: RequestConfig): Promise<ClientResponse<R>>;
    postStream<T, R = ApiDataResponse<IStreamPost<T>>>(data: T, config?: RequestConfig): Promise<ClientResponse<R>>;
    getStream<T extends string, R = ApiDataResponse<IStream<T>, 'stream'>>(stream: T, params?: any, config?: RequestConfig): Promise<ClientResponse<R>>;
    patchStream<T extends string, R = ApiDataResponse<IStream<T>, 'stream'>>(stream: T, data?: any, config?: RequestConfig): Promise<ClientResponse<R>>;
    putStream<T extends string, R = ApiDataResponse<IStream<T>>>(stream: T, data?: any, config?: RequestConfig): Promise<ClientResponse<R>>;
    deleteStream(stream: string | number, config?: RequestConfig): Promise<ClientResponse<boolean>>;
    getEntries<T = any, R = IStreamResponse<T, IEntriesMeta, IEntriesLinks>>(stream: string, params?: any, config?: RequestConfig): Promise<ClientResponse<R>>;
    postEntry<T = any, R = IStreamResponse<T>>(stream: string, data?: any, config?: RequestConfig): Promise<ClientResponse<R>>;
    getEntry<T = any, R = IStreamResponse<T>>(stream: string, entry: string | number, config?: RequestConfig): Promise<ClientResponse<R>>;
    patchEntry(stream: string, entry: string | number, data?: any, config?: RequestConfig): Promise<ClientResponse<unknown>>;
    putEntry(stream: string, entry: string | number, data?: any, config?: RequestConfig): Promise<ClientResponse<unknown>>;
    deleteEntry(stream: string, entry: string | number, config?: RequestConfig): Promise<ClientResponse<true>>;
    protected request<T>(method: MethodName, uri: string, config?: RequestConfig): Promise<T>;
}
export declare namespace Http {
    interface Response<T, C = IStreamResponse<T>> extends ClientResponse<C> {
    }
    interface StreamResponse<T, M extends IStreamMeta, L = IStreamLinks<any>> extends IStreamResponse<T, M, L> {
    }
    interface Responses<T> {
        entries: StreamResponse<T, IEntriesMeta, IEntriesLinks>;
        paginated: StreamResponse<T, IPaginatedEntriesMeta, IPaginatedEntriesLinks>;
    }
}
