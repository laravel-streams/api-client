import { Resource } from './Resource';
import { ClientResponse, RequestConfig } from './types';


export class Streams extends Resource {
    async get<T>(config: RequestConfig = {}): Promise<ClientResponse<T[]>> {
        return this.client.request('get', '/streams', config);
    }

    async find<T>(stream: string | number, config: RequestConfig = {}): Promise<ClientResponse<T>> {
        return this.client.request('get', `/streams/${stream}`, config);
    }

    async post<T>(data: any, config: RequestConfig = {}): Promise<ClientResponse<T>> {

        return this.client.request('post', '/streams', config);
    }

    async patch<T>(config: RequestConfig = {}): Promise<ClientResponse<T>> {
        return this.client.request('patch', '/streams', config);
    }

    async put<T>(config: RequestConfig = {}): Promise<ClientResponse<T>> {
        return this.client.request('put', '/streams', config);
    }

    async delete<T>(stream: string | number, config: RequestConfig = {}): Promise<ClientResponse<T>> {
        return this.client.request('delete', `/streams/${stream}`, config);
    }
}