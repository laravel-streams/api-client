import { Middleware } from './Middleware.js';

/**
 * Middleware to handle ETag caching.
 *
 * Stores validators from GET responses, sends If-None-Match on the next
 * matching GET, and replays the stored body when the server returns 304.
 */
export class ETagMiddleware extends Middleware {
    static defaultOptions = {
        priority: {
            request: 90,
            response: 10,
        },
    };

    constructor(options = {}) {
        super(options);
        this.caches = new WeakMap();
    }

    cache(client) {
        let cache = this.caches.get(client);
        if (!cache) {
            cache = new Map();
            this.caches.set(client, cache);
        }
        return cache;
    }

    key(request) {
        const headers = Array.from(request.headers.entries())
            .filter(([name]) => name.toLowerCase() !== 'if-none-match')
            .sort(([left], [right]) => left.localeCompare(right));
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
            if (request.method !== 'HEAD' && response.ok) {
                cache.clear();
            }
            return response;
        }

        if (request.cache === 'no-store') {
            return response;
        }

        const key = this.key(request);
        const cached = cache.get(key);
        if (response.status === 304 && cached && request.headers.get('If-None-Match') === cached.etag) {
            const headers = new Headers(cached.response.headers);
            response.headers.forEach((value, name) => {
                if (name.toLowerCase() === 'content-length') {
                    return;
                }
                headers.set(name, value);
            });
            const replay = new Response(cached.response.clone().body, {
                status: cached.response.status,
                statusText: cached.response.statusText,
                headers,
            });
            replay.request = request;
            replay.revalidated = true;
            // Persist updated validators and cache directives from revalidation.
            response = replay;
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
