var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var __classPrivateFieldSet = (this && this.__classPrivateFieldSet) || function (receiver, state, value, kind, f) {
    if (kind === "m") throw new TypeError("Private method is not writable");
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a setter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
    return (kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value)), value;
};
var _Streams_http;
import { Stream } from './Stream';
import { Criteria } from './Criteria';
import { Repository } from './Repository';
import { Http } from './Http';
import { AsyncSeriesWaterfallHook, SyncHook, SyncWaterfallHook } from 'tapable';
import { Collection } from './Collection';
import deepmerge from 'deepmerge';
import { Request } from './Request';
import { ETag, ETagCache, StorageAdapter } from './cache';
/**
 * The main class
 *
 * @example
 * ```ts
 * const streams = new Streams({
 *     baseURL: 'http://localhost/api',
 * });
 *
 *
 *  async function run(){
 *     const stream = await streams.make('clients')
 *     const clients = await stream.entries()
 *                                 .where('age', '>', 5)
 *                                 .where('age', '<', 50)
 *                                 .orderBy('age', 'asc')
 *                                 .get();
 *     for(const client of clients){
 *         client.email;
 *         client.age;
 *     }
 * }
 * ```
 */
export class Streams {
    constructor(config) {
        this.hooks = {
            all: new AsyncSeriesWaterfallHook(['data']),
            maked: new SyncHook(['stream']),
            created: new SyncHook(['stream']),
            createRequestConfig: new SyncWaterfallHook(['config']),
            createRequest: new SyncWaterfallHook(['request']),
        };
        _Streams_http.set(this, void 0);
        this.config = deepmerge.all([new.target.defaults, config, { request: { baseURL: config.baseURL } }], { clone: true });
        this.registerEtag();
    }
    get http() {
        if (!__classPrivateFieldGet(this, _Streams_http, "f")) {
            __classPrivateFieldSet(this, _Streams_http, new Http(this), "f");
        }
        return __classPrivateFieldGet(this, _Streams_http, "f");
    }
    registerEtag() {
        const storageAdapter = new StorageAdapter(this, window.localStorage);
        const etagCache = new ETagCache(this, storageAdapter);
        this.hooks.createRequest.tap('ETag', (request) => {
            request.hooks.createAxios.tap('ETag', (axios) => {
                new ETag(axios, etagCache);
                this.config.etag.enabled ? axios.etag.enableEtag() : axios.etag.disableEtag();
                return axios;
            });
            return request;
        });
    }
    createRequest() {
        const config = this.hooks.createRequestConfig.call(this.config.request);
        const request = Request.create(config);
        return this.hooks.createRequest.call(request);
    }
    /**
     * Return all streams.
     *
     * @returns
     */
    all() {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield this.http.getStreams();
            const streams = [];
            for (let data of response.data.data) {
                data = yield this.hooks.all.promise(data);
                const stream = new Stream(this, data, response.data.meta, response.data.links);
                streams.push(stream);
            }
            return streams;
        });
    }
    /**
     * Make a stream instance.
     *
     * @param id
     * @returns
     */
    make(id) {
        return __awaiter(this, void 0, void 0, function* () {
            let response = yield this.http.getStream(id);
            const { data, meta, links } = response.data;
            const stream = new Stream(this, data, meta, links);
            this.hooks.maked.call(stream);
            return stream;
        });
    }
    create(id, streamData) {
        return __awaiter(this, void 0, void 0, function* () {
            let response = yield this.http.postStream(Object.assign({ id, name: id }, streamData));
            const { data, meta, links } = response.data;
            const stream = new Stream(this, data, meta, links);
            this.hooks.created.call(stream);
            return stream;
        });
    }
    entries(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const stream = yield this.make(id);
            return new Criteria(stream);
        });
    }
    /**
     * Return an entry repository.
     *
     * @param id
     * @returns
     */
    repository(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const stream = yield this.make(id);
            return new Repository(stream);
        });
    }
    /**
     * Return the Streams collection.
     */
    collection() {
        return __awaiter(this, void 0, void 0, function* () {
            return new Collection(yield this.all());
        });
    }
}
_Streams_http = new WeakMap();
Streams.defaults = {
    etag: {
        enabled: false,
        manifestKey: 'streams',
        compression: true,
        StorageAdapter: StorageAdapter,
    },
};
