import { Stream } from './Stream';
import { Criteria } from './Criteria';
import { Repository } from './Repository';
import { IBaseStream, IStream, IStreamResponse, ApiConfiguration } from './types';
import { Http } from './Http';
import { Client } from './Client';
import { AsyncSeriesWaterfallHook, SyncHook } from 'tapable';
export interface Streams {
}
export declare class Streams {
    config: ApiConfiguration;
    readonly hooks: {
        all: AsyncSeriesWaterfallHook<IStreamResponse<IBaseStream<string>[], import("./types").IStreamMeta, import("./types").IStreamLinks<"entries" | "self">>, import("tapable").UnsetAdditionalOptions>;
        make: AsyncSeriesWaterfallHook<IStream<string>, import("tapable").UnsetAdditionalOptions>;
        maked: SyncHook<Stream<string>, void, import("tapable").UnsetAdditionalOptions>;
        create: AsyncSeriesWaterfallHook<IStream<string>, import("tapable").UnsetAdditionalOptions>;
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
