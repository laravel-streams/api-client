import { Middleware } from './Middleware.js';

/**
 * Middleware to handle ETag caching
 */
export class ETagMiddleware extends Middleware {
    static defaultOptions = {};

    async request(request, client) {
        // ETag support can be added here
        return request;
    }

    async response(response, client) {
        // ETag support can be added here
        return response;
    }
}
