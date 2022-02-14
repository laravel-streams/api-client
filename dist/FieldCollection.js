import { Collection } from './Collection';
import { objectify } from './utils';
export class FieldCollection extends Collection {
    constructor(fields) {
        super(fields);
    }
    serialize() {
        return this.toArray().map(([id, field]) => [id, field.serialize()]).reduce(objectify, {});
    }
}
