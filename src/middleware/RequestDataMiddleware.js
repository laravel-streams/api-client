import { Middleware } from './Middleware.js';
import { FetchRequest } from '../FetchRequest.js';

/**
 * Middleware to handle request data/body
 */
export class RequestDataMiddleware extends Middleware {
    static defaultOptions = {};

    async request(request, client) {
        if (request.data) {
            request = new FetchRequest(request, {
                body: JSON.stringify(request.data)
            });
        }
        return request;
    }
}
