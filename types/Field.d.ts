import { FieldType, IBaseField } from './types';
export declare type IField<T extends FieldType = FieldType, D extends IBaseField<T> = IBaseField<T>> = Field & D;
export interface Field<T extends FieldType = FieldType> extends IBaseField<T> {
}
export declare const isFieldData: (val: any) => val is IBaseField<keyof import("./types").FieldTypes>;
export declare const isIField: (val: any) => val is IField<keyof import("./types").FieldTypes, IBaseField<keyof import("./types").FieldTypes>>;
export declare class Field<T extends FieldType = FieldType> {
    #private;
    constructor(field: IBaseField<T>);
    serialize(): IBaseField<T>;
}
