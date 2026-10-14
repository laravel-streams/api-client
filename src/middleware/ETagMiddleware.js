import { Middleware } from './Middleware.js';

/**
 * Middleware to handle ETag caching
 */
export class ETagMiddleware extends Middleware {
    static defaultOptions = { priority: { request: 90, response: 10 } };

    constructor(options = {}) {
        super(options);
        this.caches = new WeakMap();
    }

    cache(client) {
        if (!this.caches.has(client)) this.caches.set(client, new Map());
        return this.caches.get(client);
    }

    key(request) {
        // Include request headers to keep authorization and negotiated representations isolated.
        const headers = Array.from(request.headers).filter(([name]) => name !== 'if-none-match').sort();
        return JSON.stringify([request.url, request.credentials, request.responseType, headers]);
    }

    async request(request, client) {
        if (request.method === 'GET' && request.cache !== 'no-store') {
            const cached = this.cache(client).get(this.key(request));
            if (cached && !request.headers.has('If-None-Match')) {
                request.headers.ifNoneMatch(cached.etag);
            }
        }
        return request;
    }

    async response(response, client) {
        const request = response.request;
        const cache = this.cache(client);
        if (request.method !== 'GET') {
            if (response.ok) cache.clear();
            return response;
        }
        if (request.cache === 'no-store') return response;
        const key = this.key(request);
        const cached = cache.get(key);
        if (response.status === 304 && cached
            && request.headers.get('If-None-Match') === cached.etag) {
            const replay = cached.response.clone();
            response.headers.forEach((value, name) => replay.headers.set(name, value));
            replay.request = request;
            replay.revalidated = true;
            return replay;
        }
        if (response.ok) {
            const etag = response.headers.get('ETag');
            const control = response.headers.get('Cache-Control') || '';
            if (etag && !/\bno-store\b/i.test(control) && response.headers.get('Vary') !== '*') {
                cache.set(key, { etag, response: response.clone() });
            } else {
                cache.delete(key);
            }
        }
        return response;
    }
}
