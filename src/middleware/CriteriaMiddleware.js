import { Middleware } from './Middleware.js';

/**
 * Middleware to handle criteria parameters
 */
export class CriteriaMiddleware extends Middleware {
    static defaultOptions = {
        priority: {
            request: 40,
        },
    };

    async request(request, client) {
        if (request.criteria) {
            const criteria = request.criteria;
            request.query.merge(criteria.standardizeParameters());
        }
        return request;
    }
}
