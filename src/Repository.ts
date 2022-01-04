import { Stream } from './Stream';
import { Criteria } from './Criteria';
import { EntryCollection } from './EntryCollection';
import { Entry, IEntry } from './Entry';
import { StreamID } from './types';


export class Repository<ID extends StreamID> {

    /**
     * Create a new repository instance.
     *
     * @param stream
     */
    constructor(protected stream: Stream<ID>) { }

    get http() {
        return this.stream.getStreams().http;
    }

    /**
     * Return all items.
     *
     * @returns EntryCollection
     */
    async all(): Promise<EntryCollection<ID>> {
        let response = await this.http.getEntries<any>(this.stream.id);
        let entries  = response.data.data.map(entry => new Entry(this.stream, entry, false));
        return new EntryCollection(entries, response.data.meta, response.data.links);
    }

    /**
     * Find an entry by ID.
     *
     * @param id
     * @returns Entry
     */
    async find(id: string | number): Promise<IEntry<ID>> {

        let criteria = this.stream.getEntries();

        return criteria.where('id', id).first();
    }

    /**
     * Find all records by IDs.
     *
     * @param ids
     * @returns EntryCollection
     */
    async findAll(ids: Array<string | number>): Promise<EntryCollection<ID>> {

        let criteria = this.stream.getEntries();

        return criteria.where('id', 'IN', ids).get();
    }

    /**
     * Find an entry by a field value.
     *
     * @param field
     * @param value
     * @returns Entry
     */
    async findBy(field: string, value: any): Promise<IEntry<ID>> {

        let criteria = this.stream.getEntries();

        return criteria.where(field, value).first();
    }

    async findAllWhere(field: string, value: any): Promise<EntryCollection> {

        let criteria = this.stream.getEntries();

        return criteria.where(field, value).get();
    }

    /**
     * Create a new entry.
     *
     * @param attributes
     * @returns
     */
    async create(attributes: any): Promise<IEntry<ID>> {

        let entry = this.newCriteria().newInstance(attributes);

        entry.save();

        return entry;
    }

    /**
     * Save an entry.
     *
     * @param entry
     * @returns
     */
    async save(entry: Entry): Promise<boolean> {

        return entry.save();
    }

    /**
     * Save an entry.
     *
     * @param entry
     * @returns
     */
    async delete(entry: any): Promise<boolean> {

        await this.http.deleteEntry(this.stream.id, entry.id);

        return true;
    }

    truncate(): this { return this; }

    /**
     * Return a new instance.
     *
     * @param attributes
     * @returns
     */
    newInstance(attributes: any): IEntry<ID> {
        return this.newCriteria().newInstance(attributes);
    }

    /**
     * Return a new entry criteria.
     *
     * @returns Criteria
     */
    newCriteria(): Criteria<ID> {
        return new Criteria<ID>(this.stream);
    }
}
