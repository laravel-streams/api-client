import { Resource } from './Resource.js';

/**
 * Streams resource class for managing streams
 */
export class Streams extends Resource {
    async get(config = {}) {
        return this.client.request('get', '/streams', config);
    }

    async find(stream, config = {}) {
        return this.client.request('get', `/streams/${stream}`, config);
    }

    async post(data, config = {}) {
        return this.client.request('post', '/streams', { ...config, data });
    }

    async patch(stream, data, config = {}) {
        return this.client.request('patch', `/streams/${stream}`, { ...config, data });
    }

    async put(stream, data, config = {}) {
        return this.client.request('put', `/streams/${stream}`, { ...config, data });
    }

    async delete(stream, config = {}) {
        return this.client.request('delete', `/streams/${stream}`, config);
    }
}
