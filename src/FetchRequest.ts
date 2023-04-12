import { ClientResponse, RequestConfig, ResponseType } from './types';
import { FetchHeaders } from './FetchHeaders';
import { Criteria } from './Criteria';
import { createCustomMap, CustomMap } from './utils';

export class FetchRequest extends Request {
    response: ClientResponse;
    headers: FetchHeaders;
    query: CustomMap<string>;
    responseType: ResponseType;
    criteria?: Criteria;
    data?: any;

    constructor(input: RequestInfo | URL, init: RequestConfig = {}) {
        super(input, init);
        this.responseType = init.responseType || 'json';

        this.query        = createCustomMap({});
        if ( typeof input === 'object' && 'query' in input ) {
            this.query.merge(input.query);
        }
        this.query.merge(init.query || {});

        this.criteria = init.criteria;
        this.data     = init.data;
        Object.defineProperty(this, 'headers', {
            value   : new FetchHeaders(init.headers),
            writable: false,
        });
    }

    isResponseType(responseType: ResponseType) {
        return this.responseType === responseType;
    }

    fetch(): Promise<this> {
        return fetch(this.url, this).then(async (response: ClientResponse) => {
            this.response    = response;
            response.request = this;
            return this;
        });
    }

    setUrl(url: string): this {
        Object.defineProperty(this, 'url', { value: url, writable: false });
        return this;
    }

}