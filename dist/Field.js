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
var _Field_field;
export const isFieldData = (val) => val && val.type !== undefined;
export const isIField = (val) => val && val instanceof Field; //&& typeof val.serialize === 'function'
export class Field {
    constructor(field) {
        _Field_field.set(this, void 0);
        delete field.__listeners;
        delete field.__observers;
        __classPrivateFieldSet(this, _Field_field, field, "f");
        const self = this;
        let proxy = new Proxy(this, {
            get: (target, p, receiver) => {
                if (typeof self[p.toString()] === 'function') {
                    return self[p.toString()].bind(self);
                }
                // if(self.#field[p.toString()] !== undefined){
                //     return self.#field[p.toString()];
                // }
                if (Reflect.has(__classPrivateFieldGet(target, _Field_field, "f"), p)) {
                    return Reflect.get(__classPrivateFieldGet(target, _Field_field, "f"), p);
                }
                if (Reflect.has(target, p)) {
                    return Reflect.get(target, p, receiver);
                }
            },
            set(target, p, value, receiver) {
                if (Reflect.has(target, p)) {
                    return Reflect.set(target, p, value, receiver);
                }
                return Reflect.set(__classPrivateFieldGet(target, _Field_field, "f"), p, value);
            },
        });
        return proxy;
    }
    serialize() {
        return __classPrivateFieldGet(this, _Field_field, "f");
    }
}
_Field_field = new WeakMap();
