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
            request = new FetchRequest(request, {
                body: JSON.stringify(request.data),
                headers: request.headers,
                responseType: request.responseType,
                query: request.query.toObject(),
                criteria: request.criteria,
            });
        }
        return request;
    }
}
