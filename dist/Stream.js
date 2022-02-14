var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __classPrivateFieldSet = (this && this.__classPrivateFieldSet) || function (receiver, state, value, kind, f) {
    if (kind === "m") throw new TypeError("Private method is not writable");
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a setter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
    return (kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value)), value;
};
var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var _Stream_proxy, _Stream_stream, _Stream_streams, _Stream_meta, _Stream_links, _Stream_repository, _Stream_fields;
import { Field, isFieldData } from './Field';
import { Repository } from './Repository';
import { Obj, objectify } from './utils';
import { FieldCollection } from './FieldCollection';
/**
 *
 * Represents a stream and can be used to get it's data.
 *
 * The example below uses:
 * - {@linkcode Stream.getRepository} method returns {@linkcode Repository}
 * - {@linkcode Stream.getEntries} method returns {@linkcode Criteria}
 * ```ts
 * const repository = await stream.getRepository()
 * const client = await repository.find(2);
 * const clients = await stream.getEntries()
 *                                 .where('age', '>', 5)
 *                                 .where('age', '<', 50)
 *                                 .orderBy('age', 'asc')
 *                                 .get();
 *     for(const client of clients){
 *         client.email;
 *         client.age;
 *     }
 * }
 * ```
 */
export class Stream {
    constructor(streams, stream, meta, links) {
        _Stream_proxy.set(this, void 0);
        _Stream_stream.set(this, void 0);
        _Stream_streams.set(this, void 0);
        _Stream_meta.set(this, void 0);
        _Stream_links.set(this, void 0);
        _Stream_repository.set(this, void 0);
        _Stream_fields.set(this, void 0);
        __classPrivateFieldSet(this, _Stream_streams, streams, "f");
        __classPrivateFieldSet(this, _Stream_stream, stream, "f");
        __classPrivateFieldSet(this, _Stream_meta, meta, "f");
        __classPrivateFieldSet(this, _Stream_links, links, "f");
        this.unserialize(stream);
        const self = this;
        let proxy = new Proxy(this, {
            get: (target, p, receiver) => {
                if (typeof self[p.toString()] === 'function') {
                    return self[p.toString()].bind(self);
                }
                if (__classPrivateFieldGet(self, _Stream_stream, "f")[p.toString()]) {
                    return __classPrivateFieldGet(self, _Stream_stream, "f")[p.toString()];
                }
                if (Reflect.has(__classPrivateFieldGet(target, _Stream_stream, "f"), p)) {
                    return Reflect.get(__classPrivateFieldGet(target, _Stream_stream, "f"), p);
                }
                if (Reflect.has(target, p)) {
                    return Reflect.get(target, p).bind(this);
                }
            },
            set: (target, p, value, receiver) => {
                if (__classPrivateFieldGet(self, _Stream_stream, "f")[p.toString()]) {
                    __classPrivateFieldGet(self, _Stream_stream, "f")[p.toString()] = value;
                    return true;
                }
                if (Reflect.has(target, p)) {
                    return Reflect.set(target, p, value, receiver);
                }
                return Reflect.set(__classPrivateFieldGet(this, _Stream_stream, "f"), p, value);
            },
        });
        __classPrivateFieldSet(this, _Stream_proxy, proxy, "f");
        return proxy;
    }
    getFields() { return __classPrivateFieldGet(this, _Stream_fields, "f"); }
    getStreams() { return __classPrivateFieldGet(this, _Stream_streams, "f"); }
    getMeta() { return __classPrivateFieldGet(this, _Stream_meta, "f"); }
    getLinks() { return __classPrivateFieldGet(this, _Stream_links, "f"); }
    getRepository() {
        if (!__classPrivateFieldGet(this, _Stream_repository, "f")) {
            __classPrivateFieldSet(this, _Stream_repository, new Repository(__classPrivateFieldGet(this, _Stream_proxy, "f")), "f");
        }
        return __classPrivateFieldGet(this, _Stream_repository, "f");
    }
    ;
    getEntries() { return this.getRepository().newCriteria(); }
    ;
    save() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield __classPrivateFieldGet(this, _Stream_streams, "f").http.patchStream(__classPrivateFieldGet(this, _Stream_stream, "f").id, this.serialize());
                return true;
            }
            catch (e) {
                return false;
            }
        });
    }
    delete() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield __classPrivateFieldGet(this, _Stream_streams, "f").http.deleteStream(__classPrivateFieldGet(this, _Stream_stream, "f").id);
                return true;
            }
            catch (e) {
                return false;
            }
        });
    }
    unserialize(stream) {
        let fields = Object.entries(stream.fields || {}).map(([key, field]) => {
            if (isFieldData(field)) {
                return [key, new Field(field)];
            }
            if (typeof field === 'string') {
                return [key, new Field({ type: field })];
            }
            throw new Error(`Could not unserialize stream "${this.handle}" because of field [${key}] with value ${field}`);
        }).reduce(objectify, {});
        __classPrivateFieldSet(this, _Stream_fields, new FieldCollection(fields), "f");
    }
    serialize() {
        let stream = Obj.exclude(__classPrivateFieldGet(this, _Stream_stream, "f"), ['id', 'handle']);
        stream.fields = Object
            .entries(this.getFields().toObject())
            .map(([id, field]) => [id, field.serialize()])
            .reduce(objectify, {});
        return stream;
    }
}
_Stream_proxy = new WeakMap(), _Stream_stream = new WeakMap(), _Stream_streams = new WeakMap(), _Stream_meta = new WeakMap(), _Stream_links = new WeakMap(), _Stream_repository = new WeakMap(), _Stream_fields = new WeakMap();
