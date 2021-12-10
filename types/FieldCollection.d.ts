import { Field, FieldData, IField } from './Field';
import { Collection } from './Collection';
export declare class FieldCollection<T extends IField = IField> extends Collection<Field> {
    constructor(fields: IField[]);
    serialize(): Record<string, FieldData>;
}
