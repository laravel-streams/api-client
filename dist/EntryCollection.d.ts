import { IEntry } from './Entry';
import { Collection } from './Collection';
import { IStreamLinks, IStreamMeta, streams } from './types';
import { Stream } from './Stream';
import { Http } from './Http';
import { ClientResponse } from './Client';
export declare type IEntriesLinks = IStreamLinks<'self' | 'streams' | 'stream'>;
export declare type IPaginatedEntriesLinks = IStreamLinks<'next_page' | 'previous_page' | 'self' | 'first_page' | 'streams' | 'stream'>;
export interface IEntriesMeta extends IStreamMeta {
    total: number;
}
export interface IPaginatedEntriesMeta extends IStreamMeta {
    current_page: number;
    last_page: number;
    per_page: number;
}
export declare class EntryCollection<T extends streams.StreamID = streams.StreamID> extends Collection<IEntry<T>> {
    readonly meta?: IEntriesMeta;
    readonly links?: IEntriesLinks;
    constructor(entries: IEntry<T>[], meta?: IEntriesMeta, links?: IEntriesLinks);
    static fromResponse<ID extends streams.StreamID = streams.StreamID>(response: ClientResponse<Http.Responses<streams.Entries[ID][]>['entries']>, stream: Stream<ID>): EntryCollection<ID>;
}
export declare class PaginatedEntryCollection<ID extends streams.StreamID = streams.StreamID> extends Collection<IEntry<ID>> {
    readonly meta?: IPaginatedEntriesMeta;
    readonly links?: IPaginatedEntriesLinks;
    constructor(entries: IEntry<ID>[], meta?: IPaginatedEntriesMeta, links?: IPaginatedEntriesLinks);
    static fromResponse<ID extends streams.StreamID = streams.StreamID>(response: ClientResponse<Http.Responses<streams.Entries[ID][]>['paginated']>, stream: Stream): PaginatedEntryCollection<ID>;
}
