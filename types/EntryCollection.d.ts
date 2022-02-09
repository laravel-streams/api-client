import { IEntry } from './Entry';
import { Collection } from './Collection';
import { Response } from './Response';
import { ApiDataResponse, ApiLinks, ApiMeta, IEntries, StreamID } from './types';
import { Stream } from './Stream';
export declare class EntryCollection<T extends StreamID = StreamID> extends Collection<IEntry<T>> {
    readonly meta?: ApiMeta<'list'>;
    readonly links?: ApiLinks<'entries', 'list'>;
    constructor(entries: IEntry<T>[], meta?: ApiMeta<'list'>, links?: ApiLinks<'entries', 'list'>);
    static fromResponse<ID extends StreamID = StreamID>(response: Response<ApiDataResponse<IEntries[ID][], 'entries', 'list'>>, stream: Stream<ID>): EntryCollection<ID>;
    toObject(): Record<string, IEntry<T>>;
}
export declare class PaginatedEntryCollection<ID extends StreamID = StreamID> extends Collection<IEntry<ID>> {
    readonly meta?: ApiMeta<'list'>;
    readonly links?: ApiLinks<'entries', 'list'>;
    constructor(entries: IEntry<ID>[], meta?: ApiMeta<'list'>, links?: ApiLinks<'entries', 'list'>);
    static fromResponse<ID extends StreamID = StreamID>(response: Response<ApiDataResponse<IEntries[ID][], 'entries', 'list'>>, stream: Stream): PaginatedEntryCollection<ID>;
}
