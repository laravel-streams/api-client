import { Stream } from './Stream';
import { Criteria } from './Criteria';
import { Repository } from './Repository';
import { IBaseStream, IStream, IStreamResponse, ApiConfiguration, ApiDataResponse } from './types';
import { Http } from './Http';
import { Client } from './Client';
import { AsyncSeriesWaterfallHook, SyncHook } from 'tapable';

export interface Streams {

}


export class Streams {
    public readonly hooks = {
        all    : new AsyncSeriesWaterfallHook<IBaseStream>([ 'data' ]),
        make   : new AsyncSeriesWaterfallHook<ApiDataResponse<IStream>>([ 'data' ]),
        maked  : new SyncHook<Stream>([ 'stream' ]),
        create : new AsyncSeriesWaterfallHook<ApiDataResponse<IStream>>([ 'data' ]),
        created: new SyncHook<Stream>([ 'stream' ]),
    };
    public readonly http: Http;
    public readonly client: Client;

    constructor(public config: ApiConfiguration) {
        this.client = new config.Client(this.config);
        this.http   = new config.Http(this);
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
    public async make(id: string): Promise<Stream> {

        let response = await this.http.getStream(id);
        response.data     = await this.hooks.make.promise(response.data);
        const {data,meta,links} = response.data
        const stream   = new Stream(this, data, meta, links);
        this.hooks.maked.call(stream);
        return stream;
    }

    public async create(id: string, streamData: any): Promise<Stream> {
        let response = await this.http.postStream({ id, name: id, ...streamData });
        response.data     = await this.hooks.create.promise(response.data);
        const {data,meta,links} = response.data
        const stream   = new Stream(this, data, meta, links);
        this.hooks.created.call(stream);
        return stream;
    }

    public async entries<ID extends string>(id: ID): Promise<Criteria> {
        const stream = await this.make(id);
        return new Criteria(stream);
    }

    /**
     * Return an entry repository.
     *
     * @param id
     * @returns
     */
    public async repository<ID extends string>(id: ID): Promise<Repository> {
        const stream = await this.make(id);
        return new Repository(stream);
    }

    /**
     * Return the Streams collection.
     */
    public collection() {
        // return this._collection
    }
}
