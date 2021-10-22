import { Stream } from './Stream';
import { Criteria } from './Criteria';
import { EntryCollection } from './EntryCollection';
import { Entry } from './Entry';


export class Repository<ID extends string = string> {

    /**
     * Create a new repository instance.
     *
     * @param stream
     */
    constructor(protected stream: Stream) { }

    get http() {
        return this.stream.streams.http;
    }

    /**
     * Return all items.
     *
     * @returns EntryCollection
     */
    async all(): Promise<EntryCollection> {

        let response = await this.http.getEntries<any>(this.stream.id);

        let entries = response.data.map(entry => new Entry(this.stream, entry, false));

        return new EntryCollection(entries, response.meta as any, response.links as any);
    }

    /**
     * Find an entry by ID.
     *
     * @param id
     * @returns Entry
     */
    async find<ID extends string>(id: ID): Promise<Entry> {

        let criteria = this.stream.entries();

        return criteria.where('id', id).first();
    }

    /**
     * Find all records by IDs.
     *
     * @param ids
     * @returns EntryCollection
     */
    async findAll(ids): Promise<EntryCollection> {

        let criteria = this.stream.entries();

        return criteria.where('id', 'IN', ids).get();
    }

    /**
     * Find an entry by a field value.
     *
     * @param field
     * @param value
     * @returns Entry
     */
    async findBy<ID extends string, VID extends string>(field: ID, value: VID): Promise<Entry> {

        let criteria = this.stream.entries();

        return criteria.where(field, value).first();
    }

    /**
     * Find all entries by field value.
     *
     * @param $field
     * @param $operator
     * @param $value
     * @return EntryCollection
     */
    async findAllWhere<ID extends string, VID extends string>(field: ID, value: VID): Promise<EntryCollection> {

        let criteria = this.stream.entries();

        return criteria.where(field, value).get();
    }

    /**
     * Create a new entry.
     *
     * @param attributes
     * @returns
     */
    async create(attributes: any): Promise<Boolean> {

        let entry = this.newCriteria().newInstance(attributes);

        return entry.save();
    }

    /**
     * Save an entry.
     *
     * @param entry
     * @returns
     */
    async save(entry: Entry): Promise<Boolean> {

        return entry.save();
    }

    /**
     * Save an entry.
     *
     * @param entry
     * @returns
     */
    async delete(entry: any): Promise<Boolean> {

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
    newInstance(attributes: any): Entry {
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
