import { Stream } from './Stream';
import { Criteria } from './Criteria';
import { EntryCollection } from './EntryCollection';
import { Entry, IEntry } from './Entry';
import { StreamID } from './types';
export declare class Repository<ID extends StreamID> {
    protected stream: Stream<ID>;
    /**
     * Create a new repository instance.
     *
     * @param stream
     */
    constructor(stream: Stream<ID>);
    get http(): import("./Http").Http;
    /**
     * Return all items.
     *
     * @returns EntryCollection
     */
    all(): Promise<EntryCollection<ID>>;
    /**
     * Find an entry by ID.
     *
     * @param id
     * @returns Entry
     */
    find(id: string | number): Promise<IEntry<ID>>;
    /**
     * Find all records by IDs.
     *
     * @param ids
     * @returns EntryCollection
     */
    findAll(ids: Array<string | number>): Promise<EntryCollection<ID>>;
    /**
     * Find an entry by a field value.
     *
     * @param field
     * @param value
     * @returns Entry
     */
    findBy(field: string, value: any): Promise<IEntry<ID>>;
    findAllWhere(field: string, value: any): Promise<EntryCollection>;
    /**
     * Create a new entry.
     *
     * @param attributes
     * @returns
     */
    create(attributes: any): Promise<IEntry<ID>>;
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
    newInstance(attributes: any): IEntry<ID>;
    /**
     * Return a new entry criteria.
     *
     * @returns Criteria
     */
    newCriteria(): Criteria<ID>;
}
