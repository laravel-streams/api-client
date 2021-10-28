import { IEntriesLinks, IEntriesMeta, IPaginatedEntriesLinks, IPaginatedEntriesMeta } from './EntryCollection';
import { ApiConfiguration, ApiDataResponse, IBaseStream, IStream, IStreamLinks, IStreamMeta, IStreamPost, IStreamResponse, MethodName, RequestConfig } from './types';
import { Streams } from './Streams';
import { Client, ClientResponse } from './Client';


export class Http {
    constructor(protected streams: Streams) {}

    get client(): Client {return this.streams.client;}

    get config(): ApiConfiguration { return this.streams.config; }

    async getStreams<T = IBaseStream[], R = ApiDataResponse<T>>(params: any = {}, config: RequestConfig = {}) {
        return this.client.request<R>('get', `/streams`, { params, ...config });
    }

    async postStream<T, R = ApiDataResponse<IStreamPost<T>>>(data: T, config: RequestConfig = {}) {
        return this.client.request<R>('post', `/streams`, { data, ...config });
    }

    async getStream<T extends string, R = ApiDataResponse<IStream<T>,'stream'>>(stream: T, params: any = {}, config: RequestConfig = {}) {
        return this.client.request<R>('get', `/streams/${stream}`,config);
    }

    async patchStream<T extends string, R = ApiDataResponse<IStream<T>,'stream'>>(stream: T, data: any = {}, config: RequestConfig = {}) {
        return this.client.request<R>('patch', `/streams/${stream}`, { data, ...config });
    }

    async putStream<T extends string, R = ApiDataResponse<IStream<T>>>(stream: T, data: any = {}, config: RequestConfig = {}) {
        return this.client.request<R>('put', `/streams/${stream}`, { data, ...config });
    }

    async deleteStream(stream: string | number, config: RequestConfig = {}) {
        return this.client.request<boolean>('delete', `/streams/${stream}`, config);
    }


    async getEntries<T = any, R = IStreamResponse<T,IEntriesMeta, IEntriesLinks>>(stream: string, params: any = {}, config: RequestConfig = {}) {
        return this.client.request<R>('get', `/streams/${stream}/entries`, { params, ...config });
    }

    async postEntry<T = any, R = IStreamResponse<T>>(stream: string, data: any = {}, config: RequestConfig = {}) {
        return this.client.request<R>('post', `/streams/${stream}/entries`, { data, ...config });
    }

    async getEntry<T = any, R = IStreamResponse<T>>(stream: string, entry: string | number, config: RequestConfig = {}) {
        return this.client.request<R>('get', `/streams/${stream}/entries/${entry}`, config);
    }

    async patchEntry(stream: string, entry: string | number, data: any = {}, config: RequestConfig = {}) {
        return this.client.request('patch', `/streams/${stream}/entries/${entry}`, { data, ...config });
    }

    async putEntry(stream: string, entry: string | number, data: any = {}, config: RequestConfig = {}) {
        return this.client.request('put', `/streams/${stream}/entries/${entry}`, { data, ...config });
    }

    async deleteEntry(stream: string, entry: string | number, config: RequestConfig = {}) {
        return this.client.request<true>('patch', `/streams/${stream}/entries/${entry}`, config);
    }

    protected async request<T>(method: MethodName, uri: string, config: RequestConfig = {}):Promise<T>{
        const res = await this.client.request<T>(method,uri,config);

        return res.data;
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
