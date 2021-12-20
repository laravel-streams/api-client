import { FieldType, IBaseField } from './types';


export type IField<T extends FieldType = FieldType, D extends IBaseField<T> = IBaseField<T>> =
    Field
    & D;

export interface Field<T extends FieldType = FieldType> extends IBaseField<T> {
}

export const isFieldData = (val: any): val is IBaseField => val && val.type !== undefined;

export const isIField = (val: any): val is IField => val && val instanceof Field;//&& typeof val.serialize === 'function'

export class Field<T extends FieldType = FieldType> {
    #field: IBaseField<T>;

    constructor(field: IBaseField<T>) {
        delete field.__listeners;
        delete field.__observers;
        this.#field = field;
        const self  = this;
        let proxy   = new Proxy(this, {
            get: (target: Field, p: string | symbol, receiver: any): any => {
                if ( typeof self[ p.toString() ] === 'function' ) {
                    return self[ p.toString() ].bind(self);
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

    serialize(): IBaseField<T> {
        return this.#field;
    }
}
