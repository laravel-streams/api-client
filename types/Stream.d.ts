import { Repository } from './Repository';
import { Criteria } from './Criteria';
import { ApiLinks, ApiMeta, IBaseStream, IStream, StreamID } from './types';
import { Streams } from './Streams';
import { FieldCollection } from './FieldCollection';
export interface Stream<ID extends StreamID = StreamID> extends IStream<ID> {
}
/**
 *
 * Represents a stream and can be used to get it's data.
 *
 * The example below uses:
 * - {@linkcode Stream.getRepository} method returns {@linkcode Repository}
 * - {@linkcode Stream.getEntries} method returns {@linkcode Criteria}
 * ```ts
 * const repository = await stream.getRepository()
 * const client = await repository.find(2);
 * const clients = await stream.getEntries()
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
export declare class Stream<ID extends StreamID = StreamID> {
    #private;
    constructor(streams: Streams, stream: IBaseStream<ID>, meta?: ApiMeta<'get' | 'post'>, links?: ApiLinks<'streams', 'get' | 'post'>);
    getFields(): FieldCollection;
    getStreams(): Streams;
    getMeta(): ApiMeta<'get' | 'post'>;
    getLinks(): ApiLinks<'streams', 'get' | 'post'>;
    getRepository(): Repository<ID>;
    getEntries(): Criteria<ID>;
    save(): Promise<boolean>;
    delete(): Promise<boolean>;
    protected unserialize(stream: IStream<ID>): void;
    serialize(): IStream<ID>;
}
