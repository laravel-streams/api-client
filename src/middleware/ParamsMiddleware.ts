import { Middleware, MiddlewareOptions } from './Middleware';
import { Client } from '../Client';
import { FetchRequest } from '../fetch/FetchRequest';
import { default as stringifyFn } from 'qs/lib/stringify';
import type { IStringifyOptions } from 'qs';

export interface ParamsMiddlewareOptions extends MiddlewareOptions {
    stringify?: IStringifyOptions;
    stringifyFn?: (obj: any, options?: IStringifyOptions) => string;
}

export class ParamsMiddleware extends Middleware<ParamsMiddlewareOptions> {
    static defaultOptions: ParamsMiddlewareOptions = {
        stringify: {
            encodeValuesOnly: true,
        },
        stringifyFn,
    };

    public async request(request: FetchRequest, client: Client): Promise<FetchRequest> {
        if ( request.params ) {
            const url = request.url + '?' + this.options.stringifyFn(request.params, this.options.stringify);
            request   = new FetchRequest(url, request);
            return request;
        }
        return request;
    }

}