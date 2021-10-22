import { fields } from './types';
export interface Field {
    config?:Record<string,any>
    handle:string
    input:Record<string,any> & {
        type: fields.Type
    }
    rules:any[]
    type: fields.Type
}
export class Field {
    constructor(field: any) {
        Object.assign(this, field);
    }
}
