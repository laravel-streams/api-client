import { Field, IField } from './Field';
import { Collection } from './Collection';
import { IBaseField } from './types';
export declare class FieldCollection<T extends IField = IField> extends Collection<Field> {
    constructor(fields: IField[]);
    serialize(): Record<string, IBaseField>;
}
