import { Middleware } from './Middleware.js';
import { stringify } from '../utils.js';
import { FetchRequest } from '../FetchRequest.js';

/**
 * Middleware to convert query parameters to query string
 */
export class QueryMiddleware extends Middleware {
    static defaultOptions = {
        stringify: {
            encodeValuesOnly: true,
        },
    };

    async request(request, client) {
        if (!request.query.empty()) {
            const queryString = stringify(request.query.toObject(), this.options.stringify);
            const url = request.url + '?' + queryString;
            request = new FetchRequest(url, request);
        }
        return request;
    }
}
