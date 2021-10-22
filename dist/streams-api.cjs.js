'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

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
/* global Reflect, Promise */

var extendStatics = function(d, b) {
    extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
    return extendStatics(d, b);
};

function __extends(d, b) {
    if (typeof b !== "function" && b !== null)
        throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
    extendStatics(d, b);
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
}

var __assign = function() {
    __assign = Object.assign || function __assign(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};

function __awaiter(thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
}

function __generator(thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
}

var Entry = /** @class */ (function () {
    function Entry(_stream, _data, _fresh) {
        if (_data === void 0) { _data = {}; }
        if (_fresh === void 0) { _fresh = true; }
        this._stream = _stream;
        this._data = _data;
        this._fresh = _fresh;
        var proxy = new Proxy(this, {
            get: function (target, p, receiver) {
                if (Reflect.has(target, p)) {
                    return Reflect.get(target, p, receiver);
                }
                if (Reflect.has(target._data, p)) {
                    return Reflect.get(target._data, p);
                }
            },
            set: function (target, p, value, receiver) {
                if (Reflect.has(target, p)) {
                    return Reflect.set(target, p, value, receiver);
                }
                return Reflect.set(target._data, p, value);
            },
        });
        return proxy;
    }
    Object.defineProperty(Entry.prototype, "http", {
        get: function () { return this._stream.streams.http; },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Entry.prototype, "stream", {
        get: function () {
            return this._stream;
        },
        enumerable: false,
        configurable: true
    });
    Entry.prototype.save = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 4, , 5]);
                        if (!this._fresh) return [3 /*break*/, 2];
                        return [4 /*yield*/, this.http.postEntry(this._stream.id, this._data)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/, true];
                    case 2: return [4 /*yield*/, this.http.patchEntry(this._stream.id, this._data.id, this._data)];
                    case 3:
                        _a.sent();
                        return [2 /*return*/, true];
                    case 4:
                        _a.sent();
                        return [2 /*return*/, false];
                    case 5: return [2 /*return*/];
                }
            });
        });
    };
    Entry.prototype.validator = function () {
    };
    return Entry;
}());

var Collection = /** @class */ (function (_super) {
    __extends(Collection, _super);
    /**
     * Create a new collection instance.
     *
     * @param items
     */
    function Collection() {
        var items = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            items[_i] = arguments[_i];
        }
        var _this = _super.apply(this, items) || this;
        Object.setPrototypeOf(_this, Array.prototype);
        return _this;
    }
    return Collection;
}(Array));

var EntryCollection = /** @class */ (function (_super) {
    __extends(EntryCollection, _super);
    function EntryCollection(entries, meta, links) {
        var _this = _super.apply(this, entries) || this;
        _this.meta = meta;
        _this.links = links;
        return _this;
    }
    EntryCollection.fromResponse = function (response, stream) {
        var entries = Object.values(response.data).map(function (entry) { return new Entry(stream, entry, false); });
        return new EntryCollection(entries, response.meta, response.links);
    };
    return EntryCollection;
}(Collection));
var PaginatedEntryCollection = /** @class */ (function (_super) {
    __extends(PaginatedEntryCollection, _super);
    function PaginatedEntryCollection(entries, meta, links) {
        var _this = _super.apply(this, entries) || this;
        _this.meta = meta;
        _this.links = links;
        return _this;
    }
    PaginatedEntryCollection.fromResponse = function (response, stream) {
        var entries = Object.values(response.data).map(function (entry) { return new Entry(stream, entry, false); });
        return new PaginatedEntryCollection(entries, response.meta, response.links);
    };
    return PaginatedEntryCollection;
}(Collection));

var comparisonOperators = ['>', '<', '==', '!=', '>=', '<=', '!<', '!>', '<>'];
var logicalOperators = ['BETWEEN', 'EXISTS', 'OR', 'AND', 'NOT', 'IN', 'ALL', 'ANY', 'LIKE', 'IS NULL', 'UNIQUE'];
var operators = [].concat(comparisonOperators).concat(logicalOperators);
var isOperator = function (value) { return operators.includes(value); };
var ensureArray = function (value) { return Array.isArray(value) ? value : [value]; };
var Criteria = /** @class */ (function () {
    /**
     * Create a new instance.
     *
     * @param stream
     */
    function Criteria(stream) {
        this.stream = stream;
        this.parameters = [];
    }
    Object.defineProperty(Criteria.prototype, "http", {
        get: function () { return this.stream.streams.http; },
        enumerable: false,
        configurable: true
    });
    /**
     * Find an entry by ID.
     *
     * @param id
     * @returns
     */
    Criteria.prototype.find = function (id) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.where('id', id).first()];
            });
        });
    };
    /**
     * Return the first result.
     *
     * @returns
     */
    Criteria.prototype.first = function () {
        return __awaiter(this, void 0, void 0, function () {
            var collection;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.limit(1).get()];
                    case 1:
                        collection = _a.sent();
                        return [2 /*return*/, collection[0]];
                }
            });
        });
    };
    Criteria.prototype.cache = function () { return this; };
    /**
     * Order the query by field/direction.
     *
     * @param key
     * @param direction
     * @returns
     */
    Criteria.prototype.orderBy = function (key, direction) {
        if (direction === void 0) { direction = 'desc'; }
        this.addParameter('orderBy', [key, direction]);
        return this;
    };
    /**
     * Limit the entries returned.
     *
     * @param value
     * @returns
     */
    Criteria.prototype.limit = function (value) {
        this.addParameter('limit', value);
        return this;
    };
    Criteria.prototype.where = function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        var key, operator, value, nested;
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
            throw new Error("Criteria where() operator \"" + operator + "\" not valid ");
        }
        this.addParameter('where', [key, operator, value, nested]);
        return this;
    };
    Criteria.prototype.orWhere = function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        var key, operator, value;
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
            throw new Error("Criteria orWhere() operator \"" + operator + "\" not valid ");
        }
        this.addParameter('where', [key, operator, value, 'or']);
        return this;
    };
    /**
     * Get the criteria results.
     *
     * @returns
     */
    Criteria.prototype.get = function () {
        return __awaiter(this, void 0, void 0, function () {
            var query, response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        query = this.compileStatements();
                        return [4 /*yield*/, this.http.getEntries(this.stream.id, { query: query }, {})];
                    case 1:
                        response = _a.sent();
                        return [2 /*return*/, EntryCollection.fromResponse(response, this.stream)];
                }
            });
        });
    };
    //count(): number { return 0; }
    /**
     * Create a new entry.
     *
     * @param attributes
     * @returns
     */
    Criteria.prototype.create = function (attributes) {
        return __awaiter(this, void 0, void 0, function () {
            var entry;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        entry = this.newInstance(attributes);
                        return [4 /*yield*/, entry.save()];
                    case 1:
                        _a.sent();
                        return [2 /*return*/, entry];
                }
            });
        });
    };
    /**
     * Save an entry.
     *
     * @param entry
     * @returns
     */
    Criteria.prototype.save = function (entry) {
        return __awaiter(this, void 0, void 0, function () {
            var result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, entry.save()];
                    case 1:
                        result = _a.sent();
                        return [2 /*return*/, result];
                }
            });
        });
    };
    Criteria.prototype.delete = function () { return this; };
    //truncate(): this { return this; }
    /**
     * Get paginated criteria results.
     *
     * @param per_page
     * @param page
     * @returns
     */
    Criteria.prototype.paginate = function (per_page, page) {
        if (per_page === void 0) { per_page = 100; }
        if (page === void 0) { page = 1; }
        return __awaiter(this, void 0, void 0, function () {
            var query, response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        query = this.compileStatements();
                        return [4 /*yield*/, this.http.getEntries(this.stream.id, { query: query }, { paginate: true, per_page: per_page, page: page })];
                    case 1:
                        response = _a.sent();
                        return [2 /*return*/, PaginatedEntryCollection.fromResponse(response, this.stream)];
                }
            });
        });
    };
    /**
     * Return an entry instance.
     *
     * @param attributes
     * @returns Entry
     */
    Criteria.prototype.newInstance = function (attributes) {
        return new Entry(this.stream, attributes, true);
    };
    /**
     * Get the parameters.
     *
     * @returns
     */
    Criteria.prototype.getParameters = function () {
        return this.parameters;
    };
    /**
     * Set the parameters.
     *
     * @param parameters
     * @returns
     */
    Criteria.prototype.setParameters = function (parameters) {
        this.parameters = parameters;
        return this;
    };
    /**
     * Add a statement.
     *
     * @param name
     * @param value
     * @returns
     */
    Criteria.prototype.addParameter = function (name, value) {
        this.parameters.push({ name: name, value: value });
        return this;
    };
    /**
     * Return standardized parameters.
     *
     * @returns
     */
    Criteria.prototype.compileStatements = function () {
        return this.parameters.map(function (statement) {
            var _a;
            return (_a = {}, _a[statement.name] = ensureArray(statement.value), _a);
        });
    };
    return Criteria;
}());

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

function getKeys(target) {
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
		getKeys(target).forEach(function(key) {
			destination[key] = cloneUnlessOtherwiseSpecified(target[key], options);
		});
	}
	getKeys(source).forEach(function(key) {
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

function unwrapExports (x) {
	return x && x.__esModule && Object.prototype.hasOwnProperty.call(x, 'default') ? x['default'] : x;
}

function createCommonjsModule(fn, module) {
	return module = { exports: {} }, fn(module, module.exports), module.exports;
}

var isBuffer = function isBuffer(arg) {
  return arg instanceof Buffer;
};

var inherits_browser = createCommonjsModule(function (module) {
if (typeof Object.create === 'function') {
  // implementation from standard node.js 'util' module
  module.exports = function inherits(ctor, superCtor) {
    if (superCtor) {
      ctor.super_ = superCtor;
      ctor.prototype = Object.create(superCtor.prototype, {
        constructor: {
          value: ctor,
          enumerable: false,
          writable: true,
          configurable: true
        }
      });
    }
  };
} else {
  // old school shim for old browsers
  module.exports = function inherits(ctor, superCtor) {
    if (superCtor) {
      ctor.super_ = superCtor;
      var TempCtor = function () {};
      TempCtor.prototype = superCtor.prototype;
      ctor.prototype = new TempCtor();
      ctor.prototype.constructor = ctor;
    }
  };
}
});

var util$1 = util;

var inherits = createCommonjsModule(function (module) {
try {
  var util = util$1;
  /* istanbul ignore next */
  if (typeof util.inherits !== 'function') throw '';
  module.exports = util.inherits;
} catch (e) {
  /* istanbul ignore next */
  module.exports = inherits_browser;
}
});

var util = createCommonjsModule(function (module, exports) {
// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

var getOwnPropertyDescriptors = Object.getOwnPropertyDescriptors ||
  function getOwnPropertyDescriptors(obj) {
    var keys = Object.keys(obj);
    var descriptors = {};
    for (var i = 0; i < keys.length; i++) {
      descriptors[keys[i]] = Object.getOwnPropertyDescriptor(obj, keys[i]);
    }
    return descriptors;
  };

var formatRegExp = /%[sdj%]/g;
exports.format = function(f) {
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
};


// Mark that a method should not be used.
// Returns a modified function which warns once by default.
// If --no-deprecation is set, then it is a no-op.
exports.deprecate = function(fn, msg) {
  if (typeof process !== 'undefined' && process.noDeprecation === true) {
    return fn;
  }

  // Allow for deprecating things in the process of starting up.
  if (typeof process === 'undefined') {
    return function() {
      return exports.deprecate(fn, msg).apply(this, arguments);
    };
  }

  var warned = false;
  function deprecated() {
    if (!warned) {
      if (process.throwDeprecation) {
        throw new Error(msg);
      } else if (process.traceDeprecation) {
        console.trace(msg);
      } else {
        console.error(msg);
      }
      warned = true;
    }
    return fn.apply(this, arguments);
  }

  return deprecated;
};


var debugs = {};
var debugEnviron;
exports.debuglog = function(set) {
  if (isUndefined(debugEnviron))
    debugEnviron = process.env.NODE_DEBUG || '';
  set = set.toUpperCase();
  if (!debugs[set]) {
    if (new RegExp('\\b' + set + '\\b', 'i').test(debugEnviron)) {
      var pid = process.pid;
      debugs[set] = function() {
        var msg = exports.format.apply(exports, arguments);
        console.error('%s %d: %s', set, pid, msg);
      };
    } else {
      debugs[set] = function() {};
    }
  }
  return debugs[set];
};


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
    exports._extend(ctx, opts);
  }
  // set default options
  if (isUndefined(ctx.showHidden)) ctx.showHidden = false;
  if (isUndefined(ctx.depth)) ctx.depth = 2;
  if (isUndefined(ctx.colors)) ctx.colors = false;
  if (isUndefined(ctx.customInspect)) ctx.customInspect = true;
  if (ctx.colors) ctx.stylize = stylizeWithColor;
  return formatValue(ctx, obj, ctx.depth);
}
exports.inspect = inspect;


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
      value.inspect !== exports.inspect &&
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
exports.isArray = isArray;

function isBoolean(arg) {
  return typeof arg === 'boolean';
}
exports.isBoolean = isBoolean;

function isNull(arg) {
  return arg === null;
}
exports.isNull = isNull;

function isNullOrUndefined(arg) {
  return arg == null;
}
exports.isNullOrUndefined = isNullOrUndefined;

function isNumber(arg) {
  return typeof arg === 'number';
}
exports.isNumber = isNumber;

function isString(arg) {
  return typeof arg === 'string';
}
exports.isString = isString;

function isSymbol(arg) {
  return typeof arg === 'symbol';
}
exports.isSymbol = isSymbol;

function isUndefined(arg) {
  return arg === void 0;
}
exports.isUndefined = isUndefined;

function isRegExp(re) {
  return isObject(re) && objectToString(re) === '[object RegExp]';
}
exports.isRegExp = isRegExp;

function isObject(arg) {
  return typeof arg === 'object' && arg !== null;
}
exports.isObject = isObject;

function isDate(d) {
  return isObject(d) && objectToString(d) === '[object Date]';
}
exports.isDate = isDate;

function isError(e) {
  return isObject(e) &&
      (objectToString(e) === '[object Error]' || e instanceof Error);
}
exports.isError = isError;

function isFunction(arg) {
  return typeof arg === 'function';
}
exports.isFunction = isFunction;

function isPrimitive(arg) {
  return arg === null ||
         typeof arg === 'boolean' ||
         typeof arg === 'number' ||
         typeof arg === 'string' ||
         typeof arg === 'symbol' ||  // ES6 symbol
         typeof arg === 'undefined';
}
exports.isPrimitive = isPrimitive;

exports.isBuffer = isBuffer;

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
exports.log = function() {
  console.log('%s - %s', timestamp(), exports.format.apply(exports, arguments));
};


/**
 * Inherit the prototype methods from one constructor into another.
 *
 * The Function.prototype.inherits from lang.js rewritten as a standalone
 * function (not on Function.prototype). NOTE: If this file is to be loaded
 * during bootstrapping this function needs to be rewritten using some native
 * functions as prototype setup using normal JavaScript does not work as
 * expected during bootstrapping (see mirror.js in r114903).
 *
 * @param {function} ctor Constructor function which needs to inherit the
 *     prototype.
 * @param {function} superCtor Constructor function to inherit prototype from.
 */
exports.inherits = inherits;

exports._extend = function(origin, add) {
  // Don't do anything if add isn't an object
  if (!add || !isObject(add)) return origin;

  var keys = Object.keys(add);
  var i = keys.length;
  while (i--) {
    origin[keys[i]] = add[keys[i]];
  }
  return origin;
};

function hasOwnProperty(obj, prop) {
  return Object.prototype.hasOwnProperty.call(obj, prop);
}

var kCustomPromisifiedSymbol = typeof Symbol !== 'undefined' ? Symbol('util.promisify.custom') : undefined;

exports.promisify = function promisify(original) {
  if (typeof original !== 'function')
    throw new TypeError('The "original" argument must be of type Function');

  if (kCustomPromisifiedSymbol && original[kCustomPromisifiedSymbol]) {
    var fn = original[kCustomPromisifiedSymbol];
    if (typeof fn !== 'function') {
      throw new TypeError('The "util.promisify.custom" argument must be of type Function');
    }
    Object.defineProperty(fn, kCustomPromisifiedSymbol, {
      value: fn, enumerable: false, writable: false, configurable: true
    });
    return fn;
  }

  function fn() {
    var promiseResolve, promiseReject;
    var promise = new Promise(function (resolve, reject) {
      promiseResolve = resolve;
      promiseReject = reject;
    });

    var args = [];
    for (var i = 0; i < arguments.length; i++) {
      args.push(arguments[i]);
    }
    args.push(function (err, value) {
      if (err) {
        promiseReject(err);
      } else {
        promiseResolve(value);
      }
    });

    try {
      original.apply(this, args);
    } catch (err) {
      promiseReject(err);
    }

    return promise;
  }

  Object.setPrototypeOf(fn, Object.getPrototypeOf(original));

  if (kCustomPromisifiedSymbol) Object.defineProperty(fn, kCustomPromisifiedSymbol, {
    value: fn, enumerable: false, writable: false, configurable: true
  });
  return Object.defineProperties(
    fn,
    getOwnPropertyDescriptors(original)
  );
};

exports.promisify.custom = kCustomPromisifiedSymbol;

function callbackifyOnRejected(reason, cb) {
  // `!reason` guard inspired by bluebird (Ref: https://goo.gl/t5IS6M).
  // Because `null` is a special error value in callbacks which means "no error
  // occurred", we error-wrap so the callback consumer can distinguish between
  // "the promise rejected with null" or "the promise fulfilled with undefined".
  if (!reason) {
    var newReason = new Error('Promise was rejected with a falsy value');
    newReason.reason = reason;
    reason = newReason;
  }
  return cb(reason);
}

function callbackify(original) {
  if (typeof original !== 'function') {
    throw new TypeError('The "original" argument must be of type Function');
  }

  // We DO NOT return the promise as it gives the user a false sense that
  // the promise is actually somehow related to the callback's execution
  // and that the callback throwing will reject the promise.
  function callbackified() {
    var args = [];
    for (var i = 0; i < arguments.length; i++) {
      args.push(arguments[i]);
    }

    var maybeCb = args.pop();
    if (typeof maybeCb !== 'function') {
      throw new TypeError('The last argument must be of type Function');
    }
    var self = this;
    var cb = function() {
      return maybeCb.apply(self, arguments);
    };
    // In true node style we process the callback on `nextTick` with all the
    // implications (stack, `uncaughtException`, `async_hooks`)
    original.apply(this, args)
      .then(function(ret) { process.nextTick(cb, null, ret); },
            function(rej) { process.nextTick(callbackifyOnRejected, rej, cb); });
  }

  Object.setPrototypeOf(callbackified, Object.getPrototypeOf(original));
  Object.defineProperties(callbackified,
                          getOwnPropertyDescriptors(original));
  return callbackified;
}
exports.callbackify = callbackify;
});
util.format;
util.deprecate;
util.debuglog;
util.inspect;
util.isArray;
util.isBoolean;
util.isNull;
util.isNullOrUndefined;
util.isNumber;
util.isString;
util.isSymbol;
util.isUndefined;
util.isRegExp;
util.isObject;
util.isDate;
util.isError;
util.isFunction;
util.isPrimitive;
util.isBuffer;
util.log;
util.inherits;
util._extend;
util.promisify;
util.callbackify;

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

class Hook {
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

Object.setPrototypeOf(Hook.prototype, null);

var Hook_1 = Hook;

/*
	MIT License http://www.opensource.org/licenses/mit-license.php
	Author Tobias Koppers @sokra
*/

class HookCodeFactory {
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

var HookCodeFactory_1 = HookCodeFactory;

class SyncHookCodeFactory extends HookCodeFactory_1 {
	content({ onError, onDone, rethrowIfPossible }) {
		return this.callTapsSeries({
			onError: (i, err) => onError(err),
			onDone,
			rethrowIfPossible
		});
	}
}

const factory$9 = new SyncHookCodeFactory();

const TAP_ASYNC$3 = () => {
	throw new Error("tapAsync is not supported on a SyncHook");
};

const TAP_PROMISE$3 = () => {
	throw new Error("tapPromise is not supported on a SyncHook");
};

const COMPILE$9 = function(options) {
	factory$9.setup(this, options);
	return factory$9.create(options);
};

function SyncHook(args = [], name = undefined) {
	const hook = new Hook_1(args, name);
	hook.constructor = SyncHook;
	hook.tapAsync = TAP_ASYNC$3;
	hook.tapPromise = TAP_PROMISE$3;
	hook.compile = COMPILE$9;
	return hook;
}

SyncHook.prototype = null;

var SyncHook_1 = SyncHook;

class SyncBailHookCodeFactory extends HookCodeFactory_1 {
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

const factory$8 = new SyncBailHookCodeFactory();

const TAP_ASYNC$2 = () => {
	throw new Error("tapAsync is not supported on a SyncBailHook");
};

const TAP_PROMISE$2 = () => {
	throw new Error("tapPromise is not supported on a SyncBailHook");
};

const COMPILE$8 = function(options) {
	factory$8.setup(this, options);
	return factory$8.create(options);
};

function SyncBailHook(args = [], name = undefined) {
	const hook = new Hook_1(args, name);
	hook.constructor = SyncBailHook;
	hook.tapAsync = TAP_ASYNC$2;
	hook.tapPromise = TAP_PROMISE$2;
	hook.compile = COMPILE$8;
	return hook;
}

SyncBailHook.prototype = null;

var SyncBailHook_1 = SyncBailHook;

class SyncWaterfallHookCodeFactory extends HookCodeFactory_1 {
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

const factory$7 = new SyncWaterfallHookCodeFactory();

const TAP_ASYNC$1 = () => {
	throw new Error("tapAsync is not supported on a SyncWaterfallHook");
};

const TAP_PROMISE$1 = () => {
	throw new Error("tapPromise is not supported on a SyncWaterfallHook");
};

const COMPILE$7 = function(options) {
	factory$7.setup(this, options);
	return factory$7.create(options);
};

function SyncWaterfallHook(args = [], name = undefined) {
	if (args.length < 1)
		throw new Error("Waterfall hooks must have at least one argument");
	const hook = new Hook_1(args, name);
	hook.constructor = SyncWaterfallHook;
	hook.tapAsync = TAP_ASYNC$1;
	hook.tapPromise = TAP_PROMISE$1;
	hook.compile = COMPILE$7;
	return hook;
}

SyncWaterfallHook.prototype = null;

var SyncWaterfallHook_1 = SyncWaterfallHook;

class SyncLoopHookCodeFactory extends HookCodeFactory_1 {
	content({ onError, onDone, rethrowIfPossible }) {
		return this.callTapsLooping({
			onError: (i, err) => onError(err),
			onDone,
			rethrowIfPossible
		});
	}
}

const factory$6 = new SyncLoopHookCodeFactory();

const TAP_ASYNC = () => {
	throw new Error("tapAsync is not supported on a SyncLoopHook");
};

const TAP_PROMISE = () => {
	throw new Error("tapPromise is not supported on a SyncLoopHook");
};

const COMPILE$6 = function(options) {
	factory$6.setup(this, options);
	return factory$6.create(options);
};

function SyncLoopHook(args = [], name = undefined) {
	const hook = new Hook_1(args, name);
	hook.constructor = SyncLoopHook;
	hook.tapAsync = TAP_ASYNC;
	hook.tapPromise = TAP_PROMISE;
	hook.compile = COMPILE$6;
	return hook;
}

SyncLoopHook.prototype = null;

var SyncLoopHook_1 = SyncLoopHook;

class AsyncParallelHookCodeFactory extends HookCodeFactory_1 {
	content({ onError, onDone }) {
		return this.callTapsParallel({
			onError: (i, err, done, doneBreak) => onError(err) + doneBreak(true),
			onDone
		});
	}
}

const factory$5 = new AsyncParallelHookCodeFactory();

const COMPILE$5 = function(options) {
	factory$5.setup(this, options);
	return factory$5.create(options);
};

function AsyncParallelHook(args = [], name = undefined) {
	const hook = new Hook_1(args, name);
	hook.constructor = AsyncParallelHook;
	hook.compile = COMPILE$5;
	hook._call = undefined;
	hook.call = undefined;
	return hook;
}

AsyncParallelHook.prototype = null;

var AsyncParallelHook_1 = AsyncParallelHook;

class AsyncParallelBailHookCodeFactory extends HookCodeFactory_1 {
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

const factory$4 = new AsyncParallelBailHookCodeFactory();

const COMPILE$4 = function(options) {
	factory$4.setup(this, options);
	return factory$4.create(options);
};

function AsyncParallelBailHook(args = [], name = undefined) {
	const hook = new Hook_1(args, name);
	hook.constructor = AsyncParallelBailHook;
	hook.compile = COMPILE$4;
	hook._call = undefined;
	hook.call = undefined;
	return hook;
}

AsyncParallelBailHook.prototype = null;

var AsyncParallelBailHook_1 = AsyncParallelBailHook;

class AsyncSeriesHookCodeFactory extends HookCodeFactory_1 {
	content({ onError, onDone }) {
		return this.callTapsSeries({
			onError: (i, err, next, doneBreak) => onError(err) + doneBreak(true),
			onDone
		});
	}
}

const factory$3 = new AsyncSeriesHookCodeFactory();

const COMPILE$3 = function(options) {
	factory$3.setup(this, options);
	return factory$3.create(options);
};

function AsyncSeriesHook(args = [], name = undefined) {
	const hook = new Hook_1(args, name);
	hook.constructor = AsyncSeriesHook;
	hook.compile = COMPILE$3;
	hook._call = undefined;
	hook.call = undefined;
	return hook;
}

AsyncSeriesHook.prototype = null;

var AsyncSeriesHook_1 = AsyncSeriesHook;

class AsyncSeriesBailHookCodeFactory extends HookCodeFactory_1 {
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

const factory$2 = new AsyncSeriesBailHookCodeFactory();

const COMPILE$2 = function(options) {
	factory$2.setup(this, options);
	return factory$2.create(options);
};

function AsyncSeriesBailHook(args = [], name = undefined) {
	const hook = new Hook_1(args, name);
	hook.constructor = AsyncSeriesBailHook;
	hook.compile = COMPILE$2;
	hook._call = undefined;
	hook.call = undefined;
	return hook;
}

AsyncSeriesBailHook.prototype = null;

var AsyncSeriesBailHook_1 = AsyncSeriesBailHook;

class AsyncSeriesLoopHookCodeFactory extends HookCodeFactory_1 {
	content({ onError, onDone }) {
		return this.callTapsLooping({
			onError: (i, err, next, doneBreak) => onError(err) + doneBreak(true),
			onDone
		});
	}
}

const factory$1 = new AsyncSeriesLoopHookCodeFactory();

const COMPILE$1 = function(options) {
	factory$1.setup(this, options);
	return factory$1.create(options);
};

function AsyncSeriesLoopHook(args = [], name = undefined) {
	const hook = new Hook_1(args, name);
	hook.constructor = AsyncSeriesLoopHook;
	hook.compile = COMPILE$1;
	hook._call = undefined;
	hook.call = undefined;
	return hook;
}

AsyncSeriesLoopHook.prototype = null;

var AsyncSeriesLoopHook_1 = AsyncSeriesLoopHook;

class AsyncSeriesWaterfallHookCodeFactory extends HookCodeFactory_1 {
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

function AsyncSeriesWaterfallHook(args = [], name = undefined) {
	if (args.length < 1)
		throw new Error("Waterfall hooks must have at least one argument");
	const hook = new Hook_1(args, name);
	hook.constructor = AsyncSeriesWaterfallHook;
	hook.compile = COMPILE;
	hook._call = undefined;
	hook.call = undefined;
	return hook;
}

AsyncSeriesWaterfallHook.prototype = null;

var AsyncSeriesWaterfallHook_1 = AsyncSeriesWaterfallHook;

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

HookMap.prototype.tap = util$1.deprecate(function(key, options, fn) {
	return this.for(key).tap(options, fn);
}, "HookMap#tap(key,…) is deprecated. Use HookMap#for(key).tap(…) instead.");

HookMap.prototype.tapAsync = util$1.deprecate(function(key, options, fn) {
	return this.for(key).tapAsync(options, fn);
}, "HookMap#tapAsync(key,…) is deprecated. Use HookMap#for(key).tapAsync(…) instead.");

HookMap.prototype.tapPromise = util$1.deprecate(function(key, options, fn) {
	return this.for(key).tapPromise(options, fn);
}, "HookMap#tapPromise(key,…) is deprecated. Use HookMap#for(key).tapPromise(…) instead.");

var HookMap_1 = HookMap;

class MultiHook {
	constructor(hooks, name = undefined) {
		this.hooks = hooks;
		this.name = name;
	}

	tap(options, fn) {
		for (const hook of this.hooks) {
			hook.tap(options, fn);
		}
	}

	tapAsync(options, fn) {
		for (const hook of this.hooks) {
			hook.tapAsync(options, fn);
		}
	}

	tapPromise(options, fn) {
		for (const hook of this.hooks) {
			hook.tapPromise(options, fn);
		}
	}

	isUsed() {
		for (const hook of this.hooks) {
			if (hook.isUsed()) return true;
		}
		return false;
	}

	intercept(interceptor) {
		for (const hook of this.hooks) {
			hook.intercept(interceptor);
		}
	}

	withOptions(options) {
		return new MultiHook(
			this.hooks.map(h => h.withOptions(options)),
			this.name
		);
	}
}

var MultiHook_1 = MultiHook;

var lib = createCommonjsModule(function (module, exports) {

exports.__esModule = true;
exports.SyncHook = SyncHook_1;
exports.SyncBailHook = SyncBailHook_1;
exports.SyncWaterfallHook = SyncWaterfallHook_1;
exports.SyncLoopHook = SyncLoopHook_1;
exports.AsyncParallelHook = AsyncParallelHook_1;
exports.AsyncParallelBailHook = AsyncParallelBailHook_1;
exports.AsyncSeriesHook = AsyncSeriesHook_1;
exports.AsyncSeriesBailHook = AsyncSeriesBailHook_1;
exports.AsyncSeriesLoopHook = AsyncSeriesLoopHook_1;
exports.AsyncSeriesWaterfallHook = AsyncSeriesWaterfallHook_1;
exports.HookMap = HookMap_1;
exports.MultiHook = MultiHook_1;
});

unwrapExports(lib);
lib.SyncHook;
lib.SyncBailHook;
var lib_3 = lib.SyncWaterfallHook;
lib.SyncLoopHook;
lib.AsyncParallelHook;
lib.AsyncParallelBailHook;
lib.AsyncSeriesHook;
lib.AsyncSeriesBailHook;
lib.AsyncSeriesLoopHook;
lib.AsyncSeriesWaterfallHook;
lib.HookMap;
lib.MultiHook;

exports.Method = void 0;
(function (Method) {
    Method["connect"] = "CONNECT";
    Method["delete"] = "DELETE";
    Method["get"] = "GET";
    Method["head"] = "HEAD";
    Method["options"] = "OPTIONS";
    Method["patch"] = "PATCH";
    Method["post"] = "POST";
    Method["put"] = "PUT";
    Method["trace"] = "TRACE";
})(exports.Method || (exports.Method = {}));

var HTTPError = /** @class */ (function (_super) {
    __extends(HTTPError, _super);
    function HTTPError(response) {
        var _this = _super.call(this, "HTTP " + response.status + " Error: " + response.statusText) || this;
        _this.response = response;
        _this.name = 'HTTPError';
        return _this;
    }
    return HTTPError;
}(Error));

var Str = /** @class */ (function () {
    function Str() {
    }
    Str.random = function (length) {
        if (length === void 0) { length = 15; }
        var text = '';
        var possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        for (var i = 0; i < length; i++) {
            text += possible.charAt(Math.floor(Math.random() * possible.length));
        }
        return text;
    };
    Str.ensureLeft = function (str, left) {
        if (false === str.startsWith(left)) {
            return left + str;
        }
        return str;
    };
    Str.ensureRight = function (str, right) {
        if (false === str.endsWith(right)) {
            return str + right;
        }
        return str;
    };
    Str.stripLeft = function (str, left) {
        if (str.startsWith(left)) {
            return str.substr(left.length);
        }
        return str;
    };
    Str.stripRight = function (str, right) {
        if (str.endsWith(right)) {
            return str.substr(0, str.length - right.length);
        }
        return str;
    };
    Str.ucfirst = function (string) {
        return string[0].toUpperCase() + string.slice(1);
    };
    Str.lcfirst = function (string) {
        return string[0].toLowerCase() + string.slice(1);
    };
    Str.parameters = function (str, params) {
        Object.entries(params).forEach(function (_a) {
            var key = _a[0], value = _a[1];
            return str = str.replace(new RegExp(':' + key, 'g'), value);
        });
        return str;
    };
    return Str;
}());

var Client = /** @class */ (function () {
    function Client(config) {
        this.hooks = {
            createRequest: new lib_3(['factory']),
            request: new lib_3(['request']),
            response: new lib_3(['response', 'request']),
        };
        this.config = cjs({
            headers: {
                'X-Requested-With': 'XMLHttpRequest',
            },
            request: {
                method: 'GET',
                credentials: 'include',
            },
        }, config);
    }
    Client.prototype.request = function (method, uri, config) {
        if (config === void 0) { config = {}; }
        return __awaiter(this, void 0, void 0, function () {
            var request, response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        request = this.createRequest(method, uri, config);
                        return [4 /*yield*/, this.hooks.request.promise(request)];
                    case 1:
                        request = _a.sent();
                        return [4 /*yield*/, fetch(request)];
                    case 2:
                        response = _a.sent();
                        return [4 /*yield*/, this.hooks.response.promise(response, request)];
                    case 3:
                        response = _a.sent();
                        if (!response.ok) {
                            throw new HTTPError(response);
                        }
                        return [2 /*return*/, response];
                }
            });
        });
    };
    Client.prototype.createRequest = function (method, uri, config) {
        if (config === void 0) { config = {}; }
        var factory = this.createRequestFactory(method, uri, config);
        factory = this.hooks.createRequest.call(factory);
        return factory.make();
    };
    Client.prototype.createRequestFactory = function (method, uri, config) {
        if (config === void 0) { config = {}; }
        config = this.getRequestConfig(config);
        config.method = exports.Method[method];
        return createRequestFactory(this.config).merge(config);
    };
    Client.prototype.getRequestConfig = function (config) {
        if (config === void 0) { config = {}; }
        return cjs(this.config.request, config, { clone: true });
    };
    return Client;
}());
var RequestFactory = /** @class */ (function () {
    function RequestFactory(_clientConfig, _Request) {
        this._clientConfig = _clientConfig;
        this._Request = _Request;
        this._config = {};
        this._params = new URLSearchParams();
        this._headers = new Headers();
        return new Proxy(this, {
            get: function (target, p, receiver) {
                if (Reflect.has(target, p)) {
                    return Reflect.get(target, p, receiver);
                }
                //@formatter:on
                return function (value) {
                    target._config[p] = value;
                    return target;
                };
            },
            set: function (target, p, value, receiver) {
                if (typeof target[p] === 'function') {
                    return target[p](value);
                }
                return Reflect.set(target, p, value, receiver);
            },
        });
    }
    RequestFactory.prototype.merge = function (config) {
        var _this = this;
        Object.entries(config).forEach(function (_a) {
            var key = _a[0], value = _a[1];
            return _this[key](value);
        });
        return this;
    };
    RequestFactory.prototype.getConfig = function () {
        return __assign(__assign({}, this._config), { headers: this._headers, params: this._params, url: this._config.url ? this.getUri(this._config.url) : this._config.url });
    };
    RequestFactory.prototype.header = function (name, value) {
        this._headers.set(name, value);
        return this;
    };
    RequestFactory.prototype.param = function (name, value) {
        this._headers.set(name, value);
        return this;
    };
    RequestFactory.prototype.headers = function (headers) {
        mergeHeaders(headers, this._headers);
        return this;
    };
    RequestFactory.prototype.params = function (params) {
        mergeURLSearchParams(params, this._params);
        return this;
    };
    RequestFactory.prototype.data = function (value) {
        this._headers.set('Content-Type', 'application/json');
        this._config.body = JSON.stringify(value);
        return this;
    };
    RequestFactory.prototype.getUri = function (uri) {
        var params = this._params.toString();
        if (params.length) {
            params = '?' + params;
        }
        return Str.ensureRight(this._clientConfig.baseURL, '/') + Str.stripLeft(uri, '/') + params;
    };
    RequestFactory.prototype.basic = function (username, password) {
        return this.authorization('Basic', btoa(username + ':' + password));
    };
    RequestFactory.prototype.bearer = function (token) {
        return this.authorization('Bearer', token);
    };
    RequestFactory.prototype.authorization = function (key, value) {
        this._headers.set('Authorization', key + ' ' + value);
        return this;
    };
    RequestFactory.prototype.make = function () {
        var config = this.getConfig();
        return new this._Request(config.url, config);
    };
    return RequestFactory;
}());
function createRequestFactory(clientConfig, _Request) {
    if (_Request === void 0) { _Request = Request; }
    return new RequestFactory(clientConfig, _Request);
}
function mergeHeaders(source, destination) {
    (new Headers(source)).forEach(function (value, key) { return destination.set(key, value); });
    return destination;
}
function mergeURLSearchParams(source, destination) {
    (new URLSearchParams(source)).forEach(function (value, key) { return destination.set(key, value); });
    return destination;
}

var Field = /** @class */ (function () {
    function Field(field) {
        Object.assign(this, field);
    }
    return Field;
}());

var FieldCollection = /** @class */ (function (_super) {
    __extends(FieldCollection, _super);
    function FieldCollection() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return FieldCollection;
}(Collection));

var Http = /** @class */ (function () {
    function Http(streams) {
        this.streams = streams;
    }
    Object.defineProperty(Http.prototype, "client", {
        get: function () { return this.streams.client; },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Http.prototype, "config", {
        get: function () { return this.streams.config; },
        enumerable: false,
        configurable: true
    });
    Http.prototype.getStreams = function (params, config) {
        if (params === void 0) { params = {}; }
        if (config === void 0) { config = {}; }
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                config.params = params;
                return [2 /*return*/, this.get('/streams', config)];
            });
        });
    };
    Http.prototype.postStream = function (data, config) {
        if (config === void 0) { config = {}; }
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.post('/streams', data, config)];
            });
        });
    };
    Http.prototype.getStream = function (stream, params, config) {
        if (params === void 0) { params = {}; }
        if (config === void 0) { config = {}; }
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                config.params = params;
                return [2 /*return*/, this.get("/streams/" + stream, config)];
            });
        });
    };
    Http.prototype.patchStream = function (stream, data, config) {
        if (data === void 0) { data = {}; }
        if (config === void 0) { config = {}; }
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.patch("/streams/" + stream, data, config)];
            });
        });
    };
    Http.prototype.putStream = function (stream, data, config) {
        if (data === void 0) { data = {}; }
        if (config === void 0) { config = {}; }
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.put("/streams/" + stream, data, config)];
            });
        });
    };
    Http.prototype.deleteStream = function (stream, config) {
        if (config === void 0) { config = {}; }
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.delete("/streams/" + stream, config)];
            });
        });
    };
    Http.prototype.getEntries = function (stream, data, params, config) {
        if (data === void 0) { data = {}; }
        if (params === void 0) { params = {}; }
        if (config === void 0) { config = {}; }
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                config.body = data;
                config.params = params;
                return [2 /*return*/, this.get("/streams/" + stream + "/entries", __assign(__assign({}, config), { headers: {
                            'Content-Type': 'application/json',
                        } }))];
            });
        });
    };
    Http.prototype.postEntry = function (stream, data, config) {
        if (data === void 0) { data = {}; }
        if (config === void 0) { config = {}; }
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.post("/streams/" + stream + "/entries", data, config)];
            });
        });
    };
    Http.prototype.getEntry = function (stream, entry, config) {
        if (config === void 0) { config = {}; }
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.get("/streams/" + stream + "/entries/" + entry, config)];
            });
        });
    };
    Http.prototype.patchEntry = function (stream, entry, data, config) {
        if (data === void 0) { data = {}; }
        if (config === void 0) { config = {}; }
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.patch("/streams/" + stream + "/entries/" + entry, data, config)];
            });
        });
    };
    Http.prototype.putEntry = function (stream, entry, data, config) {
        if (data === void 0) { data = {}; }
        if (config === void 0) { config = {}; }
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.put("/streams/" + stream + "/entries/" + entry, data, config)];
            });
        });
    };
    Http.prototype.deleteEntry = function (stream, entry, config) {
        if (config === void 0) { config = {}; }
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                Str.parameters('/streams/:stream/entries/:entry', { stream: stream, entry: entry });
                return [2 /*return*/, this.patch("/streams/" + stream + "/entries/" + entry, config)];
            });
        });
    };
    Http.prototype.get = function (url, config) {
        if (config === void 0) { config = {}; }
        return __awaiter(this, void 0, void 0, function () { return __generator(this, function (_a) {
            return [2 /*return*/, this.request('get', url, config)];
        }); });
    };
    Http.prototype.delete = function (url, config) {
        if (config === void 0) { config = {}; }
        return __awaiter(this, void 0, void 0, function () { return __generator(this, function (_a) {
            return [2 /*return*/, this.request('delete', url, config)];
        }); });
    };
    Http.prototype.head = function (url, config) {
        if (config === void 0) { config = {}; }
        return __awaiter(this, void 0, void 0, function () { return __generator(this, function (_a) {
            return [2 /*return*/, this.request('head', url, config)];
        }); });
    };
    Http.prototype.options = function (url, config) {
        if (config === void 0) { config = {}; }
        return __awaiter(this, void 0, void 0, function () { return __generator(this, function (_a) {
            return [2 /*return*/, this.request('options', url, config)];
        }); });
    };
    Http.prototype.post = function (url, data, config) {
        if (config === void 0) { config = {}; }
        return __awaiter(this, void 0, void 0, function () { return __generator(this, function (_a) {
            return [2 /*return*/, this.request('post', url, __assign({ data: data }, config))];
        }); });
    };
    Http.prototype.put = function (url, data, config) {
        if (config === void 0) { config = {}; }
        return __awaiter(this, void 0, void 0, function () { return __generator(this, function (_a) {
            return [2 /*return*/, this.request('put', url, __assign({ data: data }, config))];
        }); });
    };
    Http.prototype.patch = function (url, data, config) {
        if (config === void 0) { config = {}; }
        return __awaiter(this, void 0, void 0, function () { return __generator(this, function (_a) {
            return [2 /*return*/, this.request('patch', url, __assign({ data: data }, config))];
        }); });
    };
    Http.prototype.request = function (method, url, config) {
        return __awaiter(this, void 0, void 0, function () {
            var response, e_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.client.request(method, url, config)];
                    case 1:
                        response = _a.sent();
                        return [2 /*return*/, response];
                    case 2:
                        e_1 = _a.sent();
                        throw e_1;
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    return Http;
}());

var Repository = /** @class */ (function () {
    /**
     * Create a new repository instance.
     *
     * @param stream
     */
    function Repository(stream) {
        this.stream = stream;
    }
    Object.defineProperty(Repository.prototype, "http", {
        get: function () {
            return this.stream.streams.http;
        },
        enumerable: false,
        configurable: true
    });
    /**
     * Return all items.
     *
     * @returns EntryCollection
     */
    Repository.prototype.all = function () {
        return __awaiter(this, void 0, void 0, function () {
            var response, entries;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.http.getEntries(this.stream.id)];
                    case 1:
                        response = _a.sent();
                        entries = response.data.map(function (entry) { return new Entry(_this.stream, entry, false); });
                        return [2 /*return*/, new EntryCollection(entries, response.meta, response.links)];
                }
            });
        });
    };
    /**
     * Find an entry by ID.
     *
     * @param id
     * @returns Entry
     */
    Repository.prototype.find = function (id) {
        return __awaiter(this, void 0, void 0, function () {
            var criteria;
            return __generator(this, function (_a) {
                criteria = this.stream.entries();
                return [2 /*return*/, criteria.where('id', id).first()];
            });
        });
    };
    /**
     * Find all records by IDs.
     *
     * @param ids
     * @returns EntryCollection
     */
    Repository.prototype.findAll = function (ids) {
        return __awaiter(this, void 0, void 0, function () {
            var criteria;
            return __generator(this, function (_a) {
                criteria = this.stream.entries();
                return [2 /*return*/, criteria.where('id', 'IN', ids).get()];
            });
        });
    };
    /**
     * Find an entry by a field value.
     *
     * @param field
     * @param value
     * @returns Entry
     */
    Repository.prototype.findBy = function (field, value) {
        return __awaiter(this, void 0, void 0, function () {
            var criteria;
            return __generator(this, function (_a) {
                criteria = this.stream.entries();
                return [2 /*return*/, criteria.where(field, value).first()];
            });
        });
    };
    /**
     * Find all entries by field value.
     *
     * @param $field
     * @param $operator
     * @param $value
     * @return EntryCollection
     */
    Repository.prototype.findAllWhere = function (field, value) {
        return __awaiter(this, void 0, void 0, function () {
            var criteria;
            return __generator(this, function (_a) {
                criteria = this.stream.entries();
                return [2 /*return*/, criteria.where(field, value).get()];
            });
        });
    };
    /**
     * Create a new entry.
     *
     * @param attributes
     * @returns
     */
    Repository.prototype.create = function (attributes) {
        return __awaiter(this, void 0, void 0, function () {
            var entry;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        entry = this.newCriteria().newInstance(attributes);
                        return [4 /*yield*/, entry.save()];
                    case 1:
                        _a.sent();
                        return [2 /*return*/, entry];
                }
            });
        });
    };
    /**
     * Save an entry.
     *
     * @param entry
     * @returns
     */
    Repository.prototype.save = function (entry) {
        return __awaiter(this, void 0, void 0, function () {
            var result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, entry.save()];
                    case 1:
                        result = _a.sent();
                        return [2 /*return*/, result];
                }
            });
        });
    };
    /**
     * Save an entry.
     *
     * @param entry
     * @returns
     */
    Repository.prototype.delete = function (entry) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.http.deleteEntry(this.stream.id, entry.id)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/, true];
                }
            });
        });
    };
    Repository.prototype.truncate = function () { return this; };
    /**
     * Return a new instance.
     *
     * @param attributes
     * @returns
     */
    Repository.prototype.newInstance = function (attributes) {
        return this.newCriteria().newInstance(attributes);
    };
    /**
     * Return a new entry criteria.
     *
     * @returns Criteria
     */
    Repository.prototype.newCriteria = function () {
        return new Criteria(this.stream);
    };
    return Repository;
}());

var Stream = /** @class */ (function () {
    function Stream(streams, stream, meta, links) {
        this.streams = streams;
        this.meta = meta;
        this.links = links;
        if (stream.fields) {
            this.fields = new Map(Object.entries(stream.fields).map(function (_a) {
                var key = _a[0], field = _a[1];
                return [key, new Field(field)];
            }));
            delete stream.fields;
        }
        Object.assign(this, stream);
    }
    Object.defineProperty(Stream.prototype, "repository", {
        /**
         * Return the entries repository.
         *
         * @returns Repository
         */
        get: function () {
            if (!this._repository) {
                this._repository = new Repository(this);
            }
            return this._repository;
        },
        enumerable: false,
        configurable: true
    });
    /**
     * Return the entries criteria.
     *
     * @returns Criteria
     */
    Stream.prototype.entries = function () {
        return this.repository.newCriteria();
    };
    return Stream;
}());

var Streams = /** @class */ (function () {
    function Streams(config) {
        this.config = config;
        this.client = new Client(this.config);
        this.http = new Http(this);
    }
    /**
     * Return all streams.
     *
     * @returns
     */
    Streams.prototype.all = function () {
        return __awaiter(this, void 0, void 0, function () {
            var data;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.http.getStreams()];
                    case 1:
                        data = _a.sent();
                        return [2 /*return*/, data.data.map(function (data) { return new Stream(_this, data); })];
                }
            });
        });
    };
    /**
     * Make a stream instance.
     *
     * @param id
     * @returns
     */
    Streams.prototype.make = function (id) {
        return __awaiter(this, void 0, void 0, function () {
            var data;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.http.getStream(id)];
                    case 1:
                        data = _a.sent();
                        return [2 /*return*/, new Stream(this, data.data, data.meta, data.links)];
                }
            });
        });
    };
    Streams.prototype.create = function (id, stream) {
        return __awaiter(this, void 0, void 0, function () {
            var data;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.http.postStream(__assign({ id: id, name: id }, stream))];
                    case 1:
                        data = _a.sent();
                        return [2 /*return*/, new Stream(this, data.data, data.meta, data.links)];
                }
            });
        });
    };
    /**
     * Return an entry criteria.
     *
     * @param id
     * @returns Criteria
     */
    Streams.prototype.entries = function (id) {
        return __awaiter(this, void 0, void 0, function () {
            var stream;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.make(id)];
                    case 1:
                        stream = _a.sent();
                        return [2 /*return*/, new Criteria(stream)];
                }
            });
        });
    };
    /**
     * Return an entry repository.
     *
     * @param id
     * @returns
     */
    Streams.prototype.repository = function (id) {
        return __awaiter(this, void 0, void 0, function () {
            var stream;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.make(id)];
                    case 1:
                        stream = _a.sent();
                        return [2 /*return*/, new Repository(stream)];
                }
            });
        });
    };
    /**
     * Return the Streams collection.
     */
    Streams.prototype.collection = function () {
        // return this._collection
    };
    return Streams;
}());

exports.Client = Client;
exports.Collection = Collection;
exports.Criteria = Criteria;
exports.Entry = Entry;
exports.EntryCollection = EntryCollection;
exports.Field = Field;
exports.FieldCollection = FieldCollection;
exports.Http = Http;
exports.PaginatedEntryCollection = PaginatedEntryCollection;
exports.Repository = Repository;
exports.RequestFactory = RequestFactory;
exports.Stream = Stream;
exports.Streams = Streams;
exports.comparisonOperators = comparisonOperators;
exports.logicalOperators = logicalOperators;
exports.operators = operators;
