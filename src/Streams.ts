import { Stream } from './Stream';
import { Criteria } from './Criteria';
import { Repository } from './Repository';
import { StreamsConfiguration } from './types';
import { Http } from './Http';
import { Client } from './Client';

export class Streams {
    public readonly http: Http;
    public readonly client: Client;

    constructor(public config: StreamsConfiguration) {
        this.client = new Client(this.config)
        this.http = new Http(this);
    }


    /**
     * Return all streams.
     *
     * @returns
     */
    public async all(): Promise<Stream[]> {

        const data = await this.http.getStreams();

        return data.data.map(data => new Stream(this, data));
    }

    /**
     * Make a stream instance.
     *
     * @param id
     * @returns
     */
    public async make(id: string): Promise<Stream> {

        const data = await this.http.getStream(id);

        return new Stream(this, data.data, data.meta, data.links);
    }

    public async create(id: string, stream: any): Promise<Stream> {

        const data = await this.http.postStream({
            id,
            name: id,
            ...stream,
        });

        return new Stream(this, data.data, data.meta, data.links);
    }

    /**
     * Return an entry criteria.
     *
     * @param id
     * @returns Criteria
     */
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
