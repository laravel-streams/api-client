import { AnyHeader, CombinedHeaders, HeaderValue } from './types/headers';
import { MimeType } from './types/mimes';
export declare class HeaderFactory implements Omit<Headers, 'set'> {
    #private;
    constructor(init?: HeadersInit);
    make(): Headers;
    toObject(): any;
    append(name: AnyHeader, value: HeaderValue): this;
    delete(name: AnyHeader): this;
    has(name: AnyHeader): boolean;
    get(name: AnyHeader): HeaderValue;
    set<T extends keyof CombinedHeaders>(name: T, value: CombinedHeaders[T]): this;
    Accept(mime: MimeType): this;
    ContentType(mime: MimeType): this;
    IfNoneMatch(etag: string): this;
    basic(username: string, password: string): this;
    bearer(token: string): this;
    authorization(key: string, value: string): this;
    merge(headers: CombinedHeaders): this;
    forEach(callbackfn: (value: string, key: string, parent: Headers) => void, thisArg?: any): void;
}
