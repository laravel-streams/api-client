import { Field } from './Field';
import { Repository } from './Repository';
import { Criteria } from './Criteria';
import { ApiLinks, ApiMeta, IBaseStream, IStream } from './types';
import { Streams } from './Streams';
export interface Stream<ID extends string = string> extends IStream<ID> {
}
/**
 *
 * Represents a stream and can be used to get it's data.
 *
 * The example below uses:
 * - {@linkcode Stream.repository} method returns {@linkcode Repository}
 * - {@linkcode Stream.entries} method returns {@linkcode Criteria}
 * ```ts
 * const repository = await stream.repository()
 * const client = await repository.find(2);
 * const clients = await stream.entries()
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
export declare class Stream<ID extends string = string> {
    readonly streams: Streams;
    protected _stream: IBaseStream<ID>;
    readonly meta?: ApiMeta;
    readonly links?: ApiLinks;
    constructor(streams: Streams, _stream: IBaseStream<ID>, meta?: ApiMeta, links?: ApiLinks);
    /**
     * The repository instance.
     */
    protected _repository: Repository;
    /**
     * The stream fields.
     */
    fields: Map<string, Field>;
    /**
     * Return the entries repository.
     *
     * @returns Repository
     */
    get repository(): Repository;
    unserialize(stream: IStream<ID>): void;
    serialize(): IStream<ID>;
    save(): Promise<boolean>;
    /**
     * Return the entries criteria.
     *
     * @returns Criteria
     */
    entries(): Criteria;
}
