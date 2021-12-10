import { Stream } from './Stream';
import { streams } from './types';
export declare type IEntry<ID extends streams.StreamID = streams.StreamID> = Entry<ID> & streams.Streams[ID]['entries'];
export declare class Entry<ID extends streams.StreamID = streams.StreamID> {
    #private;
    constructor(stream: Stream<ID>, data?: any, fresh?: boolean);
    getStream(): Stream<ID>;
    save(): Promise<boolean>;
    serialize(): streams.Streams[ID]['entries'];
}
