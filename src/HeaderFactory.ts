import { AnyHeader, CombinedHeaders, HeaderValue } from './types/headers';
import { MimeType } from './types/mimes';

export class HeaderFactory implements Omit<Headers, 'set'> {
    #headers: Headers

    constructor(init?: HeadersInit) {
        this.#headers = new Headers(init);
    }

    make() {
        return this.#headers;
    }

    append(name: AnyHeader, value: HeaderValue): this {
        this.#headers.append(name, value);
        return this;
    }

    delete(name: AnyHeader): this {
        this.#headers.delete(name);
        return this;
    }

    has(name: AnyHeader): boolean {
        return this.#headers.has(name);
    }

    get(name: AnyHeader): HeaderValue {
        return this.#headers.get(name);
    }

    set<T extends keyof CombinedHeaders>(name: T, value: CombinedHeaders[T]) {
        this.#headers.set(name as any, value as any);
        return this;
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

    authorization(key: string, value: string) {
        this.set('Authorization', key + ' ' + value);
        return this;
    }

    merge(headers: CombinedHeaders) {
        Object.entries(headers).forEach(([ key, value ]: [ keyof CombinedHeaders, CombinedHeaders[keyof CombinedHeaders] ]) => {
            this.set(key, value);
        });
        return this;
    }


    public forEach(callbackfn: (value: string, key: string, parent: Headers) => void, thisArg?: any): void {
        this.#headers.forEach(callbackfn);
    }
}
