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
        return this.client.request('post', '/streams', config);
    }

    async patch(config = {}) {
        return this.client.request('patch', '/streams', config);
    }

    async put(config = {}) {
        return this.client.request('put', '/streams', config);
    }

    async delete(stream, config = {}) {
        return this.client.request('delete', `/streams/${stream}`, config);
    }
}
