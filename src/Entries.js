import { Resource } from './Resource.js';

/**
 * Entries resource class for managing stream entries
 */
export class Entries extends Resource {
    async get(stream, config = {}) {
        return this.client.request('get', `/streams/${stream}/entries`, config);
    }

    async find(stream, entry, config = {}) {
        return this.client.request('get', `/streams/${stream}/entries/${entry}`, config);
    }

    async post(stream, data, config = {}) {
        config.data = data;
        return this.client.request('post', `/streams/${stream}/entries`, config);
    }

    async patch(stream, entry, data, config = {}) {
        config.data = data;
        return this.client.request('patch', `/streams/${stream}/entries/${entry}`, config);
    }

    async put(stream, entry, data, config = {}) {
        config.data = data;
        return this.client.request('put', `/streams/${stream}/entries/${entry}`, config);
    }

    async delete(stream, entry, config = {}) {
        return this.client.request('delete', `/streams/${stream}/entries/${entry}`, config);
    }
}
