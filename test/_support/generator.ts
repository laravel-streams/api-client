import f from 'faker';
import { IStream } from '../../src';

export interface FieldTypes {
    string: string;
    url: string;
    text: string;
    hash: string;
    slug: string;
    email: string;
    markdown: string;
    template: string;
    number: number;
    integer: number;
    float: number;
    decimal: number;
    boolean: boolean;
    array: Array<any>;
    prototype: object;
    object: object;
    image: any;
    file: any;
    datetime: string;
    date: string;
    time: string;
    select: string;
    multiselect: string[];
    collection: Array<any>;
    entry: any;
    entries: any;
    multiple: any;
    polymorphic: any;
    relationship: any;
    color: any;
}

type SimpleFieldDefinition = keyof FieldTypes
type DetailedFieldDefinition = { type: keyof FieldTypes, [ key: string ]: any }

type Fields = Record<string, SimpleFieldDefinition | DetailedFieldDefinition>
type Field = SimpleFieldDefinition | DetailedFieldDefinition

const isSimpleField   = (val: any): val is SimpleFieldDefinition => val && typeof val === 'string';
const isDetailedField = (val: any): val is DetailedFieldDefinition => val && typeof val === 'object' && typeof val.type === 'string';

type FieldType = keyof FieldTypes

type FieldTypeFakers = {
    [P in keyof FieldTypes]: (...args) => FieldTypes[P]
}
export const objectify = (obj, [ k, v ]) => ({ ...obj, [ k ]: v });

export class Generator implements FieldTypeFakers {

    public static fromStream(stream: IStream, amount: number = 20) {
        const gen = new Generator();
        return gen.entries(stream.fields as any, amount);
    }

    public array(field?:Field): FieldTypes['array'] {
        return f.random.arrayElements(20);
    }

    public boolean(field?:Field): FieldTypes['boolean'] {
        return f.datatype.boolean();
    }

    public collection(field?:Field): FieldTypes['collection'] {
        return f.random.arrayElements(20);
    }

    public color(field?:Field): FieldTypes['color'] {
        return f.internet.color();
    }

    public date(field?:Field): FieldTypes['date'] {
        return f.date.recent().toDateString();
    }

    public datetime(field?:Field): FieldTypes['datetime'] {
        return f.date.recent().toDateString() + ' ' + f.date.recent().toTimeString();
    }

    public decimal(field?:Field): FieldTypes['decimal'] {
        return f.datatype.number();
    }

    public email(field?:Field): FieldTypes['email'] {
        return f.internet.email();
    }

    public entries(fields: Fields, amount: number = 20): FieldTypes['entries'] {
        const entries: any = {};
        for ( let i = 0; i < amount; i ++ ) {
            entries[ i.toString() ] = this.entry(fields);
        }
        return entries;
    }

    public entry(fields: Fields): FieldTypes['entry'] {
        return Object.entries(fields).map(([ k, v ]) => {
            if ( isSimpleField(v) && this[ v ] !== undefined ) {
                return [ k, this[ v ].apply(this) ];
            }
            if ( isDetailedField(v) && this[ v.type ] !== undefined ) {
                return [ k, this[ v.type ].apply(this) ];
            }
            return [ k, v ];
        }).reduce(objectify, {});
    }

    public file(field?:Field): FieldTypes['file'] {
        return undefined;
    }

    public float(field?:Field): FieldTypes['float'] {
        return f.datatype.number();
    }

    public hash(field?:Field): FieldTypes['hash'] {
        return f.random.alpha({ count: 30 });
    }

    public image(field?:Field): FieldTypes['image'] {
        return f.image.imageUrl();
    }

    public integer(field?:Field): FieldTypes['integer'] {
        return f.datatype.number();
    }

    public markdown(field?:Field): FieldTypes['markdown'] {
        return f.lorem.paragraphs();
    }

    public multiple(field?:Field): FieldTypes['multiple'] {
        return [];
    }

    public multiselect(field?:Field): FieldTypes['multiselect'] {
        return f.random.arrayElements();
    }

    public number(field?:Field): FieldTypes['number'] {
        return f.datatype.number();
    }

    public object(field?:Field): FieldTypes['object'] {
        return {};
    }

    public polymorphic(field?:Field): FieldTypes['polymorphic'] {
        return f.random.alpha();
    }

    public prototype(field?:Field): FieldTypes['prototype'] {
        return undefined;
    }

    public relationship(field?:Field): FieldTypes['relationship'] {
        return f.random.alpha();
    }

    public select(field?:Field): FieldTypes['select'] {
        return f.random.word();
    }

    public slug(field?:Field): FieldTypes['slug'] {
        return f.random.word();
    }

    public string(field?:Field): FieldTypes['string'] {
        return f.random.word();
    }

    public template(field?:Field): FieldTypes['template'] {
        return f.random.word();
    }

    public text(field?:Field): FieldTypes['text'] {
        return f.lorem.text();
    }

    public time(field?:Field): FieldTypes['time'] {
        return f.date.soon().toTimeString();
    }

    public url(field?:Field): FieldTypes['url'] {
        return f.internet.url();
    }

}
