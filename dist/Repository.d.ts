import { Stream } from './Stream';
import { Criteria } from './Criteria';
import { EntryCollection } from './EntryCollection';
import { Entry } from './Entry';
export declare class Repository {
    protected stream: Stream;
    /**
     * Create a new repository instance.
     *
     * @param stream
     */
    constructor(stream: Stream);
    get http(): import("./Http").Http;
    /**
     * Return all items.
     *
     * @returns EntryCollection
     */
    all(): Promise<EntryCollection>;
    /**
     * Find an entry by ID.
     *
     * @param id
     * @returns Entry
     */
    find(id: string | number): Promise<Entry>;
    /**
     * Find all records by IDs.
     *
     * @param ids
     * @returns EntryCollection
     */
    findAll(ids: Array<string | number>): Promise<EntryCollection>;
    /**
     * Find an entry by a field value.
     *
     * @param field
     * @param value
     * @returns Entry
     */
    findBy(field: string, value: any): Promise<Entry>;
    findAllWhere(field: string, value: any): Promise<EntryCollection>;
    /**
     * Create a new entry.
     *
     * @param attributes
     * @returns
     */
    create(attributes: any): Promise<Entry>;
    /**
     * Save an entry.
     *
     * @param entry
     * @returns
     */
    save(entry: Entry): Promise<boolean>;
    /**
     * Save an entry.
     *
     * @param entry
     * @returns
     */
    delete(entry: any): Promise<boolean>;
    truncate(): this;
    /**
     * Return a new instance.
     *
     * @param attributes
     * @returns
     */
    newInstance(attributes: any): Entry;
    /**
     * Return a new entry criteria.
     *
     * @returns Criteria
     */
    newCriteria(): Criteria;
}
