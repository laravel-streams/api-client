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
var _Entry_stream, _Entry_data, _Entry_fresh;
import { Obj } from './utils';
export class Entry {
    constructor(stream, data = {}, fresh = true) {
        _Entry_stream.set(this, void 0);
        _Entry_data.set(this, {});
        _Entry_fresh.set(this, true);
        __classPrivateFieldSet(this, _Entry_stream, stream, "f");
        __classPrivateFieldSet(this, _Entry_data, data, "f");
        __classPrivateFieldSet(this, _Entry_fresh, fresh, "f");
        const self = this;
        let proxy = new Proxy(this, {
            get: (target, p, receiver) => {
                if (typeof self[p.toString()] === 'function') {
                    return self[p.toString()].bind(self);
                }
                if (self[p.toString()] !== undefined) {
                    return self[p.toString()];
                }
                if (Reflect.has(__classPrivateFieldGet(target, _Entry_data, "f"), p)) {
                    return Reflect.get(__classPrivateFieldGet(target, _Entry_data, "f"), p);
                }
                if (Reflect.has(target, p)) {
                    return Reflect.get(target, p, receiver);
                }
            },
            set: (target, p, value, receiver) => {
                if (Reflect.has(target, p)) {
                    return Reflect.set(target, p, value, receiver);
                }
                return Reflect.set(__classPrivateFieldGet(target, _Entry_data, "f"), p, value);
            },
        });
        return proxy;
    }
    getStream() { return __classPrivateFieldGet(this, _Entry_stream, "f"); }
    save() {
        return __awaiter(this, void 0, void 0, function* () {
            let http = __classPrivateFieldGet(this, _Entry_stream, "f").getStreams().http;
            try {
                if (__classPrivateFieldGet(this, _Entry_fresh, "f")) {
                    const response = yield http.postEntry(__classPrivateFieldGet(this, _Entry_stream, "f").id, __classPrivateFieldGet(this, _Entry_data, "f"));
                    __classPrivateFieldSet(this, _Entry_data, response.data.data, "f");
                    __classPrivateFieldSet(this, _Entry_fresh, false, "f");
                    return true;
                }
                const response = yield http.patchEntry(__classPrivateFieldGet(this, _Entry_stream, "f").id, __classPrivateFieldGet(this, _Entry_data, "f").id, this.getPatchData());
                __classPrivateFieldSet(this, _Entry_data, response.data.data, "f");
                return true;
            }
            catch (e) {
                return false;
            }
        });
    }
    getPatchData() {
        var _a, _b;
        let data = this.toObject();
        if ((_b = (_a = __classPrivateFieldGet(this, _Entry_stream, "f")) === null || _a === void 0 ? void 0 : _a.config) === null || _b === void 0 ? void 0 : _b.key_name) {
            return Obj.exclude(data, [__classPrivateFieldGet(this, _Entry_stream, "f").config.key_name]);
        }
        return data;
    }
    toObject() {
        return __classPrivateFieldGet(this, _Entry_data, "f");
    }
}
_Entry_stream = new WeakMap(), _Entry_data = new WeakMap(), _Entry_fresh = new WeakMap();
