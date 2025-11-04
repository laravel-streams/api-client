import { Middleware, MiddlewareOptions } from './Middleware';
import { ClientResponse } from '../types';
import { Client } from '../Client';
import { FetchRequest } from '../FetchRequest';


export interface RequestDataMiddlewareOptions extends MiddlewareOptions {}
export class RequestDataMiddleware extends Middleware<RequestDataMiddlewareOptions> {
    static defaultOptions: RequestDataMiddlewareOptions = {};
    public async request(request: FetchRequest, client: Client): Promise<FetchRequest> {
        if ( request.data ) {
            request = new FetchRequest(request, {
                body: JSON.stringify(request.data)
            })
        }
        return request;
    }
}