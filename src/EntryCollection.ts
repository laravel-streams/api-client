import { Entry, IEntry } from './Entry';
import { Collection } from './Collection';
import { Response } from './Response';
import { ApiDataResponse, ApiLinks, ApiMeta, IEntries, StreamID } from './types';
import { Stream } from './Stream';
import { objectify } from './utils';


export class EntryCollection<T extends StreamID = StreamID> extends Collection<IEntry<T>> {
    constructor(entries: IEntry<T>[], public readonly meta?: ApiMeta<'list'>, public readonly links?: ApiLinks<'entries', 'list'>) {
        super(entries as any[]);
    }

    static fromResponse<ID extends StreamID = StreamID>(response: Response<ApiDataResponse<IEntries[ID][], 'entries', 'list'>>, stream: Stream<ID>): EntryCollection<ID> {
        const entries = Object.values(response.data.data).map(entry => new Entry(stream, entry, false));
        return new EntryCollection<ID>(entries as any, response.data.meta, response.data.links);
    }

    public toObject(): Record<string, IEntry<T>> {
        let obj = Object.entries(super.toObject()).map(([ key, value ]) => {
            return [ key, value.toObject() ];
        }).reduce(objectify, {});

        return obj;
    }
}

export class PaginatedEntryCollection<ID extends StreamID = StreamID> extends Collection<IEntry<ID>> {
    constructor(entries: IEntry<ID>[], public readonly meta?: ApiMeta<'list'>, public readonly links?: ApiLinks<'entries', 'list'>) {
        super(entries);
    }

    static fromResponse<ID extends StreamID = StreamID>(response: Response<ApiDataResponse<IEntries[ID][], 'entries', 'list'>>, stream: Stream): PaginatedEntryCollection<ID> {
        const entries = Object.values(response.data.data).map(entry => new Entry(stream, entry, false));
        return new PaginatedEntryCollection<ID>(entries as any, response.data.meta, response.data.links);
    }
}
