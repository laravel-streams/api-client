import { ApiDataResponse, IBaseStream, IEntries, IStream, IStreamPost, RequestConfig, StreamID, StreamsConfiguration } from './types';
import { Streams } from './Streams';
import { Method } from 'axios';
import { Response } from './Response';


export class Http {
    constructor(protected streams: Streams) {
    }

    get config(): StreamsConfiguration { return this.streams.config; }

    async getStreams<T = IBaseStream[], R = ApiDataResponse<T, 'streams', 'list'>>(params: any = {}, config: RequestConfig = {}) {
        return this.request<R>('get', `/streams`, { params, ...config });
    }

    async postStream<T, R = ApiDataResponse<IStreamPost<T>, 'streams', 'post'>>(data: T, config: RequestConfig = {}) {
        return this.request<R>('post', `/streams`, { data, ...config });
    }

    async getStream<ID extends StreamID, R = ApiDataResponse<IStream<ID>, 'streams', 'get'>>(stream: ID, params: any = {}, config: RequestConfig = {}) {
        return this.request<R>('get', `/streams/${stream}`, config);
    }

    async patchStream<ID extends StreamID, R = ApiDataResponse<IStream<ID>, 'streams', 'patch'>>(stream: ID, data: any = {}, config: RequestConfig = {}) {
        return this.request<R>('patch', `/streams/${stream}`, { data, ...config });
    }

    async putStream<ID extends StreamID, R = ApiDataResponse<IStream<ID>, 'streams', 'put'>>(stream: ID, data: any = {}, config: RequestConfig = {}) {
        return this.request<R>('put', `/streams/${stream}`, { data, ...config });
    }

    async deleteStream(stream: string | number, config: RequestConfig = {}) {
        return this.request<boolean>('delete', `/streams/${stream}`, config);
    }


    async getEntries<ID extends StreamID, T = IEntries[ID], R = ApiDataResponse<T[], 'entries', 'list'>>(stream: ID, params: any = {}, config: RequestConfig = {}) {
        return this.request<R>('get', `/streams/${stream}/entries`, { params, ...config });
    }

    async postEntry<ID extends StreamID, T = IEntries[ID], R = ApiDataResponse<T, 'entries', 'post'>>(stream: ID, data: any = {}, config: RequestConfig = {}) {
        return this.request<R>('post', `/streams/${stream}/entries`, { data, ...config });
    }

    async getEntry<ID extends StreamID, T = IEntries[ID], R = ApiDataResponse<T, 'entries', 'get'>>(stream: ID, entry: string | number, config: RequestConfig = {}) {
        return this.request<R>('get', `/streams/${stream}/entries/${entry}`, config);
    }

    async patchEntry<ID extends StreamID, T = IEntries[ID], R = ApiDataResponse<T, 'entries', 'patch'>>(stream: ID, entry: string | number, data: any = {}, config: RequestConfig = {}) {
        return this.request<R>('patch', `/streams/${stream}/entries/${entry}`, { data, ...config });
    }

    async putEntry<ID extends StreamID, T = IEntries[ID], R = ApiDataResponse<T, 'entries', 'put'>>(stream: ID, entry: string | number, data: any = {}, config: RequestConfig = {}) {
        return this.request<R>('put', `/streams/${stream}/entries/${entry}`, { data, ...config });
    }

    async deleteEntry<ID extends StreamID, T = any, R = boolean>(stream: ID, entry: string | number, config: RequestConfig = {}) {
        return this.request<R>('delete', `/streams/${stream}/entries/${entry}`, config);
    }

    protected async request<T = any, D = any>(method: Method, url: string, config?: RequestConfig): Promise<Response<T, D>>
    protected async request<T = any, D = any>(method: Method, url: string, config: RequestConfig, data: D): Promise<Response<T, D>>
    protected async request<T = any, D = any>(method: Method, url: string, ...args): Promise<Response<T, D>> {
        let config: RequestConfig = args[ 0 ] || {};
        let data: D               = args[ 1 ] || undefined;

        const response = await this.streams.createRequest<T, D>().send({ method, url, data, ...config });
        return response;
    }

}
