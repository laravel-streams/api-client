import { Field, IField } from './Field';
import { Collection } from './Collection';
import { objectify } from './utils';
import { IBaseField } from './types';

export class FieldCollection<T extends IField = IField> extends Collection<Field> {
    constructor(fields: IField[]) {
        super(fields as any[]);
    }

    serialize(): Record<string, IBaseField> {
        return this.toArray().map(([ id, field ]) => [ id, field.serialize() ]).reduce(objectify, {});
    }
}
