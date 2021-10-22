import { Stream } from './Stream';
import { Criteria } from './Criteria';
import { Repository } from './Repository';
import { StreamsConfiguration } from './types';
import { Http } from './Http';
import { Client } from './Client';
export declare class Streams {
    config: StreamsConfiguration;
    readonly http: Http;
    readonly client: Client;
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
    make(id: string): Promise<Stream>;
    create(id: string, stream: any): Promise<Stream>;
    /**
     * Return an entry criteria.
     *
     * @param id
     * @returns Criteria
     */
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
