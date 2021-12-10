import { Field, FieldData, IField } from './Field';
import { Collection } from './Collection';
import { objectify } from './utils';

export class FieldCollection<T extends IField = IField> extends Collection<Field> {
    constructor(fields: IField[]) {
        super(fields as any[]);
    }

    serialize(): Record<string, FieldData> {
        return this.toArray().map(([ id, field ]) => [ id, field.serialize() ]).reduce(objectify, {});
    }
}
