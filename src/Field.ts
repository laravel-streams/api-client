import { fields } from './types';

export interface FieldData<T extends fields.Type = fields.Type> {
    handle?: string;
    type: T;
    input?: Record<string, any> & {
        type: T
    };
    rules?: any[];
    config?: Record<string, any>;

    [ key: string ]: any;
}

export type IField<T extends keyof fields.Types = keyof fields.Types, D extends FieldData<any> = FieldData<T>> =
    Field
    & D;

export interface Field<T extends keyof fields.Types = keyof fields.Types> extends FieldData<T> {
}

export const isFieldData = (val: any): val is FieldData => val && val.type !== undefined;

export const isIField    = (val: any): val is IField => val && val instanceof Field;//&& typeof val.serialize === 'function'

export class Field<T extends keyof fields.Types = keyof fields.Types> {
    #field: FieldData;

    constructor(field: FieldData) {
        delete field.__listeners;
        delete field.__observers;
        this.#field = field;
        const self=this;
        let proxy   = new Proxy(this, {
            get: (target: Field, p: string | symbol, receiver: any): any=> {
                if(typeof self[p.toString()] === 'function'){
                    return self[p.toString()].bind(self);
                }
                // if(self.#field[p.toString()] !== undefined){
                //     return self.#field[p.toString()];
                // }
                if ( Reflect.has(target.#field, p) ) {
                    return Reflect.get(target.#field, p);
                }
                if ( Reflect.has(target, p) ) {
                    return Reflect.get(target, p, receiver);
                }
            },
            set(target: Field, p: string | symbol, value: any, receiver: any): boolean {
                if ( Reflect.has(target, p) ) {
                    return Reflect.set(target, p, value, receiver);
                }
                return Reflect.set(target.#field, p, value);
            },
        });
        return proxy as any;
    }

    serialize():FieldData {
        return this.#field;
    }
}
