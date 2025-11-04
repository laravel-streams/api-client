import { Resource } from './Resource';
import { ClientResponse, RequestConfig } from './types';


export class Entries extends Resource {
    async get<T>(stream: string, config: RequestConfig = {}): Promise<ClientResponse<T[]>> {
        return this.client.request('get', `/streams/${stream}/entries`, config);
    }

    async find<T>(stream: string, entry: string | number, config: RequestConfig = {}): Promise<ClientResponse<T>> {
        return this.client.request('get', `/streams/${stream}/entries/${entry}`, config);
    }

    async post<T>(stream: string, data: any, config: RequestConfig = {}): Promise<ClientResponse<T>> {
        config.data = data;
        return this.client.request('post', `/streams/${stream}/entries`, config);
    }

    async patch<T>(stream: string, entry: string | number, data: any, config: RequestConfig = {}): Promise<ClientResponse<T>> {
        config.data = data;
        return this.client.request('patch', `/streams/${stream}/entries/${entry}`, config);
    }

    async put<T>(stream: string, entry: string | number, data: any, config: RequestConfig = {}): Promise<ClientResponse<T>> {
        config.data = data;
        return this.client.request('put', `/streams/${stream}/entries/${entry}`, config);
    }

    async delete<T>(stream: string, entry: string | number, config: RequestConfig = {}): Promise<ClientResponse<T>> {
        return this.client.request('delete', `/streams/${stream}/entries/${entry}`, config);
    }
}
