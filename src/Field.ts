import { fields } from './types';

export interface IField {
    handle: string;
    type: fields.Type;
    input?: Record<string, any> & {
        type: fields.Type
    };
    rules?: any[];
    config?: Record<string, any>;

    [ key: string ]: any;
}

export interface Field extends IField {
}

export class Field {
    constructor(protected _field: IField) {
        delete _field.__listeners
        delete _field.__observers
        let proxy = new Proxy(this, {
            get(target: Field, p: string | symbol, receiver: any): any {
                if ( Reflect.has(target, p) ) {
                    return Reflect.get(target, p, receiver);
                }
                if ( Reflect.has(target._field, p) ) {
                    return Reflect.get(target._field, p);
                }
            },
            set(target: Field, p: string | symbol, value: any, receiver: any): boolean {
                if ( Reflect.has(target, p) ) {
                    return Reflect.set(target, p, value, receiver);
                }
                return Reflect.set(target._field, p, value);
            },
        });
        return proxy;
    }

    serialize(){
        return this._field
    }
}
