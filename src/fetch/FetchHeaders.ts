import { MimeType, RequestHeader, RequestHeaderValue } from '../types';

export class FetchHeaders extends Headers {
    constructor(init?: HeadersInit) {
        super(init);
    }

    set(key: RequestHeader, value: RequestHeaderValue) {
        super.set(key, value);
    }

    Accept(mime: MimeType) {
        this.set('Accept', mime);
        return this;
    }

    ContentType(mime: MimeType) {
        this.set('Content-Type', mime);
        return this;
    }

    IfNoneMatch(etag: string) {
        this.set('If-None-Match', etag);
        return this;
    }

    basic(username: string, password: string) {
        return this.authorization('Basic', btoa(username + ':' + password));
    }

    bearer(token: string) {
        return this.authorization('Bearer', token);
    }

    authorization(key: 'Basic' | 'Bearer', value: string) {
        this.set('Authorization', key + ' ' + value);
        return this;
    }

    toObject() {
        let obj = {};
        for ( const header of this[ 'entries' ]() ) {
            obj[ header[ 0 ] ] = header[ 1 ];
        }
        return obj;
    }
}