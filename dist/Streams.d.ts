import { Stream } from './Stream';
import { Criteria } from './Criteria';
import { Repository } from './Repository';
import { IBaseStream, IStream, ApiConfiguration, ApiDataResponse } from './types';
import { Http } from './Http';
import { Client } from './Client';
import { AsyncSeriesWaterfallHook, SyncHook } from 'tapable';
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
    config: ApiConfiguration;
    readonly hooks: {
        all: AsyncSeriesWaterfallHook<IBaseStream<string>, import("tapable").UnsetAdditionalOptions>;
        make: AsyncSeriesWaterfallHook<ApiDataResponse<IStream<string>, any, Partial<Record<"stream" | "entries" | "streams" | "self" | "location" | "first_page" | "next_page" | "previous_page", string>>, import("./types").ApiPayloadMeta<IStream<string>, any>>, import("tapable").UnsetAdditionalOptions>;
        maked: SyncHook<Stream<string>, void, import("tapable").UnsetAdditionalOptions>;
        create: AsyncSeriesWaterfallHook<ApiDataResponse<IStream<string>, any, Partial<Record<"stream" | "entries" | "streams" | "self" | "location" | "first_page" | "next_page" | "previous_page", string>>, import("./types").ApiPayloadMeta<IStream<string>, any>>, import("tapable").UnsetAdditionalOptions>;
        created: SyncHook<Stream<string>, void, import("tapable").UnsetAdditionalOptions>;
    };
    readonly http: Http;
    readonly client: Client;
    constructor(config: ApiConfiguration);
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
    make(id: string): Promise<Stream>;
    create(id: string, streamData: any): Promise<Stream>;
    entries<ID extends string>(id: ID): Promise<Criteria>;
    /**
     * Return an entry repository.
     *
     * @param id
     * @returns
     */
    repository<ID extends string>(id: ID): Promise<Repository>;
    /**
     * Return the Streams collection.
     */
    collection(): void;
}
