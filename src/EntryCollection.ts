import { Entry, IEntry } from './Entry';
import { Collection } from './Collection';
import { IStreamLinks, IStreamMeta, streams } from './types';
import { Stream } from './Stream';
import { Http } from './Http';
import { ClientResponse } from './Client';


export type IEntriesLinks = IStreamLinks<'self' | 'streams' | 'stream'>;
export type IPaginatedEntriesLinks = IStreamLinks<'next_page' | 'previous_page' | 'self' | 'first_page' | 'streams' | 'stream'>;

export interface IEntriesMeta extends IStreamMeta {
    total: number;
}

export interface IPaginatedEntriesMeta extends IStreamMeta {
    current_page: number;
    last_page: number;
    per_page: number;
}

export class EntryCollection<T extends streams.StreamID = streams.StreamID> extends Collection<IEntry<T>> {
    constructor(entries: IEntry<T>[], public readonly meta?: IEntriesMeta, public readonly links?: IEntriesLinks) {
        super(entries as any[]);
    }

    static fromResponse<ID extends streams.StreamID = streams.StreamID>(response: ClientResponse<Http.Responses<streams.Entries[ID][]>['entries']>, stream: Stream<ID>): EntryCollection<ID> {
        const entries = Object.values(response.data.data).map(entry => new Entry(stream, entry, false));
        return new EntryCollection<ID>(entries as any, response.data.meta, response.data.links);
    }
}

export class PaginatedEntryCollection<ID extends streams.StreamID = streams.StreamID> extends Collection<IEntry<ID>> {
    constructor(entries: IEntry<ID>[], public readonly meta?: IPaginatedEntriesMeta, public readonly links?: IPaginatedEntriesLinks) {
        super(...entries);
    }

    static fromResponse<ID extends streams.StreamID = streams.StreamID>(response: ClientResponse<Http.Responses<streams.Entries[ID][]>['paginated']>, stream: Stream): PaginatedEntryCollection<ID> {
        const entries = Object.values(response.data.data).map(entry => new Entry(stream, entry, false));
        return new PaginatedEntryCollection<ID>(entries as any, response.data.meta, response.data.links);
    }
}
