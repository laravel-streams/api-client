import { ClientResponse, RequestConfig,ResponseType } from '../types';
import { FetchHeaders } from './FetchHeaders';
import { Criteria } from '../Criteria';

export class FetchRequest extends Request {
    response: ClientResponse;
    headers: FetchHeaders;
    responseType:ResponseType;
    params?:any
    criteria?:Criteria

    constructor(input: RequestInfo | URL, init: RequestConfig = {}) {
        super(input, init);
        this.responseType = init.responseType || 'json';
        this.params = init.params;
        this.criteria = init.criteria;
        delete this.headers;
        Object.defineProperty(this, 'headers', {
            value   : new FetchHeaders(init.headers),
            writable: false,
        });
    }

    isResponseType(responseType:ResponseType){
        return this.responseType === responseType
    }

    fetch(): Promise<this> {
        return fetch(this.url, this).then(async (response: ClientResponse) => {
            this.response    = response;
            response.request = this;
            return this;
        });
    }

}