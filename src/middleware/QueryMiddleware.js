import { Middleware } from './Middleware.js';
import { stringify } from '../utils.js';

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
            const url = new URL(request.url);
            const separator = url.search ? '&' : '?';
            request.setUrl(url.origin + url.pathname + url.search + separator + queryString + url.hash);
        }
        return request;
    }
}
