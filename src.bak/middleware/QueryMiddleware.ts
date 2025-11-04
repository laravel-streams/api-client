import { Middleware, MiddlewareOptions } from './Middleware';
import { Client } from '../Client';
import { FetchRequest } from '../FetchRequest';
export interface QueryMiddlewareOptions extends MiddlewareOptions {
}

export class QueryMiddleware extends Middleware<QueryMiddlewareOptions> {
    static defaultOptions: QueryMiddlewareOptions = {
    };

    public async request(request: FetchRequest, client: Client): Promise<FetchRequest> {
        if ( !request.query.empty() ) {
            let params = new URLSearchParams();
            request.query.forEach((value,key) => {
                if(typeof value === 'object'){
                    Object.entries(value).forEach(([key2,value2]) => {
                        params.set(`${key}[${key2}]`, value2.toString());
                    })
                } else {
                    params.set(key, value.toString())
                }
            })
            const url = request.url + '?' + params.toString(); // this.options.stringifyFn(request.query, this.options.stringify);
            request   = new FetchRequest(url, request);
            return request;
        }
        return request;
    }

}