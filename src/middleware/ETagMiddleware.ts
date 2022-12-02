import { Middleware } from './Middleware';
import { ClientResponse } from '../types';
import { FetchRequest } from '../fetch/FetchRequest';
import { Client } from '../Client';
import { Transformer } from '../Transformer';

const isCacheableMethod       = (request: FetchRequest) => ~ [ 'GET', 'HEAD' ].indexOf(request.method.toUpperCase());
const getBase64UrlFromRequest = (request: FetchRequest) => btoa(request.url);

export interface ETagMiddlewareOptions {
    manifestKey?: string;
    compression?: boolean;
}

export interface ETagCacheValue {
    etag: string;
    value: any;
}

class ETagCache {

    public transformer      = Transformer;
    public storage: Storage = localStorage;

    protected get options() {return this.middleware.options;}

    protected get manifestKey(): string {return this.options.manifestKey;}

    constructor(protected middleware: ETagMiddleware) {}

    public get(key: string): ETagCacheValue | undefined {
        if ( !this.has(key) ) {
            return undefined;
        }
        let strValue = this.storage.getItem(key);
        if ( this.options.compression ) {
            strValue = this.transformer.decompress(strValue);
        }
        return this.transformer.decode(strValue);
    }

    public has(key: string): boolean {
        return !!this.storage.getItem(key);
    }

    public set(key: string, etag: string, value: any) {
        this.addToUuidManifest(key);
        let strValue = this.transformer.encode({ etag, value });
        if ( this.options.compression ) {
            strValue = this.transformer.compress(strValue);
        }
        this.storage.setItem(key, strValue);
        return this;
    }

    public unset(key: string): this {
        this.storage.removeItem(key);
        return this;
    }

    public clear() {
        this.getUuidManifest().forEach(uuid => this.unset(uuid));
        this.storage.set(this.manifestKey, []);
        return this;
    }

    protected getUuidManifest(): string[] {
        if ( !this.storage.has(this.manifestKey) ) {
            this.storage.set(this.manifestKey, []);
        }
        return this.storage.get(this.manifestKey, []);
    }

    protected addToUuidManifest(uuid) {
        let manifest = this.getUuidManifest();
        manifest.push(uuid);
        this.storage.set(this.manifestKey, manifest);
    }
}


export class ETagMiddleware extends Middleware {
    public readonly cache: ETagCache;
    public options: ETagMiddlewareOptions;
    protected enabled: boolean = true;

    constructor(options: ETagMiddlewareOptions = {}) {
        super();
        this.options = {
            compression:false,
            manifestKey: 'streams_api_cache',
            ...options,
        };
        this.cache   = new ETagCache(this);
    }

    public enable(): this {
        this.enabled = true;
        return this;
    }

    public disable(): this {
        this.enabled = false;
        return this;
    }

    public async request(request: FetchRequest, client: Client): Promise<FetchRequest> {
        if ( this.enabled && isCacheableMethod(request) ) {
            const uuid             = getBase64UrlFromRequest(request);
            const lastCachedResult = this.cache.get(uuid);
            if ( lastCachedResult ) {
                request.headers.IfNoneMatch(lastCachedResult.etag);
            }
        }
        return request;
    }

    public async response(response: ClientResponse, client: Client): Promise<ClientResponse> {
        if ( this.enabled && isCacheableMethod(response.request) ) {
            if ( response.headers.has('etag') ) {
                this.cache.set(getBase64UrlFromRequest(response.request), response.headers.get('etag'), response.data);
            }
        }
        return response;
    }
}