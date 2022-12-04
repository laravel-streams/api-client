import { MimeType, RequestHeader, RequestHeaderValue } from './types';
import { objectify } from './utils';

export class FetchHeaders extends Headers {
    constructor(init?: HeadersInit | FetchHeaders) {
        super(init && init instanceof FetchHeaders ? init.toObject() : init);
    }

    set(key: RequestHeader, value: RequestHeaderValue) {
        super.set(key, value);
    }

    accept(mime: MimeType) {
        this.set('Accept', mime);
        return this;
    }

    contentType(mime: MimeType) {
        this.set('Content-Type', mime);
        return this;
    }

    ifNoneMatch(etag: string) {
        this.set('If-None-Match', etag);
        return this;
    }

    basic(base64: string): this
    basic(username: string, password: string): this
    basic(...args): this {
        return this.authorization('Basic', args[ 1 ] === undefined ? args[ 0 ] : btoa(args[ 0 ] + ':' + args[ 1 ]));
    }

    bearer(token: string) {
        return this.authorization('Bearer', token);
    }

    authorization(key: 'Basic' | 'Bearer', value: string) {
        this.set('Authorization', key + ' ' + value);
        return this;
    }

    toObject(): Record<string, string> {
        return Object.entries(this).map(kv => ([ kv[ 0 ], kv[ 1 ] ])).reduce(objectify, {});
    }
}