import { Middleware, MiddlewareOptions } from './Middleware';
import { Client } from '../Client';
import { FetchRequest } from '../fetch/FetchRequest';
import { mergeObjects, objectify } from '../utils';

export interface CriteriaMiddlewareOptions extends MiddlewareOptions {}
export class CriteriaMiddleware extends Middleware<CriteriaMiddlewareOptions> {
    static defaultOptions: CriteriaMiddlewareOptions = {
        priority: {
            request: 40
        }
    };

    public async request(request: FetchRequest, client: Client): Promise<FetchRequest> {
        if ( request.criteria ) {
            const criteria=request.criteria;
            criteria.get();
            const params=criteria.get();
            const obj = params.map(kv => [kv['name'],kv['value']]).reduce((obj, [ k, v ], i, data) => {
                if(Array.isArray(v)){
                    data.slice().filter(kv => kv['name'] === k)
                }
                return { ...obj, [ k ]: v}
            },{});
            request.params=mergeObjects(request.params||{},obj);
        }
        // if ( request.isResponseType('arraybuffer') ) {
        //     response.data = await response.arrayBuffer();
        // } else if ( request.isResponseType('blob') ) {
        //     response.data = await response.blob();
        // } else if ( request.isResponseType('document') ) {
        //     response.data = await response.formData();
        // } else if ( request.isResponseType('json') ) {
        //     response.data = await response.json();
        // } else if ( request.isResponseType('stream') ) {
        //     response.data = await response.body;
        // } else if ( request.isResponseType('text') ) {
        //     response.data = await response.text();
        // }
        return request;
    }
}