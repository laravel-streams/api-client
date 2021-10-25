import { IEntriesLinks, IEntriesMeta, IPaginatedEntriesLinks, IPaginatedEntriesMeta } from './EntryCollection';
import { IBaseStream, IStreamLinks, IStreamMeta, IStreamResponse, MethodName, RequestConfig, ApiConfiguration } from './types';
import { Streams } from './Streams';
import { Str } from './utils';
import { Client } from './Client';


export class Http {
    constructor(protected streams: Streams) {}

    get client(): Client {return this.streams.client;}

    get config(): ApiConfiguration { return this.streams.config; }

    async getStreams(params: any = {}, config: RequestConfig = {}) {
        config.params = params;
        return this.get('/streams', config);
    }

    async postStream<T>(data: T, config: RequestConfig = {}): Promise<IStreamResponse<T>> {
        return this.post<T>('/streams', data, config);
    }

    async getStream<ID extends string>(stream: ID, params: any = {}, config: RequestConfig = {}) {
        config.params = params;
        return await this.get<IBaseStream<ID>>(`/streams/${stream}`, config);
    }

    async patchStream<ID extends string>(stream: ID, data: any = {}, config: RequestConfig = {}) {
        return this.patch<IBaseStream<ID>>(`/streams/${stream}`, data, config);
    }

    async putStream<ID extends string>(stream: ID, data: any = {}, config: RequestConfig = {}) {
        return this.put<IBaseStream<ID>>(`/streams/${stream}`, data, config);
    }

    async deleteStream<ID extends string>(stream: ID, config: RequestConfig = {}) {
        return this.delete<IBaseStream<ID>>(`/streams/${stream}`, config);
    }

    async getEntries<DATA, TYPE extends keyof Http.Responses<DATA> = 'entries', ID extends string = string>(stream: ID, data: any = {}, params: any = {}, config: RequestConfig = {}): Promise<Http.Responses<DATA>[TYPE]> {
        config.body   = data;
        config.params = params;
        return this.get<DATA[], Http.Responses<DATA>[TYPE]>(`/streams/${stream}/entries`, {
            ...config,
            headers: {
                'Content-Type': 'application/json',
            },
        });
    }

    async postEntry<ID extends string>(stream: ID, data: any = {}, config: RequestConfig = {}) {
        return this.post<any>(`/streams/${stream}/entries`, data, config);
    }


    async getEntry<ID extends string, EID extends string>(stream: ID, entry: EID, config: RequestConfig = {}) {
        return this.get<any>(`/streams/${stream}/entries/${entry}`, config);
    }

    async patchEntry<ID extends string, EID extends string>(stream: ID, entry: EID, data: any = {}, config: RequestConfig = {}) {
        return this.patch<any>(`/streams/${stream}/entries/${entry}`, data, config);
    }

    async putEntry<ID extends string, EID extends string>(stream: ID, entry: EID, data: any = {}, config: RequestConfig = {}) {
        return this.put<any>(`/streams/${stream}/entries/${entry}`, data, config);
    }

    async deleteEntry<ID extends string, EID extends string>(stream: ID, entry: EID, config: RequestConfig = {}) {
        Str.parameters('/streams/:stream/entries/:entry', { stream, entry });
        return this.patch<any>(`/streams/${stream}/entries/${entry}`, config);
    }

    async get<T = any, R = IStreamResponse<T>>(url: string, config: RequestConfig = {}): Promise<R> { return this.request<T, R>('get', url, config); }

    async delete<T = any, R = IStreamResponse<T>>(url: string, config: RequestConfig = {}): Promise<R> { return this.request<T, R>('delete', url, config); }

    async head<T = any, R = IStreamResponse<T>>(url: string, config: RequestConfig = {}): Promise<R> { return this.request<T, R>('head', url, config); }

    async options<T = any, R = IStreamResponse<T>>(url: string, config: RequestConfig = {}): Promise<R> { return this.request<T, R>('options', url, config); }

    async post<T = any, R = IStreamResponse<T>>(url: string, data?: any, config: RequestConfig = {}): Promise<R> { return this.request<T, R>('post', url, {data, ...config }); }

    async put<T = any, R = IStreamResponse<T>>(url: string, data?: any, config: RequestConfig = {}): Promise<R> { return this.request<T, R>('put', url, {  data, ...config }); }

    async patch<T = any, R = IStreamResponse<T>>(url: string, data?: any, config: RequestConfig = {}): Promise<R> {return this.request<T, R>('patch', url, { data, ...config }); }

    async request<T = any, R = IStreamResponse<T>>(method: MethodName, url: string, config: RequestConfig): Promise<R> {
        try {
            const response = await this.client.request(method, url, config);
            return response as any;
        } catch (e) {
            throw e;
        }
    }

}


export namespace Http {
    export interface StreamResponse<T, M extends IStreamMeta, L = IStreamLinks<any>> extends IStreamResponse<T, M, L> {

    }

    export interface Responses<T> {
        entries: StreamResponse<T, IEntriesMeta, IEntriesLinks>;
        paginated: StreamResponse<T, IPaginatedEntriesMeta, IPaginatedEntriesLinks>;
    }

}
