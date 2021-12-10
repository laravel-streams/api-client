import { fields } from './types';
export interface FieldData<T extends fields.Type = fields.Type> {
    handle?: string;
    type: T;
    input?: Record<string, any> & {
        type: T;
    };
    rules?: any[];
    config?: Record<string, any>;
    [key: string]: any;
}
export declare type IField<T extends keyof fields.Types = keyof fields.Types, D extends FieldData<any> = FieldData<T>> = Field & D;
export interface Field<T extends keyof fields.Types = keyof fields.Types> extends FieldData<T> {
}
export declare const isFieldData: (val: any) => val is FieldData<keyof fields.Types>;
export declare const isIField: (val: any) => val is IField<keyof fields.Types, FieldData<keyof fields.Types>>;
export declare class Field<T extends keyof fields.Types = keyof fields.Types> {
    #private;
    constructor(field: FieldData);
    serialize(): FieldData;
}
