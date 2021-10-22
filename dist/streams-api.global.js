var streamsApi = (function (exports, deepmerge, require$$0) {
    'use strict';

    function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

    var deepmerge__default = /*#__PURE__*/_interopDefaultLegacy(deepmerge);
    var require$$0__default = /*#__PURE__*/_interopDefaultLegacy(require$$0);

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

    /*
    	MIT License http://www.opensource.org/licenses/mit-license.php
    	Author Tobias Koppers @sokra
    */

    const util$1 = require$$0__default["default"];

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

    class Hook$1 {
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

    Object.setPrototypeOf(Hook$1.prototype, null);

    var Hook_1 = Hook$1;

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

    new SyncHookCodeFactory();

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

    const Hook = Hook_1;
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

    const factory = new SyncWaterfallHookCodeFactory();

    const TAP_ASYNC = () => {
    	throw new Error("tapAsync is not supported on a SyncWaterfallHook");
    };

    const TAP_PROMISE = () => {
    	throw new Error("tapPromise is not supported on a SyncWaterfallHook");
    };

    const COMPILE = function(options) {
    	factory.setup(this, options);
    	return factory.create(options);
    };

    function SyncWaterfallHook$1(args = [], name = undefined) {
    	if (args.length < 1)
    		throw new Error("Waterfall hooks must have at least one argument");
    	const hook = new Hook(args, name);
    	hook.constructor = SyncWaterfallHook$1;
    	hook.tapAsync = TAP_ASYNC;
    	hook.tapPromise = TAP_PROMISE;
    	hook.compile = COMPILE;
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

    new AsyncSeriesWaterfallHookCodeFactory();

    /*
    	MIT License http://www.opensource.org/licenses/mit-license.php
    	Author Tobias Koppers @sokra
    */

    const util = require$$0__default["default"];

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
    var SyncWaterfallHook = SyncWaterfallHook_1;

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
                createRequest: new SyncWaterfallHook(['factory']),
                request: new SyncWaterfallHook(['request']),
                response: new SyncWaterfallHook([
                    'response',
                    'request',
                ]),
            };
            this.config = deepmerge__default["default"]({
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
            return deepmerge__default["default"](this.config.request, config, {
                clone: true,
            });
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
            return __assign(__assign({}, this._config), { headers: this._headers, params: this._params, url: this._config.url
                    ? this.getUri(this._config.url)
                    : this._config.url });
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
            return (Str.ensureRight(this._clientConfig.baseURL, '/') +
                Str.stripLeft(uri, '/') +
                params);
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
        new Headers(source).forEach(function (value, key) { return destination.set(key, value); });
        return destination;
    }
    function mergeURLSearchParams(source, destination) {
        new URLSearchParams(source).forEach(function (value, key) {
            return destination.set(key, value);
        });
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
                    entry = this.newCriteria().newInstance(attributes);
                    return [2 /*return*/, entry.save()];
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
                return __generator(this, function (_a) {
                    return [2 /*return*/, entry.save()];
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

    Object.defineProperty(exports, '__esModule', { value: true });

    return exports;

})({}, deepmerge, require$$0);
