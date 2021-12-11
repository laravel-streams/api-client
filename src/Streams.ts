import { Stream } from './Stream';
import { Criteria } from './Criteria';
import { Repository } from './Repository';
import { ApiDataResponse, IBaseStream, IEntries, IStream, StreamID, StreamsConfiguration } from './types';
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
export class Streams {
    public readonly hooks = {
        all    : new AsyncSeriesWaterfallHook<IBaseStream>([ 'data' ]),
        make   : new AsyncSeriesWaterfallHook<ApiDataResponse<IStream<any>>>([ 'data' ]),
        maked  : new SyncHook<Stream>([ 'stream' ]),
        create : new AsyncSeriesWaterfallHook<ApiDataResponse<IStream<any>>>([ 'data' ]),
        created: new SyncHook<Stream>([ 'stream' ]),
    };
    #http: Http;
    public get http(): Http {
        if ( !this.#http ) {
            this.#http = new this.config.Http(this);
        }
        return this.#http;
    }

    #client: Client;
    public get client(): Client {
        if ( !this.#client ) {
            this.#client = new this.config.Client(this.config);
        }
        return this.#client;
    }

    public config: StreamsConfiguration;

    constructor(config: StreamsConfiguration) {
        this.config = {
            Client: Client,
            Http  : Http,
            ...config,
        };
        // this.client = new this.config.Client(this.config);
        // this.http   = new this.config.Http(this);
    }


    /**
     * Return all streams.
     *
     * @returns
     */
    public async all(): Promise<Stream[]> {

        const response          = await this.http.getStreams();
        const streams: Stream[] = [];
        for ( let data of response.data.data ) {
            data         = await this.hooks.all.promise(data);
            const stream = new Stream(this, data, response.data.meta, response.data.links);
            streams.push(stream);
        }
        return streams;
    }

    /**
     * Make a stream instance.
     *
     * @param id
     * @returns
     */
    public async make<ID extends StreamID>(id: ID): Promise<Stream<ID>> {

        let response                = await this.http.getStream(id);
        response.data               = await this.hooks.make.promise(response.data);
        const { data, meta, links } = response.data;
        const stream                = new Stream<ID>(this, data, meta, links);
        this.hooks.maked.call(stream);
        return stream;
    }

    public async create<ID extends StreamID>(id: ID, streamData: IEntries[ID]): Promise<Stream<ID>> {
        let response                = await this.http.postStream({ id, name: id, ...streamData });
        // @ts-ignore
        response.data               = await this.hooks.create.promise(response.data);
        const { data, meta, links } = response.data;
        const stream                = new Stream<ID>(this, data, meta, links);
        this.hooks.created.call(stream);
        return stream;
    }

    public async entries<ID extends StreamID>(id: ID): Promise<Criteria<ID>> {
        const stream = await this.make(id);
        return new Criteria(stream);
    }

    /**
     * Return an entry repository.
     *
     * @param id
     * @returns
     */
    public async repository<ID extends StreamID>(id: ID): Promise<Repository<ID>> {
        const stream = await this.make(id);
        return new Repository<ID>(stream);
    }

    /**
     * Return the Streams collection.
     */
    public async collection(): Promise<Collection<Stream>> {
        return new Collection(await this.all());
    }
}
