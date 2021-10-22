import { IEntriesLinks, IEntriesMeta, IPaginatedEntriesLinks, IPaginatedEntriesMeta } from './EntryCollection';
import { IBaseStream, IStreamLinks, IStreamMeta, IStreamResponse, MethodName, RequestConfig, StreamsConfiguration } from './types';
import { Streams } from './Streams';
import { Client } from './Client';
export declare class Http {
    protected streams: Streams;
    constructor(streams: Streams);
    get client(): Client;
    get config(): StreamsConfiguration;
    getStreams(params?: any, config?: RequestConfig): Promise<IStreamResponse<any, IStreamMeta, IStreamLinks<"self" | "entries">>>;
    postStream<T>(data: T, config?: RequestConfig): Promise<IStreamResponse<T>>;
    getStream<ID extends string>(stream: ID, params?: any, config?: RequestConfig): Promise<IStreamResponse<IBaseStream<ID>, IStreamMeta, IStreamLinks<"self" | "entries">>>;
    patchStream<ID extends string>(stream: ID, data?: any, config?: RequestConfig): Promise<IStreamResponse<IBaseStream<ID>, IStreamMeta, IStreamLinks<"self" | "entries">>>;
    putStream<ID extends string>(stream: ID, data?: any, config?: RequestConfig): Promise<IStreamResponse<IBaseStream<ID>, IStreamMeta, IStreamLinks<"self" | "entries">>>;
    deleteStream<ID extends string>(stream: ID, config?: RequestConfig): Promise<IStreamResponse<IBaseStream<ID>, IStreamMeta, IStreamLinks<"self" | "entries">>>;
    getEntries<DATA, TYPE extends keyof Http.Responses<DATA> = 'entries', ID extends string = string>(stream: ID, data?: any, params?: any, config?: RequestConfig): Promise<Http.Responses<DATA>[TYPE]>;
    postEntry<ID extends string>(stream: ID, data?: any, config?: RequestConfig): Promise<IStreamResponse<any, IStreamMeta, IStreamLinks<"self" | "entries">>>;
    getEntry<ID extends string, EID extends string>(stream: ID, entry: EID, config?: RequestConfig): Promise<IStreamResponse<any, IStreamMeta, IStreamLinks<"self" | "entries">>>;
    patchEntry<ID extends string, EID extends string>(stream: ID, entry: EID, data?: any, config?: RequestConfig): Promise<IStreamResponse<any, IStreamMeta, IStreamLinks<"self" | "entries">>>;
    putEntry<ID extends string, EID extends string>(stream: ID, entry: EID, data?: any, config?: RequestConfig): Promise<IStreamResponse<any, IStreamMeta, IStreamLinks<"self" | "entries">>>;
    deleteEntry<ID extends string, EID extends string>(stream: ID, entry: EID, config?: RequestConfig): Promise<IStreamResponse<any, IStreamMeta, IStreamLinks<"self" | "entries">>>;
    get<T = any, R = IStreamResponse<T>>(url: string, config?: RequestConfig): Promise<R>;
    delete<T = any, R = IStreamResponse<T>>(url: string, config?: RequestConfig): Promise<R>;
    head<T = any, R = IStreamResponse<T>>(url: string, config?: RequestConfig): Promise<R>;
    options<T = any, R = IStreamResponse<T>>(url: string, config?: RequestConfig): Promise<R>;
    post<T = any, R = IStreamResponse<T>>(url: string, data?: any, config?: RequestConfig): Promise<R>;
    put<T = any, R = IStreamResponse<T>>(url: string, data?: any, config?: RequestConfig): Promise<R>;
    patch<T = any, R = IStreamResponse<T>>(url: string, data?: any, config?: RequestConfig): Promise<R>;
    request<T = any, R = IStreamResponse<T>>(method: MethodName, url: string, config: RequestConfig): Promise<R>;
}
export declare namespace Http {
    interface StreamResponse<T, M extends IStreamMeta, L = IStreamLinks<any>> extends IStreamResponse<T, M, L> {
    }
    interface Responses<T> {
        entries: StreamResponse<T, IEntriesMeta, IEntriesLinks>;
        paginated: StreamResponse<T, IPaginatedEntriesMeta, IPaginatedEntriesLinks>;
    }
}
