import { IEntriesLinks, IEntriesMeta, IPaginatedEntriesLinks, IPaginatedEntriesMeta } from './EntryCollection';
import { ApiDataResponse, ClientResponse, IBaseStream, IEntries, IStream, IStreamLinks, IStreamMeta, IStreamPost, IStreamResponse, RequestConfig, StreamID, StreamsConfiguration } from './types';
import { Streams } from './Streams';
import { Method } from 'axios';
import { Response } from './Response';


export class Http {
    constructor(protected streams: Streams) {
    }

    get config(): StreamsConfiguration { return this.streams.config; }

    async getStreams<T = IBaseStream[], R = ApiDataResponse<T>>(params: any = {}, config: RequestConfig = {}) {
        return this.request<R>('get', `/streams`, { params, ...config });
    }

    async postStream<T, R = ApiDataResponse<IStreamPost<T>>>(data: T, config: RequestConfig = {}) {
        return this.request<R>('post', `/streams`, { data, ...config });
    }

    async getStream<ID extends StreamID, R = ApiDataResponse<IStream<ID>, 'stream'>>(stream: ID, params: any = {}, config: RequestConfig = {}) {
        return this.request<R>('get', `/streams/${stream}`, config);
    }

    async patchStream<ID extends StreamID, R = ApiDataResponse<IStream<ID>, 'stream'>>(stream: ID, data: any = {}, config: RequestConfig = {}) {
        return this.request<R>('patch', `/streams/${stream}`, { data, ...config });
    }

    async putStream<ID extends StreamID, R = ApiDataResponse<IStream<ID>>>(stream: ID, data: any = {}, config: RequestConfig = {}) {
        return this.request<R>('put', `/streams/${stream}`, { data, ...config });
    }

    async deleteStream(stream: string | number, config: RequestConfig = {}) {
        return this.request<boolean>('delete', `/streams/${stream}`, config);
    }


    async getEntries<ID extends StreamID, T = IEntries[ID], R = IStreamResponse<T[], IEntriesMeta, IEntriesLinks>>(stream: ID, params: any = {}, config: RequestConfig = {}) {
        return this.request<R>('get', `/streams/${stream}/entries`, { params, ...config });
    }

    async postEntry<ID extends StreamID, T = IEntries[ID], R = IStreamResponse<T>>(stream: ID, data: any = {}, config: RequestConfig = {}) {
        return this.request<R>('post', `/streams/${stream}/entries`, { data, ...config });
    }

    async getEntry<ID extends StreamID, T = IEntries[ID], R = IStreamResponse<T>>(stream: ID, entry: string | number, config: RequestConfig = {}) {
        return this.request<R>('get', `/streams/${stream}/entries/${entry}`, config);
    }

    async patchEntry<ID extends StreamID, T = IEntries[ID], R = IStreamResponse<T>>(stream: ID, entry: string | number, data: any = {}, config: RequestConfig = {}) {
        return this.request<R>('patch', `/streams/${stream}/entries/${entry}`, { data, ...config });
    }

    async putEntry<ID extends StreamID, T = IEntries[ID], R = IStreamResponse<T>>(stream: ID, entry: string | number, data: any = {}, config: RequestConfig = {}) {
        return this.request<R>('put', `/streams/${stream}/entries/${entry}`, { data, ...config });
    }

    async deleteEntry<ID extends StreamID, T = any, R = IStreamResponse<T>>(stream: ID, entry: string | number, config: RequestConfig = {}) {
        return this.request<R>('delete', `/streams/${stream}/entries/${entry}`, config);
    }

    protected async request<T = any, D = any>(method: Method, url: string, config?: RequestConfig): Promise<Response<T, D>>
    protected async request<T = any, D = any>(method: Method, url: string, config: RequestConfig, data: D): Promise<Response<T, D>>
    protected async request<T = any, D = any>(method: Method, url: string, ...args): Promise<Response<T, D>> {
        let config:RequestConfig=args[0] || {};
        let data:D=args[1] || undefined;

        const response = await this.streams.createRequest<T, D>().send({ method, url, data, ...config });
        return response;
    }

}


export namespace Http {
    export interface Response<T, C = IStreamResponse<T>> extends ClientResponse<C> {

    }

    export interface StreamResponse<T, M extends IStreamMeta, L = IStreamLinks<any>> extends IStreamResponse<T, M, L> {

    }

    export interface Responses<T> {
        entries: StreamResponse<T, IEntriesMeta, IEntriesLinks>;
        paginated: StreamResponse<T, IPaginatedEntriesMeta, IPaginatedEntriesLinks>;
    }

}
