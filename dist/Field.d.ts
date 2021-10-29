import { fields } from './types';
export interface IField {
    handle: string;
    type: fields.Type;
    input?: Record<string, any> & {
        type: fields.Type;
    };
    rules?: any[];
    config?: Record<string, any>;
    [key: string]: any;
}
export interface Field extends IField {
}
export declare class Field {
    protected _field: IField;
    constructor(_field: IField);
    serialize(): IField;
}
