import { FetchHeaders } from './FetchHeaders.js';
import { createCustomMap } from './utils.js';

/**
 * Extended Request class with additional functionality
 */
export class FetchRequest extends Request {
    constructor(input, init = {}) {
        super(input, init);
        
        this.responseType = init.responseType || 'json';
        this.query = createCustomMap(init.query || {});
        this.criteria = init.criteria;
        this.data = init.data;
        this.response = null;

        // Create custom headers
        Object.defineProperty(this, 'headers', {
            value: new FetchHeaders(init.headers),
            writable: false,
        });
    }

    isResponseType(responseType) {
        return this.responseType === responseType;
    }

    async fetch() {
        const response = await fetch(this.url, this);
        this.response = response;
        response.request = this;
        return this;
    }

    setUrl(url) {
        Object.defineProperty(this, 'url', { value: url, writable: false });
        return this;
    }
}
