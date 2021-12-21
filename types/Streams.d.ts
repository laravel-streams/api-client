import { Stream } from './Stream';
import { Criteria } from './Criteria';
import { Repository } from './Repository';
import { IBaseStream, IEntries, RequestConfig, StreamID, StreamsConfiguration } from './types';
import { Http } from './Http';
import { AsyncSeriesWaterfallHook, SyncHook, SyncWaterfallHook } from 'tapable';
import { Collection } from './Collection';
import { Request } from './Request';
export interface Streams {
}
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
export declare class Streams {
    #private;
    readonly hooks: {
        all: AsyncSeriesWaterfallHook<IBaseStream<any>, import("tapable").UnsetAdditionalOptions>;
        maked: SyncHook<Stream<string | number>, void, import("tapable").UnsetAdditionalOptions>;
        created: SyncHook<Stream<string | number>, void, import("tapable").UnsetAdditionalOptions>;
        createRequestConfig: SyncWaterfallHook<RequestConfig<any>, import("tapable").UnsetAdditionalOptions>;
        createRequest: SyncWaterfallHook<Request<any, any>, import("tapable").UnsetAdditionalOptions>;
    };
    get http(): Http;
    config: StreamsConfiguration;
    constructor(config: StreamsConfiguration);
    createRequest<T = any, D = any>(): Request<T, D>;
    /**
     * Return all streams.
     *
     * @returns
     */
    all(): Promise<Stream[]>;
    /**
     * Make a stream instance.
     *
     * @param id
     * @returns
     */
    make<ID extends StreamID>(id: ID): Promise<Stream<ID>>;
    create<ID extends StreamID>(id: ID, streamData: IEntries[ID]): Promise<Stream<ID>>;
    entries<ID extends StreamID>(id: ID): Promise<Criteria<ID>>;
    /**
     * Return an entry repository.
     *
     * @param id
     * @returns
     */
    repository<ID extends StreamID>(id: ID): Promise<Repository<ID>>;
    /**
     * Return the Streams collection.
     */
    collection(): Promise<Collection<Stream>>;
}
