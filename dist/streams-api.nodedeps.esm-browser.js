import Axios from 'axios';
import { stringify } from 'qs';

var commonjsGlobal = typeof globalThis !== 'undefined' ? globalThis : typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : {};

function getAugmentedNamespace(n) {
	if (n.__esModule) return n;
	var a = Object.defineProperty({}, '__esModule', {value: true});
	Object.keys(n).forEach(function (k) {
		var d = Object.getOwnPropertyDescriptor(n, k);
		Object.defineProperty(a, k, d.get ? d : {
			enumerable: true,
			get: function () {
				return n[k];
			}
		});
	});
	return a;
}

/*! *****************************************************************************
Copyright (C) Microsoft. All rights reserved.
Licensed under the Apache License, Version 2.0 (the "License"); you may not use
this file except in compliance with the License. You may obtain a copy of the
License at http://www.apache.org/licenses/LICENSE-2.0

THIS CODE IS PROVIDED ON AN *AS IS* BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
KIND, EITHER EXPRESS OR IMPLIED, INCLUDING WITHOUT LIMITATION ANY IMPLIED
WARRANTIES OR CONDITIONS OF TITLE, FITNESS FOR A PARTICULAR PURPOSE,
MERCHANTABLITY OR NON-INFRINGEMENT.

See the Apache Version 2.0 License for specific language governing permissions
and limitations under the License.
***************************************************************************** */

var Reflect$1;
(function (Reflect) {
    // Metadata Proposal
    // https://rbuckton.github.io/reflect-metadata/
    (function (factory) {
        var root = typeof commonjsGlobal === "object" ? commonjsGlobal :
            typeof self === "object" ? self :
                typeof this === "object" ? this :
                    Function("return this;")();
        var exporter = makeExporter(Reflect);
        if (typeof root.Reflect === "undefined") {
            root.Reflect = Reflect;
        }
        else {
            exporter = makeExporter(root.Reflect, exporter);
        }
        factory(exporter);
        function makeExporter(target, previous) {
            return function (key, value) {
                if (typeof target[key] !== "function") {
                    Object.defineProperty(target, key, { configurable: true, writable: true, value: value });
                }
                if (previous)
                    previous(key, value);
            };
        }
    })(function (exporter) {
        var hasOwn = Object.prototype.hasOwnProperty;
        // feature test for Symbol support
        var supportsSymbol = typeof Symbol === "function";
        var toPrimitiveSymbol = supportsSymbol && typeof Symbol.toPrimitive !== "undefined" ? Symbol.toPrimitive : "@@toPrimitive";
        var iteratorSymbol = supportsSymbol && typeof Symbol.iterator !== "undefined" ? Symbol.iterator : "@@iterator";
        var supportsCreate = typeof Object.create === "function"; // feature test for Object.create support
        var supportsProto = { __proto__: [] } instanceof Array; // feature test for __proto__ support
        var downLevel = !supportsCreate && !supportsProto;
        var HashMap = {
            // create an object in dictionary mode (a.k.a. "slow" mode in v8)
            create: supportsCreate
                ? function () { return MakeDictionary(Object.create(null)); }
                : supportsProto
                    ? function () { return MakeDictionary({ __proto__: null }); }
                    : function () { return MakeDictionary({}); },
            has: downLevel
                ? function (map, key) { return hasOwn.call(map, key); }
                : function (map, key) { return key in map; },
            get: downLevel
                ? function (map, key) { return hasOwn.call(map, key) ? map[key] : undefined; }
                : function (map, key) { return map[key]; },
        };
        // Load global or shim versions of Map, Set, and WeakMap
        var functionPrototype = Object.getPrototypeOf(Function);
        var usePolyfill = typeof process === "object" && process.env && process.env["REFLECT_METADATA_USE_MAP_POLYFILL"] === "true";
        var _Map = !usePolyfill && typeof Map === "function" && typeof Map.prototype.entries === "function" ? Map : CreateMapPolyfill();
        var _Set = !usePolyfill && typeof Set === "function" && typeof Set.prototype.entries === "function" ? Set : CreateSetPolyfill();
        var _WeakMap = !usePolyfill && typeof WeakMap === "function" ? WeakMap : CreateWeakMapPolyfill();
        // [[Metadata]] internal slot
        // https://rbuckton.github.io/reflect-metadata/#ordinary-object-internal-methods-and-internal-slots
        var Metadata = new _WeakMap();
        /**
         * Applies a set of decorators to a property of a target object.
         * @param decorators An array of decorators.
         * @param target The target object.
         * @param propertyKey (Optional) The property key to decorate.
         * @param attributes (Optional) The property descriptor for the target key.
         * @remarks Decorators are applied in reverse order.
         * @example
         *
         *     class Example {
         *         // property declarations are not part of ES6, though they are valid in TypeScript:
         *         // static staticProperty;
         *         // property;
         *
         *         constructor(p) { }
         *         static staticMethod(p) { }
         *         method(p) { }
         *     }
         *
         *     // constructor
         *     Example = Reflect.decorate(decoratorsArray, Example);
         *
         *     // property (on constructor)
         *     Reflect.decorate(decoratorsArray, Example, "staticProperty");
         *
         *     // property (on prototype)
         *     Reflect.decorate(decoratorsArray, Example.prototype, "property");
         *
         *     // method (on constructor)
         *     Object.defineProperty(Example, "staticMethod",
         *         Reflect.decorate(decoratorsArray, Example, "staticMethod",
         *             Object.getOwnPropertyDescriptor(Example, "staticMethod")));
         *
         *     // method (on prototype)
         *     Object.defineProperty(Example.prototype, "method",
         *         Reflect.decorate(decoratorsArray, Example.prototype, "method",
         *             Object.getOwnPropertyDescriptor(Example.prototype, "method")));
         *
         */
        function decorate(decorators, target, propertyKey, attributes) {
            if (!IsUndefined(propertyKey)) {
                if (!IsArray(decorators))
                    throw new TypeError();
                if (!IsObject(target))
                    throw new TypeError();
                if (!IsObject(attributes) && !IsUndefined(attributes) && !IsNull(attributes))
                    throw new TypeError();
                if (IsNull(attributes))
                    attributes = undefined;
                propertyKey = ToPropertyKey(propertyKey);
                return DecorateProperty(decorators, target, propertyKey, attributes);
            }
            else {
                if (!IsArray(decorators))
                    throw new TypeError();
                if (!IsConstructor(target))
                    throw new TypeError();
                return DecorateConstructor(decorators, target);
            }
        }
        exporter("decorate", decorate);
        // 4.1.2 Reflect.metadata(metadataKey, metadataValue)
        // https://rbuckton.github.io/reflect-metadata/#reflect.metadata
        /**
         * A default metadata decorator factory that can be used on a class, class member, or parameter.
         * @param metadataKey The key for the metadata entry.
         * @param metadataValue The value for the metadata entry.
         * @returns A decorator function.
         * @remarks
         * If `metadataKey` is already defined for the target and target key, the
         * metadataValue for that key will be overwritten.
         * @example
         *
         *     // constructor
         *     @Reflect.metadata(key, value)
         *     class Example {
         *     }
         *
         *     // property (on constructor, TypeScript only)
         *     class Example {
         *         @Reflect.metadata(key, value)
         *         static staticProperty;
         *     }
         *
         *     // property (on prototype, TypeScript only)
         *     class Example {
         *         @Reflect.metadata(key, value)
         *         property;
         *     }
         *
         *     // method (on constructor)
         *     class Example {
         *         @Reflect.metadata(key, value)
         *         static staticMethod() { }
         *     }
         *
         *     // method (on prototype)
         *     class Example {
         *         @Reflect.metadata(key, value)
         *         method() { }
         *     }
         *
         */
        function metadata(metadataKey, metadataValue) {
            function decorator(target, propertyKey) {
                if (!IsObject(target))
                    throw new TypeError();
                if (!IsUndefined(propertyKey) && !IsPropertyKey(propertyKey))
                    throw new TypeError();
                OrdinaryDefineOwnMetadata(metadataKey, metadataValue, target, propertyKey);
            }
            return decorator;
        }
        exporter("metadata", metadata);
        /**
         * Define a unique metadata entry on the target.
         * @param metadataKey A key used to store and retrieve metadata.
         * @param metadataValue A value that contains attached metadata.
         * @param target The target object on which to define metadata.
         * @param propertyKey (Optional) The property key for the target.
         * @example
         *
         *     class Example {
         *         // property declarations are not part of ES6, though they are valid in TypeScript:
         *         // static staticProperty;
         *         // property;
         *
         *         constructor(p) { }
         *         static staticMethod(p) { }
         *         method(p) { }
         *     }
         *
         *     // constructor
         *     Reflect.defineMetadata("custom:annotation", options, Example);
         *
         *     // property (on constructor)
         *     Reflect.defineMetadata("custom:annotation", options, Example, "staticProperty");
         *
         *     // property (on prototype)
         *     Reflect.defineMetadata("custom:annotation", options, Example.prototype, "property");
         *
         *     // method (on constructor)
         *     Reflect.defineMetadata("custom:annotation", options, Example, "staticMethod");
         *
         *     // method (on prototype)
         *     Reflect.defineMetadata("custom:annotation", options, Example.prototype, "method");
         *
         *     // decorator factory as metadata-producing annotation.
         *     function MyAnnotation(options): Decorator {
         *         return (target, key?) => Reflect.defineMetadata("custom:annotation", options, target, key);
         *     }
         *
         */
        function defineMetadata(metadataKey, metadataValue, target, propertyKey) {
            if (!IsObject(target))
                throw new TypeError();
            if (!IsUndefined(propertyKey))
                propertyKey = ToPropertyKey(propertyKey);
            return OrdinaryDefineOwnMetadata(metadataKey, metadataValue, target, propertyKey);
        }
        exporter("defineMetadata", defineMetadata);
        /**
         * Gets a value indicating whether the target object or its prototype chain has the provided metadata key defined.
         * @param metadataKey A key used to store and retrieve metadata.
         * @param target The target object on which the metadata is defined.
         * @param propertyKey (Optional) The property key for the target.
         * @returns `true` if the metadata key was defined on the target object or its prototype chain; otherwise, `false`.
         * @example
         *
         *     class Example {
         *         // property declarations are not part of ES6, though they are valid in TypeScript:
         *         // static staticProperty;
         *         // property;
         *
         *         constructor(p) { }
         *         static staticMethod(p) { }
         *         method(p) { }
         *     }
         *
         *     // constructor
         *     result = Reflect.hasMetadata("custom:annotation", Example);
         *
         *     // property (on constructor)
         *     result = Reflect.hasMetadata("custom:annotation", Example, "staticProperty");
         *
         *     // property (on prototype)
         *     result = Reflect.hasMetadata("custom:annotation", Example.prototype, "property");
         *
         *     // method (on constructor)
         *     result = Reflect.hasMetadata("custom:annotation", Example, "staticMethod");
         *
         *     // method (on prototype)
         *     result = Reflect.hasMetadata("custom:annotation", Example.prototype, "method");
         *
         */
        function hasMetadata(metadataKey, target, propertyKey) {
            if (!IsObject(target))
                throw new TypeError();
            if (!IsUndefined(propertyKey))
                propertyKey = ToPropertyKey(propertyKey);
            return OrdinaryHasMetadata(metadataKey, target, propertyKey);
        }
        exporter("hasMetadata", hasMetadata);
        /**
         * Gets a value indicating whether the target object has the provided metadata key defined.
         * @param metadataKey A key used to store and retrieve metadata.
         * @param target The target object on which the metadata is defined.
         * @param propertyKey (Optional) The property key for the target.
         * @returns `true` if the metadata key was defined on the target object; otherwise, `false`.
         * @example
         *
         *     class Example {
         *         // property declarations are not part of ES6, though they are valid in TypeScript:
         *         // static staticProperty;
         *         // property;
         *
         *         constructor(p) { }
         *         static staticMethod(p) { }
         *         method(p) { }
         *     }
         *
         *     // constructor
         *     result = Reflect.hasOwnMetadata("custom:annotation", Example);
         *
         *     // property (on constructor)
         *     result = Reflect.hasOwnMetadata("custom:annotation", Example, "staticProperty");
         *
         *     // property (on prototype)
         *     result = Reflect.hasOwnMetadata("custom:annotation", Example.prototype, "property");
         *
         *     // method (on constructor)
         *     result = Reflect.hasOwnMetadata("custom:annotation", Example, "staticMethod");
         *
         *     // method (on prototype)
         *     result = Reflect.hasOwnMetadata("custom:annotation", Example.prototype, "method");
         *
         */
        function hasOwnMetadata(metadataKey, target, propertyKey) {
            if (!IsObject(target))
                throw new TypeError();
            if (!IsUndefined(propertyKey))
                propertyKey = ToPropertyKey(propertyKey);
            return OrdinaryHasOwnMetadata(metadataKey, target, propertyKey);
        }
        exporter("hasOwnMetadata", hasOwnMetadata);
        /**
         * Gets the metadata value for the provided metadata key on the target object or its prototype chain.
         * @param metadataKey A key used to store and retrieve metadata.
         * @param target The target object on which the metadata is defined.
         * @param propertyKey (Optional) The property key for the target.
         * @returns The metadata value for the metadata key if found; otherwise, `undefined`.
         * @example
         *
         *     class Example {
         *         // property declarations are not part of ES6, though they are valid in TypeScript:
         *         // static staticProperty;
         *         // property;
         *
         *         constructor(p) { }
         *         static staticMethod(p) { }
         *         method(p) { }
         *     }
         *
         *     // constructor
         *     result = Reflect.getMetadata("custom:annotation", Example);
         *
         *     // property (on constructor)
         *     result = Reflect.getMetadata("custom:annotation", Example, "staticProperty");
         *
         *     // property (on prototype)
         *     result = Reflect.getMetadata("custom:annotation", Example.prototype, "property");
         *
         *     // method (on constructor)
         *     result = Reflect.getMetadata("custom:annotation", Example, "staticMethod");
         *
         *     // method (on prototype)
         *     result = Reflect.getMetadata("custom:annotation", Example.prototype, "method");
         *
         */
        function getMetadata(metadataKey, target, propertyKey) {
            if (!IsObject(target))
                throw new TypeError();
            if (!IsUndefined(propertyKey))
                propertyKey = ToPropertyKey(propertyKey);
            return OrdinaryGetMetadata(metadataKey, target, propertyKey);
        }
        exporter("getMetadata", getMetadata);
        /**
         * Gets the metadata value for the provided metadata key on the target object.
         * @param metadataKey A key used to store and retrieve metadata.
         * @param target The target object on which the metadata is defined.
         * @param propertyKey (Optional) The property key for the target.
         * @returns The metadata value for the metadata key if found; otherwise, `undefined`.
         * @example
         *
         *     class Example {
         *         // property declarations are not part of ES6, though they are valid in TypeScript:
         *         // static staticProperty;
         *         // property;
         *
         *         constructor(p) { }
         *         static staticMethod(p) { }
         *         method(p) { }
         *     }
         *
         *     // constructor
         *     result = Reflect.getOwnMetadata("custom:annotation", Example);
         *
         *     // property (on constructor)
         *     result = Reflect.getOwnMetadata("custom:annotation", Example, "staticProperty");
         *
         *     // property (on prototype)
         *     result = Reflect.getOwnMetadata("custom:annotation", Example.prototype, "property");
         *
         *     // method (on constructor)
         *     result = Reflect.getOwnMetadata("custom:annotation", Example, "staticMethod");
         *
         *     // method (on prototype)
         *     result = Reflect.getOwnMetadata("custom:annotation", Example.prototype, "method");
         *
         */
        function getOwnMetadata(metadataKey, target, propertyKey) {
            if (!IsObject(target))
                throw new TypeError();
            if (!IsUndefined(propertyKey))
                propertyKey = ToPropertyKey(propertyKey);
            return OrdinaryGetOwnMetadata(metadataKey, target, propertyKey);
        }
        exporter("getOwnMetadata", getOwnMetadata);
        /**
         * Gets the metadata keys defined on the target object or its prototype chain.
         * @param target The target object on which the metadata is defined.
         * @param propertyKey (Optional) The property key for the target.
         * @returns An array of unique metadata keys.
         * @example
         *
         *     class Example {
         *         // property declarations are not part of ES6, though they are valid in TypeScript:
         *         // static staticProperty;
         *         // property;
         *
         *         constructor(p) { }
         *         static staticMethod(p) { }
         *         method(p) { }
         *     }
         *
         *     // constructor
         *     result = Reflect.getMetadataKeys(Example);
         *
         *     // property (on constructor)
         *     result = Reflect.getMetadataKeys(Example, "staticProperty");
         *
         *     // property (on prototype)
         *     result = Reflect.getMetadataKeys(Example.prototype, "property");
         *
         *     // method (on constructor)
         *     result = Reflect.getMetadataKeys(Example, "staticMethod");
         *
         *     // method (on prototype)
         *     result = Reflect.getMetadataKeys(Example.prototype, "method");
         *
         */
        function getMetadataKeys(target, propertyKey) {
            if (!IsObject(target))
                throw new TypeError();
            if (!IsUndefined(propertyKey))
                propertyKey = ToPropertyKey(propertyKey);
            return OrdinaryMetadataKeys(target, propertyKey);
        }
        exporter("getMetadataKeys", getMetadataKeys);
        /**
         * Gets the unique metadata keys defined on the target object.
         * @param target The target object on which the metadata is defined.
         * @param propertyKey (Optional) The property key for the target.
         * @returns An array of unique metadata keys.
         * @example
         *
         *     class Example {
         *         // property declarations are not part of ES6, though they are valid in TypeScript:
         *         // static staticProperty;
         *         // property;
         *
         *         constructor(p) { }
         *         static staticMethod(p) { }
         *         method(p) { }
         *     }
         *
         *     // constructor
         *     result = Reflect.getOwnMetadataKeys(Example);
         *
         *     // property (on constructor)
         *     result = Reflect.getOwnMetadataKeys(Example, "staticProperty");
         *
         *     // property (on prototype)
         *     result = Reflect.getOwnMetadataKeys(Example.prototype, "property");
         *
         *     // method (on constructor)
         *     result = Reflect.getOwnMetadataKeys(Example, "staticMethod");
         *
         *     // method (on prototype)
         *     result = Reflect.getOwnMetadataKeys(Example.prototype, "method");
         *
         */
        function getOwnMetadataKeys(target, propertyKey) {
            if (!IsObject(target))
                throw new TypeError();
            if (!IsUndefined(propertyKey))
                propertyKey = ToPropertyKey(propertyKey);
            return OrdinaryOwnMetadataKeys(target, propertyKey);
        }
        exporter("getOwnMetadataKeys", getOwnMetadataKeys);
        /**
         * Deletes the metadata entry from the target object with the provided key.
         * @param metadataKey A key used to store and retrieve metadata.
         * @param target The target object on which the metadata is defined.
         * @param propertyKey (Optional) The property key for the target.
         * @returns `true` if the metadata entry was found and deleted; otherwise, false.
         * @example
         *
         *     class Example {
         *         // property declarations are not part of ES6, though they are valid in TypeScript:
         *         // static staticProperty;
         *         // property;
         *
         *         constructor(p) { }
         *         static staticMethod(p) { }
         *         method(p) { }
         *     }
         *
         *     // constructor
         *     result = Reflect.deleteMetadata("custom:annotation", Example);
         *
         *     // property (on constructor)
         *     result = Reflect.deleteMetadata("custom:annotation", Example, "staticProperty");
         *
         *     // property (on prototype)
         *     result = Reflect.deleteMetadata("custom:annotation", Example.prototype, "property");
         *
         *     // method (on constructor)
         *     result = Reflect.deleteMetadata("custom:annotation", Example, "staticMethod");
         *
         *     // method (on prototype)
         *     result = Reflect.deleteMetadata("custom:annotation", Example.prototype, "method");
         *
         */
        function deleteMetadata(metadataKey, target, propertyKey) {
            if (!IsObject(target))
                throw new TypeError();
            if (!IsUndefined(propertyKey))
                propertyKey = ToPropertyKey(propertyKey);
            var metadataMap = GetOrCreateMetadataMap(target, propertyKey, /*Create*/ false);
            if (IsUndefined(metadataMap))
                return false;
            if (!metadataMap.delete(metadataKey))
                return false;
            if (metadataMap.size > 0)
                return true;
            var targetMetadata = Metadata.get(target);
            targetMetadata.delete(propertyKey);
            if (targetMetadata.size > 0)
                return true;
            Metadata.delete(target);
            return true;
        }
        exporter("deleteMetadata", deleteMetadata);
        function DecorateConstructor(decorators, target) {
            for (var i = decorators.length - 1; i >= 0; --i) {
                var decorator = decorators[i];
                var decorated = decorator(target);
                if (!IsUndefined(decorated) && !IsNull(decorated)) {
                    if (!IsConstructor(decorated))
                        throw new TypeError();
                    target = decorated;
                }
            }
            return target;
        }
        function DecorateProperty(decorators, target, propertyKey, descriptor) {
            for (var i = decorators.length - 1; i >= 0; --i) {
                var decorator = decorators[i];
                var decorated = decorator(target, propertyKey, descriptor);
                if (!IsUndefined(decorated) && !IsNull(decorated)) {
                    if (!IsObject(decorated))
                        throw new TypeError();
                    descriptor = decorated;
                }
            }
            return descriptor;
        }
        function GetOrCreateMetadataMap(O, P, Create) {
            var targetMetadata = Metadata.get(O);
            if (IsUndefined(targetMetadata)) {
                if (!Create)
                    return undefined;
                targetMetadata = new _Map();
                Metadata.set(O, targetMetadata);
            }
            var metadataMap = targetMetadata.get(P);
            if (IsUndefined(metadataMap)) {
                if (!Create)
                    return undefined;
                metadataMap = new _Map();
                targetMetadata.set(P, metadataMap);
            }
            return metadataMap;
        }
        // 3.1.1.1 OrdinaryHasMetadata(MetadataKey, O, P)
        // https://rbuckton.github.io/reflect-metadata/#ordinaryhasmetadata
        function OrdinaryHasMetadata(MetadataKey, O, P) {
            var hasOwn = OrdinaryHasOwnMetadata(MetadataKey, O, P);
            if (hasOwn)
                return true;
            var parent = OrdinaryGetPrototypeOf(O);
            if (!IsNull(parent))
                return OrdinaryHasMetadata(MetadataKey, parent, P);
            return false;
        }
        // 3.1.2.1 OrdinaryHasOwnMetadata(MetadataKey, O, P)
        // https://rbuckton.github.io/reflect-metadata/#ordinaryhasownmetadata
        function OrdinaryHasOwnMetadata(MetadataKey, O, P) {
            var metadataMap = GetOrCreateMetadataMap(O, P, /*Create*/ false);
            if (IsUndefined(metadataMap))
                return false;
            return ToBoolean(metadataMap.has(MetadataKey));
        }
        // 3.1.3.1 OrdinaryGetMetadata(MetadataKey, O, P)
        // https://rbuckton.github.io/reflect-metadata/#ordinarygetmetadata
        function OrdinaryGetMetadata(MetadataKey, O, P) {
            var hasOwn = OrdinaryHasOwnMetadata(MetadataKey, O, P);
            if (hasOwn)
                return OrdinaryGetOwnMetadata(MetadataKey, O, P);
            var parent = OrdinaryGetPrototypeOf(O);
            if (!IsNull(parent))
                return OrdinaryGetMetadata(MetadataKey, parent, P);
            return undefined;
        }
        // 3.1.4.1 OrdinaryGetOwnMetadata(MetadataKey, O, P)
        // https://rbuckton.github.io/reflect-metadata/#ordinarygetownmetadata
        function OrdinaryGetOwnMetadata(MetadataKey, O, P) {
            var metadataMap = GetOrCreateMetadataMap(O, P, /*Create*/ false);
            if (IsUndefined(metadataMap))
                return undefined;
            return metadataMap.get(MetadataKey);
        }
        // 3.1.5.1 OrdinaryDefineOwnMetadata(MetadataKey, MetadataValue, O, P)
        // https://rbuckton.github.io/reflect-metadata/#ordinarydefineownmetadata
        function OrdinaryDefineOwnMetadata(MetadataKey, MetadataValue, O, P) {
            var metadataMap = GetOrCreateMetadataMap(O, P, /*Create*/ true);
            metadataMap.set(MetadataKey, MetadataValue);
        }
        // 3.1.6.1 OrdinaryMetadataKeys(O, P)
        // https://rbuckton.github.io/reflect-metadata/#ordinarymetadatakeys
        function OrdinaryMetadataKeys(O, P) {
            var ownKeys = OrdinaryOwnMetadataKeys(O, P);
            var parent = OrdinaryGetPrototypeOf(O);
            if (parent === null)
                return ownKeys;
            var parentKeys = OrdinaryMetadataKeys(parent, P);
            if (parentKeys.length <= 0)
                return ownKeys;
            if (ownKeys.length <= 0)
                return parentKeys;
            var set = new _Set();
            var keys = [];
            for (var _i = 0, ownKeys_1 = ownKeys; _i < ownKeys_1.length; _i++) {
                var key = ownKeys_1[_i];
                var hasKey = set.has(key);
                if (!hasKey) {
                    set.add(key);
                    keys.push(key);
                }
            }
            for (var _a = 0, parentKeys_1 = parentKeys; _a < parentKeys_1.length; _a++) {
                var key = parentKeys_1[_a];
                var hasKey = set.has(key);
                if (!hasKey) {
                    set.add(key);
                    keys.push(key);
                }
            }
            return keys;
        }
        // 3.1.7.1 OrdinaryOwnMetadataKeys(O, P)
        // https://rbuckton.github.io/reflect-metadata/#ordinaryownmetadatakeys
        function OrdinaryOwnMetadataKeys(O, P) {
            var keys = [];
            var metadataMap = GetOrCreateMetadataMap(O, P, /*Create*/ false);
            if (IsUndefined(metadataMap))
                return keys;
            var keysObj = metadataMap.keys();
            var iterator = GetIterator(keysObj);
            var k = 0;
            while (true) {
                var next = IteratorStep(iterator);
                if (!next) {
                    keys.length = k;
                    return keys;
                }
                var nextValue = IteratorValue(next);
                try {
                    keys[k] = nextValue;
                }
                catch (e) {
                    try {
                        IteratorClose(iterator);
                    }
                    finally {
                        throw e;
                    }
                }
                k++;
            }
        }
        // 6 ECMAScript Data Typ0es and Values
        // https://tc39.github.io/ecma262/#sec-ecmascript-data-types-and-values
        function Type(x) {
            if (x === null)
                return 1 /* Null */;
            switch (typeof x) {
                case "undefined": return 0 /* Undefined */;
                case "boolean": return 2 /* Boolean */;
                case "string": return 3 /* String */;
                case "symbol": return 4 /* Symbol */;
                case "number": return 5 /* Number */;
                case "object": return x === null ? 1 /* Null */ : 6 /* Object */;
                default: return 6 /* Object */;
            }
        }
        // 6.1.1 The Undefined Type
        // https://tc39.github.io/ecma262/#sec-ecmascript-language-types-undefined-type
        function IsUndefined(x) {
            return x === undefined;
        }
        // 6.1.2 The Null Type
        // https://tc39.github.io/ecma262/#sec-ecmascript-language-types-null-type
        function IsNull(x) {
            return x === null;
        }
        // 6.1.5 The Symbol Type
        // https://tc39.github.io/ecma262/#sec-ecmascript-language-types-symbol-type
        function IsSymbol(x) {
            return typeof x === "symbol";
        }
        // 6.1.7 The Object Type
        // https://tc39.github.io/ecma262/#sec-object-type
        function IsObject(x) {
            return typeof x === "object" ? x !== null : typeof x === "function";
        }
        // 7.1 Type Conversion
        // https://tc39.github.io/ecma262/#sec-type-conversion
        // 7.1.1 ToPrimitive(input [, PreferredType])
        // https://tc39.github.io/ecma262/#sec-toprimitive
        function ToPrimitive(input, PreferredType) {
            switch (Type(input)) {
                case 0 /* Undefined */: return input;
                case 1 /* Null */: return input;
                case 2 /* Boolean */: return input;
                case 3 /* String */: return input;
                case 4 /* Symbol */: return input;
                case 5 /* Number */: return input;
            }
            var hint = PreferredType === 3 /* String */ ? "string" : PreferredType === 5 /* Number */ ? "number" : "default";
            var exoticToPrim = GetMethod(input, toPrimitiveSymbol);
            if (exoticToPrim !== undefined) {
                var result = exoticToPrim.call(input, hint);
                if (IsObject(result))
                    throw new TypeError();
                return result;
            }
            return OrdinaryToPrimitive(input, hint === "default" ? "number" : hint);
        }
        // 7.1.1.1 OrdinaryToPrimitive(O, hint)
        // https://tc39.github.io/ecma262/#sec-ordinarytoprimitive
        function OrdinaryToPrimitive(O, hint) {
            if (hint === "string") {
                var toString_1 = O.toString;
                if (IsCallable(toString_1)) {
                    var result = toString_1.call(O);
                    if (!IsObject(result))
                        return result;
                }
                var valueOf = O.valueOf;
                if (IsCallable(valueOf)) {
                    var result = valueOf.call(O);
                    if (!IsObject(result))
                        return result;
                }
            }
            else {
                var valueOf = O.valueOf;
                if (IsCallable(valueOf)) {
                    var result = valueOf.call(O);
                    if (!IsObject(result))
                        return result;
                }
                var toString_2 = O.toString;
                if (IsCallable(toString_2)) {
                    var result = toString_2.call(O);
                    if (!IsObject(result))
                        return result;
                }
            }
            throw new TypeError();
        }
        // 7.1.2 ToBoolean(argument)
        // https://tc39.github.io/ecma262/2016/#sec-toboolean
        function ToBoolean(argument) {
            return !!argument;
        }
        // 7.1.12 ToString(argument)
        // https://tc39.github.io/ecma262/#sec-tostring
        function ToString(argument) {
            return "" + argument;
        }
        // 7.1.14 ToPropertyKey(argument)
        // https://tc39.github.io/ecma262/#sec-topropertykey
        function ToPropertyKey(argument) {
            var key = ToPrimitive(argument, 3 /* String */);
            if (IsSymbol(key))
                return key;
            return ToString(key);
        }
        // 7.2 Testing and Comparison Operations
        // https://tc39.github.io/ecma262/#sec-testing-and-comparison-operations
        // 7.2.2 IsArray(argument)
        // https://tc39.github.io/ecma262/#sec-isarray
        function IsArray(argument) {
            return Array.isArray
                ? Array.isArray(argument)
                : argument instanceof Object
                    ? argument instanceof Array
                    : Object.prototype.toString.call(argument) === "[object Array]";
        }
        // 7.2.3 IsCallable(argument)
        // https://tc39.github.io/ecma262/#sec-iscallable
        function IsCallable(argument) {
            // NOTE: This is an approximation as we cannot check for [[Call]] internal method.
            return typeof argument === "function";
        }
        // 7.2.4 IsConstructor(argument)
        // https://tc39.github.io/ecma262/#sec-isconstructor
        function IsConstructor(argument) {
            // NOTE: This is an approximation as we cannot check for [[Construct]] internal method.
            return typeof argument === "function";
        }
        // 7.2.7 IsPropertyKey(argument)
        // https://tc39.github.io/ecma262/#sec-ispropertykey
        function IsPropertyKey(argument) {
            switch (Type(argument)) {
                case 3 /* String */: return true;
                case 4 /* Symbol */: return true;
                default: return false;
            }
        }
        // 7.3 Operations on Objects
        // https://tc39.github.io/ecma262/#sec-operations-on-objects
        // 7.3.9 GetMethod(V, P)
        // https://tc39.github.io/ecma262/#sec-getmethod
        function GetMethod(V, P) {
            var func = V[P];
            if (func === undefined || func === null)
                return undefined;
            if (!IsCallable(func))
                throw new TypeError();
            return func;
        }
        // 7.4 Operations on Iterator Objects
        // https://tc39.github.io/ecma262/#sec-operations-on-iterator-objects
        function GetIterator(obj) {
            var method = GetMethod(obj, iteratorSymbol);
            if (!IsCallable(method))
                throw new TypeError(); // from Call
            var iterator = method.call(obj);
            if (!IsObject(iterator))
                throw new TypeError();
            return iterator;
        }
        // 7.4.4 IteratorValue(iterResult)
        // https://tc39.github.io/ecma262/2016/#sec-iteratorvalue
        function IteratorValue(iterResult) {
            return iterResult.value;
        }
        // 7.4.5 IteratorStep(iterator)
        // https://tc39.github.io/ecma262/#sec-iteratorstep
        function IteratorStep(iterator) {
            var result = iterator.next();
            return result.done ? false : result;
        }
        // 7.4.6 IteratorClose(iterator, completion)
        // https://tc39.github.io/ecma262/#sec-iteratorclose
        function IteratorClose(iterator) {
            var f = iterator["return"];
            if (f)
                f.call(iterator);
        }
        // 9.1 Ordinary Object Internal Methods and Internal Slots
        // https://tc39.github.io/ecma262/#sec-ordinary-object-internal-methods-and-internal-slots
        // 9.1.1.1 OrdinaryGetPrototypeOf(O)
        // https://tc39.github.io/ecma262/#sec-ordinarygetprototypeof
        function OrdinaryGetPrototypeOf(O) {
            var proto = Object.getPrototypeOf(O);
            if (typeof O !== "function" || O === functionPrototype)
                return proto;
            // TypeScript doesn't set __proto__ in ES5, as it's non-standard.
            // Try to determine the superclass constructor. Compatible implementations
            // must either set __proto__ on a subclass constructor to the superclass constructor,
            // or ensure each class has a valid `constructor` property on its prototype that
            // points back to the constructor.
            // If this is not the same as Function.[[Prototype]], then this is definately inherited.
            // This is the case when in ES6 or when using __proto__ in a compatible browser.
            if (proto !== functionPrototype)
                return proto;
            // If the super prototype is Object.prototype, null, or undefined, then we cannot determine the heritage.
            var prototype = O.prototype;
            var prototypeProto = prototype && Object.getPrototypeOf(prototype);
            if (prototypeProto == null || prototypeProto === Object.prototype)
                return proto;
            // If the constructor was not a function, then we cannot determine the heritage.
            var constructor = prototypeProto.constructor;
            if (typeof constructor !== "function")
                return proto;
            // If we have some kind of self-reference, then we cannot determine the heritage.
            if (constructor === O)
                return proto;
            // we have a pretty good guess at the heritage.
            return constructor;
        }
        // naive Map shim
        function CreateMapPolyfill() {
            var cacheSentinel = {};
            var arraySentinel = [];
            var MapIterator = /** @class */ (function () {
                function MapIterator(keys, values, selector) {
                    this._index = 0;
                    this._keys = keys;
                    this._values = values;
                    this._selector = selector;
                }
                MapIterator.prototype["@@iterator"] = function () { return this; };
                MapIterator.prototype[iteratorSymbol] = function () { return this; };
                MapIterator.prototype.next = function () {
                    var index = this._index;
                    if (index >= 0 && index < this._keys.length) {
                        var result = this._selector(this._keys[index], this._values[index]);
                        if (index + 1 >= this._keys.length) {
                            this._index = -1;
                            this._keys = arraySentinel;
                            this._values = arraySentinel;
                        }
                        else {
                            this._index++;
                        }
                        return { value: result, done: false };
                    }
                    return { value: undefined, done: true };
                };
                MapIterator.prototype.throw = function (error) {
                    if (this._index >= 0) {
                        this._index = -1;
                        this._keys = arraySentinel;
                        this._values = arraySentinel;
                    }
                    throw error;
                };
                MapIterator.prototype.return = function (value) {
                    if (this._index >= 0) {
                        this._index = -1;
                        this._keys = arraySentinel;
                        this._values = arraySentinel;
                    }
                    return { value: value, done: true };
                };
                return MapIterator;
            }());
            return /** @class */ (function () {
                function Map() {
                    this._keys = [];
                    this._values = [];
                    this._cacheKey = cacheSentinel;
                    this._cacheIndex = -2;
                }
                Object.defineProperty(Map.prototype, "size", {
                    get: function () { return this._keys.length; },
                    enumerable: true,
                    configurable: true
                });
                Map.prototype.has = function (key) { return this._find(key, /*insert*/ false) >= 0; };
                Map.prototype.get = function (key) {
                    var index = this._find(key, /*insert*/ false);
                    return index >= 0 ? this._values[index] : undefined;
                };
                Map.prototype.set = function (key, value) {
                    var index = this._find(key, /*insert*/ true);
                    this._values[index] = value;
                    return this;
                };
                Map.prototype.delete = function (key) {
                    var index = this._find(key, /*insert*/ false);
                    if (index >= 0) {
                        var size = this._keys.length;
                        for (var i = index + 1; i < size; i++) {
                            this._keys[i - 1] = this._keys[i];
                            this._values[i - 1] = this._values[i];
                        }
                        this._keys.length--;
                        this._values.length--;
                        if (key === this._cacheKey) {
                            this._cacheKey = cacheSentinel;
                            this._cacheIndex = -2;
                        }
                        return true;
                    }
                    return false;
                };
                Map.prototype.clear = function () {
                    this._keys.length = 0;
                    this._values.length = 0;
                    this._cacheKey = cacheSentinel;
                    this._cacheIndex = -2;
                };
                Map.prototype.keys = function () { return new MapIterator(this._keys, this._values, getKey); };
                Map.prototype.values = function () { return new MapIterator(this._keys, this._values, getValue); };
                Map.prototype.entries = function () { return new MapIterator(this._keys, this._values, getEntry); };
                Map.prototype["@@iterator"] = function () { return this.entries(); };
                Map.prototype[iteratorSymbol] = function () { return this.entries(); };
                Map.prototype._find = function (key, insert) {
                    if (this._cacheKey !== key) {
                        this._cacheIndex = this._keys.indexOf(this._cacheKey = key);
                    }
                    if (this._cacheIndex < 0 && insert) {
                        this._cacheIndex = this._keys.length;
                        this._keys.push(key);
                        this._values.push(undefined);
                    }
                    return this._cacheIndex;
                };
                return Map;
            }());
            function getKey(key, _) {
                return key;
            }
            function getValue(_, value) {
                return value;
            }
            function getEntry(key, value) {
                return [key, value];
            }
        }
        // naive Set shim
        function CreateSetPolyfill() {
            return /** @class */ (function () {
                function Set() {
                    this._map = new _Map();
                }
                Object.defineProperty(Set.prototype, "size", {
                    get: function () { return this._map.size; },
                    enumerable: true,
                    configurable: true
                });
                Set.prototype.has = function (value) { return this._map.has(value); };
                Set.prototype.add = function (value) { return this._map.set(value, value), this; };
                Set.prototype.delete = function (value) { return this._map.delete(value); };
                Set.prototype.clear = function () { this._map.clear(); };
                Set.prototype.keys = function () { return this._map.keys(); };
                Set.prototype.values = function () { return this._map.values(); };
                Set.prototype.entries = function () { return this._map.entries(); };
                Set.prototype["@@iterator"] = function () { return this.keys(); };
                Set.prototype[iteratorSymbol] = function () { return this.keys(); };
                return Set;
            }());
        }
        // naive WeakMap shim
        function CreateWeakMapPolyfill() {
            var UUID_SIZE = 16;
            var keys = HashMap.create();
            var rootKey = CreateUniqueKey();
            return /** @class */ (function () {
                function WeakMap() {
                    this._key = CreateUniqueKey();
                }
                WeakMap.prototype.has = function (target) {
                    var table = GetOrCreateWeakMapTable(target, /*create*/ false);
                    return table !== undefined ? HashMap.has(table, this._key) : false;
                };
                WeakMap.prototype.get = function (target) {
                    var table = GetOrCreateWeakMapTable(target, /*create*/ false);
                    return table !== undefined ? HashMap.get(table, this._key) : undefined;
                };
                WeakMap.prototype.set = function (target, value) {
                    var table = GetOrCreateWeakMapTable(target, /*create*/ true);
                    table[this._key] = value;
                    return this;
                };
                WeakMap.prototype.delete = function (target) {
                    var table = GetOrCreateWeakMapTable(target, /*create*/ false);
                    return table !== undefined ? delete table[this._key] : false;
                };
                WeakMap.prototype.clear = function () {
                    // NOTE: not a real clear, just makes the previous data unreachable
                    this._key = CreateUniqueKey();
                };
                return WeakMap;
            }());
            function CreateUniqueKey() {
                var key;
                do
                    key = "@@WeakMap@@" + CreateUUID();
                while (HashMap.has(keys, key));
                keys[key] = true;
                return key;
            }
            function GetOrCreateWeakMapTable(target, create) {
                if (!hasOwn.call(target, rootKey)) {
                    if (!create)
                        return undefined;
                    Object.defineProperty(target, rootKey, { value: HashMap.create() });
                }
                return target[rootKey];
            }
            function FillRandomBytes(buffer, size) {
                for (var i = 0; i < size; ++i)
                    buffer[i] = Math.random() * 0xff | 0;
                return buffer;
            }
            function GenRandomBytes(size) {
                if (typeof Uint8Array === "function") {
                    if (typeof crypto !== "undefined")
                        return crypto.getRandomValues(new Uint8Array(size));
                    if (typeof msCrypto !== "undefined")
                        return msCrypto.getRandomValues(new Uint8Array(size));
                    return FillRandomBytes(new Uint8Array(size), size);
                }
                return FillRandomBytes(new Array(size), size);
            }
            function CreateUUID() {
                var data = GenRandomBytes(UUID_SIZE);
                // mark as random - RFC 4122 § 4.4
                data[6] = data[6] & 0x4f | 0x40;
                data[8] = data[8] & 0xbf | 0x80;
                var result = "";
                for (var offset = 0; offset < UUID_SIZE; ++offset) {
                    var byte = data[offset];
                    if (offset === 4 || offset === 6 || offset === 8)
                        result += "-";
                    if (byte < 16)
                        result += "0";
                    result += byte.toString(16).toLowerCase();
                }
                return result;
            }
        }
        // uses a heuristic used by v8 and chakra to force an object into dictionary mode.
        function MakeDictionary(obj) {
            obj.__ = undefined;
            delete obj.__;
            return obj;
        }
    });
})(Reflect$1 || (Reflect$1 = {}));

/*! *****************************************************************************
Copyright (c) Microsoft Corporation.

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
PERFORMANCE OF THIS SOFTWARE.
***************************************************************************** */

function __awaiter(thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
}

function __classPrivateFieldGet(receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
}

function __classPrivateFieldSet(receiver, state, value, kind, f) {
    if (kind === "m") throw new TypeError("Private method is not writable");
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a setter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
    return (kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value)), value;
}

var _Field_field;
const isFieldData = (val) => val && val.type !== undefined;
const isIField = (val) => val && val instanceof Field; //&& typeof val.serialize === 'function'
class Field {
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

var isMergeableObject = function isMergeableObject(value) {
	return isNonNullObject(value)
		&& !isSpecial(value)
};

function isNonNullObject(value) {
	return !!value && typeof value === 'object'
}

function isSpecial(value) {
	var stringValue = Object.prototype.toString.call(value);

	return stringValue === '[object RegExp]'
		|| stringValue === '[object Date]'
		|| isReactElement(value)
}

// see https://github.com/facebook/react/blob/b5ac963fb791d1298e7f396236383bc955f916c1/src/isomorphic/classic/element/ReactElement.js#L21-L25
var canUseSymbol = typeof Symbol === 'function' && Symbol.for;
var REACT_ELEMENT_TYPE = canUseSymbol ? Symbol.for('react.element') : 0xeac7;

function isReactElement(value) {
	return value.$$typeof === REACT_ELEMENT_TYPE
}

function emptyTarget(val) {
	return Array.isArray(val) ? [] : {}
}

function cloneUnlessOtherwiseSpecified(value, options) {
	return (options.clone !== false && options.isMergeableObject(value))
		? deepmerge(emptyTarget(value), value, options)
		: value
}

function defaultArrayMerge(target, source, options) {
	return target.concat(source).map(function(element) {
		return cloneUnlessOtherwiseSpecified(element, options)
	})
}

function getMergeFunction(key, options) {
	if (!options.customMerge) {
		return deepmerge
	}
	var customMerge = options.customMerge(key);
	return typeof customMerge === 'function' ? customMerge : deepmerge
}

function getEnumerableOwnPropertySymbols(target) {
	return Object.getOwnPropertySymbols
		? Object.getOwnPropertySymbols(target).filter(function(symbol) {
			return target.propertyIsEnumerable(symbol)
		})
		: []
}

function getKeys$1(target) {
	return Object.keys(target).concat(getEnumerableOwnPropertySymbols(target))
}

function propertyIsOnObject(object, property) {
	try {
		return property in object
	} catch(_) {
		return false
	}
}

// Protects from prototype poisoning and unexpected merging up the prototype chain.
function propertyIsUnsafe(target, key) {
	return propertyIsOnObject(target, key) // Properties are safe to merge if they don't exist in the target yet,
		&& !(Object.hasOwnProperty.call(target, key) // unsafe if they exist up the prototype chain,
			&& Object.propertyIsEnumerable.call(target, key)) // and also unsafe if they're nonenumerable.
}

function mergeObject(target, source, options) {
	var destination = {};
	if (options.isMergeableObject(target)) {
		getKeys$1(target).forEach(function(key) {
			destination[key] = cloneUnlessOtherwiseSpecified(target[key], options);
		});
	}
	getKeys$1(source).forEach(function(key) {
		if (propertyIsUnsafe(target, key)) {
			return
		}

		if (propertyIsOnObject(target, key) && options.isMergeableObject(source[key])) {
			destination[key] = getMergeFunction(key, options)(target[key], source[key], options);
		} else {
			destination[key] = cloneUnlessOtherwiseSpecified(source[key], options);
		}
	});
	return destination
}

function deepmerge(target, source, options) {
	options = options || {};
	options.arrayMerge = options.arrayMerge || defaultArrayMerge;
	options.isMergeableObject = options.isMergeableObject || isMergeableObject;
	// cloneUnlessOtherwiseSpecified is added to `options` so that custom arrayMerge()
	// implementations can use it. The caller may not replace it.
	options.cloneUnlessOtherwiseSpecified = cloneUnlessOtherwiseSpecified;

	var sourceIsArray = Array.isArray(source);
	var targetIsArray = Array.isArray(target);
	var sourceAndTargetTypesMatch = sourceIsArray === targetIsArray;

	if (!sourceAndTargetTypesMatch) {
		return cloneUnlessOtherwiseSpecified(source, options)
	} else if (sourceIsArray) {
		return options.arrayMerge(target, source, options)
	} else {
		return mergeObject(target, source, options)
	}
}

deepmerge.all = function deepmergeAll(array, options) {
	if (!Array.isArray(array)) {
		throw new Error('first argument should be an array')
	}

	return array.reduce(function(prev, next) {
		return deepmerge(prev, next, options)
	}, {})
};

var deepmerge_1 = deepmerge;

var cjs = deepmerge_1;

class Str {
    static random(length = 15) {
        let text = '';
        const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        for (let i = 0; i < length; i++) {
            text += possible.charAt(Math.floor(Math.random() * possible.length));
        }
        return text;
    }
    static ensureLeft(str, left) {
        if (false === str.startsWith(left)) {
            return left + str;
        }
        return str;
    }
    static ensureRight(str, right) {
        if (false === str.endsWith(right)) {
            return str + right;
        }
        return str;
    }
    static stripLeft(str, left) {
        if (str.startsWith(left)) {
            return str.substr(left.length);
        }
        return str;
    }
    static stripRight(str, right) {
        if (str.endsWith(right)) {
            return str.substr(0, str.length - right.length);
        }
        return str;
    }
    static ucfirst(string) {
        return string[0].toUpperCase() + string.slice(1);
    }
    static lcfirst(string) {
        return string[0].toLowerCase() + string.slice(1);
    }
    static parameters(str, params) {
        Object.entries(params).forEach(([key, value]) => str = str.replace(new RegExp(':' + key, 'g'), value));
        return str;
    }
}
/**
 *
 * @param obj
 * @param k
 * @param v
 * @example
 *
 * params = Object.entries(params).filter(([ key, value ]) => {
 *     return value.toString().length > 0;
 * }).reduce(utils.objectify, {});
 *
 */
const objectify = (obj, [k, v]) => (Object.assign(Object.assign({}, obj), { [k]: v }));
class Obj {
    static merge(...objs) {
        objs.unshift({});
        return cjs.all(objs, { clone: true });
    }
    static clone(obj) {
        return cjs({}, obj, { clone: true });
    }
    static exclude(obj, keys) {
        obj = this.clone(obj);
        for (let key of keys) {
            delete obj[key];
        }
        return obj;
    }
}

var _Entry_stream, _Entry_data, _Entry_fresh;
class Entry {
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

var dist = {exports: {}};

var symbol_iterator = function SymbolIterator() {
  var _this = this;

  var index = -1;

  return {
    next: function next() {
      index += 1;

      return {
        value: _this.items[index],
        done: index >= _this.items.length
      };
    }
  };
};

var all = function all() {
  return this.items;
};

var _typeof$b = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var is = {
  /**
   * @returns {boolean}
   */
  isArray: function isArray(item) {
    return Array.isArray(item);
  },

  /**
   * @returns {boolean}
   */
  isObject: function isObject(item) {
    return (typeof item === 'undefined' ? 'undefined' : _typeof$b(item)) === 'object' && Array.isArray(item) === false && item !== null;
  },

  /**
   * @returns {boolean}
   */
  isFunction: function isFunction(item) {
    return typeof item === 'function';
  }
};

var _require$k = is,
    isFunction$g = _require$k.isFunction;

var average$1 = function average(key) {
  if (key === undefined) {
    return this.sum() / this.items.length;
  }

  if (isFunction$g(key)) {
    return new this.constructor(this.items).sum(key) / this.items.length;
  }

  return new this.constructor(this.items).pluck(key).sum() / this.items.length;
};

var average = average$1;

var avg = average;

var _typeof$a = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var chunk = function chunk(size) {
  var _this = this;

  var chunks = [];
  var index = 0;

  if (Array.isArray(this.items)) {
    do {
      var items = this.items.slice(index, index + size);
      var collection = new this.constructor(items);

      chunks.push(collection);
      index += size;
    } while (index < this.items.length);
  } else if (_typeof$a(this.items) === 'object') {
    var keys = Object.keys(this.items);

    var _loop = function _loop() {
      var keysOfChunk = keys.slice(index, index + size);
      var collection = new _this.constructor({});

      keysOfChunk.forEach(function (key) {
        return collection.put(key, _this.items[key]);
      });

      chunks.push(collection);
      index += size;
    };

    do {
      _loop();
    } while (index < keys.length);
  } else {
    chunks.push(new this.constructor([this.items]));
  }

  return new this.constructor(chunks);
};

function _toConsumableArray$7(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

var collapse = function collapse() {
  var _ref;

  return new this.constructor((_ref = []).concat.apply(_ref, _toConsumableArray$7(this.items)));
};

var _slicedToArray$3 = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _typeof$9 = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var combine = function combine(array) {
  var _this = this;

  var values = array;

  if (values instanceof this.constructor) {
    values = array.all();
  }

  var collection = {};

  if (Array.isArray(this.items) && Array.isArray(values)) {
    this.items.forEach(function (key, iterator) {
      collection[key] = values[iterator];
    });
  } else if (_typeof$9(this.items) === 'object' && (typeof values === 'undefined' ? 'undefined' : _typeof$9(values)) === 'object') {
    Object.keys(this.items).forEach(function (key, index) {
      collection[_this.items[key]] = values[Object.keys(values)[index]];
    });
  } else if (Array.isArray(this.items)) {
    collection[this.items[0]] = values;
  } else if (typeof this.items === 'string' && Array.isArray(values)) {
    var _values = values;

    var _values2 = _slicedToArray$3(_values, 1);

    collection[this.items] = _values2[0];
  } else if (typeof this.items === 'string') {
    collection[this.items] = values;
  }

  return new this.constructor(collection);
};

/**
 * Clone helper
 *
 * Clone an array or object
 *
 * @param items
 * @returns {*}
 */

function _toConsumableArray$6(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

var clone$2 = function clone(items) {
  var cloned = void 0;

  if (Array.isArray(items)) {
    var _cloned;

    cloned = [];

    (_cloned = cloned).push.apply(_cloned, _toConsumableArray$6(items));
  } else {
    cloned = {};

    Object.keys(items).forEach(function (prop) {
      cloned[prop] = items[prop];
    });
  }

  return cloned;
};

var _typeof$8 = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var clone$1 = clone$2;

var concat = function concat(collectionOrArrayOrObject) {
  var list = collectionOrArrayOrObject;

  if (collectionOrArrayOrObject instanceof this.constructor) {
    list = collectionOrArrayOrObject.all();
  } else if ((typeof collectionOrArrayOrObject === 'undefined' ? 'undefined' : _typeof$8(collectionOrArrayOrObject)) === 'object') {
    list = [];
    Object.keys(collectionOrArrayOrObject).forEach(function (property) {
      list.push(collectionOrArrayOrObject[property]);
    });
  }

  var collection = clone$1(this.items);

  list.forEach(function (item) {
    if ((typeof item === 'undefined' ? 'undefined' : _typeof$8(item)) === 'object') {
      Object.keys(item).forEach(function (key) {
        return collection.push(item[key]);
      });
    } else {
      collection.push(item);
    }
  });

  return new this.constructor(collection);
};

/**
 * Values helper
 *
 * Retrieve values from [this.items] when it is an array, object or Collection
 *
 * @returns {*}
 * @param items
 */

function _toConsumableArray$5(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

var values$8 = function values(items) {
  var valuesArray = [];

  if (Array.isArray(items)) {
    valuesArray.push.apply(valuesArray, _toConsumableArray$5(items));
  } else if (items.constructor.name === 'Collection') {
    valuesArray.push.apply(valuesArray, _toConsumableArray$5(items.all()));
  } else {
    Object.keys(items).forEach(function (prop) {
      return valuesArray.push(items[prop]);
    });
  }

  return valuesArray;
};

function _toConsumableArray$4(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

var values$7 = values$8;

var _require$j = is,
    isFunction$f = _require$j.isFunction;

var contains$1 = function contains(key, value) {
  if (value !== undefined) {
    if (Array.isArray(this.items)) {
      return this.items.filter(function (items) {
        return items[key] !== undefined && items[key] === value;
      }).length > 0;
    }

    return this.items[key] !== undefined && this.items[key] === value;
  }

  if (isFunction$f(key)) {
    return this.items.filter(function (item, index) {
      return key(item, index);
    }).length > 0;
  }

  if (Array.isArray(this.items)) {
    return this.items.indexOf(key) !== -1;
  }

  var keysAndValues = values$7(this.items);
  keysAndValues.push.apply(keysAndValues, _toConsumableArray$4(Object.keys(this.items)));

  return keysAndValues.indexOf(key) !== -1;
};

var count = function count() {
  var arrayLength = 0;

  if (Array.isArray(this.items)) {
    arrayLength = this.items.length;
  }

  return Math.max(Object.keys(this.items).length, arrayLength);
};

var countBy = function countBy() {
  var fn = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : function (value) {
    return value;
  };

  return new this.constructor(this.items).groupBy(fn).map(function (value) {
    return value.count();
  });
};

var crossJoin = function crossJoin() {
  function join(collection, constructor, args) {
    var current = args[0];

    if (current instanceof constructor) {
      current = current.all();
    }

    var rest = args.slice(1);
    var last = !rest.length;
    var result = [];

    for (var i = 0; i < current.length; i += 1) {
      var collectionCopy = collection.slice();
      collectionCopy.push(current[i]);

      if (last) {
        result.push(collectionCopy);
      } else {
        result = result.concat(join(collectionCopy, constructor, rest));
      }
    }

    return result;
  }

  for (var _len = arguments.length, values = Array(_len), _key = 0; _key < _len; _key++) {
    values[_key] = arguments[_key];
  }

  return new this.constructor(join([], this.constructor, [].concat([this.items], values)));
};

var dd = function dd() {
  this.dump();

  if (typeof process !== 'undefined') {
    process.exit(1);
  }
};

var diff = function diff(values) {
  var valuesToDiff = void 0;

  if (values instanceof this.constructor) {
    valuesToDiff = values.all();
  } else {
    valuesToDiff = values;
  }

  var collection = this.items.filter(function (item) {
    return valuesToDiff.indexOf(item) === -1;
  });

  return new this.constructor(collection);
};

var diffAssoc = function diffAssoc(values) {
  var _this = this;

  var diffValues = values;

  if (values instanceof this.constructor) {
    diffValues = values.all();
  }

  var collection = {};

  Object.keys(this.items).forEach(function (key) {
    if (diffValues[key] === undefined || diffValues[key] !== _this.items[key]) {
      collection[key] = _this.items[key];
    }
  });

  return new this.constructor(collection);
};

var diffKeys = function diffKeys(object) {
  var objectToDiff = void 0;

  if (object instanceof this.constructor) {
    objectToDiff = object.all();
  } else {
    objectToDiff = object;
  }

  var objectKeys = Object.keys(objectToDiff);

  var remainingKeys = Object.keys(this.items).filter(function (item) {
    return objectKeys.indexOf(item) === -1;
  });

  return new this.constructor(this.items).only(remainingKeys);
};

var dump = function dump() {
  // eslint-disable-next-line
  console.log(this);

  return this;
};

var _typeof$7 = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var duplicates = function duplicates() {
  var _this = this;

  var occuredValues = [];
  var duplicateValues = {};

  var stringifiedValue = function stringifiedValue(value) {
    if (Array.isArray(value) || (typeof value === 'undefined' ? 'undefined' : _typeof$7(value)) === 'object') {
      return JSON.stringify(value);
    }

    return value;
  };

  if (Array.isArray(this.items)) {
    this.items.forEach(function (value, index) {
      var valueAsString = stringifiedValue(value);

      if (occuredValues.indexOf(valueAsString) === -1) {
        occuredValues.push(valueAsString);
      } else {
        duplicateValues[index] = value;
      }
    });
  } else if (_typeof$7(this.items) === 'object') {
    Object.keys(this.items).forEach(function (key) {
      var valueAsString = stringifiedValue(_this.items[key]);

      if (occuredValues.indexOf(valueAsString) === -1) {
        occuredValues.push(valueAsString);
      } else {
        duplicateValues[key] = _this.items[key];
      }
    });
  }

  return new this.constructor(duplicateValues);
};

var each = function each(fn) {
  var stop = false;

  if (Array.isArray(this.items)) {
    var length = this.items.length;


    for (var index = 0; index < length && !stop; index += 1) {
      stop = fn(this.items[index], index, this.items) === false;
    }
  } else {
    var keys = Object.keys(this.items);
    var _length = keys.length;


    for (var _index = 0; _index < _length && !stop; _index += 1) {
      var key = keys[_index];

      stop = fn(this.items[key], key, this.items) === false;
    }
  }

  return this;
};

function _toConsumableArray$3(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

var eachSpread = function eachSpread(fn) {
  this.each(function (values, key) {
    fn.apply(undefined, _toConsumableArray$3(values).concat([key]));
  });

  return this;
};

var values$6 = values$8;

var every = function every(fn) {
  var items = values$6(this.items);

  return items.every(fn);
};

/**
 * Variadic helper function
 *
 * @param args
 * @returns {Array}
 */

var variadic$4 = function variadic(args) {
  if (Array.isArray(args[0])) {
    return args[0];
  }

  return args;
};

var variadic$3 = variadic$4;

var except = function except() {
  var _this = this;

  for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
    args[_key] = arguments[_key];
  }

  var properties = variadic$3(args);

  if (Array.isArray(this.items)) {
    var _collection = this.items.filter(function (item) {
      return properties.indexOf(item) === -1;
    });

    return new this.constructor(_collection);
  }

  var collection = {};

  Object.keys(this.items).forEach(function (property) {
    if (properties.indexOf(property) === -1) {
      collection[property] = _this.items[property];
    }
  });

  return new this.constructor(collection);
};

var _typeof$6 = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

function falsyValue(item) {
  if (Array.isArray(item)) {
    if (item.length) {
      return false;
    }
  } else if (item !== undefined && item !== null && (typeof item === 'undefined' ? 'undefined' : _typeof$6(item)) === 'object') {
    if (Object.keys(item).length) {
      return false;
    }
  } else if (item) {
    return false;
  }

  return true;
}

function filterObject(func, items) {
  var result = {};
  Object.keys(items).forEach(function (key) {
    if (func) {
      if (func(items[key], key)) {
        result[key] = items[key];
      }
    } else if (!falsyValue(items[key])) {
      result[key] = items[key];
    }
  });

  return result;
}

function filterArray(func, items) {
  if (func) {
    return items.filter(func);
  }
  var result = [];
  for (var i = 0; i < items.length; i += 1) {
    var item = items[i];
    if (!falsyValue(item)) {
      result.push(item);
    }
  }

  return result;
}

var filter = function filter(fn) {
  var func = fn || false;
  var filteredItems = null;
  if (Array.isArray(this.items)) {
    filteredItems = filterArray(func, this.items);
  } else {
    filteredItems = filterObject(func, this.items);
  }

  return new this.constructor(filteredItems);
};

var _require$i = is,
    isFunction$e = _require$i.isFunction;

var first = function first(fn, defaultValue) {
  if (isFunction$e(fn)) {
    for (var i = 0, length = this.items.length; i < length; i += 1) {
      var item = this.items[i];
      if (fn(item)) {
        return item;
      }
    }

    if (isFunction$e(defaultValue)) {
      return defaultValue();
    }

    return defaultValue;
  }

  if (Array.isArray(this.items) && this.items.length || Object.keys(this.items).length) {
    if (Array.isArray(this.items)) {
      return this.items[0];
    }

    var firstKey = Object.keys(this.items)[0];

    return this.items[firstKey];
  }

  if (isFunction$e(defaultValue)) {
    return defaultValue();
  }

  return defaultValue;
};

var firstWhere = function firstWhere(key, operator, value) {
  return this.where(key, operator, value).first() || null;
};

var flatMap = function flatMap(fn) {
  return this.map(fn).collapse();
};

var _require$h = is,
    isArray$9 = _require$h.isArray,
    isObject$a = _require$h.isObject;

var flatten = function flatten(depth) {
  var flattenDepth = depth || Infinity;

  var fullyFlattened = false;
  var collection = [];

  var flat = function flat(items) {
    collection = [];

    if (isArray$9(items)) {
      items.forEach(function (item) {
        if (isArray$9(item)) {
          collection = collection.concat(item);
        } else if (isObject$a(item)) {
          Object.keys(item).forEach(function (property) {
            collection = collection.concat(item[property]);
          });
        } else {
          collection.push(item);
        }
      });
    } else {
      Object.keys(items).forEach(function (property) {
        if (isArray$9(items[property])) {
          collection = collection.concat(items[property]);
        } else if (isObject$a(items[property])) {
          Object.keys(items[property]).forEach(function (prop) {
            collection = collection.concat(items[property][prop]);
          });
        } else {
          collection.push(items[property]);
        }
      });
    }

    fullyFlattened = collection.filter(function (item) {
      return isObject$a(item);
    });
    fullyFlattened = fullyFlattened.length === 0;

    flattenDepth -= 1;
  };

  flat(this.items);

  while (!fullyFlattened && flattenDepth > 0) {
    flat(collection);
  }

  return new this.constructor(collection);
};

var flip = function flip() {
  var _this = this;

  var collection = {};

  if (Array.isArray(this.items)) {
    Object.keys(this.items).forEach(function (key) {
      collection[_this.items[key]] = Number(key);
    });
  } else {
    Object.keys(this.items).forEach(function (key) {
      collection[_this.items[key]] = key;
    });
  }

  return new this.constructor(collection);
};

var forPage = function forPage(page, chunk) {
  var _this = this;

  var collection = {};

  if (Array.isArray(this.items)) {
    collection = this.items.slice(page * chunk - chunk, page * chunk);
  } else {
    Object.keys(this.items).slice(page * chunk - chunk, page * chunk).forEach(function (key) {
      collection[key] = _this.items[key];
    });
  }

  return new this.constructor(collection);
};

var forget = function forget(key) {
  if (Array.isArray(this.items)) {
    this.items.splice(key, 1);
  } else {
    delete this.items[key];
  }

  return this;
};

var _require$g = is,
    isFunction$d = _require$g.isFunction;

var get = function get(key) {
  var defaultValue = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;

  if (this.items[key] !== undefined) {
    return this.items[key];
  }

  if (isFunction$d(defaultValue)) {
    return defaultValue();
  }

  if (defaultValue !== null) {
    return defaultValue;
  }

  return null;
};

/**
 * Get value of a nested property
 *
 * @param mainObject
 * @param key
 * @returns {*}
 */

var nestedValue$8 = function nestedValue(mainObject, key) {
  try {
    return key.split('.').reduce(function (obj, property) {
      return obj[property];
    }, mainObject);
  } catch (err) {
    // If we end up here, we're not working with an object, and @var mainObject is the value itself
    return mainObject;
  }
};

var nestedValue$7 = nestedValue$8;

var _require$f = is,
    isFunction$c = _require$f.isFunction;

var groupBy = function groupBy(key) {
  var _this = this;

  var collection = {};

  this.items.forEach(function (item, index) {
    var resolvedKey = void 0;

    if (isFunction$c(key)) {
      resolvedKey = key(item, index);
    } else if (nestedValue$7(item, key) || nestedValue$7(item, key) === 0) {
      resolvedKey = nestedValue$7(item, key);
    } else {
      resolvedKey = '';
    }

    if (collection[resolvedKey] === undefined) {
      collection[resolvedKey] = new _this.constructor([]);
    }

    collection[resolvedKey].push(item);
  });

  return new this.constructor(collection);
};

var variadic$2 = variadic$4;

var has = function has() {
  var _this = this;

  for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
    args[_key] = arguments[_key];
  }

  var properties = variadic$2(args);

  return properties.filter(function (key) {
    return Object.hasOwnProperty.call(_this.items, key);
  }).length === properties.length;
};

var implode = function implode(key, glue) {
  if (glue === undefined) {
    return this.items.join(key);
  }

  return new this.constructor(this.items).pluck(key).all().join(glue);
};

var intersect = function intersect(values) {
  var intersectValues = values;

  if (values instanceof this.constructor) {
    intersectValues = values.all();
  }

  var collection = this.items.filter(function (item) {
    return intersectValues.indexOf(item) !== -1;
  });

  return new this.constructor(collection);
};

var intersectByKeys = function intersectByKeys(values) {
  var _this = this;

  var intersectKeys = Object.keys(values);

  if (values instanceof this.constructor) {
    intersectKeys = Object.keys(values.all());
  }

  var collection = {};

  Object.keys(this.items).forEach(function (key) {
    if (intersectKeys.indexOf(key) !== -1) {
      collection[key] = _this.items[key];
    }
  });

  return new this.constructor(collection);
};

var isEmpty = function isEmpty() {
  if (Array.isArray(this.items)) {
    return !this.items.length;
  }

  return !Object.keys(this.items).length;
};

var isNotEmpty = function isNotEmpty() {
  return !this.isEmpty();
};

var join = function join(glue, finalGlue) {
  var collection = this.values();

  if (finalGlue === undefined) {
    return collection.implode(glue);
  }

  var count = collection.count();

  if (count === 0) {
    return '';
  }

  if (count === 1) {
    return collection.last();
  }

  var finalItem = collection.pop();

  return collection.implode(glue) + finalGlue + finalItem;
};

var nestedValue$6 = nestedValue$8;

var _require$e = is,
    isFunction$b = _require$e.isFunction;

var keyBy = function keyBy(key) {
  var collection = {};

  if (isFunction$b(key)) {
    this.items.forEach(function (item) {
      collection[key(item)] = item;
    });
  } else {
    this.items.forEach(function (item) {
      var keyValue = nestedValue$6(item, key);

      collection[keyValue || ''] = item;
    });
  }

  return new this.constructor(collection);
};

var keys = function keys() {
  var collection = Object.keys(this.items);

  if (Array.isArray(this.items)) {
    collection = collection.map(Number);
  }

  return new this.constructor(collection);
};

var _require$d = is,
    isFunction$a = _require$d.isFunction;

var last = function last(fn, defaultValue) {
  var items = this.items;


  if (isFunction$a(fn)) {
    items = this.filter(fn).all();
  }

  if (Array.isArray(items) && !items.length || !Object.keys(items).length) {
    if (isFunction$a(defaultValue)) {
      return defaultValue();
    }

    return defaultValue;
  }

  if (Array.isArray(items)) {
    return items[items.length - 1];
  }
  var keys = Object.keys(items);

  return items[keys[keys.length - 1]];
};

var macro = function macro(name, fn) {
  this.constructor.prototype[name] = fn;
};

var make = function make() {
  var items = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];

  return new this.constructor(items);
};

var map = function map(fn) {
  var _this = this;

  if (Array.isArray(this.items)) {
    return new this.constructor(this.items.map(fn));
  }

  var collection = {};

  Object.keys(this.items).forEach(function (key) {
    collection[key] = fn(_this.items[key], key);
  });

  return new this.constructor(collection);
};

function _toConsumableArray$2(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

var mapSpread = function mapSpread(fn) {
  return this.map(function (values, key) {
    return fn.apply(undefined, _toConsumableArray$2(values).concat([key]));
  });
};

var _slicedToArray$2 = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var mapToDictionary = function mapToDictionary(fn) {
  var collection = {};

  this.items.forEach(function (item, k) {
    var _fn = fn(item, k),
        _fn2 = _slicedToArray$2(_fn, 2),
        key = _fn2[0],
        value = _fn2[1];

    if (collection[key] === undefined) {
      collection[key] = [value];
    } else {
      collection[key].push(value);
    }
  });

  return new this.constructor(collection);
};

var mapInto = function mapInto(ClassName) {
  return this.map(function (value, key) {
    return new ClassName(value, key);
  });
};

var _slicedToArray$1 = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var mapToGroups = function mapToGroups(fn) {
  var collection = {};

  this.items.forEach(function (item, key) {
    var _fn = fn(item, key),
        _fn2 = _slicedToArray$1(_fn, 2),
        keyed = _fn2[0],
        value = _fn2[1];

    if (collection[keyed] === undefined) {
      collection[keyed] = [value];
    } else {
      collection[keyed].push(value);
    }
  });

  return new this.constructor(collection);
};

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var mapWithKeys = function mapWithKeys(fn) {
  var _this = this;

  var collection = {};

  if (Array.isArray(this.items)) {
    this.items.forEach(function (item, index) {
      var _fn = fn(item, index),
          _fn2 = _slicedToArray(_fn, 2),
          keyed = _fn2[0],
          value = _fn2[1];

      collection[keyed] = value;
    });
  } else {
    Object.keys(this.items).forEach(function (key) {
      var _fn3 = fn(_this.items[key], key),
          _fn4 = _slicedToArray(_fn3, 2),
          keyed = _fn4[0],
          value = _fn4[1];

      collection[keyed] = value;
    });
  }

  return new this.constructor(collection);
};

function _toConsumableArray$1(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

var max = function max(key) {
  if (typeof key === 'string') {
    var filtered = this.items.filter(function (item) {
      return item[key] !== undefined;
    });

    return Math.max.apply(Math, _toConsumableArray$1(filtered.map(function (item) {
      return item[key];
    })));
  }

  return Math.max.apply(Math, _toConsumableArray$1(this.items));
};

var median = function median(key) {
  var length = this.items.length;


  if (key === undefined) {
    if (length % 2 === 0) {
      return (this.items[length / 2 - 1] + this.items[length / 2]) / 2;
    }

    return this.items[Math.floor(length / 2)];
  }

  if (length % 2 === 0) {
    return (this.items[length / 2 - 1][key] + this.items[length / 2][key]) / 2;
  }

  return this.items[Math.floor(length / 2)][key];
};

var merge = function merge(value) {
  var arrayOrObject = value;

  if (typeof arrayOrObject === 'string') {
    arrayOrObject = [arrayOrObject];
  }

  if (Array.isArray(this.items) && Array.isArray(arrayOrObject)) {
    return new this.constructor(this.items.concat(arrayOrObject));
  }

  var collection = JSON.parse(JSON.stringify(this.items));

  Object.keys(arrayOrObject).forEach(function (key) {
    collection[key] = arrayOrObject[key];
  });

  return new this.constructor(collection);
};

var _typeof$5 = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var mergeRecursive = function mergeRecursive(items) {
  var merge = function merge(target, source) {
    var merged = {};

    var mergedKeys = Object.keys(Object.assign({}, target, source));

    mergedKeys.forEach(function (key) {
      if (target[key] === undefined && source[key] !== undefined) {
        merged[key] = source[key];
      } else if (target[key] !== undefined && source[key] === undefined) {
        merged[key] = target[key];
      } else if (target[key] !== undefined && source[key] !== undefined) {
        if (target[key] === source[key]) {
          merged[key] = target[key];
        } else if (!Array.isArray(target[key]) && _typeof$5(target[key]) === 'object' && !Array.isArray(source[key]) && _typeof$5(source[key]) === 'object') {
          merged[key] = merge(target[key], source[key]);
        } else {
          merged[key] = [].concat(target[key], source[key]);
        }
      }
    });

    return merged;
  };

  if (!items) {
    return this;
  }

  if (items.constructor.name === 'Collection') {
    return new this.constructor(merge(this.items, items.all()));
  }

  return new this.constructor(merge(this.items, items));
};

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

var min = function min(key) {
  if (key !== undefined) {
    var filtered = this.items.filter(function (item) {
      return item[key] !== undefined;
    });

    return Math.min.apply(Math, _toConsumableArray(filtered.map(function (item) {
      return item[key];
    })));
  }

  return Math.min.apply(Math, _toConsumableArray(this.items));
};

var mode = function mode(key) {
  var values = [];
  var highestCount = 1;

  if (!this.items.length) {
    return null;
  }

  this.items.forEach(function (item) {
    var tempValues = values.filter(function (value) {
      if (key !== undefined) {
        return value.key === item[key];
      }

      return value.key === item;
    });

    if (!tempValues.length) {
      if (key !== undefined) {
        values.push({ key: item[key], count: 1 });
      } else {
        values.push({ key: item, count: 1 });
      }
    } else {
      tempValues[0].count += 1;
      var count = tempValues[0].count;


      if (count > highestCount) {
        highestCount = count;
      }
    }
  });

  return values.filter(function (value) {
    return value.count === highestCount;
  }).map(function (value) {
    return value.key;
  });
};

var values$5 = values$8;

var nth = function nth(n) {
  var offset = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;

  var items = values$5(this.items);

  var collection = items.slice(offset).filter(function (item, index) {
    return index % n === 0;
  });

  return new this.constructor(collection);
};

var variadic$1 = variadic$4;

var only = function only() {
  var _this = this;

  for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
    args[_key] = arguments[_key];
  }

  var properties = variadic$1(args);

  if (Array.isArray(this.items)) {
    var _collection = this.items.filter(function (item) {
      return properties.indexOf(item) !== -1;
    });

    return new this.constructor(_collection);
  }

  var collection = {};

  Object.keys(this.items).forEach(function (prop) {
    if (properties.indexOf(prop) !== -1) {
      collection[prop] = _this.items[prop];
    }
  });

  return new this.constructor(collection);
};

var clone = clone$2;

var pad$1 = function pad(size, value) {
  var abs = Math.abs(size);
  var count = this.count();

  if (abs <= count) {
    return this;
  }

  var diff = abs - count;
  var items = clone(this.items);
  var isArray = Array.isArray(this.items);
  var prepend = size < 0;

  for (var iterator = 0; iterator < diff;) {
    if (!isArray) {
      if (items[iterator] !== undefined) {
        diff += 1;
      } else {
        items[iterator] = value;
      }
    } else if (prepend) {
      items.unshift(value);
    } else {
      items.push(value);
    }

    iterator += 1;
  }

  return new this.constructor(items);
};

var partition = function partition(fn) {
  var _this = this;

  var arrays = void 0;

  if (Array.isArray(this.items)) {
    arrays = [new this.constructor([]), new this.constructor([])];

    this.items.forEach(function (item) {
      if (fn(item) === true) {
        arrays[0].push(item);
      } else {
        arrays[1].push(item);
      }
    });
  } else {
    arrays = [new this.constructor({}), new this.constructor({})];

    Object.keys(this.items).forEach(function (prop) {
      var value = _this.items[prop];

      if (fn(value) === true) {
        arrays[0].put(prop, value);
      } else {
        arrays[1].put(prop, value);
      }
    });
  }

  return new this.constructor(arrays);
};

var pipe = function pipe(fn) {
  return fn(this);
};

var _require$c = is,
    isArray$8 = _require$c.isArray,
    isObject$9 = _require$c.isObject;

var nestedValue$5 = nestedValue$8;

var buildKeyPathMap = function buildKeyPathMap(items) {
  var keyPaths = {};

  items.forEach(function (item, index) {
    function buildKeyPath(val, keyPath) {
      if (isObject$9(val)) {
        Object.keys(val).forEach(function (prop) {
          buildKeyPath(val[prop], keyPath + '.' + prop);
        });
      } else if (isArray$8(val)) {
        val.forEach(function (v, i) {
          buildKeyPath(v, keyPath + '.' + i);
        });
      }

      keyPaths[keyPath] = val;
    }

    buildKeyPath(item, index);
  });

  return keyPaths;
};

var pluck = function pluck(value, key) {
  if (value.indexOf('*') !== -1) {
    var keyPathMap = buildKeyPathMap(this.items);

    var keyMatches = [];

    if (key !== undefined) {
      var keyRegex = new RegExp('0.' + key, 'g');
      var keyNumberOfLevels = ('0.' + key).split('.').length;

      Object.keys(keyPathMap).forEach(function (k) {
        var matchingKey = k.match(keyRegex);

        if (matchingKey) {
          var match = matchingKey[0];

          if (match.split('.').length === keyNumberOfLevels) {
            keyMatches.push(keyPathMap[match]);
          }
        }
      });
    }

    var valueMatches = [];
    var valueRegex = new RegExp('0.' + value, 'g');
    var valueNumberOfLevels = ('0.' + value).split('.').length;

    Object.keys(keyPathMap).forEach(function (k) {
      var matchingValue = k.match(valueRegex);

      if (matchingValue) {
        var match = matchingValue[0];

        if (match.split('.').length === valueNumberOfLevels) {
          valueMatches.push(keyPathMap[match]);
        }
      }
    });

    if (key !== undefined) {
      var collection = {};

      this.items.forEach(function (item, index) {
        collection[keyMatches[index] || ''] = valueMatches;
      });

      return new this.constructor(collection);
    }

    return new this.constructor([valueMatches]);
  }

  if (key !== undefined) {
    var _collection = {};

    this.items.forEach(function (item) {
      if (nestedValue$5(item, value) !== undefined) {
        _collection[item[key] || ''] = nestedValue$5(item, value);
      } else {
        _collection[item[key] || ''] = null;
      }
    });

    return new this.constructor(_collection);
  }

  return this.map(function (item) {
    if (nestedValue$5(item, value) !== undefined) {
      return nestedValue$5(item, value);
    }

    return null;
  });
};

var variadic = variadic$4;

/**
 * Delete keys helper
 *
 * Delete one or multiple keys from an object
 *
 * @param obj
 * @param keys
 * @returns {void}
 */
var deleteKeys$2 = function deleteKeys(obj) {
  for (var _len = arguments.length, keys = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
    keys[_key - 1] = arguments[_key];
  }

  variadic(keys).forEach(function (key) {
    // eslint-disable-next-line
    delete obj[key];
  });
};

var _require$b = is,
    isArray$7 = _require$b.isArray,
    isObject$8 = _require$b.isObject;

var deleteKeys$1 = deleteKeys$2;

var pop = function pop() {
  var _this = this;

  var count = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 1;

  if (this.isEmpty()) {
    return null;
  }

  if (isArray$7(this.items)) {
    if (count === 1) {
      return this.items.pop();
    }

    return new this.constructor(this.items.splice(-count));
  }

  if (isObject$8(this.items)) {
    var keys = Object.keys(this.items);

    if (count === 1) {
      var key = keys[keys.length - 1];
      var last = this.items[key];

      deleteKeys$1(this.items, key);

      return last;
    }

    var poppedKeys = keys.slice(-count);

    var newObject = poppedKeys.reduce(function (acc, current) {
      acc[current] = _this.items[current];

      return acc;
    }, {});

    deleteKeys$1(this.items, poppedKeys);

    return new this.constructor(newObject);
  }

  return null;
};

var prepend = function prepend(value, key) {
  if (key !== undefined) {
    return this.put(key, value);
  }

  this.items.unshift(value);

  return this;
};

var _require$a = is,
    isFunction$9 = _require$a.isFunction;

var pull = function pull(key, defaultValue) {
  var returnValue = this.items[key] || null;

  if (!returnValue && defaultValue !== undefined) {
    if (isFunction$9(defaultValue)) {
      returnValue = defaultValue();
    } else {
      returnValue = defaultValue;
    }
  }

  delete this.items[key];

  return returnValue;
};

var push = function push() {
  var _items;

  (_items = this.items).push.apply(_items, arguments);

  return this;
};

var put = function put(key, value) {
  this.items[key] = value;

  return this;
};

var values$4 = values$8;

var random = function random() {
  var length = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;

  var items = values$4(this.items);

  var collection = new this.constructor(items).shuffle();

  // If not a length was specified
  if (length !== parseInt(length, 10)) {
    return collection.first();
  }

  return collection.take(length);
};

var reduce = function reduce(fn, carry) {
  var _this = this;

  var reduceCarry = null;

  if (carry !== undefined) {
    reduceCarry = carry;
  }

  if (Array.isArray(this.items)) {
    this.items.forEach(function (item) {
      reduceCarry = fn(reduceCarry, item);
    });
  } else {
    Object.keys(this.items).forEach(function (key) {
      reduceCarry = fn(reduceCarry, _this.items[key], key);
    });
  }

  return reduceCarry;
};

var reject = function reject(fn) {
  return new this.constructor(this.items).filter(function (item) {
    return !fn(item);
  });
};

var replace = function replace(items) {
  if (!items) {
    return this;
  }

  if (Array.isArray(items)) {
    var _replaced = this.items.map(function (value, index) {
      return items[index] || value;
    });

    return new this.constructor(_replaced);
  }

  if (items.constructor.name === 'Collection') {
    var _replaced2 = Object.assign({}, this.items, items.all());

    return new this.constructor(_replaced2);
  }

  var replaced = Object.assign({}, this.items, items);

  return new this.constructor(replaced);
};

var _typeof$4 = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var replaceRecursive = function replaceRecursive(items) {
  var replace = function replace(target, source) {
    var replaced = Object.assign({}, target);

    var mergedKeys = Object.keys(Object.assign({}, target, source));

    mergedKeys.forEach(function (key) {
      if (!Array.isArray(source[key]) && _typeof$4(source[key]) === 'object') {
        replaced[key] = replace(target[key], source[key]);
      } else if (target[key] === undefined && source[key] !== undefined) {
        if (_typeof$4(target[key]) === 'object') {
          replaced[key] = Object.assign({}, source[key]);
        } else {
          replaced[key] = source[key];
        }
      } else if (target[key] !== undefined && source[key] === undefined) {
        if (_typeof$4(target[key]) === 'object') {
          replaced[key] = Object.assign({}, target[key]);
        } else {
          replaced[key] = target[key];
        }
      } else if (target[key] !== undefined && source[key] !== undefined) {
        if (_typeof$4(source[key]) === 'object') {
          replaced[key] = Object.assign({}, source[key]);
        } else {
          replaced[key] = source[key];
        }
      }
    });

    return replaced;
  };

  if (!items) {
    return this;
  }

  if (!Array.isArray(items) && (typeof items === 'undefined' ? 'undefined' : _typeof$4(items)) !== 'object') {
    return new this.constructor(replace(this.items, [items]));
  }

  if (items.constructor.name === 'Collection') {
    return new this.constructor(replace(this.items, items.all()));
  }

  return new this.constructor(replace(this.items, items));
};

var reverse = function reverse() {
  var collection = [].concat(this.items).reverse();

  return new this.constructor(collection);
};

/* eslint-disable eqeqeq */

var _require$9 = is,
    isArray$6 = _require$9.isArray,
    isObject$7 = _require$9.isObject,
    isFunction$8 = _require$9.isFunction;

var search = function search(valueOrFunction, strict) {
  var _this = this;

  var result = void 0;

  var find = function find(item, key) {
    if (isFunction$8(valueOrFunction)) {
      return valueOrFunction(_this.items[key], key);
    }

    if (strict) {
      return _this.items[key] === valueOrFunction;
    }

    return _this.items[key] == valueOrFunction;
  };

  if (isArray$6(this.items)) {
    result = this.items.findIndex(find);
  } else if (isObject$7(this.items)) {
    result = Object.keys(this.items).find(function (key) {
      return find(_this.items[key], key);
    });
  }

  if (result === undefined || result < 0) {
    return false;
  }

  return result;
};

var _require$8 = is,
    isArray$5 = _require$8.isArray,
    isObject$6 = _require$8.isObject;

var deleteKeys = deleteKeys$2;

var shift = function shift() {
  var _this = this;

  var count = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 1;

  if (this.isEmpty()) {
    return null;
  }

  if (isArray$5(this.items)) {
    if (count === 1) {
      return this.items.shift();
    }

    return new this.constructor(this.items.splice(0, count));
  }

  if (isObject$6(this.items)) {
    if (count === 1) {
      var key = Object.keys(this.items)[0];
      var value = this.items[key];
      delete this.items[key];

      return value;
    }

    var keys = Object.keys(this.items);
    var poppedKeys = keys.slice(0, count);

    var newObject = poppedKeys.reduce(function (acc, current) {
      acc[current] = _this.items[current];

      return acc;
    }, {});

    deleteKeys(this.items, poppedKeys);

    return new this.constructor(newObject);
  }

  return null;
};

var values$3 = values$8;

var shuffle = function shuffle() {
  var items = values$3(this.items);

  var j = void 0;
  var x = void 0;
  var i = void 0;

  for (i = items.length; i; i -= 1) {
    j = Math.floor(Math.random() * i);
    x = items[i - 1];
    items[i - 1] = items[j];
    items[j] = x;
  }

  this.items = items;

  return this;
};

var _require$7 = is,
    isObject$5 = _require$7.isObject;

var skip = function skip(number) {
  var _this = this;

  if (isObject$5(this.items)) {
    return new this.constructor(Object.keys(this.items).reduce(function (accumulator, key, index) {
      if (index + 1 > number) {
        accumulator[key] = _this.items[key];
      }

      return accumulator;
    }, {}));
  }

  return new this.constructor(this.items.slice(number));
};

var _require$6 = is,
    isArray$4 = _require$6.isArray,
    isObject$4 = _require$6.isObject,
    isFunction$7 = _require$6.isFunction;

var skipUntil = function skipUntil(valueOrFunction) {
  var _this = this;

  var previous = null;
  var items = void 0;

  var callback = function callback(value) {
    return value === valueOrFunction;
  };
  if (isFunction$7(valueOrFunction)) {
    callback = valueOrFunction;
  }

  if (isArray$4(this.items)) {
    items = this.items.filter(function (item) {
      if (previous !== true) {
        previous = callback(item);
      }

      return previous;
    });
  }

  if (isObject$4(this.items)) {
    items = Object.keys(this.items).reduce(function (acc, key) {
      if (previous !== true) {
        previous = callback(_this.items[key]);
      }

      if (previous !== false) {
        acc[key] = _this.items[key];
      }

      return acc;
    }, {});
  }

  return new this.constructor(items);
};

var _require$5 = is,
    isArray$3 = _require$5.isArray,
    isObject$3 = _require$5.isObject,
    isFunction$6 = _require$5.isFunction;

var skipWhile = function skipWhile(valueOrFunction) {
  var _this = this;

  var previous = null;
  var items = void 0;

  var callback = function callback(value) {
    return value === valueOrFunction;
  };
  if (isFunction$6(valueOrFunction)) {
    callback = valueOrFunction;
  }

  if (isArray$3(this.items)) {
    items = this.items.filter(function (item) {
      if (previous !== true) {
        previous = !callback(item);
      }

      return previous;
    });
  }

  if (isObject$3(this.items)) {
    items = Object.keys(this.items).reduce(function (acc, key) {
      if (previous !== true) {
        previous = !callback(_this.items[key]);
      }

      if (previous !== false) {
        acc[key] = _this.items[key];
      }

      return acc;
    }, {});
  }

  return new this.constructor(items);
};

var slice = function slice(remove, limit) {
  var collection = this.items.slice(remove);

  if (limit !== undefined) {
    collection = collection.slice(0, limit);
  }

  return new this.constructor(collection);
};

var contains = contains$1;

var some = contains;

var sort = function sort(fn) {
  var collection = [].concat(this.items);

  if (fn === undefined) {
    if (this.every(function (item) {
      return typeof item === 'number';
    })) {
      collection.sort(function (a, b) {
        return a - b;
      });
    } else {
      collection.sort();
    }
  } else {
    collection.sort(fn);
  }

  return new this.constructor(collection);
};

var sortDesc = function sortDesc() {
  return this.sort().reverse();
};

var nestedValue$4 = nestedValue$8;

var _require$4 = is,
    isFunction$5 = _require$4.isFunction;

var sortBy = function sortBy(valueOrFunction) {
  var collection = [].concat(this.items);
  var getValue = function getValue(item) {
    if (isFunction$5(valueOrFunction)) {
      return valueOrFunction(item);
    }

    return nestedValue$4(item, valueOrFunction);
  };

  collection.sort(function (a, b) {
    var valueA = getValue(a);
    var valueB = getValue(b);

    if (valueA === null || valueA === undefined) {
      return 1;
    }
    if (valueB === null || valueB === undefined) {
      return -1;
    }

    if (valueA < valueB) {
      return -1;
    }
    if (valueA > valueB) {
      return 1;
    }

    return 0;
  });

  return new this.constructor(collection);
};

var sortByDesc = function sortByDesc(valueOrFunction) {
  return this.sortBy(valueOrFunction).reverse();
};

var sortKeys = function sortKeys() {
  var _this = this;

  var ordered = {};

  Object.keys(this.items).sort().forEach(function (key) {
    ordered[key] = _this.items[key];
  });

  return new this.constructor(ordered);
};

var sortKeysDesc = function sortKeysDesc() {
  var _this = this;

  var ordered = {};

  Object.keys(this.items).sort().reverse().forEach(function (key) {
    ordered[key] = _this.items[key];
  });

  return new this.constructor(ordered);
};

var splice = function splice(index, limit, replace) {
  var slicedCollection = this.slice(index, limit);

  this.items = this.diff(slicedCollection.all()).all();

  if (Array.isArray(replace)) {
    for (var iterator = 0, length = replace.length; iterator < length; iterator += 1) {
      this.items.splice(index + iterator, 0, replace[iterator]);
    }
  }

  return slicedCollection;
};

var split = function split(numberOfGroups) {
  var itemsPerGroup = Math.round(this.items.length / numberOfGroups);

  var items = JSON.parse(JSON.stringify(this.items));
  var collection = [];

  for (var iterator = 0; iterator < numberOfGroups; iterator += 1) {
    collection.push(new this.constructor(items.splice(0, itemsPerGroup)));
  }

  return new this.constructor(collection);
};

var values$2 = values$8;

var _require$3 = is,
    isFunction$4 = _require$3.isFunction;

var sum = function sum(key) {
  var items = values$2(this.items);

  var total = 0;

  if (key === undefined) {
    for (var i = 0, length = items.length; i < length; i += 1) {
      total += parseFloat(items[i]);
    }
  } else if (isFunction$4(key)) {
    for (var _i = 0, _length = items.length; _i < _length; _i += 1) {
      total += parseFloat(key(items[_i]));
    }
  } else {
    for (var _i2 = 0, _length2 = items.length; _i2 < _length2; _i2 += 1) {
      total += parseFloat(items[_i2][key]);
    }
  }

  return parseFloat(total.toPrecision(12));
};

var _typeof$3 = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var take = function take(length) {
  var _this = this;

  if (!Array.isArray(this.items) && _typeof$3(this.items) === 'object') {
    var keys = Object.keys(this.items);
    var slicedKeys = void 0;

    if (length < 0) {
      slicedKeys = keys.slice(length);
    } else {
      slicedKeys = keys.slice(0, length);
    }

    var collection = {};

    keys.forEach(function (prop) {
      if (slicedKeys.indexOf(prop) !== -1) {
        collection[prop] = _this.items[prop];
      }
    });

    return new this.constructor(collection);
  }

  if (length < 0) {
    return new this.constructor(this.items.slice(length));
  }

  return new this.constructor(this.items.slice(0, length));
};

var _require$2 = is,
    isArray$2 = _require$2.isArray,
    isObject$2 = _require$2.isObject,
    isFunction$3 = _require$2.isFunction;

var takeUntil = function takeUntil(valueOrFunction) {
  var _this = this;

  var previous = null;
  var items = void 0;

  var callback = function callback(value) {
    return value === valueOrFunction;
  };
  if (isFunction$3(valueOrFunction)) {
    callback = valueOrFunction;
  }

  if (isArray$2(this.items)) {
    items = this.items.filter(function (item) {
      if (previous !== false) {
        previous = !callback(item);
      }

      return previous;
    });
  }

  if (isObject$2(this.items)) {
    items = Object.keys(this.items).reduce(function (acc, key) {
      if (previous !== false) {
        previous = !callback(_this.items[key]);
      }

      if (previous !== false) {
        acc[key] = _this.items[key];
      }

      return acc;
    }, {});
  }

  return new this.constructor(items);
};

var _require$1 = is,
    isArray$1 = _require$1.isArray,
    isObject$1 = _require$1.isObject,
    isFunction$2 = _require$1.isFunction;

var takeWhile = function takeWhile(valueOrFunction) {
  var _this = this;

  var previous = null;
  var items = void 0;

  var callback = function callback(value) {
    return value === valueOrFunction;
  };
  if (isFunction$2(valueOrFunction)) {
    callback = valueOrFunction;
  }

  if (isArray$1(this.items)) {
    items = this.items.filter(function (item) {
      if (previous !== false) {
        previous = callback(item);
      }

      return previous;
    });
  }

  if (isObject$1(this.items)) {
    items = Object.keys(this.items).reduce(function (acc, key) {
      if (previous !== false) {
        previous = callback(_this.items[key]);
      }

      if (previous !== false) {
        acc[key] = _this.items[key];
      }

      return acc;
    }, {});
  }

  return new this.constructor(items);
};

var tap = function tap(fn) {
  fn(this);

  return this;
};

var times = function times(n, fn) {
  for (var iterator = 1; iterator <= n; iterator += 1) {
    this.items.push(fn(iterator));
  }

  return this;
};

var toArray = function toArray() {
  var collectionInstance = this.constructor;

  function iterate(list, collection) {
    var childCollection = [];

    if (list instanceof collectionInstance) {
      list.items.forEach(function (i) {
        return iterate(i, childCollection);
      });
      collection.push(childCollection);
    } else if (Array.isArray(list)) {
      list.forEach(function (i) {
        return iterate(i, childCollection);
      });
      collection.push(childCollection);
    } else {
      collection.push(list);
    }
  }

  if (Array.isArray(this.items)) {
    var collection = [];

    this.items.forEach(function (items) {
      iterate(items, collection);
    });

    return collection;
  }

  return this.values().all();
};

var _typeof$2 = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var toJson = function toJson() {
  if (_typeof$2(this.items) === 'object' && !Array.isArray(this.items)) {
    return JSON.stringify(this.all());
  }

  return JSON.stringify(this.toArray());
};

var transform = function transform(fn) {
  var _this = this;

  if (Array.isArray(this.items)) {
    this.items = this.items.map(fn);
  } else {
    var collection = {};

    Object.keys(this.items).forEach(function (key) {
      collection[key] = fn(_this.items[key], key);
    });

    this.items = collection;
  }

  return this;
};

var unless = function when(value, fn, defaultFn) {
  if (!value) {
    fn(this);
  } else {
    defaultFn(this);
  }
};

var whenNotEmpty = function whenNotEmpty(fn, defaultFn) {
  if (Array.isArray(this.items) && this.items.length) {
    return fn(this);
  }if (Object.keys(this.items).length) {
    return fn(this);
  }

  if (defaultFn !== undefined) {
    if (Array.isArray(this.items) && !this.items.length) {
      return defaultFn(this);
    }if (!Object.keys(this.items).length) {
      return defaultFn(this);
    }
  }

  return this;
};

var whenEmpty = function whenEmpty(fn, defaultFn) {
  if (Array.isArray(this.items) && !this.items.length) {
    return fn(this);
  }if (!Object.keys(this.items).length) {
    return fn(this);
  }

  if (defaultFn !== undefined) {
    if (Array.isArray(this.items) && this.items.length) {
      return defaultFn(this);
    }if (Object.keys(this.items).length) {
      return defaultFn(this);
    }
  }

  return this;
};

var union = function union(object) {
  var _this = this;

  var collection = JSON.parse(JSON.stringify(this.items));

  Object.keys(object).forEach(function (prop) {
    if (_this.items[prop] === undefined) {
      collection[prop] = object[prop];
    }
  });

  return new this.constructor(collection);
};

var _require = is,
    isFunction$1 = _require.isFunction;

var unique = function unique(key) {
  var collection = void 0;

  if (key === undefined) {
    collection = this.items.filter(function (element, index, self) {
      return self.indexOf(element) === index;
    });
  } else {
    collection = [];

    var usedKeys = [];

    for (var iterator = 0, length = this.items.length; iterator < length; iterator += 1) {
      var uniqueKey = void 0;
      if (isFunction$1(key)) {
        uniqueKey = key(this.items[iterator]);
      } else {
        uniqueKey = this.items[iterator][key];
      }

      if (usedKeys.indexOf(uniqueKey) === -1) {
        collection.push(this.items[iterator]);
        usedKeys.push(uniqueKey);
      }
    }
  }

  return new this.constructor(collection);
};

var unwrap = function unwrap(value) {
  if (value instanceof this.constructor) {
    return value.all();
  }

  return value;
};

var getValues = values$8;

var values$1 = function values() {
  return new this.constructor(getValues(this.items));
};

var when = function when(value, fn, defaultFn) {
  if (value) {
    return fn(this, value);
  }

  if (defaultFn) {
    return defaultFn(this, value);
  }

  return this;
};

var values = values$8;
var nestedValue$3 = nestedValue$8;

var where = function where(key, operator, value) {
  var comparisonOperator = operator;
  var comparisonValue = value;

  var items = values(this.items);

  if (operator === undefined || operator === true) {
    return new this.constructor(items.filter(function (item) {
      return nestedValue$3(item, key);
    }));
  }

  if (operator === false) {
    return new this.constructor(items.filter(function (item) {
      return !nestedValue$3(item, key);
    }));
  }

  if (value === undefined) {
    comparisonValue = operator;
    comparisonOperator = '===';
  }

  var collection = items.filter(function (item) {
    switch (comparisonOperator) {
      case '==':
        return nestedValue$3(item, key) === Number(comparisonValue) || nestedValue$3(item, key) === comparisonValue.toString();

      default:
      case '===':
        return nestedValue$3(item, key) === comparisonValue;

      case '!=':
      case '<>':
        return nestedValue$3(item, key) !== Number(comparisonValue) && nestedValue$3(item, key) !== comparisonValue.toString();

      case '!==':
        return nestedValue$3(item, key) !== comparisonValue;

      case '<':
        return nestedValue$3(item, key) < comparisonValue;

      case '<=':
        return nestedValue$3(item, key) <= comparisonValue;

      case '>':
        return nestedValue$3(item, key) > comparisonValue;

      case '>=':
        return nestedValue$3(item, key) >= comparisonValue;
    }
  });

  return new this.constructor(collection);
};

var whereBetween = function whereBetween(key, values) {
  return this.where(key, '>=', values[0]).where(key, '<=', values[values.length - 1]);
};

var extractValues$1 = values$8;
var nestedValue$2 = nestedValue$8;

var whereIn = function whereIn(key, values) {
  var items = extractValues$1(values);

  var collection = this.items.filter(function (item) {
    return items.indexOf(nestedValue$2(item, key)) !== -1;
  });

  return new this.constructor(collection);
};

var whereInstanceOf = function whereInstanceOf(type) {
  return this.filter(function (item) {
    return item instanceof type;
  });
};

var nestedValue$1 = nestedValue$8;

var whereNotBetween = function whereNotBetween(key, values) {
  return this.filter(function (item) {
    return nestedValue$1(item, key) < values[0] || nestedValue$1(item, key) > values[values.length - 1];
  });
};

var extractValues = values$8;
var nestedValue = nestedValue$8;

var whereNotIn = function whereNotIn(key, values) {
  var items = extractValues(values);

  var collection = this.items.filter(function (item) {
    return items.indexOf(nestedValue(item, key)) === -1;
  });

  return new this.constructor(collection);
};

var whereNull = function whereNull() {
  var key = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;

  return this.where(key, '===', null);
};

var whereNotNull = function whereNotNull() {
  var key = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;

  return this.where(key, '!==', null);
};

var _typeof$1 = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var wrap = function wrap(value) {
  if (value instanceof this.constructor) {
    return value;
  }

  if ((typeof value === 'undefined' ? 'undefined' : _typeof$1(value)) === 'object') {
    return new this.constructor(value);
  }

  return new this.constructor([value]);
};

var zip = function zip(array) {
  var _this = this;

  var values = array;

  if (values instanceof this.constructor) {
    values = values.all();
  }

  var collection = this.items.map(function (item, index) {
    return new _this.constructor([item, values[index]]);
  });

  return new this.constructor(collection);
};

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

function Collection$1(collection) {
  if (collection !== undefined && !Array.isArray(collection) && (typeof collection === 'undefined' ? 'undefined' : _typeof(collection)) !== 'object') {
    this.items = [collection];
  } else if (collection instanceof this.constructor) {
    this.items = collection.all();
  } else {
    this.items = collection || [];
  }
}

/**
 * Symbol.iterator
 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Symbol/iterator
 */
var SymbolIterator = symbol_iterator;

if (typeof Symbol !== 'undefined') {
  Collection$1.prototype[Symbol.iterator] = SymbolIterator;
}

/**
 * Support JSON.stringify
 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/JSON/stringify
 */
Collection$1.prototype.toJSON = function toJSON() {
  return this.items;
};

Collection$1.prototype.all = all;
Collection$1.prototype.average = average$1;
Collection$1.prototype.avg = avg;
Collection$1.prototype.chunk = chunk;
Collection$1.prototype.collapse = collapse;
Collection$1.prototype.combine = combine;
Collection$1.prototype.concat = concat;
Collection$1.prototype.contains = contains$1;
Collection$1.prototype.count = count;
Collection$1.prototype.countBy = countBy;
Collection$1.prototype.crossJoin = crossJoin;
Collection$1.prototype.dd = dd;
Collection$1.prototype.diff = diff;
Collection$1.prototype.diffAssoc = diffAssoc;
Collection$1.prototype.diffKeys = diffKeys;
Collection$1.prototype.dump = dump;
Collection$1.prototype.duplicates = duplicates;
Collection$1.prototype.each = each;
Collection$1.prototype.eachSpread = eachSpread;
Collection$1.prototype.every = every;
Collection$1.prototype.except = except;
Collection$1.prototype.filter = filter;
Collection$1.prototype.first = first;
Collection$1.prototype.firstWhere = firstWhere;
Collection$1.prototype.flatMap = flatMap;
Collection$1.prototype.flatten = flatten;
Collection$1.prototype.flip = flip;
Collection$1.prototype.forPage = forPage;
Collection$1.prototype.forget = forget;
Collection$1.prototype.get = get;
Collection$1.prototype.groupBy = groupBy;
Collection$1.prototype.has = has;
Collection$1.prototype.implode = implode;
Collection$1.prototype.intersect = intersect;
Collection$1.prototype.intersectByKeys = intersectByKeys;
Collection$1.prototype.isEmpty = isEmpty;
Collection$1.prototype.isNotEmpty = isNotEmpty;
Collection$1.prototype.join = join;
Collection$1.prototype.keyBy = keyBy;
Collection$1.prototype.keys = keys;
Collection$1.prototype.last = last;
Collection$1.prototype.macro = macro;
Collection$1.prototype.make = make;
Collection$1.prototype.map = map;
Collection$1.prototype.mapSpread = mapSpread;
Collection$1.prototype.mapToDictionary = mapToDictionary;
Collection$1.prototype.mapInto = mapInto;
Collection$1.prototype.mapToGroups = mapToGroups;
Collection$1.prototype.mapWithKeys = mapWithKeys;
Collection$1.prototype.max = max;
Collection$1.prototype.median = median;
Collection$1.prototype.merge = merge;
Collection$1.prototype.mergeRecursive = mergeRecursive;
Collection$1.prototype.min = min;
Collection$1.prototype.mode = mode;
Collection$1.prototype.nth = nth;
Collection$1.prototype.only = only;
Collection$1.prototype.pad = pad$1;
Collection$1.prototype.partition = partition;
Collection$1.prototype.pipe = pipe;
Collection$1.prototype.pluck = pluck;
Collection$1.prototype.pop = pop;
Collection$1.prototype.prepend = prepend;
Collection$1.prototype.pull = pull;
Collection$1.prototype.push = push;
Collection$1.prototype.put = put;
Collection$1.prototype.random = random;
Collection$1.prototype.reduce = reduce;
Collection$1.prototype.reject = reject;
Collection$1.prototype.replace = replace;
Collection$1.prototype.replaceRecursive = replaceRecursive;
Collection$1.prototype.reverse = reverse;
Collection$1.prototype.search = search;
Collection$1.prototype.shift = shift;
Collection$1.prototype.shuffle = shuffle;
Collection$1.prototype.skip = skip;
Collection$1.prototype.skipUntil = skipUntil;
Collection$1.prototype.skipWhile = skipWhile;
Collection$1.prototype.slice = slice;
Collection$1.prototype.some = some;
Collection$1.prototype.sort = sort;
Collection$1.prototype.sortDesc = sortDesc;
Collection$1.prototype.sortBy = sortBy;
Collection$1.prototype.sortByDesc = sortByDesc;
Collection$1.prototype.sortKeys = sortKeys;
Collection$1.prototype.sortKeysDesc = sortKeysDesc;
Collection$1.prototype.splice = splice;
Collection$1.prototype.split = split;
Collection$1.prototype.sum = sum;
Collection$1.prototype.take = take;
Collection$1.prototype.takeUntil = takeUntil;
Collection$1.prototype.takeWhile = takeWhile;
Collection$1.prototype.tap = tap;
Collection$1.prototype.times = times;
Collection$1.prototype.toArray = toArray;
Collection$1.prototype.toJson = toJson;
Collection$1.prototype.transform = transform;
Collection$1.prototype.unless = unless;
Collection$1.prototype.unlessEmpty = whenNotEmpty;
Collection$1.prototype.unlessNotEmpty = whenEmpty;
Collection$1.prototype.union = union;
Collection$1.prototype.unique = unique;
Collection$1.prototype.unwrap = unwrap;
Collection$1.prototype.values = values$1;
Collection$1.prototype.when = when;
Collection$1.prototype.whenEmpty = whenEmpty;
Collection$1.prototype.whenNotEmpty = whenNotEmpty;
Collection$1.prototype.where = where;
Collection$1.prototype.whereBetween = whereBetween;
Collection$1.prototype.whereIn = whereIn;
Collection$1.prototype.whereInstanceOf = whereInstanceOf;
Collection$1.prototype.whereNotBetween = whereNotBetween;
Collection$1.prototype.whereNotIn = whereNotIn;
Collection$1.prototype.whereNull = whereNull;
Collection$1.prototype.whereNotNull = whereNotNull;
Collection$1.prototype.wrap = wrap;
Collection$1.prototype.zip = zip;

var collect = function collect(collection) {
  return new Collection$1(collection);
};

dist.exports = collect;
dist.exports.collect = collect;
dist.exports.default = collect;
var Collection_1 = dist.exports.Collection = Collection$1;

class Collection extends Collection_1 {
    toObject() {
        return this.items;
    }
}

class EntryCollection extends Collection {
    constructor(entries, meta, links) {
        super(entries);
        this.meta = meta;
        this.links = links;
    }
    static fromResponse(response, stream) {
        const entries = Object.values(response.data.data).map(entry => new Entry(stream, entry, false));
        return new EntryCollection(entries, response.data.meta, response.data.links);
    }
}
class PaginatedEntryCollection extends Collection {
    constructor(entries, meta, links) {
        super(entries);
        this.meta = meta;
        this.links = links;
    }
    static fromResponse(response, stream) {
        const entries = Object.values(response.data.data).map(entry => new Entry(stream, entry, false));
        return new PaginatedEntryCollection(entries, response.data.meta, response.data.links);
    }
}

const comparisonOperators = ['>', '<', '==', '!=', '>=', '<=', '!<', '!>', '<>'];
const logicalOperators = ['BETWEEN', 'EXISTS', 'OR', 'AND', 'NOT', 'IN', 'ALL', 'ANY', 'LIKE', 'IS NULL', 'UNIQUE'];
const operators = [].concat(comparisonOperators).concat(logicalOperators);
const isOperator = (value) => operators.includes(value);
const ensureArray = (value) => Array.isArray(value) ? value : [value];
class Criteria {
    /**
     * Create a new instance.
     *
     * @param stream
     */
    constructor(stream) {
        this.stream = stream;
        this.parameters = [];
    }
    get http() { return this.stream.getStreams().http; }
    /**
     * Find an entry by ID.
     *
     * @param id
     * @returns
     */
    find(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.where('id', id).first();
        });
    }
    /**
     * Return the first result.
     *
     * @returns
     */
    first() {
        return __awaiter(this, void 0, void 0, function* () {
            let collection = yield this.limit(1).get();
            return collection.get(0);
        });
    }
    cache() { return this; }
    /**
     * Order the query by field/direction.
     *
     * @param key
     * @param direction
     * @returns
     */
    orderBy(key, direction = 'desc') {
        this.addParameter('orderBy', [key, direction]);
        return this;
    }
    /**
     * Limit the entries returned.
     *
     * @param value
     * @returns
     */
    limit(value) {
        this.addParameter('limit', value);
        return this;
    }
    where(...args) {
        let key, operator, value, nested;
        if (args.length === 2) {
            key = args[0];
            operator = '==';
            value = args[1];
        }
        else if (args.length === 3) {
            key = args[0];
            operator = args[1];
            value = args[2];
        }
        else if (args.length === 4) {
            key = args[0];
            operator = args[1];
            value = args[2];
            nested = args[3];
        }
        if (!isOperator(operator)) {
            throw new Error(`Criteria where() operator "${operator}" not valid `);
        }
        this.addParameter('where', [key, operator, value, nested]);
        return this;
    }
    orWhere(...args) {
        let key, operator, value;
        if (args.length === 2) {
            key = args[0];
            operator = '==';
            value = args[1];
        }
        else {
            key = args[0];
            operator = args[1];
            value = args[2];
        }
        if (!isOperator(operator)) {
            throw new Error(`Criteria orWhere() operator "${operator}" not valid `);
        }
        this.addParameter('where', [key, operator, value, 'or']);
        return this;
    }
    /**
     * Get the criteria results.
     *
     * @returns
     */
    get() {
        return __awaiter(this, void 0, void 0, function* () {
            const parameters = this.compileParameters();
            const params = { parameters };
            const response = yield this.http.getEntries(this.stream.id, params);
            return EntryCollection.fromResponse(response, this.stream);
        });
    }
    /**
     * Get paginated criteria results.
     *
     * @param per_page
     * @param page
     * @returns
     */
    paginate(per_page = 100, page = 1) {
        return __awaiter(this, void 0, void 0, function* () {
            let parameters = this.compileParameters();
            let params = { parameters, paginate: true, per_page, page };
            const response = yield this.http.getEntries(this.stream.id, params);
            return PaginatedEntryCollection.fromResponse(response, this.stream);
        });
    }
    //count(): number { return 0; }
    /**
     * Create a new entry.
     *
     * @param attributes
     * @returns
     */
    create(attributes) {
        return __awaiter(this, void 0, void 0, function* () {
            let entry = this.newInstance(attributes);
            yield entry.save();
            return entry;
        });
    }
    /**
     * Save an entry.
     *
     * @param entry
     * @returns
     */
    save(entry) {
        return __awaiter(this, void 0, void 0, function* () {
            return entry.save();
        });
    }
    delete() { return this; }
    //truncate(): this { return this; }
    /**
     * Return an entry instance.
     *
     * @param attributes
     * @returns Entry
     */
    newInstance(attributes) {
        return new Entry(this.stream, attributes, true);
    }
    /**
     * Get the parameters.
     *
     * @returns
     */
    getParameters() {
        return this.parameters;
    }
    /**
     * Set the parameters.
     *
     * @param parameters
     * @returns
     */
    setParameters(parameters) {
        this.parameters = parameters;
        return this;
    }
    /**
     * Add a statement.
     *
     * @param name
     * @param value
     * @returns
     */
    addParameter(name, value) {
        this.parameters.push({ name, value });
        return this;
    }
    /**
     * Return standardized parameters.
     *
     * @returns
     */
    compileParameters() {
        return this.parameters.map(statement => ({ [statement.name]: ensureArray(statement.value) }));
    }
}

class Repository {
    /**
     * Create a new repository instance.
     *
     * @param stream
     */
    constructor(stream) {
        this.stream = stream;
    }
    get http() {
        return this.stream.getStreams().http;
    }
    /**
     * Return all items.
     *
     * @returns EntryCollection
     */
    all() {
        return __awaiter(this, void 0, void 0, function* () {
            let response = yield this.http.getEntries(this.stream.id);
            let entries = response.data.data.map(entry => new Entry(this.stream, entry, false));
            return new EntryCollection(entries, response.data.meta, response.data.links);
        });
    }
    /**
     * Find an entry by ID.
     *
     * @param id
     * @returns Entry
     */
    find(id) {
        return __awaiter(this, void 0, void 0, function* () {
            let response = yield this.http.getEntry(this.stream.id, id);
            let entry = new Entry(this.stream, response.data.data, false);
            return entry;
        });
    }
    /**
     * Find all records by IDs.
     *
     * @param ids
     * @returns EntryCollection
     */
    findAll(ids) {
        return __awaiter(this, void 0, void 0, function* () {
            let criteria = this.stream.getEntries();
            return criteria.where('id', 'IN', ids).get();
        });
    }
    /**
     * Find an entry by a field value.
     *
     * @param field
     * @param value
     * @returns Entry
     */
    findBy(field, value) {
        return __awaiter(this, void 0, void 0, function* () {
            let criteria = this.stream.getEntries();
            return criteria.where(field, value).first();
        });
    }
    findAllWhere(field, value) {
        return __awaiter(this, void 0, void 0, function* () {
            let criteria = this.stream.getEntries();
            return criteria.where(field, value).get();
        });
    }
    /**
     * Create a new entry.
     *
     * @param attributes
     * @returns
     */
    create(attributes) {
        return __awaiter(this, void 0, void 0, function* () {
            let entry = this.newCriteria().newInstance(attributes);
            yield entry.save();
            return entry;
        });
    }
    /**
     * Save an entry.
     *
     * @param entry
     * @returns
     */
    save(entry) {
        return __awaiter(this, void 0, void 0, function* () {
            return entry.save();
        });
    }
    /**
     * Save an entry.
     *
     * @param entry
     * @returns
     */
    delete(entry) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.http.deleteEntry(this.stream.id, entry.id);
            return true;
        });
    }
    truncate() { return this; }
    /**
     * Return a new instance.
     *
     * @param attributes
     * @returns
     */
    newInstance(attributes) {
        return this.newCriteria().newInstance(attributes);
    }
    /**
     * Return a new entry criteria.
     *
     * @returns Criteria
     */
    newCriteria() {
        return new Criteria(this.stream);
    }
}

class FieldCollection extends Collection {
    constructor(fields) {
        super(fields);
    }
    serialize() {
        return this.toArray().map(([id, field]) => [id, field.serialize()]).reduce(objectify, {});
    }
}

var _Stream_proxy, _Stream_stream, _Stream_streams, _Stream_meta, _Stream_links, _Stream_repository, _Stream_fields;
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
class Stream {
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

class Http {
    constructor(streams) {
        this.streams = streams;
    }
    get config() { return this.streams.config; }
    getStreams(params = {}, config = {}) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.request('get', `/streams`, Object.assign({ params }, config));
        });
    }
    postStream(data, config = {}) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.request('post', `/streams`, Object.assign({ data }, config));
        });
    }
    getStream(stream, params = {}, config = {}) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.request('get', `/streams/${stream}`, config);
        });
    }
    patchStream(stream, data = {}, config = {}) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.request('patch', `/streams/${stream}`, Object.assign({ data }, config));
        });
    }
    putStream(stream, data = {}, config = {}) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.request('put', `/streams/${stream}`, Object.assign({ data }, config));
        });
    }
    deleteStream(stream, config = {}) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.request('delete', `/streams/${stream}`, config);
        });
    }
    getEntries(stream, params = {}, config = {}) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.request('get', `/streams/${stream}/entries`, Object.assign({ params }, config));
        });
    }
    postEntry(stream, data = {}, config = {}) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.request('post', `/streams/${stream}/entries`, Object.assign({ data }, config));
        });
    }
    getEntry(stream, entry, config = {}) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.request('get', `/streams/${stream}/entries/${entry}`, config);
        });
    }
    patchEntry(stream, entry, data = {}, config = {}) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.request('patch', `/streams/${stream}/entries/${entry}`, Object.assign({ data }, config));
        });
    }
    putEntry(stream, entry, data = {}, config = {}) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.request('put', `/streams/${stream}/entries/${entry}`, Object.assign({ data }, config));
        });
    }
    deleteEntry(stream, entry, config = {}) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.request('delete', `/streams/${stream}/entries/${entry}`, config);
        });
    }
    request(method, url, ...args) {
        return __awaiter(this, void 0, void 0, function* () {
            let config = args[0] || {};
            let data = args[1] || undefined;
            const response = yield this.streams.createRequest().send(Object.assign({ method, url, data }, config));
            return response;
        });
    }
}

// shim for using process in browser
// based off https://github.com/defunctzombie/node-process/blob/master/browser.js

function defaultSetTimout() {
    throw new Error('setTimeout has not been defined');
}
function defaultClearTimeout () {
    throw new Error('clearTimeout has not been defined');
}
var cachedSetTimeout = defaultSetTimout;
var cachedClearTimeout = defaultClearTimeout;
if (typeof global.setTimeout === 'function') {
    cachedSetTimeout = setTimeout;
}
if (typeof global.clearTimeout === 'function') {
    cachedClearTimeout = clearTimeout;
}

function runTimeout(fun) {
    if (cachedSetTimeout === setTimeout) {
        //normal enviroments in sane situations
        return setTimeout(fun, 0);
    }
    // if setTimeout wasn't available but was latter defined
    if ((cachedSetTimeout === defaultSetTimout || !cachedSetTimeout) && setTimeout) {
        cachedSetTimeout = setTimeout;
        return setTimeout(fun, 0);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedSetTimeout(fun, 0);
    } catch(e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't trust the global object when called normally
            return cachedSetTimeout.call(null, fun, 0);
        } catch(e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error
            return cachedSetTimeout.call(this, fun, 0);
        }
    }


}
function runClearTimeout(marker) {
    if (cachedClearTimeout === clearTimeout) {
        //normal enviroments in sane situations
        return clearTimeout(marker);
    }
    // if clearTimeout wasn't available but was latter defined
    if ((cachedClearTimeout === defaultClearTimeout || !cachedClearTimeout) && clearTimeout) {
        cachedClearTimeout = clearTimeout;
        return clearTimeout(marker);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedClearTimeout(marker);
    } catch (e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't  trust the global object when called normally
            return cachedClearTimeout.call(null, marker);
        } catch (e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error.
            // Some versions of I.E. have different rules for clearTimeout vs setTimeout
            return cachedClearTimeout.call(this, marker);
        }
    }



}
var queue = [];
var draining = false;
var currentQueue;
var queueIndex = -1;

function cleanUpNextTick() {
    if (!draining || !currentQueue) {
        return;
    }
    draining = false;
    if (currentQueue.length) {
        queue = currentQueue.concat(queue);
    } else {
        queueIndex = -1;
    }
    if (queue.length) {
        drainQueue();
    }
}

function drainQueue() {
    if (draining) {
        return;
    }
    var timeout = runTimeout(cleanUpNextTick);
    draining = true;

    var len = queue.length;
    while(len) {
        currentQueue = queue;
        queue = [];
        while (++queueIndex < len) {
            if (currentQueue) {
                currentQueue[queueIndex].run();
            }
        }
        queueIndex = -1;
        len = queue.length;
    }
    currentQueue = null;
    draining = false;
    runClearTimeout(timeout);
}
function nextTick(fun) {
    var args = new Array(arguments.length - 1);
    if (arguments.length > 1) {
        for (var i = 1; i < arguments.length; i++) {
            args[i - 1] = arguments[i];
        }
    }
    queue.push(new Item(fun, args));
    if (queue.length === 1 && !draining) {
        runTimeout(drainQueue);
    }
}
// v8 likes predictible objects
function Item(fun, array) {
    this.fun = fun;
    this.array = array;
}
Item.prototype.run = function () {
    this.fun.apply(null, this.array);
};
var title = 'browser';
var platform = 'browser';
var browser = true;
var env = {};
var argv = [];
var version = ''; // empty string to avoid regexp issues
var versions = {};
var release = {};
var config = {};

function noop() {}

var on = noop;
var addListener = noop;
var once = noop;
var off = noop;
var removeListener = noop;
var removeAllListeners = noop;
var emit = noop;

function binding(name) {
    throw new Error('process.binding is not supported');
}

function cwd () { return '/' }
function chdir (dir) {
    throw new Error('process.chdir is not supported');
}function umask() { return 0; }

// from https://github.com/kumavis/browser-process-hrtime/blob/master/index.js
var performance = global.performance || {};
var performanceNow =
  performance.now        ||
  performance.mozNow     ||
  performance.msNow      ||
  performance.oNow       ||
  performance.webkitNow  ||
  function(){ return (new Date()).getTime() };

// generate timestamp or delta
// see http://nodejs.org/api/process.html#process_process_hrtime
function hrtime(previousTimestamp){
  var clocktime = performanceNow.call(performance)*1e-3;
  var seconds = Math.floor(clocktime);
  var nanoseconds = Math.floor((clocktime%1)*1e9);
  if (previousTimestamp) {
    seconds = seconds - previousTimestamp[0];
    nanoseconds = nanoseconds - previousTimestamp[1];
    if (nanoseconds<0) {
      seconds--;
      nanoseconds += 1e9;
    }
  }
  return [seconds,nanoseconds]
}

var startTime = new Date();
function uptime() {
  var currentTime = new Date();
  var dif = currentTime - startTime;
  return dif / 1000;
}

var browser$1 = {
  nextTick: nextTick,
  title: title,
  browser: browser,
  env: env,
  argv: argv,
  version: version,
  versions: versions,
  on: on,
  addListener: addListener,
  once: once,
  off: off,
  removeListener: removeListener,
  removeAllListeners: removeAllListeners,
  emit: emit,
  binding: binding,
  cwd: cwd,
  chdir: chdir,
  umask: umask,
  hrtime: hrtime,
  platform: platform,
  release: release,
  config: config,
  uptime: uptime
};

var inherits;
if (typeof Object.create === 'function'){
  inherits = function inherits(ctor, superCtor) {
    // implementation from standard node.js 'util' module
    ctor.super_ = superCtor;
    ctor.prototype = Object.create(superCtor.prototype, {
      constructor: {
        value: ctor,
        enumerable: false,
        writable: true,
        configurable: true
      }
    });
  };
} else {
  inherits = function inherits(ctor, superCtor) {
    ctor.super_ = superCtor;
    var TempCtor = function () {};
    TempCtor.prototype = superCtor.prototype;
    ctor.prototype = new TempCtor();
    ctor.prototype.constructor = ctor;
  };
}
var inherits$1 = inherits;

// Copyright Joyent, Inc. and other Node contributors.
var formatRegExp = /%[sdj%]/g;
function format(f) {
  if (!isString(f)) {
    var objects = [];
    for (var i = 0; i < arguments.length; i++) {
      objects.push(inspect(arguments[i]));
    }
    return objects.join(' ');
  }

  var i = 1;
  var args = arguments;
  var len = args.length;
  var str = String(f).replace(formatRegExp, function(x) {
    if (x === '%%') return '%';
    if (i >= len) return x;
    switch (x) {
      case '%s': return String(args[i++]);
      case '%d': return Number(args[i++]);
      case '%j':
        try {
          return JSON.stringify(args[i++]);
        } catch (_) {
          return '[Circular]';
        }
      default:
        return x;
    }
  });
  for (var x = args[i]; i < len; x = args[++i]) {
    if (isNull(x) || !isObject(x)) {
      str += ' ' + x;
    } else {
      str += ' ' + inspect(x);
    }
  }
  return str;
}

// Mark that a method should not be used.
// Returns a modified function which warns once by default.
// If --no-deprecation is set, then it is a no-op.
function deprecate(fn, msg) {
  // Allow for deprecating things in the process of starting up.
  if (isUndefined(global.process)) {
    return function() {
      return deprecate(fn, msg).apply(this, arguments);
    };
  }

  if (browser$1.noDeprecation === true) {
    return fn;
  }

  var warned = false;
  function deprecated() {
    if (!warned) {
      {
        console.error(msg);
      }
      warned = true;
    }
    return fn.apply(this, arguments);
  }

  return deprecated;
}

var debugs = {};
var debugEnviron;
function debuglog(set) {
  if (isUndefined(debugEnviron))
    debugEnviron = browser$1.env.NODE_DEBUG || '';
  set = set.toUpperCase();
  if (!debugs[set]) {
    if (new RegExp('\\b' + set + '\\b', 'i').test(debugEnviron)) {
      var pid = 0;
      debugs[set] = function() {
        var msg = format.apply(null, arguments);
        console.error('%s %d: %s', set, pid, msg);
      };
    } else {
      debugs[set] = function() {};
    }
  }
  return debugs[set];
}

/**
 * Echos the value of a value. Trys to print the value out
 * in the best way possible given the different types.
 *
 * @param {Object} obj The object to print out.
 * @param {Object} opts Optional options object that alters the output.
 */
/* legacy: obj, showHidden, depth, colors*/
function inspect(obj, opts) {
  // default options
  var ctx = {
    seen: [],
    stylize: stylizeNoColor
  };
  // legacy...
  if (arguments.length >= 3) ctx.depth = arguments[2];
  if (arguments.length >= 4) ctx.colors = arguments[3];
  if (isBoolean(opts)) {
    // legacy...
    ctx.showHidden = opts;
  } else if (opts) {
    // got an "options" object
    _extend(ctx, opts);
  }
  // set default options
  if (isUndefined(ctx.showHidden)) ctx.showHidden = false;
  if (isUndefined(ctx.depth)) ctx.depth = 2;
  if (isUndefined(ctx.colors)) ctx.colors = false;
  if (isUndefined(ctx.customInspect)) ctx.customInspect = true;
  if (ctx.colors) ctx.stylize = stylizeWithColor;
  return formatValue(ctx, obj, ctx.depth);
}

// http://en.wikipedia.org/wiki/ANSI_escape_code#graphics
inspect.colors = {
  'bold' : [1, 22],
  'italic' : [3, 23],
  'underline' : [4, 24],
  'inverse' : [7, 27],
  'white' : [37, 39],
  'grey' : [90, 39],
  'black' : [30, 39],
  'blue' : [34, 39],
  'cyan' : [36, 39],
  'green' : [32, 39],
  'magenta' : [35, 39],
  'red' : [31, 39],
  'yellow' : [33, 39]
};

// Don't use 'blue' not visible on cmd.exe
inspect.styles = {
  'special': 'cyan',
  'number': 'yellow',
  'boolean': 'yellow',
  'undefined': 'grey',
  'null': 'bold',
  'string': 'green',
  'date': 'magenta',
  // "name": intentionally not styling
  'regexp': 'red'
};


function stylizeWithColor(str, styleType) {
  var style = inspect.styles[styleType];

  if (style) {
    return '\u001b[' + inspect.colors[style][0] + 'm' + str +
           '\u001b[' + inspect.colors[style][1] + 'm';
  } else {
    return str;
  }
}


function stylizeNoColor(str, styleType) {
  return str;
}


function arrayToHash(array) {
  var hash = {};

  array.forEach(function(val, idx) {
    hash[val] = true;
  });

  return hash;
}


function formatValue(ctx, value, recurseTimes) {
  // Provide a hook for user-specified inspect functions.
  // Check that value is an object with an inspect function on it
  if (ctx.customInspect &&
      value &&
      isFunction(value.inspect) &&
      // Filter out the util module, it's inspect function is special
      value.inspect !== inspect &&
      // Also filter out any prototype objects using the circular check.
      !(value.constructor && value.constructor.prototype === value)) {
    var ret = value.inspect(recurseTimes, ctx);
    if (!isString(ret)) {
      ret = formatValue(ctx, ret, recurseTimes);
    }
    return ret;
  }

  // Primitive types cannot have properties
  var primitive = formatPrimitive(ctx, value);
  if (primitive) {
    return primitive;
  }

  // Look up the keys of the object.
  var keys = Object.keys(value);
  var visibleKeys = arrayToHash(keys);

  if (ctx.showHidden) {
    keys = Object.getOwnPropertyNames(value);
  }

  // IE doesn't make error fields non-enumerable
  // http://msdn.microsoft.com/en-us/library/ie/dww52sbt(v=vs.94).aspx
  if (isError(value)
      && (keys.indexOf('message') >= 0 || keys.indexOf('description') >= 0)) {
    return formatError(value);
  }

  // Some type of object without properties can be shortcutted.
  if (keys.length === 0) {
    if (isFunction(value)) {
      var name = value.name ? ': ' + value.name : '';
      return ctx.stylize('[Function' + name + ']', 'special');
    }
    if (isRegExp(value)) {
      return ctx.stylize(RegExp.prototype.toString.call(value), 'regexp');
    }
    if (isDate(value)) {
      return ctx.stylize(Date.prototype.toString.call(value), 'date');
    }
    if (isError(value)) {
      return formatError(value);
    }
  }

  var base = '', array = false, braces = ['{', '}'];

  // Make Array say that they are Array
  if (isArray(value)) {
    array = true;
    braces = ['[', ']'];
  }

  // Make functions say that they are functions
  if (isFunction(value)) {
    var n = value.name ? ': ' + value.name : '';
    base = ' [Function' + n + ']';
  }

  // Make RegExps say that they are RegExps
  if (isRegExp(value)) {
    base = ' ' + RegExp.prototype.toString.call(value);
  }

  // Make dates with properties first say the date
  if (isDate(value)) {
    base = ' ' + Date.prototype.toUTCString.call(value);
  }

  // Make error with message first say the error
  if (isError(value)) {
    base = ' ' + formatError(value);
  }

  if (keys.length === 0 && (!array || value.length == 0)) {
    return braces[0] + base + braces[1];
  }

  if (recurseTimes < 0) {
    if (isRegExp(value)) {
      return ctx.stylize(RegExp.prototype.toString.call(value), 'regexp');
    } else {
      return ctx.stylize('[Object]', 'special');
    }
  }

  ctx.seen.push(value);

  var output;
  if (array) {
    output = formatArray(ctx, value, recurseTimes, visibleKeys, keys);
  } else {
    output = keys.map(function(key) {
      return formatProperty(ctx, value, recurseTimes, visibleKeys, key, array);
    });
  }

  ctx.seen.pop();

  return reduceToSingleString(output, base, braces);
}


function formatPrimitive(ctx, value) {
  if (isUndefined(value))
    return ctx.stylize('undefined', 'undefined');
  if (isString(value)) {
    var simple = '\'' + JSON.stringify(value).replace(/^"|"$/g, '')
                                             .replace(/'/g, "\\'")
                                             .replace(/\\"/g, '"') + '\'';
    return ctx.stylize(simple, 'string');
  }
  if (isNumber(value))
    return ctx.stylize('' + value, 'number');
  if (isBoolean(value))
    return ctx.stylize('' + value, 'boolean');
  // For some reason typeof null is "object", so special case here.
  if (isNull(value))
    return ctx.stylize('null', 'null');
}


function formatError(value) {
  return '[' + Error.prototype.toString.call(value) + ']';
}


function formatArray(ctx, value, recurseTimes, visibleKeys, keys) {
  var output = [];
  for (var i = 0, l = value.length; i < l; ++i) {
    if (hasOwnProperty(value, String(i))) {
      output.push(formatProperty(ctx, value, recurseTimes, visibleKeys,
          String(i), true));
    } else {
      output.push('');
    }
  }
  keys.forEach(function(key) {
    if (!key.match(/^\d+$/)) {
      output.push(formatProperty(ctx, value, recurseTimes, visibleKeys,
          key, true));
    }
  });
  return output;
}


function formatProperty(ctx, value, recurseTimes, visibleKeys, key, array) {
  var name, str, desc;
  desc = Object.getOwnPropertyDescriptor(value, key) || { value: value[key] };
  if (desc.get) {
    if (desc.set) {
      str = ctx.stylize('[Getter/Setter]', 'special');
    } else {
      str = ctx.stylize('[Getter]', 'special');
    }
  } else {
    if (desc.set) {
      str = ctx.stylize('[Setter]', 'special');
    }
  }
  if (!hasOwnProperty(visibleKeys, key)) {
    name = '[' + key + ']';
  }
  if (!str) {
    if (ctx.seen.indexOf(desc.value) < 0) {
      if (isNull(recurseTimes)) {
        str = formatValue(ctx, desc.value, null);
      } else {
        str = formatValue(ctx, desc.value, recurseTimes - 1);
      }
      if (str.indexOf('\n') > -1) {
        if (array) {
          str = str.split('\n').map(function(line) {
            return '  ' + line;
          }).join('\n').substr(2);
        } else {
          str = '\n' + str.split('\n').map(function(line) {
            return '   ' + line;
          }).join('\n');
        }
      }
    } else {
      str = ctx.stylize('[Circular]', 'special');
    }
  }
  if (isUndefined(name)) {
    if (array && key.match(/^\d+$/)) {
      return str;
    }
    name = JSON.stringify('' + key);
    if (name.match(/^"([a-zA-Z_][a-zA-Z_0-9]*)"$/)) {
      name = name.substr(1, name.length - 2);
      name = ctx.stylize(name, 'name');
    } else {
      name = name.replace(/'/g, "\\'")
                 .replace(/\\"/g, '"')
                 .replace(/(^"|"$)/g, "'");
      name = ctx.stylize(name, 'string');
    }
  }

  return name + ': ' + str;
}


function reduceToSingleString(output, base, braces) {
  var length = output.reduce(function(prev, cur) {
    if (cur.indexOf('\n') >= 0) ;
    return prev + cur.replace(/\u001b\[\d\d?m/g, '').length + 1;
  }, 0);

  if (length > 60) {
    return braces[0] +
           (base === '' ? '' : base + '\n ') +
           ' ' +
           output.join(',\n  ') +
           ' ' +
           braces[1];
  }

  return braces[0] + base + ' ' + output.join(', ') + ' ' + braces[1];
}


// NOTE: These type checking functions intentionally don't use `instanceof`
// because it is fragile and can be easily faked with `Object.create()`.
function isArray(ar) {
  return Array.isArray(ar);
}

function isBoolean(arg) {
  return typeof arg === 'boolean';
}

function isNull(arg) {
  return arg === null;
}

function isNullOrUndefined(arg) {
  return arg == null;
}

function isNumber(arg) {
  return typeof arg === 'number';
}

function isString(arg) {
  return typeof arg === 'string';
}

function isSymbol(arg) {
  return typeof arg === 'symbol';
}

function isUndefined(arg) {
  return arg === void 0;
}

function isRegExp(re) {
  return isObject(re) && objectToString(re) === '[object RegExp]';
}

function isObject(arg) {
  return typeof arg === 'object' && arg !== null;
}

function isDate(d) {
  return isObject(d) && objectToString(d) === '[object Date]';
}

function isError(e) {
  return isObject(e) &&
      (objectToString(e) === '[object Error]' || e instanceof Error);
}

function isFunction(arg) {
  return typeof arg === 'function';
}

function isPrimitive(arg) {
  return arg === null ||
         typeof arg === 'boolean' ||
         typeof arg === 'number' ||
         typeof arg === 'string' ||
         typeof arg === 'symbol' ||  // ES6 symbol
         typeof arg === 'undefined';
}

function isBuffer(maybeBuf) {
  return Buffer.isBuffer(maybeBuf);
}

function objectToString(o) {
  return Object.prototype.toString.call(o);
}


function pad(n) {
  return n < 10 ? '0' + n.toString(10) : n.toString(10);
}


var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep',
              'Oct', 'Nov', 'Dec'];

// 26 Feb 16:19:34
function timestamp() {
  var d = new Date();
  var time = [pad(d.getHours()),
              pad(d.getMinutes()),
              pad(d.getSeconds())].join(':');
  return [d.getDate(), months[d.getMonth()], time].join(' ');
}


// log is just a thin wrapper to console.log that prepends a timestamp
function log() {
  console.log('%s - %s', timestamp(), format.apply(null, arguments));
}

function _extend(origin, add) {
  // Don't do anything if add isn't an object
  if (!add || !isObject(add)) return origin;

  var keys = Object.keys(add);
  var i = keys.length;
  while (i--) {
    origin[keys[i]] = add[keys[i]];
  }
  return origin;
}
function hasOwnProperty(obj, prop) {
  return Object.prototype.hasOwnProperty.call(obj, prop);
}

var _polyfillNode_util = {
  inherits: inherits$1,
  _extend: _extend,
  log: log,
  isBuffer: isBuffer,
  isPrimitive: isPrimitive,
  isFunction: isFunction,
  isError: isError,
  isDate: isDate,
  isObject: isObject,
  isRegExp: isRegExp,
  isUndefined: isUndefined,
  isSymbol: isSymbol,
  isString: isString,
  isNumber: isNumber,
  isNullOrUndefined: isNullOrUndefined,
  isNull: isNull,
  isBoolean: isBoolean,
  isArray: isArray,
  inspect: inspect,
  deprecate: deprecate,
  format: format,
  debuglog: debuglog
};

var _polyfillNode_util$1 = /*#__PURE__*/Object.freeze({
	__proto__: null,
	format: format,
	deprecate: deprecate,
	debuglog: debuglog,
	inspect: inspect,
	isArray: isArray,
	isBoolean: isBoolean,
	isNull: isNull,
	isNullOrUndefined: isNullOrUndefined,
	isNumber: isNumber,
	isString: isString,
	isSymbol: isSymbol,
	isUndefined: isUndefined,
	isRegExp: isRegExp,
	isObject: isObject,
	isDate: isDate,
	isError: isError,
	isFunction: isFunction,
	isPrimitive: isPrimitive,
	isBuffer: isBuffer,
	log: log,
	inherits: inherits$1,
	_extend: _extend,
	'default': _polyfillNode_util
});

var require$$0 = /*@__PURE__*/getAugmentedNamespace(_polyfillNode_util$1);

/*
	MIT License http://www.opensource.org/licenses/mit-license.php
	Author Tobias Koppers @sokra
*/

const util$1 = require$$0;

const deprecateContext = util$1.deprecate(() => {},
"Hook.context is deprecated and will be removed");

const CALL_DELEGATE = function(...args) {
	this.call = this._createCall("sync");
	return this.call(...args);
};
const CALL_ASYNC_DELEGATE = function(...args) {
	this.callAsync = this._createCall("async");
	return this.callAsync(...args);
};
const PROMISE_DELEGATE = function(...args) {
	this.promise = this._createCall("promise");
	return this.promise(...args);
};

class Hook$3 {
	constructor(args = [], name = undefined) {
		this._args = args;
		this.name = name;
		this.taps = [];
		this.interceptors = [];
		this._call = CALL_DELEGATE;
		this.call = CALL_DELEGATE;
		this._callAsync = CALL_ASYNC_DELEGATE;
		this.callAsync = CALL_ASYNC_DELEGATE;
		this._promise = PROMISE_DELEGATE;
		this.promise = PROMISE_DELEGATE;
		this._x = undefined;

		this.compile = this.compile;
		this.tap = this.tap;
		this.tapAsync = this.tapAsync;
		this.tapPromise = this.tapPromise;
	}

	compile(options) {
		throw new Error("Abstract: should be overridden");
	}

	_createCall(type) {
		return this.compile({
			taps: this.taps,
			interceptors: this.interceptors,
			args: this._args,
			type: type
		});
	}

	_tap(type, options, fn) {
		if (typeof options === "string") {
			options = {
				name: options.trim()
			};
		} else if (typeof options !== "object" || options === null) {
			throw new Error("Invalid tap options");
		}
		if (typeof options.name !== "string" || options.name === "") {
			throw new Error("Missing name for tap");
		}
		if (typeof options.context !== "undefined") {
			deprecateContext();
		}
		options = Object.assign({ type, fn }, options);
		options = this._runRegisterInterceptors(options);
		this._insert(options);
	}

	tap(options, fn) {
		this._tap("sync", options, fn);
	}

	tapAsync(options, fn) {
		this._tap("async", options, fn);
	}

	tapPromise(options, fn) {
		this._tap("promise", options, fn);
	}

	_runRegisterInterceptors(options) {
		for (const interceptor of this.interceptors) {
			if (interceptor.register) {
				const newOptions = interceptor.register(options);
				if (newOptions !== undefined) {
					options = newOptions;
				}
			}
		}
		return options;
	}

	withOptions(options) {
		const mergeOptions = opt =>
			Object.assign({}, options, typeof opt === "string" ? { name: opt } : opt);

		return {
			name: this.name,
			tap: (opt, fn) => this.tap(mergeOptions(opt), fn),
			tapAsync: (opt, fn) => this.tapAsync(mergeOptions(opt), fn),
			tapPromise: (opt, fn) => this.tapPromise(mergeOptions(opt), fn),
			intercept: interceptor => this.intercept(interceptor),
			isUsed: () => this.isUsed(),
			withOptions: opt => this.withOptions(mergeOptions(opt))
		};
	}

	isUsed() {
		return this.taps.length > 0 || this.interceptors.length > 0;
	}

	intercept(interceptor) {
		this._resetCompilation();
		this.interceptors.push(Object.assign({}, interceptor));
		if (interceptor.register) {
			for (let i = 0; i < this.taps.length; i++) {
				this.taps[i] = interceptor.register(this.taps[i]);
			}
		}
	}

	_resetCompilation() {
		this.call = this._call;
		this.callAsync = this._callAsync;
		this.promise = this._promise;
	}

	_insert(item) {
		this._resetCompilation();
		let before;
		if (typeof item.before === "string") {
			before = new Set([item.before]);
		} else if (Array.isArray(item.before)) {
			before = new Set(item.before);
		}
		let stage = 0;
		if (typeof item.stage === "number") {
			stage = item.stage;
		}
		let i = this.taps.length;
		while (i > 0) {
			i--;
			const x = this.taps[i];
			this.taps[i + 1] = x;
			const xStage = x.stage || 0;
			if (before) {
				if (before.has(x.name)) {
					before.delete(x.name);
					continue;
				}
				if (before.size > 0) {
					continue;
				}
			}
			if (xStage > stage) {
				continue;
			}
			i++;
			break;
		}
		this.taps[i] = item;
	}
}

Object.setPrototypeOf(Hook$3.prototype, null);

var Hook_1 = Hook$3;

/*
	MIT License http://www.opensource.org/licenses/mit-license.php
	Author Tobias Koppers @sokra
*/

class HookCodeFactory$a {
	constructor(config) {
		this.config = config;
		this.options = undefined;
		this._args = undefined;
	}

	create(options) {
		this.init(options);
		let fn;
		switch (this.options.type) {
			case "sync":
				fn = new Function(
					this.args(),
					'"use strict";\n' +
						this.header() +
						this.contentWithInterceptors({
							onError: err => `throw ${err};\n`,
							onResult: result => `return ${result};\n`,
							resultReturns: true,
							onDone: () => "",
							rethrowIfPossible: true
						})
				);
				break;
			case "async":
				fn = new Function(
					this.args({
						after: "_callback"
					}),
					'"use strict";\n' +
						this.header() +
						this.contentWithInterceptors({
							onError: err => `_callback(${err});\n`,
							onResult: result => `_callback(null, ${result});\n`,
							onDone: () => "_callback();\n"
						})
				);
				break;
			case "promise":
				let errorHelperUsed = false;
				const content = this.contentWithInterceptors({
					onError: err => {
						errorHelperUsed = true;
						return `_error(${err});\n`;
					},
					onResult: result => `_resolve(${result});\n`,
					onDone: () => "_resolve();\n"
				});
				let code = "";
				code += '"use strict";\n';
				code += this.header();
				code += "return new Promise((function(_resolve, _reject) {\n";
				if (errorHelperUsed) {
					code += "var _sync = true;\n";
					code += "function _error(_err) {\n";
					code += "if(_sync)\n";
					code +=
						"_resolve(Promise.resolve().then((function() { throw _err; })));\n";
					code += "else\n";
					code += "_reject(_err);\n";
					code += "};\n";
				}
				code += content;
				if (errorHelperUsed) {
					code += "_sync = false;\n";
				}
				code += "}));\n";
				fn = new Function(this.args(), code);
				break;
		}
		this.deinit();
		return fn;
	}

	setup(instance, options) {
		instance._x = options.taps.map(t => t.fn);
	}

	/**
	 * @param {{ type: "sync" | "promise" | "async", taps: Array<Tap>, interceptors: Array<Interceptor> }} options
	 */
	init(options) {
		this.options = options;
		this._args = options.args.slice();
	}

	deinit() {
		this.options = undefined;
		this._args = undefined;
	}

	contentWithInterceptors(options) {
		if (this.options.interceptors.length > 0) {
			const onError = options.onError;
			const onResult = options.onResult;
			const onDone = options.onDone;
			let code = "";
			for (let i = 0; i < this.options.interceptors.length; i++) {
				const interceptor = this.options.interceptors[i];
				if (interceptor.call) {
					code += `${this.getInterceptor(i)}.call(${this.args({
						before: interceptor.context ? "_context" : undefined
					})});\n`;
				}
			}
			code += this.content(
				Object.assign(options, {
					onError:
						onError &&
						(err => {
							let code = "";
							for (let i = 0; i < this.options.interceptors.length; i++) {
								const interceptor = this.options.interceptors[i];
								if (interceptor.error) {
									code += `${this.getInterceptor(i)}.error(${err});\n`;
								}
							}
							code += onError(err);
							return code;
						}),
					onResult:
						onResult &&
						(result => {
							let code = "";
							for (let i = 0; i < this.options.interceptors.length; i++) {
								const interceptor = this.options.interceptors[i];
								if (interceptor.result) {
									code += `${this.getInterceptor(i)}.result(${result});\n`;
								}
							}
							code += onResult(result);
							return code;
						}),
					onDone:
						onDone &&
						(() => {
							let code = "";
							for (let i = 0; i < this.options.interceptors.length; i++) {
								const interceptor = this.options.interceptors[i];
								if (interceptor.done) {
									code += `${this.getInterceptor(i)}.done();\n`;
								}
							}
							code += onDone();
							return code;
						})
				})
			);
			return code;
		} else {
			return this.content(options);
		}
	}

	header() {
		let code = "";
		if (this.needContext()) {
			code += "var _context = {};\n";
		} else {
			code += "var _context;\n";
		}
		code += "var _x = this._x;\n";
		if (this.options.interceptors.length > 0) {
			code += "var _taps = this.taps;\n";
			code += "var _interceptors = this.interceptors;\n";
		}
		return code;
	}

	needContext() {
		for (const tap of this.options.taps) if (tap.context) return true;
		return false;
	}

	callTap(tapIndex, { onError, onResult, onDone, rethrowIfPossible }) {
		let code = "";
		let hasTapCached = false;
		for (let i = 0; i < this.options.interceptors.length; i++) {
			const interceptor = this.options.interceptors[i];
			if (interceptor.tap) {
				if (!hasTapCached) {
					code += `var _tap${tapIndex} = ${this.getTap(tapIndex)};\n`;
					hasTapCached = true;
				}
				code += `${this.getInterceptor(i)}.tap(${
					interceptor.context ? "_context, " : ""
				}_tap${tapIndex});\n`;
			}
		}
		code += `var _fn${tapIndex} = ${this.getTapFn(tapIndex)};\n`;
		const tap = this.options.taps[tapIndex];
		switch (tap.type) {
			case "sync":
				if (!rethrowIfPossible) {
					code += `var _hasError${tapIndex} = false;\n`;
					code += "try {\n";
				}
				if (onResult) {
					code += `var _result${tapIndex} = _fn${tapIndex}(${this.args({
						before: tap.context ? "_context" : undefined
					})});\n`;
				} else {
					code += `_fn${tapIndex}(${this.args({
						before: tap.context ? "_context" : undefined
					})});\n`;
				}
				if (!rethrowIfPossible) {
					code += "} catch(_err) {\n";
					code += `_hasError${tapIndex} = true;\n`;
					code += onError("_err");
					code += "}\n";
					code += `if(!_hasError${tapIndex}) {\n`;
				}
				if (onResult) {
					code += onResult(`_result${tapIndex}`);
				}
				if (onDone) {
					code += onDone();
				}
				if (!rethrowIfPossible) {
					code += "}\n";
				}
				break;
			case "async":
				let cbCode = "";
				if (onResult)
					cbCode += `(function(_err${tapIndex}, _result${tapIndex}) {\n`;
				else cbCode += `(function(_err${tapIndex}) {\n`;
				cbCode += `if(_err${tapIndex}) {\n`;
				cbCode += onError(`_err${tapIndex}`);
				cbCode += "} else {\n";
				if (onResult) {
					cbCode += onResult(`_result${tapIndex}`);
				}
				if (onDone) {
					cbCode += onDone();
				}
				cbCode += "}\n";
				cbCode += "})";
				code += `_fn${tapIndex}(${this.args({
					before: tap.context ? "_context" : undefined,
					after: cbCode
				})});\n`;
				break;
			case "promise":
				code += `var _hasResult${tapIndex} = false;\n`;
				code += `var _promise${tapIndex} = _fn${tapIndex}(${this.args({
					before: tap.context ? "_context" : undefined
				})});\n`;
				code += `if (!_promise${tapIndex} || !_promise${tapIndex}.then)\n`;
				code += `  throw new Error('Tap function (tapPromise) did not return promise (returned ' + _promise${tapIndex} + ')');\n`;
				code += `_promise${tapIndex}.then((function(_result${tapIndex}) {\n`;
				code += `_hasResult${tapIndex} = true;\n`;
				if (onResult) {
					code += onResult(`_result${tapIndex}`);
				}
				if (onDone) {
					code += onDone();
				}
				code += `}), function(_err${tapIndex}) {\n`;
				code += `if(_hasResult${tapIndex}) throw _err${tapIndex};\n`;
				code += onError(`_err${tapIndex}`);
				code += "});\n";
				break;
		}
		return code;
	}

	callTapsSeries({
		onError,
		onResult,
		resultReturns,
		onDone,
		doneReturns,
		rethrowIfPossible
	}) {
		if (this.options.taps.length === 0) return onDone();
		const firstAsync = this.options.taps.findIndex(t => t.type !== "sync");
		const somethingReturns = resultReturns || doneReturns;
		let code = "";
		let current = onDone;
		let unrollCounter = 0;
		for (let j = this.options.taps.length - 1; j >= 0; j--) {
			const i = j;
			const unroll =
				current !== onDone &&
				(this.options.taps[i].type !== "sync" || unrollCounter++ > 20);
			if (unroll) {
				unrollCounter = 0;
				code += `function _next${i}() {\n`;
				code += current();
				code += `}\n`;
				current = () => `${somethingReturns ? "return " : ""}_next${i}();\n`;
			}
			const done = current;
			const doneBreak = skipDone => {
				if (skipDone) return "";
				return onDone();
			};
			const content = this.callTap(i, {
				onError: error => onError(i, error, done, doneBreak),
				onResult:
					onResult &&
					(result => {
						return onResult(i, result, done, doneBreak);
					}),
				onDone: !onResult && done,
				rethrowIfPossible:
					rethrowIfPossible && (firstAsync < 0 || i < firstAsync)
			});
			current = () => content;
		}
		code += current();
		return code;
	}

	callTapsLooping({ onError, onDone, rethrowIfPossible }) {
		if (this.options.taps.length === 0) return onDone();
		const syncOnly = this.options.taps.every(t => t.type === "sync");
		let code = "";
		if (!syncOnly) {
			code += "var _looper = (function() {\n";
			code += "var _loopAsync = false;\n";
		}
		code += "var _loop;\n";
		code += "do {\n";
		code += "_loop = false;\n";
		for (let i = 0; i < this.options.interceptors.length; i++) {
			const interceptor = this.options.interceptors[i];
			if (interceptor.loop) {
				code += `${this.getInterceptor(i)}.loop(${this.args({
					before: interceptor.context ? "_context" : undefined
				})});\n`;
			}
		}
		code += this.callTapsSeries({
			onError,
			onResult: (i, result, next, doneBreak) => {
				let code = "";
				code += `if(${result} !== undefined) {\n`;
				code += "_loop = true;\n";
				if (!syncOnly) code += "if(_loopAsync) _looper();\n";
				code += doneBreak(true);
				code += `} else {\n`;
				code += next();
				code += `}\n`;
				return code;
			},
			onDone:
				onDone &&
				(() => {
					let code = "";
					code += "if(!_loop) {\n";
					code += onDone();
					code += "}\n";
					return code;
				}),
			rethrowIfPossible: rethrowIfPossible && syncOnly
		});
		code += "} while(_loop);\n";
		if (!syncOnly) {
			code += "_loopAsync = true;\n";
			code += "});\n";
			code += "_looper();\n";
		}
		return code;
	}

	callTapsParallel({
		onError,
		onResult,
		onDone,
		rethrowIfPossible,
		onTap = (i, run) => run()
	}) {
		if (this.options.taps.length <= 1) {
			return this.callTapsSeries({
				onError,
				onResult,
				onDone,
				rethrowIfPossible
			});
		}
		let code = "";
		code += "do {\n";
		code += `var _counter = ${this.options.taps.length};\n`;
		if (onDone) {
			code += "var _done = (function() {\n";
			code += onDone();
			code += "});\n";
		}
		for (let i = 0; i < this.options.taps.length; i++) {
			const done = () => {
				if (onDone) return "if(--_counter === 0) _done();\n";
				else return "--_counter;";
			};
			const doneBreak = skipDone => {
				if (skipDone || !onDone) return "_counter = 0;\n";
				else return "_counter = 0;\n_done();\n";
			};
			code += "if(_counter <= 0) break;\n";
			code += onTap(
				i,
				() =>
					this.callTap(i, {
						onError: error => {
							let code = "";
							code += "if(_counter > 0) {\n";
							code += onError(i, error, done, doneBreak);
							code += "}\n";
							return code;
						},
						onResult:
							onResult &&
							(result => {
								let code = "";
								code += "if(_counter > 0) {\n";
								code += onResult(i, result, done, doneBreak);
								code += "}\n";
								return code;
							}),
						onDone:
							!onResult &&
							(() => {
								return done();
							}),
						rethrowIfPossible
					}),
				done,
				doneBreak
			);
		}
		code += "} while(false);\n";
		return code;
	}

	args({ before, after } = {}) {
		let allArgs = this._args;
		if (before) allArgs = [before].concat(allArgs);
		if (after) allArgs = allArgs.concat(after);
		if (allArgs.length === 0) {
			return "";
		} else {
			return allArgs.join(", ");
		}
	}

	getTapFn(idx) {
		return `_x[${idx}]`;
	}

	getTap(idx) {
		return `_taps[${idx}]`;
	}

	getInterceptor(idx) {
		return `_interceptors[${idx}]`;
	}
}

var HookCodeFactory_1 = HookCodeFactory$a;

/*
	MIT License http://www.opensource.org/licenses/mit-license.php
	Author Tobias Koppers @sokra
*/

const Hook$2 = Hook_1;
const HookCodeFactory$9 = HookCodeFactory_1;

class SyncHookCodeFactory extends HookCodeFactory$9 {
	content({ onError, onDone, rethrowIfPossible }) {
		return this.callTapsSeries({
			onError: (i, err) => onError(err),
			onDone,
			rethrowIfPossible
		});
	}
}

const factory$2 = new SyncHookCodeFactory();

const TAP_ASYNC$1 = () => {
	throw new Error("tapAsync is not supported on a SyncHook");
};

const TAP_PROMISE$1 = () => {
	throw new Error("tapPromise is not supported on a SyncHook");
};

const COMPILE$2 = function(options) {
	factory$2.setup(this, options);
	return factory$2.create(options);
};

function SyncHook$1(args = [], name = undefined) {
	const hook = new Hook$2(args, name);
	hook.constructor = SyncHook$1;
	hook.tapAsync = TAP_ASYNC$1;
	hook.tapPromise = TAP_PROMISE$1;
	hook.compile = COMPILE$2;
	return hook;
}

SyncHook$1.prototype = null;

var SyncHook_1 = SyncHook$1;

/*
	MIT License http://www.opensource.org/licenses/mit-license.php
	Author Tobias Koppers @sokra
*/
const HookCodeFactory$8 = HookCodeFactory_1;

class SyncBailHookCodeFactory extends HookCodeFactory$8 {
	content({ onError, onResult, resultReturns, onDone, rethrowIfPossible }) {
		return this.callTapsSeries({
			onError: (i, err) => onError(err),
			onResult: (i, result, next) =>
				`if(${result} !== undefined) {\n${onResult(
					result
				)};\n} else {\n${next()}}\n`,
			resultReturns,
			onDone,
			rethrowIfPossible
		});
	}
}

new SyncBailHookCodeFactory();

/*
	MIT License http://www.opensource.org/licenses/mit-license.php
	Author Tobias Koppers @sokra
*/

const Hook$1 = Hook_1;
const HookCodeFactory$7 = HookCodeFactory_1;

class SyncWaterfallHookCodeFactory extends HookCodeFactory$7 {
	content({ onError, onResult, resultReturns, rethrowIfPossible }) {
		return this.callTapsSeries({
			onError: (i, err) => onError(err),
			onResult: (i, result, next) => {
				let code = "";
				code += `if(${result} !== undefined) {\n`;
				code += `${this._args[0]} = ${result};\n`;
				code += `}\n`;
				code += next();
				return code;
			},
			onDone: () => onResult(this._args[0]),
			doneReturns: resultReturns,
			rethrowIfPossible
		});
	}
}

const factory$1 = new SyncWaterfallHookCodeFactory();

const TAP_ASYNC = () => {
	throw new Error("tapAsync is not supported on a SyncWaterfallHook");
};

const TAP_PROMISE = () => {
	throw new Error("tapPromise is not supported on a SyncWaterfallHook");
};

const COMPILE$1 = function(options) {
	factory$1.setup(this, options);
	return factory$1.create(options);
};

function SyncWaterfallHook$1(args = [], name = undefined) {
	if (args.length < 1)
		throw new Error("Waterfall hooks must have at least one argument");
	const hook = new Hook$1(args, name);
	hook.constructor = SyncWaterfallHook$1;
	hook.tapAsync = TAP_ASYNC;
	hook.tapPromise = TAP_PROMISE;
	hook.compile = COMPILE$1;
	return hook;
}

SyncWaterfallHook$1.prototype = null;

var SyncWaterfallHook_1 = SyncWaterfallHook$1;

/*
	MIT License http://www.opensource.org/licenses/mit-license.php
	Author Tobias Koppers @sokra
*/
const HookCodeFactory$6 = HookCodeFactory_1;

class SyncLoopHookCodeFactory extends HookCodeFactory$6 {
	content({ onError, onDone, rethrowIfPossible }) {
		return this.callTapsLooping({
			onError: (i, err) => onError(err),
			onDone,
			rethrowIfPossible
		});
	}
}

new SyncLoopHookCodeFactory();

/*
	MIT License http://www.opensource.org/licenses/mit-license.php
	Author Tobias Koppers @sokra
*/
const HookCodeFactory$5 = HookCodeFactory_1;

class AsyncParallelHookCodeFactory extends HookCodeFactory$5 {
	content({ onError, onDone }) {
		return this.callTapsParallel({
			onError: (i, err, done, doneBreak) => onError(err) + doneBreak(true),
			onDone
		});
	}
}

new AsyncParallelHookCodeFactory();

/*
	MIT License http://www.opensource.org/licenses/mit-license.php
	Author Tobias Koppers @sokra
*/
const HookCodeFactory$4 = HookCodeFactory_1;

class AsyncParallelBailHookCodeFactory extends HookCodeFactory$4 {
	content({ onError, onResult, onDone }) {
		let code = "";
		code += `var _results = new Array(${this.options.taps.length});\n`;
		code += "var _checkDone = function() {\n";
		code += "for(var i = 0; i < _results.length; i++) {\n";
		code += "var item = _results[i];\n";
		code += "if(item === undefined) return false;\n";
		code += "if(item.result !== undefined) {\n";
		code += onResult("item.result");
		code += "return true;\n";
		code += "}\n";
		code += "if(item.error) {\n";
		code += onError("item.error");
		code += "return true;\n";
		code += "}\n";
		code += "}\n";
		code += "return false;\n";
		code += "}\n";
		code += this.callTapsParallel({
			onError: (i, err, done, doneBreak) => {
				let code = "";
				code += `if(${i} < _results.length && ((_results.length = ${i +
					1}), (_results[${i}] = { error: ${err} }), _checkDone())) {\n`;
				code += doneBreak(true);
				code += "} else {\n";
				code += done();
				code += "}\n";
				return code;
			},
			onResult: (i, result, done, doneBreak) => {
				let code = "";
				code += `if(${i} < _results.length && (${result} !== undefined && (_results.length = ${i +
					1}), (_results[${i}] = { result: ${result} }), _checkDone())) {\n`;
				code += doneBreak(true);
				code += "} else {\n";
				code += done();
				code += "}\n";
				return code;
			},
			onTap: (i, run, done, doneBreak) => {
				let code = "";
				if (i > 0) {
					code += `if(${i} >= _results.length) {\n`;
					code += done();
					code += "} else {\n";
				}
				code += run();
				if (i > 0) code += "}\n";
				return code;
			},
			onDone
		});
		return code;
	}
}

new AsyncParallelBailHookCodeFactory();

/*
	MIT License http://www.opensource.org/licenses/mit-license.php
	Author Tobias Koppers @sokra
*/
const HookCodeFactory$3 = HookCodeFactory_1;

class AsyncSeriesHookCodeFactory extends HookCodeFactory$3 {
	content({ onError, onDone }) {
		return this.callTapsSeries({
			onError: (i, err, next, doneBreak) => onError(err) + doneBreak(true),
			onDone
		});
	}
}

new AsyncSeriesHookCodeFactory();

/*
	MIT License http://www.opensource.org/licenses/mit-license.php
	Author Tobias Koppers @sokra
*/
const HookCodeFactory$2 = HookCodeFactory_1;

class AsyncSeriesBailHookCodeFactory extends HookCodeFactory$2 {
	content({ onError, onResult, resultReturns, onDone }) {
		return this.callTapsSeries({
			onError: (i, err, next, doneBreak) => onError(err) + doneBreak(true),
			onResult: (i, result, next) =>
				`if(${result} !== undefined) {\n${onResult(
					result
				)}\n} else {\n${next()}}\n`,
			resultReturns,
			onDone
		});
	}
}

new AsyncSeriesBailHookCodeFactory();

/*
	MIT License http://www.opensource.org/licenses/mit-license.php
	Author Tobias Koppers @sokra
*/
const HookCodeFactory$1 = HookCodeFactory_1;

class AsyncSeriesLoopHookCodeFactory extends HookCodeFactory$1 {
	content({ onError, onDone }) {
		return this.callTapsLooping({
			onError: (i, err, next, doneBreak) => onError(err) + doneBreak(true),
			onDone
		});
	}
}

new AsyncSeriesLoopHookCodeFactory();

/*
	MIT License http://www.opensource.org/licenses/mit-license.php
	Author Tobias Koppers @sokra
*/

const Hook = Hook_1;
const HookCodeFactory = HookCodeFactory_1;

class AsyncSeriesWaterfallHookCodeFactory extends HookCodeFactory {
	content({ onError, onResult, onDone }) {
		return this.callTapsSeries({
			onError: (i, err, next, doneBreak) => onError(err) + doneBreak(true),
			onResult: (i, result, next) => {
				let code = "";
				code += `if(${result} !== undefined) {\n`;
				code += `${this._args[0]} = ${result};\n`;
				code += `}\n`;
				code += next();
				return code;
			},
			onDone: () => onResult(this._args[0])
		});
	}
}

const factory = new AsyncSeriesWaterfallHookCodeFactory();

const COMPILE = function(options) {
	factory.setup(this, options);
	return factory.create(options);
};

function AsyncSeriesWaterfallHook$1(args = [], name = undefined) {
	if (args.length < 1)
		throw new Error("Waterfall hooks must have at least one argument");
	const hook = new Hook(args, name);
	hook.constructor = AsyncSeriesWaterfallHook$1;
	hook.compile = COMPILE;
	hook._call = undefined;
	hook.call = undefined;
	return hook;
}

AsyncSeriesWaterfallHook$1.prototype = null;

var AsyncSeriesWaterfallHook_1 = AsyncSeriesWaterfallHook$1;

/*
	MIT License http://www.opensource.org/licenses/mit-license.php
	Author Tobias Koppers @sokra
*/

const util = require$$0;

const defaultFactory = (key, hook) => hook;

class HookMap {
	constructor(factory, name = undefined) {
		this._map = new Map();
		this.name = name;
		this._factory = factory;
		this._interceptors = [];
	}

	get(key) {
		return this._map.get(key);
	}

	for(key) {
		const hook = this.get(key);
		if (hook !== undefined) {
			return hook;
		}
		let newHook = this._factory(key);
		const interceptors = this._interceptors;
		for (let i = 0; i < interceptors.length; i++) {
			newHook = interceptors[i].factory(key, newHook);
		}
		this._map.set(key, newHook);
		return newHook;
	}

	intercept(interceptor) {
		this._interceptors.push(
			Object.assign(
				{
					factory: defaultFactory
				},
				interceptor
			)
		);
	}
}

HookMap.prototype.tap = util.deprecate(function(key, options, fn) {
	return this.for(key).tap(options, fn);
}, "HookMap#tap(key,…) is deprecated. Use HookMap#for(key).tap(…) instead.");

HookMap.prototype.tapAsync = util.deprecate(function(key, options, fn) {
	return this.for(key).tapAsync(options, fn);
}, "HookMap#tapAsync(key,…) is deprecated. Use HookMap#for(key).tapAsync(…) instead.");

HookMap.prototype.tapPromise = util.deprecate(function(key, options, fn) {
	return this.for(key).tapPromise(options, fn);
}, "HookMap#tapPromise(key,…) is deprecated. Use HookMap#for(key).tapPromise(…) instead.");

/*
	MIT License http://www.opensource.org/licenses/mit-license.php
	Author Tobias Koppers @sokra
*/
var SyncHook = SyncHook_1;
var SyncWaterfallHook = SyncWaterfallHook_1;
var AsyncSeriesWaterfallHook = AsyncSeriesWaterfallHook_1;

var _Response_headers;
class Response {
    constructor() {
        _Response_headers.set(this, {});
    }
    set headers(headers) {
        __classPrivateFieldSet(this, _Response_headers, {}, "f");
        Object.entries(headers).forEach(([key, value]) => {
            __classPrivateFieldGet(this, _Response_headers, "f")[key] = value;
            __classPrivateFieldGet(this, _Response_headers, "f")[key.toLowerCase()] = value;
        });
    }
    get headers() { return __classPrivateFieldGet(this, _Response_headers, "f"); }
    get ok() { return this.status >= 200 && this.status <= 299; }
    get redirected() { return this.status === Response.HTTP_TEMPORARY_REDIRECT || this.status === Response.HTTP_PERMANENTLY_REDIRECT; }
    hasHeader(name) { return __classPrivateFieldGet(this, _Response_headers, "f")[name.toLocaleLowerCase()] !== undefined; }
    getHeader(name) { return __classPrivateFieldGet(this, _Response_headers, "f")[name.toLocaleLowerCase()]; }
    static fromAxiosResponse(axiosResponse) {
        const response = new Response();
        Object.assign(response, axiosResponse);
        return response;
    }
}
_Response_headers = new WeakMap();
(function (Response) {
    Response.HTTP_CONTINUE = 100;
    Response.HTTP_SWITCHING_PROTOCOLS = 101;
    Response.HTTP_PROCESSING = 102; // RFC2518
    Response.HTTP_EARLY_HINTS = 103; // RFC8297
    Response.HTTP_OK = 200;
    Response.HTTP_CREATED = 201;
    Response.HTTP_ACCEPTED = 202;
    Response.HTTP_NON_AUTHORITATIVE_INFORMATION = 203;
    Response.HTTP_NO_CONTENT = 204;
    Response.HTTP_RESET_CONTENT = 205;
    Response.HTTP_PARTIAL_CONTENT = 206;
    Response.HTTP_MULTI_STATUS = 207; // RFC4918
    Response.HTTP_ALREADY_REPORTED = 208; // RFC5842
    Response.HTTP_IM_USED = 226; // RFC3229
    Response.HTTP_MULTIPLE_CHOICES = 300;
    Response.HTTP_MOVED_PERMANENTLY = 301;
    Response.HTTP_FOUND = 302;
    Response.HTTP_SEE_OTHER = 303;
    Response.HTTP_NOT_MODIFIED = 304;
    Response.HTTP_USE_PROXY = 305;
    Response.HTTP_RESERVED = 306;
    Response.HTTP_TEMPORARY_REDIRECT = 307;
    Response.HTTP_PERMANENTLY_REDIRECT = 308; // RFC7238
    Response.HTTP_BAD_REQUEST = 400;
    Response.HTTP_UNAUTHORIZED = 401;
    Response.HTTP_PAYMENT_REQUIRED = 402;
    Response.HTTP_FORBIDDEN = 403;
    Response.HTTP_NOT_FOUND = 404;
    Response.HTTP_METHOD_NOT_ALLOWED = 405;
    Response.HTTP_NOT_ACCEPTABLE = 406;
    Response.HTTP_PROXY_AUTHENTICATION_REQUIRED = 407;
    Response.HTTP_REQUEST_TIMEOUT = 408;
    Response.HTTP_CONFLICT = 409;
    Response.HTTP_GONE = 410;
    Response.HTTP_LENGTH_REQUIRED = 411;
    Response.HTTP_PRECONDITION_FAILED = 412;
    Response.HTTP_REQUEST_ENTITY_TOO_LARGE = 413;
    Response.HTTP_REQUEST_URI_TOO_LONG = 414;
    Response.HTTP_UNSUPPORTED_MEDIA_TYPE = 415;
    Response.HTTP_REQUESTED_RANGE_NOT_SATISFIABLE = 416;
    Response.HTTP_EXPECTATION_FAILED = 417;
    Response.HTTP_I_AM_A_TEAPOT = 418; // RFC2324
    Response.HTTP_MISDIRECTED_REQUEST = 421; // RFC7540
    Response.HTTP_UNPROCESSABLE_ENTITY = 422; // RFC4918
    Response.HTTP_LOCKED = 423; // RFC4918
    Response.HTTP_FAILED_DEPENDENCY = 424; // RFC4918
    Response.HTTP_TOO_EARLY = 425; // RFC-ietf-httpbis-replay-04
    Response.HTTP_UPGRADE_REQUIRED = 426; // RFC2817
    Response.HTTP_PRECONDITION_REQUIRED = 428; // RFC6585
    Response.HTTP_TOO_MANY_REQUESTS = 429; // RFC6585
    Response.HTTP_REQUEST_HEADER_FIELDS_TOO_LARGE = 431; // RFC6585
    Response.HTTP_UNAVAILABLE_FOR_LEGAL_REASONS = 451;
    Response.HTTP_INTERNAL_SERVER_ERROR = 500;
    Response.HTTP_NOT_IMPLEMENTED = 501;
    Response.HTTP_BAD_GATEWAY = 502;
    Response.HTTP_SERVICE_UNAVAILABLE = 503;
    Response.HTTP_GATEWAY_TIMEOUT = 504;
    Response.HTTP_VERSION_NOT_SUPPORTED = 505;
    Response.HTTP_VARIANT_ALSO_NEGOTIATES_EXPERIMENTAL = 506; // RFC2295
    Response.HTTP_INSUFFICIENT_STORAGE = 507; // RFC4918
    Response.HTTP_LOOP_DETECTED = 508; // RFC5842
    Response.HTTP_NOT_EXTENDED = 510; // RFC2774
    Response.HTTP_NETWORK_AUTHENTICATION_REQUIRED = 511; // RFC6585
    Response.statusTexts = {
        '100': 'Continue',
        '101': 'Switching Protocols',
        '102': 'Processing',
        '103': 'Early Hints',
        '200': 'OK',
        '201': 'Created',
        '202': 'Accepted',
        '203': 'Non-Authoritative Information',
        '204': 'No Content',
        '205': 'Reset Content',
        '206': 'Partial Content',
        '207': 'Multi-Status',
        '208': 'Already Reported',
        '226': 'IM Used',
        '300': 'Multiple Choices',
        '301': 'Moved Permanently',
        '302': 'Found',
        '303': 'See Other',
        '304': 'Not Modified',
        '305': 'Use Proxy',
        '307': 'Temporary Redirect',
        '308': 'Permanent Redirect',
        '400': 'Bad Request',
        '401': 'Unauthorized',
        '402': 'Payment Required',
        '403': 'Forbidden',
        '404': 'Not Found',
        '405': 'Method Not Allowed',
        '406': 'Not Acceptable',
        '407': 'Proxy Authentication Required',
        '408': 'Request Timeout',
        '409': 'Conflict',
        '410': 'Gone',
        '411': 'Length Required',
        '412': 'Precondition Failed',
        '413': 'Content Too Large',
        '414': 'URI Too Long',
        '415': 'Unsupported Media Type',
        '416': 'Range Not Satisfiable',
        '417': 'Expectation Failed',
        '418': 'I\'m a teapot',
        '421': 'Misdirected Request',
        '422': 'Unprocessable Content',
        '423': 'Locked',
        '424': 'Failed Dependency',
        '425': 'Too Early',
        '426': 'Upgrade Required',
        '428': 'Precondition Required',
        '429': 'Too Many Requests',
        '431': 'Request Header Fields Too Large',
        '451': 'Unavailable For Legal Reasons',
        '500': 'Internal Server Error',
        '501': 'Not Implemented',
        '502': 'Bad Gateway',
        '503': 'Service Unavailable',
        '504': 'Gateway Timeout',
        '505': 'HTTP Version Not Supported',
        '506': 'Variant Also Negotiates',
        '507': 'Insufficient Storage',
        '508': 'Loop Detected',
        '510': 'Not Extended',
        '511': 'Network Authentication Required', // RFC6585
    };
})(Response || (Response = {}));

const isAxiosError = (val) => val && val.isAxiosError;
const hasException = (val) => { var _a, _b; return isAxiosError(val) && ((_b = (_a = val === null || val === void 0 ? void 0 : val.response) === null || _a === void 0 ? void 0 : _a.data) === null || _b === void 0 ? void 0 : _b.exception) !== undefined; };
class Request {
    constructor(config) {
        this.hooks = {
            createAxios: new SyncWaterfallHook(['axios', 'request']),
            send: new SyncWaterfallHook(['config', 'axios', 'request']),
            response: new SyncWaterfallHook(['response', 'config', 'request']),
        };
        this.CancelToken = Axios.CancelToken;
        this.CancelTokenSource = this.CancelToken.source();
        this.config = cjs.all([
            Request.getDefaultConfig(),
            config,
        ], { clone: true });
        this.config.cancelToken = this.CancelTokenSource.token;
        this.config.paramsSerializer = params => stringify(params);
    }
    get cancelToken() { return this.CancelTokenSource.token; }
    static create(config) {
        return new Request(config);
    }
    send(config = {}) {
        return __awaiter(this, void 0, void 0, function* () {
            const axios = this.createAxios();
            config = this.hooks.send.call(config, axios, this);
            let response;
            try {
                let axiosResponse = yield axios.request(config);
                response = Response.fromAxiosResponse(axiosResponse);
            }
            catch (e) {
                if (isAxiosError(e) && hasException(e)) {
                    let { message, exception, file, line } = e.response.data;
                    e.message += `:\n${exception}: ${message}\n${line}:${file}`;
                }
                throw e;
            }
            response = this.hooks.response.call(response, config, this);
            return response;
        });
    }
    createAxios() {
        let axios = Axios.create(this.config);
        axios = this.hooks.createAxios.call(axios, this);
        return axios;
    }
    mergeConfig(config) {
        this.config = cjs(this.config, config, { clone: true });
        return this;
    }
    cancel(message) {
        this.CancelTokenSource.cancel(message);
        return this;
    }
    header(key, value) {
        this.config.headers[key] = value;
        return this;
    }
    Accept(mime) {
        this.header('Accept', mime);
        return this;
    }
    ContentType(mime) {
        this.header('Content-Type', mime);
        return this;
    }
    IfNoneMatch(etag) {
        this.header('If-None-Match', etag);
        return this;
    }
    basic(username, password) {
        return this.authorization('Basic', btoa(username + ':' + password));
    }
    bearer(token) {
        return this.authorization('Bearer', token);
    }
    authorization(key, value) {
        this.header('Authorization', key + ' ' + value);
        return this;
    }
}
(function (Request) {
    const url = new URL(window.location.toString());
    const baseURL = [url.protocol, '//', url.host, '/api'].join('');
    Request.getDefaultConfig = () => ({
        baseURL,
        headers: {
            'X-Requested-With': 'XMLHttpRequest',
        },
        // `responseType` indicates the type of data that the server will respond with
        // options are: 'arraybuffer', 'document', 'json', 'text', 'stream'
        //   browser only: 'blob'
        responseType: 'json',
        // `xsrfCookieName` is the name of the cookie to use as a value for xsrf token
        xsrfCookieName: 'XSRF-TOKEN',
        // `xsrfHeaderName` is the name of the http header that carries the xsrf token value
        xsrfHeaderName: 'X-XSRF-TOKEN',
        withCredentials: false,
        validateStatus: function (status) {
            return status >= 200 && status < 300; // default
        },
        // `decompress` indicates whether or not the response body should be decompressed
        // automatically. If set to `true` will also remove the 'content-encoding' header
        // from the responses objects of all decompressed responses
        // - Node only (XHR cannot turn off decompression)
        decompress: true, // default
    });
})(Request || (Request = {}));

const byLowerCase = toFind => value => toLowerCase(value) === toFind;
const toLowerCase = value => value.toLowerCase();
const getKeys = headers => Object.keys(headers);
const isCacheableMethod = (config) => ~['GET', 'HEAD'].indexOf(config.method.toUpperCase());
const getHeaderCaseInsensitive = (headerName, headers = {}) => headers[getKeys(headers).find(byLowerCase(headerName))];
const getBase64UrlFromConfig = (config) => {
    let url = config.url;
    if (config.paramsSerializer) {
        url += '?' + config.paramsSerializer(config.params);
    }
    else {
        url += '?' + JSON.stringify(config.params);
    }
    return btoa(url);
};
class ETag {
    constructor(axios, cache) {
        this.axios = axios;
        this.cache = cache;
        this.request = null;
        this.response = null;
        this.enabled = false;
        Object.defineProperty(axios, 'etag', {
            get: () => { return this; },
            configurable: true,
            enumerable: true,
        });
    }
    enableEtag() {
        if (this.enabled)
            return;
        this.request = this.axios.interceptors.request.use(this.getRequestInterceptor());
        this.response = this.axios.interceptors.response.use(this.getResponseInterceptor(), this.getResponseErrorInterceptor());
        this.enabled = true;
    }
    disableEtag() {
        if (!this.enabled)
            return;
        this.axios.interceptors.request.eject(this.request);
        this.axios.interceptors.response.eject(this.response);
        this.enabled = false;
    }
    isEnabled() { return this.enabled; }
    getCacheByAxiosConfig(config) {
        return this.cache.get(getBase64UrlFromConfig(config));
    }
    getRequestInterceptor() {
        return (config) => {
            if (isCacheableMethod(config)) {
                const uuid = getBase64UrlFromConfig(config);
                const lastCachedResult = this.cache.get(uuid);
                if (lastCachedResult) {
                    config.headers = Object.assign(Object.assign({}, config.headers), { 'If-None-Match': lastCachedResult.etag });
                }
            }
            return config;
        };
    }
    getResponseInterceptor() {
        return (response) => {
            if (isCacheableMethod(response.config)) {
                const responseETAG = getHeaderCaseInsensitive('etag', response.headers);
                if (responseETAG) {
                    this.cache.set(getBase64UrlFromConfig(response.config), responseETAG, response.data);
                }
            }
            return response;
        };
    }
    getResponseErrorInterceptor() {
        return (error) => {
            if (error.response && error.response.status === 304) {
                const getCachedResult = this.getCacheByAxiosConfig(error.response.config);
                if (!getCachedResult) {
                    return Promise.reject(error);
                }
                const newResponse = error.response;
                newResponse.status = 200;
                newResponse.data = getCachedResult.value;
                return Promise.resolve(newResponse);
            }
            return Promise.reject(error);
        };
    }
}

class ETagCache {
    constructor(streams, storage) {
        this.streams = streams;
        this.storage = storage;
    }
    get manifestKey() { return this.streams.config.etag.manifestKey; }
    get(key) {
        return this.storage.get(key);
    }
    set(key, etag, value) {
        this.addToUuidManifest(key);
        return this.storage.set(key, { etag, value });
    }
    reset() {
        this.getUuidManifest().forEach(uuid => this.storage.unset(uuid));
    }
    getUuidManifest() {
        if (!this.storage.has(this.manifestKey)) {
            this.storage.set(this.manifestKey, []);
        }
        return this.storage.get(this.manifestKey, []);
    }
    addToUuidManifest(uuid) {
        let manifest = this.getUuidManifest();
        manifest.push(uuid);
        this.storage.set(this.manifestKey, manifest);
    }
}

var lzString = {exports: {}};

(function (module) {
// Copyright (c) 2013 Pieroxy <pieroxy@pieroxy.net>
// This work is free. You can redistribute it and/or modify it
// under the terms of the WTFPL, Version 2
// For more information see LICENSE.txt or http://www.wtfpl.net/
//
// For more information, the home page:
// http://pieroxy.net/blog/pages/lz-string/testing.html
//
// LZ-based compression algorithm, version 1.4.4
var LZString = (function() {

// private property
var f = String.fromCharCode;
var keyStrBase64 = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
var keyStrUriSafe = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+-$";
var baseReverseDic = {};

function getBaseValue(alphabet, character) {
  if (!baseReverseDic[alphabet]) {
    baseReverseDic[alphabet] = {};
    for (var i=0 ; i<alphabet.length ; i++) {
      baseReverseDic[alphabet][alphabet.charAt(i)] = i;
    }
  }
  return baseReverseDic[alphabet][character];
}

var LZString = {
  compressToBase64 : function (input) {
    if (input == null) return "";
    var res = LZString._compress(input, 6, function(a){return keyStrBase64.charAt(a);});
    switch (res.length % 4) { // To produce valid Base64
    default: // When could this happen ?
    case 0 : return res;
    case 1 : return res+"===";
    case 2 : return res+"==";
    case 3 : return res+"=";
    }
  },

  decompressFromBase64 : function (input) {
    if (input == null) return "";
    if (input == "") return null;
    return LZString._decompress(input.length, 32, function(index) { return getBaseValue(keyStrBase64, input.charAt(index)); });
  },

  compressToUTF16 : function (input) {
    if (input == null) return "";
    return LZString._compress(input, 15, function(a){return f(a+32);}) + " ";
  },

  decompressFromUTF16: function (compressed) {
    if (compressed == null) return "";
    if (compressed == "") return null;
    return LZString._decompress(compressed.length, 16384, function(index) { return compressed.charCodeAt(index) - 32; });
  },

  //compress into uint8array (UCS-2 big endian format)
  compressToUint8Array: function (uncompressed) {
    var compressed = LZString.compress(uncompressed);
    var buf=new Uint8Array(compressed.length*2); // 2 bytes per character

    for (var i=0, TotalLen=compressed.length; i<TotalLen; i++) {
      var current_value = compressed.charCodeAt(i);
      buf[i*2] = current_value >>> 8;
      buf[i*2+1] = current_value % 256;
    }
    return buf;
  },

  //decompress from uint8array (UCS-2 big endian format)
  decompressFromUint8Array:function (compressed) {
    if (compressed===null || compressed===undefined){
        return LZString.decompress(compressed);
    } else {
        var buf=new Array(compressed.length/2); // 2 bytes per character
        for (var i=0, TotalLen=buf.length; i<TotalLen; i++) {
          buf[i]=compressed[i*2]*256+compressed[i*2+1];
        }

        var result = [];
        buf.forEach(function (c) {
          result.push(f(c));
        });
        return LZString.decompress(result.join(''));

    }

  },


  //compress into a string that is already URI encoded
  compressToEncodedURIComponent: function (input) {
    if (input == null) return "";
    return LZString._compress(input, 6, function(a){return keyStrUriSafe.charAt(a);});
  },

  //decompress from an output of compressToEncodedURIComponent
  decompressFromEncodedURIComponent:function (input) {
    if (input == null) return "";
    if (input == "") return null;
    input = input.replace(/ /g, "+");
    return LZString._decompress(input.length, 32, function(index) { return getBaseValue(keyStrUriSafe, input.charAt(index)); });
  },

  compress: function (uncompressed) {
    return LZString._compress(uncompressed, 16, function(a){return f(a);});
  },
  _compress: function (uncompressed, bitsPerChar, getCharFromInt) {
    if (uncompressed == null) return "";
    var i, value,
        context_dictionary= {},
        context_dictionaryToCreate= {},
        context_c="",
        context_wc="",
        context_w="",
        context_enlargeIn= 2, // Compensate for the first entry which should not count
        context_dictSize= 3,
        context_numBits= 2,
        context_data=[],
        context_data_val=0,
        context_data_position=0,
        ii;

    for (ii = 0; ii < uncompressed.length; ii += 1) {
      context_c = uncompressed.charAt(ii);
      if (!Object.prototype.hasOwnProperty.call(context_dictionary,context_c)) {
        context_dictionary[context_c] = context_dictSize++;
        context_dictionaryToCreate[context_c] = true;
      }

      context_wc = context_w + context_c;
      if (Object.prototype.hasOwnProperty.call(context_dictionary,context_wc)) {
        context_w = context_wc;
      } else {
        if (Object.prototype.hasOwnProperty.call(context_dictionaryToCreate,context_w)) {
          if (context_w.charCodeAt(0)<256) {
            for (i=0 ; i<context_numBits ; i++) {
              context_data_val = (context_data_val << 1);
              if (context_data_position == bitsPerChar-1) {
                context_data_position = 0;
                context_data.push(getCharFromInt(context_data_val));
                context_data_val = 0;
              } else {
                context_data_position++;
              }
            }
            value = context_w.charCodeAt(0);
            for (i=0 ; i<8 ; i++) {
              context_data_val = (context_data_val << 1) | (value&1);
              if (context_data_position == bitsPerChar-1) {
                context_data_position = 0;
                context_data.push(getCharFromInt(context_data_val));
                context_data_val = 0;
              } else {
                context_data_position++;
              }
              value = value >> 1;
            }
          } else {
            value = 1;
            for (i=0 ; i<context_numBits ; i++) {
              context_data_val = (context_data_val << 1) | value;
              if (context_data_position ==bitsPerChar-1) {
                context_data_position = 0;
                context_data.push(getCharFromInt(context_data_val));
                context_data_val = 0;
              } else {
                context_data_position++;
              }
              value = 0;
            }
            value = context_w.charCodeAt(0);
            for (i=0 ; i<16 ; i++) {
              context_data_val = (context_data_val << 1) | (value&1);
              if (context_data_position == bitsPerChar-1) {
                context_data_position = 0;
                context_data.push(getCharFromInt(context_data_val));
                context_data_val = 0;
              } else {
                context_data_position++;
              }
              value = value >> 1;
            }
          }
          context_enlargeIn--;
          if (context_enlargeIn == 0) {
            context_enlargeIn = Math.pow(2, context_numBits);
            context_numBits++;
          }
          delete context_dictionaryToCreate[context_w];
        } else {
          value = context_dictionary[context_w];
          for (i=0 ; i<context_numBits ; i++) {
            context_data_val = (context_data_val << 1) | (value&1);
            if (context_data_position == bitsPerChar-1) {
              context_data_position = 0;
              context_data.push(getCharFromInt(context_data_val));
              context_data_val = 0;
            } else {
              context_data_position++;
            }
            value = value >> 1;
          }


        }
        context_enlargeIn--;
        if (context_enlargeIn == 0) {
          context_enlargeIn = Math.pow(2, context_numBits);
          context_numBits++;
        }
        // Add wc to the dictionary.
        context_dictionary[context_wc] = context_dictSize++;
        context_w = String(context_c);
      }
    }

    // Output the code for w.
    if (context_w !== "") {
      if (Object.prototype.hasOwnProperty.call(context_dictionaryToCreate,context_w)) {
        if (context_w.charCodeAt(0)<256) {
          for (i=0 ; i<context_numBits ; i++) {
            context_data_val = (context_data_val << 1);
            if (context_data_position == bitsPerChar-1) {
              context_data_position = 0;
              context_data.push(getCharFromInt(context_data_val));
              context_data_val = 0;
            } else {
              context_data_position++;
            }
          }
          value = context_w.charCodeAt(0);
          for (i=0 ; i<8 ; i++) {
            context_data_val = (context_data_val << 1) | (value&1);
            if (context_data_position == bitsPerChar-1) {
              context_data_position = 0;
              context_data.push(getCharFromInt(context_data_val));
              context_data_val = 0;
            } else {
              context_data_position++;
            }
            value = value >> 1;
          }
        } else {
          value = 1;
          for (i=0 ; i<context_numBits ; i++) {
            context_data_val = (context_data_val << 1) | value;
            if (context_data_position == bitsPerChar-1) {
              context_data_position = 0;
              context_data.push(getCharFromInt(context_data_val));
              context_data_val = 0;
            } else {
              context_data_position++;
            }
            value = 0;
          }
          value = context_w.charCodeAt(0);
          for (i=0 ; i<16 ; i++) {
            context_data_val = (context_data_val << 1) | (value&1);
            if (context_data_position == bitsPerChar-1) {
              context_data_position = 0;
              context_data.push(getCharFromInt(context_data_val));
              context_data_val = 0;
            } else {
              context_data_position++;
            }
            value = value >> 1;
          }
        }
        context_enlargeIn--;
        if (context_enlargeIn == 0) {
          context_enlargeIn = Math.pow(2, context_numBits);
          context_numBits++;
        }
        delete context_dictionaryToCreate[context_w];
      } else {
        value = context_dictionary[context_w];
        for (i=0 ; i<context_numBits ; i++) {
          context_data_val = (context_data_val << 1) | (value&1);
          if (context_data_position == bitsPerChar-1) {
            context_data_position = 0;
            context_data.push(getCharFromInt(context_data_val));
            context_data_val = 0;
          } else {
            context_data_position++;
          }
          value = value >> 1;
        }


      }
      context_enlargeIn--;
      if (context_enlargeIn == 0) {
        context_enlargeIn = Math.pow(2, context_numBits);
        context_numBits++;
      }
    }

    // Mark the end of the stream
    value = 2;
    for (i=0 ; i<context_numBits ; i++) {
      context_data_val = (context_data_val << 1) | (value&1);
      if (context_data_position == bitsPerChar-1) {
        context_data_position = 0;
        context_data.push(getCharFromInt(context_data_val));
        context_data_val = 0;
      } else {
        context_data_position++;
      }
      value = value >> 1;
    }

    // Flush the last char
    while (true) {
      context_data_val = (context_data_val << 1);
      if (context_data_position == bitsPerChar-1) {
        context_data.push(getCharFromInt(context_data_val));
        break;
      }
      else context_data_position++;
    }
    return context_data.join('');
  },

  decompress: function (compressed) {
    if (compressed == null) return "";
    if (compressed == "") return null;
    return LZString._decompress(compressed.length, 32768, function(index) { return compressed.charCodeAt(index); });
  },

  _decompress: function (length, resetValue, getNextValue) {
    var dictionary = [],
        enlargeIn = 4,
        dictSize = 4,
        numBits = 3,
        entry = "",
        result = [],
        i,
        w,
        bits, resb, maxpower, power,
        c,
        data = {val:getNextValue(0), position:resetValue, index:1};

    for (i = 0; i < 3; i += 1) {
      dictionary[i] = i;
    }

    bits = 0;
    maxpower = Math.pow(2,2);
    power=1;
    while (power!=maxpower) {
      resb = data.val & data.position;
      data.position >>= 1;
      if (data.position == 0) {
        data.position = resetValue;
        data.val = getNextValue(data.index++);
      }
      bits |= (resb>0 ? 1 : 0) * power;
      power <<= 1;
    }

    switch (bits) {
      case 0:
          bits = 0;
          maxpower = Math.pow(2,8);
          power=1;
          while (power!=maxpower) {
            resb = data.val & data.position;
            data.position >>= 1;
            if (data.position == 0) {
              data.position = resetValue;
              data.val = getNextValue(data.index++);
            }
            bits |= (resb>0 ? 1 : 0) * power;
            power <<= 1;
          }
        c = f(bits);
        break;
      case 1:
          bits = 0;
          maxpower = Math.pow(2,16);
          power=1;
          while (power!=maxpower) {
            resb = data.val & data.position;
            data.position >>= 1;
            if (data.position == 0) {
              data.position = resetValue;
              data.val = getNextValue(data.index++);
            }
            bits |= (resb>0 ? 1 : 0) * power;
            power <<= 1;
          }
        c = f(bits);
        break;
      case 2:
        return "";
    }
    dictionary[3] = c;
    w = c;
    result.push(c);
    while (true) {
      if (data.index > length) {
        return "";
      }

      bits = 0;
      maxpower = Math.pow(2,numBits);
      power=1;
      while (power!=maxpower) {
        resb = data.val & data.position;
        data.position >>= 1;
        if (data.position == 0) {
          data.position = resetValue;
          data.val = getNextValue(data.index++);
        }
        bits |= (resb>0 ? 1 : 0) * power;
        power <<= 1;
      }

      switch (c = bits) {
        case 0:
          bits = 0;
          maxpower = Math.pow(2,8);
          power=1;
          while (power!=maxpower) {
            resb = data.val & data.position;
            data.position >>= 1;
            if (data.position == 0) {
              data.position = resetValue;
              data.val = getNextValue(data.index++);
            }
            bits |= (resb>0 ? 1 : 0) * power;
            power <<= 1;
          }

          dictionary[dictSize++] = f(bits);
          c = dictSize-1;
          enlargeIn--;
          break;
        case 1:
          bits = 0;
          maxpower = Math.pow(2,16);
          power=1;
          while (power!=maxpower) {
            resb = data.val & data.position;
            data.position >>= 1;
            if (data.position == 0) {
              data.position = resetValue;
              data.val = getNextValue(data.index++);
            }
            bits |= (resb>0 ? 1 : 0) * power;
            power <<= 1;
          }
          dictionary[dictSize++] = f(bits);
          c = dictSize-1;
          enlargeIn--;
          break;
        case 2:
          return result.join('');
      }

      if (enlargeIn == 0) {
        enlargeIn = Math.pow(2, numBits);
        numBits++;
      }

      if (dictionary[c]) {
        entry = dictionary[c];
      } else {
        if (c === dictSize) {
          entry = w + w.charAt(0);
        } else {
          return null;
        }
      }
      result.push(entry);

      // Add w+entry[0] to the dictionary.
      dictionary[dictSize++] = w + entry.charAt(0);
      enlargeIn--;

      w = entry;

      if (enlargeIn == 0) {
        enlargeIn = Math.pow(2, numBits);
        numBits++;
      }

    }
  }
};
  return LZString;
})();

if( module != null ) {
  module.exports = LZString;
}
}(lzString));

var lzs = lzString.exports;

class Transformer {
    static get prefixesLength() { return this.typePrefix.length + 5; }
    static compress(value) {
        return this.typePrefix + 'lz-s|' + lzs.compressToUTF16(value);
    }
    static decompress(value) {
        let type, length, source;
        length = value.length;
        if (length < this.prefixesLength) {
            // then it wasn't compressed by us
            return value;
        }
        type = value.substr(0, this.prefixesLength - 1);
        source = value.substring(this.prefixesLength);
        if (type === this.typePrefix + 'lz-s') {
            value = lzs.decompressFromUTF16(source);
        }
        return value;
    }
    static encode(value) {
        if (Object.prototype.toString.call(value) === '[object Date]') {
            return this.typePrefix + 'date|' + value.getTime().toString();
        }
        if (Object.prototype.toString.call(value) === '[object RegExp]') {
            return this.typePrefix + 'expr|' + value.source;
        }
        if (typeof value === 'number') {
            return this.typePrefix + 'numb|' + value;
        }
        if (typeof value === 'boolean') {
            return this.typePrefix + 'bool|' + (value ? '1' : '0');
        }
        if (typeof value === 'string') {
            return this.typePrefix + 'strn|' + value;
        }
        if (value === Object(value)) {
            return this.typePrefix + 'objt|' + JSON.stringify(value);
        }
        // hmm, we don't know what to do with it,
        // so just return it as is
        return value;
    }
    static decode(value) {
        let type, length, source;
        length = value.length;
        if (length < this.prefixesLength) {
            // then it wasn't encoded by us
            return value;
        }
        type = value.substr(0, this.prefixesLength - 1);
        source = value.substring(this.prefixesLength);
        switch (type) {
            case this.typePrefix + 'date':
                return new Date(parseInt(source));
            case this.typePrefix + 'expr':
                return new RegExp(source);
            case this.typePrefix + 'numb':
                return Number(source);
            case this.typePrefix + 'bool':
                return Boolean(source === '1');
            case this.typePrefix + 'strn':
                return '' + source;
            case this.typePrefix + 'objt':
                return JSON.parse(source);
            default:
                // hmm, we reached here, we don't know the type,
                // then it means it wasn't encoded by us, so just
                // return whatever value it is
                return value;
        }
    }
}
Transformer.typePrefix = '__ls_';

class StorageAdapter {
    constructor(streams, storage = localStorage) {
        this.streams = streams;
        this.storage = storage;
    }
    get config() { return this.streams.config.etag; }
    get(key, defaultValue) {
        if (!this.has(key)) {
            return defaultValue;
        }
        let strValue = this.storage.getItem(key);
        if (this.config.compression) {
            strValue = Transformer.decompress(strValue);
        }
        return Transformer.decode(strValue);
    }
    has(key) {
        return !!this.storage.getItem(key);
    }
    set(key, value) {
        let strValue = Transformer.encode(value);
        if (this.config.compression) {
            strValue = Transformer.compress(strValue);
        }
        this.storage.setItem(key, strValue);
        return this;
    }
    unset(key) {
        this.storage.removeItem(key);
        return this;
    }
    clear() {
        this.storage.clear();
        return this;
    }
}

var _Streams_http;
/**
 * The main class
 *
 * @example
 * ```ts
 * const streams = new Streams({
 *     baseURL: 'http://localhost/api',
 * });
 *
 *
 *  async function run(){
 *     const stream = await streams.make('clients')
 *     const clients = await stream.entries()
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
class Streams {
    constructor(config) {
        this.hooks = {
            all: new AsyncSeriesWaterfallHook(['data']),
            maked: new SyncHook(['stream']),
            created: new SyncHook(['stream']),
            createRequestConfig: new SyncWaterfallHook(['config']),
            createRequest: new SyncWaterfallHook(['request']),
        };
        _Streams_http.set(this, void 0);
        this.config = cjs.all([new.target.defaults, config, { request: { baseURL: config.baseURL } }], { clone: true });
        this.registerEtag();
    }
    get http() {
        if (!__classPrivateFieldGet(this, _Streams_http, "f")) {
            __classPrivateFieldSet(this, _Streams_http, new Http(this), "f");
        }
        return __classPrivateFieldGet(this, _Streams_http, "f");
    }
    registerEtag() {
        const storageAdapter = new StorageAdapter(this, window.localStorage);
        const etagCache = new ETagCache(this, storageAdapter);
        this.hooks.createRequest.tap('ETag', (request) => {
            request.hooks.createAxios.tap('ETag', (axios) => {
                new ETag(axios, etagCache);
                this.config.etag.enabled ? axios.etag.enableEtag() : axios.etag.disableEtag();
                return axios;
            });
            return request;
        });
    }
    createRequest() {
        const config = this.hooks.createRequestConfig.call(this.config.request);
        const request = Request.create(config);
        return this.hooks.createRequest.call(request);
    }
    /**
     * Return all streams.
     *
     * @returns
     */
    all() {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield this.http.getStreams();
            const streams = [];
            for (let data of response.data.data) {
                data = yield this.hooks.all.promise(data);
                const stream = new Stream(this, data, response.data.meta, response.data.links);
                streams.push(stream);
            }
            return streams;
        });
    }
    /**
     * Make a stream instance.
     *
     * @param id
     * @returns
     */
    make(id) {
        return __awaiter(this, void 0, void 0, function* () {
            let response = yield this.http.getStream(id);
            const { data, meta, links } = response.data;
            const stream = new Stream(this, data, meta, links);
            this.hooks.maked.call(stream);
            return stream;
        });
    }
    create(id, streamData) {
        return __awaiter(this, void 0, void 0, function* () {
            let response = yield this.http.postStream(Object.assign({ id, name: id }, streamData));
            const { data, meta, links } = response.data;
            const stream = new Stream(this, data, meta, links);
            this.hooks.created.call(stream);
            return stream;
        });
    }
    entries(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const stream = yield this.make(id);
            return new Criteria(stream);
        });
    }
    /**
     * Return an entry repository.
     *
     * @param id
     * @returns
     */
    repository(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const stream = yield this.make(id);
            return new Repository(stream);
        });
    }
    /**
     * Return the Streams collection.
     */
    collection() {
        return __awaiter(this, void 0, void 0, function* () {
            return new Collection(yield this.all());
        });
    }
}
_Streams_http = new WeakMap();
Streams.defaults = {
    etag: {
        enabled: false,
        manifestKey: 'streams',
        compression: true,
        StorageAdapter: StorageAdapter,
    },
};

const mimes = {
    'application/andrew-inset': ['ez'],
    'application/applixware': ['aw'],
    'application/atom+xml': ['atom'],
    'application/atomcat+xml': ['atomcat'],
    'application/atomdeleted+xml': ['atomdeleted'],
    'application/atomsvc+xml': ['atomsvc'],
    'application/atsc-dwd+xml': ['dwd'],
    'application/atsc-held+xml': ['held'],
    'application/atsc-rsat+xml': ['rsat'],
    'application/bdoc': ['bdoc'],
    'application/calendar+xml': ['xcs'],
    'application/ccxml+xml': ['ccxml'],
    'application/cdfx+xml': ['cdfx'],
    'application/cdmi-capability': ['cdmia'],
    'application/cdmi-container': ['cdmic'],
    'application/cdmi-domain': ['cdmid'],
    'application/cdmi-object': ['cdmio'],
    'application/cdmi-queue': ['cdmiq'],
    'application/cu-seeme': ['cu'],
    'application/dash+xml': ['mpd'],
    'application/davmount+xml': ['davmount'],
    'application/docbook+xml': ['dbk'],
    'application/dssc+der': ['dssc'],
    'application/dssc+xml': ['xdssc'],
    'application/ecmascript': ['es', 'ecma'],
    'application/emma+xml': ['emma'],
    'application/emotionml+xml': ['emotionml'],
    'application/epub+zip': ['epub'],
    'application/exi': ['exi'],
    'application/express': ['exp'],
    'application/fdt+xml': ['fdt'],
    'application/font-tdpfr': ['pfr'],
    'application/geo+json': ['geojson'],
    'application/gml+xml': ['gml'],
    'application/gpx+xml': ['gpx'],
    'application/gxf': ['gxf'],
    'application/gzip': ['gz'],
    'application/hjson': ['hjson'],
    'application/hyperstudio': ['stk'],
    'application/inkml+xml': ['ink', 'inkml'],
    'application/ipfix': ['ipfix'],
    'application/its+xml': ['its'],
    'application/java-archive': ['jar', 'war', 'ear'],
    'application/java-serialized-object': ['ser'],
    'application/java-vm': ['class'],
    'application/javascript': ['js', 'mjs'],
    'application/json': ['json', 'map'],
    'application/json5': ['json5'],
    'application/jsonml+json': ['jsonml'],
    'application/ld+json': ['jsonld'],
    'application/lgr+xml': ['lgr'],
    'application/lost+xml': ['lostxml'],
    'application/mac-binhex40': ['hqx'],
    'application/mac-compactpro': ['cpt'],
    'application/mads+xml': ['mads'],
    'application/manifest+json': ['webmanifest'],
    'application/marc': ['mrc'],
    'application/marcxml+xml': ['mrcx'],
    'application/mathematica': ['ma', 'nb', 'mb'],
    'application/mathml+xml': ['mathml'],
    'application/mbox': ['mbox'],
    'application/mediaservercontrol+xml': ['mscml'],
    'application/metalink+xml': ['metalink'],
    'application/metalink4+xml': ['meta4'],
    'application/mets+xml': ['mets'],
    'application/mmt-aei+xml': ['maei'],
    'application/mmt-usd+xml': ['musd'],
    'application/mods+xml': ['mods'],
    'application/mp21': ['m21', 'mp21'],
    'application/mp4': ['mp4s', 'm4p'],
    'application/msword': ['doc', 'dot'],
    'application/mxf': ['mxf'],
    'application/n-quads': ['nq'],
    'application/n-triples': ['nt'],
    'application/node': ['cjs'],
    'application/octet-stream': ['bin', 'dms', 'lrf', 'mar', 'so', 'dist', 'distz', 'pkg', 'bpk', 'dump', 'elc', 'deploy', 'exe', 'dll', 'deb', 'dmg', 'iso', 'img', 'msi', 'msp', 'msm', 'buffer'],
    'application/oda': ['oda'],
    'application/oebps-package+xml': ['opf'],
    'application/ogg': ['ogx'],
    'application/omdoc+xml': ['omdoc'],
    'application/onenote': ['onetoc', 'onetoc2', 'onetmp', 'onepkg'],
    'application/oxps': ['oxps'],
    'application/p2p-overlay+xml': ['relo'],
    'application/patch-ops-error+xml': ['xer'],
    'application/pdf': ['pdf'],
    'application/pgp-encrypted': ['pgp'],
    'application/pgp-signature': ['asc', 'sig'],
    'application/pics-rules': ['prf'],
    'application/pkcs10': ['p10'],
    'application/pkcs7-mime': ['p7m', 'p7c'],
    'application/pkcs7-signature': ['p7s'],
    'application/pkcs8': ['p8'],
    'application/pkix-attr-cert': ['ac'],
    'application/pkix-cert': ['cer'],
    'application/pkix-crl': ['crl'],
    'application/pkix-pkipath': ['pkipath'],
    'application/pkixcmp': ['pki'],
    'application/pls+xml': ['pls'],
    'application/postscript': ['ai', 'eps', 'ps'],
    'application/provenance+xml': ['provx'],
    'application/pskc+xml': ['pskcxml'],
    'application/raml+yaml': ['raml'],
    'application/rdf+xml': ['rdf', 'owl'],
    'application/reginfo+xml': ['rif'],
    'application/relax-ng-compact-syntax': ['rnc'],
    'application/resource-lists+xml': ['rl'],
    'application/resource-lists-diff+xml': ['rld'],
    'application/rls-services+xml': ['rs'],
    'application/route-apd+xml': ['rapd'],
    'application/route-s-tsid+xml': ['sls'],
    'application/route-usd+xml': ['rusd'],
    'application/rpki-ghostbusters': ['gbr'],
    'application/rpki-manifest': ['mft'],
    'application/rpki-roa': ['roa'],
    'application/rsd+xml': ['rsd'],
    'application/rss+xml': ['rss'],
    'application/rtf': ['rtf'],
    'application/sbml+xml': ['sbml'],
    'application/scvp-cv-request': ['scq'],
    'application/scvp-cv-response': ['scs'],
    'application/scvp-vp-request': ['spq'],
    'application/scvp-vp-response': ['spp'],
    'application/sdp': ['sdp'],
    'application/senml+xml': ['senmlx'],
    'application/sensml+xml': ['sensmlx'],
    'application/set-payment-initiation': ['setpay'],
    'application/set-registration-initiation': ['setreg'],
    'application/shf+xml': ['shf'],
    'application/sieve': ['siv', 'sieve'],
    'application/smil+xml': ['smi', 'smil'],
    'application/sparql-query': ['rq'],
    'application/sparql-results+xml': ['srx'],
    'application/srgs': ['gram'],
    'application/srgs+xml': ['grxml'],
    'application/sru+xml': ['sru'],
    'application/ssdl+xml': ['ssdl'],
    'application/ssml+xml': ['ssml'],
    'application/swid+xml': ['swidtag'],
    'application/tei+xml': ['tei', 'teicorpus'],
    'application/thraud+xml': ['tfi'],
    'application/timestamped-data': ['tsd'],
    'application/toml': ['toml'],
    'application/trig': ['trig'],
    'application/ttml+xml': ['ttml'],
    'application/ubjson': ['ubj'],
    'application/urc-ressheet+xml': ['rsheet'],
    'application/urc-targetdesc+xml': ['td'],
    'application/voicexml+xml': ['vxml'],
    'application/wasm': ['wasm'],
    'application/widget': ['wgt'],
    'application/winhlp': ['hlp'],
    'application/wsdl+xml': ['wsdl'],
    'application/wspolicy+xml': ['wspolicy'],
    'application/xaml+xml': ['xaml'],
    'application/xcap-att+xml': ['xav'],
    'application/xcap-caps+xml': ['xca'],
    'application/xcap-diff+xml': ['xdf'],
    'application/xcap-el+xml': ['xel'],
    'application/xcap-ns+xml': ['xns'],
    'application/xenc+xml': ['xenc'],
    'application/xhtml+xml': ['xhtml', 'xht'],
    'application/xliff+xml': ['xlf'],
    'application/xml': ['xml', 'xsl', 'xsd', 'rng'],
    'application/xml-dtd': ['dtd'],
    'application/xop+xml': ['xop'],
    'application/xproc+xml': ['xpl'],
    'application/xslt+xml': ['*xsl', 'xslt'],
    'application/xspf+xml': ['xspf'],
    'application/xv+xml': ['mxml', 'xhvml', 'xvml', 'xvm'],
    'application/yang': ['yang'],
    'application/yin+xml': ['yin'],
    'application/zip': ['zip'],
    'audio/3gpp': ['*3gpp'],
    'audio/adpcm': ['adp'],
    'audio/amr': ['amr'],
    'audio/basic': ['au', 'snd'],
    'audio/midi': ['mid', 'midi', 'kar', 'rmi'],
    'audio/mobile-xmf': ['mxmf'],
    'audio/mp3': ['*mp3'],
    'audio/mp4': ['m4a', 'mp4a'],
    'audio/mpeg': ['mpga', 'mp2', 'mp2a', 'mp3', 'm2a', 'm3a'],
    'audio/ogg': ['oga', 'ogg', 'spx', 'opus'],
    'audio/s3m': ['s3m'],
    'audio/silk': ['sil'],
    'audio/wav': ['wav'],
    'audio/wave': ['*wav'],
    'audio/webm': ['weba'],
    'audio/xm': ['xm'],
    'font/collection': ['ttc'],
    'font/otf': ['otf'],
    'font/ttf': ['ttf'],
    'font/woff': ['woff'],
    'font/woff2': ['woff2'],
    'image/aces': ['exr'],
    'image/apng': ['apng'],
    'image/avif': ['avif'],
    'image/bmp': ['bmp'],
    'image/cgm': ['cgm'],
    'image/dicom-rle': ['drle'],
    'image/emf': ['emf'],
    'image/fits': ['fits'],
    'image/g3fax': ['g3'],
    'image/gif': ['gif'],
    'image/heic': ['heic'],
    'image/heic-sequence': ['heics'],
    'image/heif': ['heif'],
    'image/heif-sequence': ['heifs'],
    'image/hej2k': ['hej2'],
    'image/hsj2': ['hsj2'],
    'image/ief': ['ief'],
    'image/jls': ['jls'],
    'image/jp2': ['jp2', 'jpg2'],
    'image/jpeg': ['jpeg', 'jpg', 'jpe'],
    'image/jph': ['jph'],
    'image/jphc': ['jhc'],
    'image/jpm': ['jpm'],
    'image/jpx': ['jpx', 'jpf'],
    'image/jxr': ['jxr'],
    'image/jxra': ['jxra'],
    'image/jxrs': ['jxrs'],
    'image/jxs': ['jxs'],
    'image/jxsc': ['jxsc'],
    'image/jxsi': ['jxsi'],
    'image/jxss': ['jxss'],
    'image/ktx': ['ktx'],
    'image/ktx2': ['ktx2'],
    'image/png': ['png'],
    'image/sgi': ['sgi'],
    'image/svg+xml': ['svg', 'svgz'],
    'image/t38': ['t38'],
    'image/tiff': ['tif', 'tiff'],
    'image/tiff-fx': ['tfx'],
    'image/webp': ['webp'],
    'image/wmf': ['wmf'],
    'message/disposition-notification': ['disposition-notification'],
    'message/global': ['u8msg'],
    'message/global-delivery-status': ['u8dsn'],
    'message/global-disposition-notification': ['u8mdn'],
    'message/global-headers': ['u8hdr'],
    'message/rfc822': ['eml', 'mime'],
    'model/3mf': ['3mf'],
    'model/gltf+json': ['gltf'],
    'model/gltf-binary': ['glb'],
    'model/iges': ['igs', 'iges'],
    'model/mesh': ['msh', 'mesh', 'silo'],
    'model/mtl': ['mtl'],
    'model/obj': ['obj'],
    'model/step+xml': ['stpx'],
    'model/step+zip': ['stpz'],
    'model/step-xml+zip': ['stpxz'],
    'model/stl': ['stl'],
    'model/vrml': ['wrl', 'vrml'],
    'model/x3d+binary': ['*x3db', 'x3dbz'],
    'model/x3d+fastinfoset': ['x3db'],
    'model/x3d+vrml': ['*x3dv', 'x3dvz'],
    'model/x3d+xml': ['x3d', 'x3dz'],
    'model/x3d-vrml': ['x3dv'],
    'text/cache-manifest': ['appcache', 'manifest'],
    'text/calendar': ['ics', 'ifb'],
    'text/coffeescript': ['coffee', 'litcoffee'],
    'text/css': ['css'],
    'text/csv': ['csv'],
    'text/html': ['html', 'htm', 'shtml'],
    'text/jade': ['jade'],
    'text/jsx': ['jsx'],
    'text/less': ['less'],
    'text/markdown': ['markdown', 'md'],
    'text/mathml': ['mml'],
    'text/mdx': ['mdx'],
    'text/n3': ['n3'],
    'text/plain': ['txt', 'text', 'conf', 'def', 'list', 'log', 'in', 'ini'],
    'text/richtext': ['rtx'],
    'text/rtf': ['*rtf'],
    'text/sgml': ['sgml', 'sgm'],
    'text/shex': ['shex'],
    'text/slim': ['slim', 'slm'],
    'text/spdx': ['spdx'],
    'text/stylus': ['stylus', 'styl'],
    'text/tab-separated-values': ['tsv'],
    'text/troff': ['t', 'tr', 'roff', 'man', 'me', 'ms'],
    'text/turtle': ['ttl'],
    'text/uri-list': ['uri', 'uris', 'urls'],
    'text/vcard': ['vcard'],
    'text/vtt': ['vtt'],
    'text/xml': ['*xml'],
    'text/yaml': ['yaml', 'yml'],
    'video/3gpp': ['3gp', '3gpp'],
    'video/3gpp2': ['3g2'],
    'video/h261': ['h261'],
    'video/h263': ['h263'],
    'video/h264': ['h264'],
    'video/iso.segment': ['m4s'],
    'video/jpeg': ['jpgv'],
    'video/jpm': ['*jpm', 'jpgm'],
    'video/mj2': ['mj2', 'mjp2'],
    'video/mp2t': ['ts'],
    'video/mp4': ['mp4', 'mp4v', 'mpg4'],
    'video/mpeg': ['mpeg', 'mpg', 'mpe', 'm1v', 'm2v'],
    'video/ogg': ['ogv'],
    'video/quicktime': ['qt', 'mov'],
    'video/webm': ['webm'],
};

export { Collection, Criteria, ETag, ETagCache, Entry, EntryCollection, Field, FieldCollection, Http, Obj, PaginatedEntryCollection, Repository, Request, Response, StorageAdapter, Str, Stream, Streams, Transformer, comparisonOperators, Streams as default, isFieldData, isIField, logicalOperators, mimes, objectify, operators };
//# sourceMappingURL=streams-api.nodedeps.esm-browser.js.map
