import { FetchHeaders } from './FetchHeaders.js';
import { createCustomMap } from './utils.js';

/**
 * Extended Request class with additional functionality
 */
export class FetchRequest extends Request {
    constructor(input, init = {}) {
        super(input, init);

        const source = input instanceof FetchRequest ? input : {};
        this.responseType = init.responseType ?? source.responseType ?? 'json';
        const query = init.query ?? source.query ?? {};
        this.query = createCustomMap(query instanceof Map ? Object.fromEntries(query) : query);
        this.criteria = init.criteria ?? source.criteria;
        this.data = init.data ?? source.data;
        this.response = null;

        // Create custom headers
        Object.defineProperty(this, 'headers', {
            value: new FetchHeaders(init.headers ?? (input instanceof Request ? input.headers : undefined)),
            writable: false,
        });
    }

    isResponseType(responseType) {
        return this.responseType === responseType;
    }

    async fetch(signal = this.signal) {
        // Build fetch options from this request
        const options = {
            method: this.method,
            headers: this.headers,
            mode: this.mode,
            credentials: this.credentials,
            cache: this.cache,
            redirect: this.redirect,
            referrer: this.referrer,
            integrity: this.integrity,
            signal,
        };
        
        // Add body if present
        if (this.body) {
            // Keep the prepared body readable for a subsequent retry.
            options.body = this.clone().body;
            options.duplex = 'half';
        }
        
        const response = await fetch(this.url, options);
        
        this.response = response;
        response.request = this;
        return this;
    }

    setUrl(url) {
        Object.defineProperty(this, 'url', { value: url, writable: false });
        return this;
    }
}
