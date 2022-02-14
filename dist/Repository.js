var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { Criteria } from './Criteria';
import { EntryCollection } from './EntryCollection';
import { Entry } from './Entry';
export class Repository {
    /**
     * Create a new repository instance.
     *
     * @param stream
     */
    constructor(stream) {
        this.stream = stream;
    }
    get http() {
        return this.stream.getStreams().http;
    }
    /**
     * Return all items.
     *
     * @returns EntryCollection
     */
    all() {
        return __awaiter(this, void 0, void 0, function* () {
            let response = yield this.http.getEntries(this.stream.id);
            let entries = response.data.data.map(entry => new Entry(this.stream, entry, false));
            return new EntryCollection(entries, response.data.meta, response.data.links);
        });
    }
    /**
     * Find an entry by ID.
     *
     * @param id
     * @returns Entry
     */
    find(id) {
        return __awaiter(this, void 0, void 0, function* () {
            let response = yield this.http.getEntry(this.stream.id, id);
            let entry = new Entry(this.stream, response.data.data, false);
            return entry;
        });
    }
    /**
     * Find all records by IDs.
     *
     * @param ids
     * @returns EntryCollection
     */
    findAll(ids) {
        return __awaiter(this, void 0, void 0, function* () {
            let criteria = this.stream.getEntries();
            return criteria.where('id', 'IN', ids).get();
        });
    }
    /**
     * Find an entry by a field value.
     *
     * @param field
     * @param value
     * @returns Entry
     */
    findBy(field, value) {
        return __awaiter(this, void 0, void 0, function* () {
            let criteria = this.stream.getEntries();
            return criteria.where(field, value).first();
        });
    }
    findAllWhere(field, value) {
        return __awaiter(this, void 0, void 0, function* () {
            let criteria = this.stream.getEntries();
            return criteria.where(field, value).get();
        });
    }
    /**
     * Create a new entry.
     *
     * @param attributes
     * @returns
     */
    create(attributes) {
        return __awaiter(this, void 0, void 0, function* () {
            let entry = this.newCriteria().newInstance(attributes);
            yield entry.save();
            return entry;
        });
    }
    /**
     * Save an entry.
     *
     * @param entry
     * @returns
     */
    save(entry) {
        return __awaiter(this, void 0, void 0, function* () {
            return entry.save();
        });
    }
    /**
     * Save an entry.
     *
     * @param entry
     * @returns
     */
    delete(entry) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.http.deleteEntry(this.stream.id, entry.id);
            return true;
        });
    }
    truncate() { return this; }
    /**
     * Return a new instance.
     *
     * @param attributes
     * @returns
     */
    newInstance(attributes) {
        return this.newCriteria().newInstance(attributes);
    }
    /**
     * Return a new entry criteria.
     *
     * @returns Criteria
     */
    newCriteria() {
        return new Criteria(this.stream);
    }
}
