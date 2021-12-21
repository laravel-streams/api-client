import { Stream } from './Stream';
import { IStreams, StreamID } from './types';
export declare type IEntry<ID extends StreamID = StreamID> = Entry<ID> & IStreams[ID]['entries'];
export declare class Entry<ID extends StreamID = StreamID> {
    #private;
    constructor(stream: Stream<ID>, data?: any, fresh?: boolean);
    getStream(): Stream<ID>;
    save(): Promise<boolean>;
    serialize(): IStreams[ID]['entries'];
}
