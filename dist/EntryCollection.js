import { Entry } from './Entry';
import { Collection } from './Collection';
import { objectify } from './utils';
export class EntryCollection extends Collection {
    constructor(entries, meta, links) {
        super(entries);
        this.meta = meta;
        this.links = links;
    }
    static fromResponse(response, stream) {
        const entries = Object.values(response.data.data).map(entry => new Entry(stream, entry, false));
        return new EntryCollection(entries, response.data.meta, response.data.links);
    }
    toObject() {
        let obj = Object.entries(super.toObject()).map(([key, value]) => {
            return [key, value.toObject()];
        }).reduce(objectify, {});
        return obj;
    }
}
export class PaginatedEntryCollection extends Collection {
    constructor(entries, meta, links) {
        super(entries);
        this.meta = meta;
        this.links = links;
    }
    static fromResponse(response, stream) {
        const entries = Object.values(response.data.data).map(entry => new Entry(stream, entry, false));
        return new PaginatedEntryCollection(entries, response.data.meta, response.data.links);
    }
}
