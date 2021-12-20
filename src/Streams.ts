import { Stream } from './Stream';
import { Criteria } from './Criteria';
import { Repository } from './Repository';
import { ApiDataResponse, IBaseStream, IEntries, IStream, IStreams, RequestConfig, StreamID, StreamsConfiguration } from './types';
import { Http } from './Http';
import { AsyncSeriesWaterfallHook, SyncHook, SyncWaterfallHook } from 'tapable';
import { Collection } from './Collection';
import deepmerge from 'deepmerge';
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
export class Streams {
    public readonly hooks = {
        all                : new AsyncSeriesWaterfallHook<IBaseStream>([ 'data' ]),
        maked              : new SyncHook<Stream>([ 'stream' ]),
        created            : new SyncHook<Stream>([ 'stream' ]),
        createRequestConfig: new SyncWaterfallHook<RequestConfig>([ 'config' ]),
        createRequest      : new SyncWaterfallHook<Request>([ 'request' ]),
    };

    #http: Http;
    public get http(): Http {
        if ( !this.#http ) {
            this.#http = new Http(this);
        }
        return this.#http;
    }

    public config: StreamsConfiguration;

    constructor(config: StreamsConfiguration) {
        this.config = deepmerge.all<StreamsConfiguration>([ config, { request: { baseURL: config.baseURL } } ], { clone: true });
    }

    public createRequest<T = any, D = any>(): Request<T, D> {
        const config  = this.hooks.createRequestConfig.call(this.config.request);
        const request = Request.create<T, D>(config);
        return this.hooks.createRequest.call(request);
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
        const { data, meta, links } = response.data;
        const stream                = new Stream<ID>(this, data, meta, links);
        this.hooks.maked.call(stream);
        return stream;
    }

    public async create<ID extends StreamID>(id: ID, streamData: IEntries[ID]): Promise<Stream<ID>> {
        let response                = await this.http.postStream({ id, name: id, ...streamData });
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
