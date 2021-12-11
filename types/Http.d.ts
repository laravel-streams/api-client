import { IEntriesLinks, IEntriesMeta, IPaginatedEntriesLinks, IPaginatedEntriesMeta } from './EntryCollection';
import { ApiDataResponse, IBaseStream, IEntries, IStream, IStreamLinks, IStreamMeta, IStreamPost, IStreamResponse, MethodName, RequestConfig, StreamID, StreamsConfiguration } from './types';
import { Streams } from './Streams';
import { Client, ClientResponse } from './Client';
export declare class Http {
    protected streams: Streams;
    constructor(streams: Streams);
    get client(): Client;
    get config(): StreamsConfiguration;
    getStreams<T = IBaseStream[], R = ApiDataResponse<T>>(params?: any, config?: RequestConfig): Promise<ClientResponse<R>>;
    postStream<T, R = ApiDataResponse<IStreamPost<T>>>(data: T, config?: RequestConfig): Promise<ClientResponse<R>>;
    getStream<ID extends StreamID, R = ApiDataResponse<IStream<ID>, 'stream'>>(stream: ID, params?: any, config?: RequestConfig): Promise<ClientResponse<R>>;
    patchStream<ID extends StreamID, R = ApiDataResponse<IStream<ID>, 'stream'>>(stream: ID, data?: any, config?: RequestConfig): Promise<ClientResponse<R>>;
    putStream<ID extends StreamID, R = ApiDataResponse<IStream<ID>>>(stream: ID, data?: any, config?: RequestConfig): Promise<ClientResponse<R>>;
    deleteStream(stream: string | number, config?: RequestConfig): Promise<ClientResponse<boolean>>;
    getEntries<ID extends StreamID, T = IEntries[ID], R = IStreamResponse<T[], IEntriesMeta, IEntriesLinks>>(stream: ID, params?: any, config?: RequestConfig): Promise<ClientResponse<R>>;
    postEntry<ID extends StreamID, T = IEntries[ID], R = IStreamResponse<T>>(stream: ID, data?: any, config?: RequestConfig): Promise<ClientResponse<R>>;
    getEntry<ID extends StreamID, T = IEntries[ID], R = IStreamResponse<T>>(stream: ID, entry: string | number, config?: RequestConfig): Promise<ClientResponse<R>>;
    patchEntry<ID extends StreamID, T = IEntries[ID], R = IStreamResponse<T>>(stream: ID, entry: string | number, data?: any, config?: RequestConfig): Promise<ClientResponse<R>>;
    putEntry<ID extends StreamID, T = IEntries[ID], R = IStreamResponse<T>>(stream: ID, entry: string | number, data?: any, config?: RequestConfig): Promise<ClientResponse<R>>;
    deleteEntry<ID extends StreamID, T = any, R = IStreamResponse<T>>(stream: ID, entry: string | number, config?: RequestConfig): Promise<ClientResponse<R>>;
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
