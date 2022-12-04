import { Middleware, MiddlewareOptions } from './Middleware';
import { Client } from '../Client';
import { FetchRequest } from '../FetchRequest';
import { default as stringifyFn } from 'qs/lib/stringify';
import type { IStringifyOptions } from 'qs';

export interface QueryMiddlewareOptions extends MiddlewareOptions {
    stringify?: IStringifyOptions;
    stringifyFn?: (obj: any, options?: IStringifyOptions) => string;
}

export class QueryMiddleware extends Middleware<QueryMiddlewareOptions> {
    static defaultOptions: QueryMiddlewareOptions = {
        stringify: {
            encodeValuesOnly: true,
        },
        stringifyFn,
    };

    public async request(request: FetchRequest, client: Client): Promise<FetchRequest> {
        if ( !request.query.empty() ) {
            const url = request.url + '?' + this.options.stringifyFn(request.query, this.options.stringify);
            request   = new FetchRequest(url, request);
            return request;
        }
        return request;
    }

}