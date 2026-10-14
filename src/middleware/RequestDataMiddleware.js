import { Middleware } from './Middleware.js';
import { FetchRequest } from '../FetchRequest.js';

/**
 * Middleware to handle request data/body
 */
export class RequestDataMiddleware extends Middleware {
    static defaultOptions = {};

    async request(request, client) {
        if (request.data !== undefined) {
            if (!request.headers.has('Content-Type')) {
                request.headers.contentType('application/json');
            }
            const query = request.query && typeof request.query.toObject === 'function'
                ? request.query.toObject()
                : (request.query || {});
            request = new FetchRequest(request, {
                body: JSON.stringify(request.data),
                headers: request.headers.toObject(),
                responseType: request.responseType,
                query,
                criteria: request.criteria,
                data: request.data,
            });
        }
        return request;
    }
}
