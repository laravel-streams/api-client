import { Middleware, MiddlewareOptions } from './Middleware';
import { Client } from '../Client';
import { FetchRequest } from '../FetchRequest';

export interface CriteriaMiddlewareOptions extends MiddlewareOptions {}

export class CriteriaMiddleware extends Middleware<CriteriaMiddlewareOptions> {
    static defaultOptions: CriteriaMiddlewareOptions = {
        priority: {
            request: 40,
        },
    };

    public async request(request: FetchRequest, client: Client): Promise<FetchRequest> {
        if ( request.criteria ) {
            const criteria = request.criteria;
            request.query.merge(criteria.standardizeParameters());
        }
        return request;
    }
}