import { Collection as BaseCollection } from 'collect.js';
export class Collection extends BaseCollection {
    toObject() {
        return this.items;
    }
}
