"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Generator = exports.objectify = void 0;
const tslib_1 = require("tslib");
const faker_1 = (0, tslib_1.__importDefault)(require("faker"));
const isSimpleField = (val) => val && typeof val === 'string';
const isDetailedField = (val) => val && typeof val === 'object' && typeof val.type === 'string';
const objectify = (obj, [k, v]) => (Object.assign(Object.assign({}, obj), { [k]: v }));
exports.objectify = objectify;
class Generator {
    static fromStream(stream, amount = 20) {
        const gen = new Generator();
        return gen.entries(stream.fields, amount);
    }
    array(field) {
        return faker_1.default.random.arrayElements(20);
    }
    boolean(field) {
        return faker_1.default.datatype.boolean();
    }
    collection(field) {
        return faker_1.default.random.arrayElements(20);
    }
    color(field) {
        return faker_1.default.internet.color();
    }
    date(field) {
        return faker_1.default.date.recent().toDateString();
    }
    datetime(field) {
        return faker_1.default.date.recent().toDateString() + ' ' + faker_1.default.date.recent().toTimeString();
    }
    decimal(field) {
        return faker_1.default.datatype.number();
    }
    email(field) {
        return faker_1.default.internet.email();
    }
    entries(fields, amount = 20) {
        const entries = {};
        for (let i = 0; i < amount; i++) {
            entries[i.toString()] = this.entry(fields);
        }
        return entries;
    }
    entry(fields) {
        return Object.entries(fields).map(([k, v]) => {
            if (isSimpleField(v) && this[v] !== undefined) {
                return [k, this[v].apply(this)];
            }
            if (isDetailedField(v) && this[v.type] !== undefined) {
                return [k, this[v.type].apply(this)];
            }
            return [k, v];
        }).reduce(exports.objectify, {});
    }
    file(field) {
        return undefined;
    }
    float(field) {
        return faker_1.default.datatype.number();
    }
    hash(field) {
        return faker_1.default.random.alpha({ count: 30 });
    }
    image(field) {
        return faker_1.default.image.imageUrl();
    }
    integer(field) {
        return faker_1.default.datatype.number();
    }
    markdown(field) {
        return faker_1.default.lorem.paragraphs();
    }
    multiple(field) {
        return [];
    }
    multiselect(field) {
        return faker_1.default.random.arrayElements();
    }
    number(field) {
        return faker_1.default.datatype.number();
    }
    object(field) {
        return {};
    }
    polymorphic(field) {
        return faker_1.default.random.alpha();
    }
    prototype(field) {
        return undefined;
    }
    relationship(field) {
        return faker_1.default.random.alpha();
    }
    select(field) {
        return faker_1.default.random.word();
    }
    slug(field) {
        return faker_1.default.random.word();
    }
    string(field) {
        return faker_1.default.random.word();
    }
    template(field) {
        return faker_1.default.random.word();
    }
    text(field) {
        return faker_1.default.lorem.text();
    }
    time(field) {
        return faker_1.default.date.soon().toTimeString();
    }
    url(field) {
        return faker_1.default.internet.url();
    }
}
exports.Generator = Generator;
//# sourceMappingURL=generator.js.map