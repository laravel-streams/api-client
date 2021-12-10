import { Stream } from './Stream';
import { Criteria } from './Criteria';
import { Repository } from './Repository';
import { ApiDataResponse, IBaseStream, IStream, streams, StreamsConfiguration } from './types';
import { Http } from './Http';
import { Client } from './Client';
import { AsyncSeriesWaterfallHook, SyncHook } from 'tapable';
import { Collection } from './Collection';
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
        all: AsyncSeriesWaterfallHook<IBaseStream<keyof streams.Streams>, import("tapable").UnsetAdditionalOptions>;
        make: AsyncSeriesWaterfallHook<ApiDataResponse<IStream<any>, any, Partial<Record<"stream" | "entries" | "streams" | "self" | "location" | "first_page" | "next_page" | "previous_page", string>>, import("./types").ApiPayloadMeta<IStream<any>, any>>, import("tapable").UnsetAdditionalOptions>;
        maked: SyncHook<Stream<keyof streams.Streams>, void, import("tapable").UnsetAdditionalOptions>;
        create: AsyncSeriesWaterfallHook<ApiDataResponse<IStream<any>, any, Partial<Record<"stream" | "entries" | "streams" | "self" | "location" | "first_page" | "next_page" | "previous_page", string>>, import("./types").ApiPayloadMeta<IStream<any>, any>>, import("tapable").UnsetAdditionalOptions>;
        created: SyncHook<Stream<keyof streams.Streams>, void, import("tapable").UnsetAdditionalOptions>;
    };
    get http(): Http;
    get client(): Client;
    config: StreamsConfiguration;
    constructor(config: StreamsConfiguration);
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
    make<ID extends streams.StreamID>(id: ID): Promise<Stream<ID>>;
    create<ID extends streams.StreamID>(id: ID, streamData: streams.Entries[ID]): Promise<Stream<ID>>;
    entries<ID extends streams.StreamID>(id: ID): Promise<Criteria<ID>>;
    /**
     * Return an entry repository.
     *
     * @param id
     * @returns
     */
    repository<ID extends streams.StreamID>(id: ID): Promise<Repository<ID>>;
    /**
     * Return the Streams collection.
     */
    collection(): Promise<Collection<Stream>>;
}
