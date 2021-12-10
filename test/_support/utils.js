"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Dot = exports.dot = exports.FS = exports.fs = exports.FixturesDirectoryStorage = exports.ProjectDirectoryStorage = exports.StreamDirectoryStorage = exports.proxyEnv = exports.getEnv = exports.getDotEnv = exports.getProjectRootPath = exports.getDotEnvPath = exports.getBigDataObject = void 0;
require("reflect-metadata");
const path_1 = require("path");
const fs_1 = require("fs");
const dotenv_1 = require("dotenv");
const lodash_1 = require("lodash");
const DirectoryStorage_1 = require("./DirectoryStorage");
const generator_1 = require("./generator");
function getBigDataObject() {
    return require('./package-lock-data.json');
}
exports.getBigDataObject = getBigDataObject;
function getDotEnvPath() {
    let dirPath = __dirname;
    while (true) {
        let envPath = (0, path_1.join)(dirPath, '.env');
        if ((0, fs_1.existsSync)(envPath)) {
            return envPath;
        }
        if ((0, path_1.dirname)(dirPath) === dirPath) {
            return false;
        }
        dirPath = (0, path_1.dirname)(dirPath);
    }
}
exports.getDotEnvPath = getDotEnvPath;
function getProjectRootPath() {
    let dirPath = __dirname;
    while (true) {
        let rootPath = (0, path_1.join)(dirPath, 'artisan');
        if ((0, fs_1.existsSync)(rootPath)) {
            return (0, path_1.dirname)(rootPath);
        }
        if ((0, path_1.dirname)(dirPath) === dirPath) {
            return false;
        }
        dirPath = (0, path_1.dirname)(dirPath);
    }
}
exports.getProjectRootPath = getProjectRootPath;
function getDotEnv() {
    let dotEnvPath = getDotEnvPath();
    let parsed = {};
    if (dotEnvPath) {
        let env = (0, dotenv_1.config)({
            path: dotEnvPath,
            encoding: 'utf8',
        });
        parsed = env.parsed;
    }
    return parsed;
}
exports.getDotEnv = getDotEnv;
function getEnv() {
    getDotEnv();
    return proxyEnv(process.env);
}
exports.getEnv = getEnv;
function proxyEnv(env) {
    const get = (key, defaultValue) => env[key];
    const has = (key) => env[key] !== undefined;
    const set = (key, value) => env[key] = value;
    return new Proxy(env, {
        get(target, p, receiver) {
            if (Reflect.has(target, p)) {
                return Reflect.get(target, p, receiver);
            }
            let name = p.toString();
            if (name === "__s_is_proxy" /* IS_PROXY */)
                return true;
            if (name === "__s_unproxy" /* UNPROXY */)
                return target;
            if (name === 'get')
                return get;
            if (name === 'has')
                return has;
            if (name === 'set')
                return set;
        },
        set(target, p, value, receiver) {
            return Reflect.set(target, p, value, receiver);
        },
        has(target, p) {
            return Reflect.has(target, p);
        },
    });
}
exports.proxyEnv = proxyEnv;
class StreamDirectoryStorage extends DirectoryStorage_1.DirectoryStorage {
    createStream(name, stream) {
        this.deleteStream(name);
        this.writeJson(this.path(this.streamsDir, name + '.json'), stream, { pretty: true });
        return this.getStream(name);
    }
    deleteStream(name) {
        this.delete(this.path(this.streamsDir, name + '.json'));
        this.deleteStreamData(name);
    }
    deleteStreamData(name) {
        this.delete(this.path(this.dataDir, name + '.json'));
        if (this.isFile(this.dataDir, name + '.json')) {
            this.delete(this.path(this.dataDir, name + '.json'));
        }
        if (this.isDirectory(this.dataDir, name)) {
            this.delete(this.path(this.dataDir, name));
        }
    }
    hasStream(name) { return this.exists(this.streamsDir, name + '.json'); }
    hasStreamData(name) { return this.isDirectory(this.dataDir, name) || this.exists(this.dataDir, name + '.json'); }
    getStream(name) {
        return (0, exports.dot)(this.readJson(this.streamsDir + '/' + name + '.json'));
    }
    getStreamEntries(name) {
        if (!this.hasStreamData(name)) {
            return null;
        }
        if (this.isDirectory(this.dataDir, name)) {
            return this.glob((0, path_1.join)(this.dataDir, name + '/*.json')).map(jsonFile => {
                let obj = this.readJson(jsonFile, { pretty: true });
                Object.defineProperty(obj, '__filename', {
                    enumerable: false,
                    get: () => (0, path_1.basename)(jsonFile),
                });
                return obj;
            });
        }
        if (this.exists(this.dataDir, name + '.json')) {
            let obj = this.readJson(this.path(this.dataDir, name + '.json'));
            // obj.id       = name;
            return obj;
        }
    }
    generateFakeStreamEntries(name, amount) {
        let stream = this.getStream(name);
        let entries = generator_1.Generator.fromStream(stream, amount);
        this.createStreamEntries(name, entries);
        return entries;
    }
    createStreamEntries(name, data) {
        this.ensureDir(this.dataDir);
        if (Array.isArray(data)) {
            this.ensureDir(this.dataDir, name);
            for (const entry of data) {
                let fileName = (entry.id || entry.handle || entry.__filename).toString();
                if (!fileName.endsWith('.json'))
                    fileName += '.json';
                this.writeJson(this.path(this.dataDir, name, fileName), entry);
            }
        }
        else {
            this.writeJson(this.path(this.dataDir, name + '.json'), data);
        }
    }
    copyStream(name, dest) {
        let stream = this.getStream(name);
        dest.createStream(name, stream.obj);
        dest.createStreamEntries(name, this.getStreamEntries(name));
        return this;
    }
}
exports.StreamDirectoryStorage = StreamDirectoryStorage;
class ProjectDirectoryStorage extends StreamDirectoryStorage {
    constructor() {
        super(...arguments);
        this.streamsDir = 'streams';
        this.dataDir = 'streams/data';
    }
}
exports.ProjectDirectoryStorage = ProjectDirectoryStorage;
class FixturesDirectoryStorage extends StreamDirectoryStorage {
    constructor() {
        super(...arguments);
        this.streamsDir = 'streams';
        this.dataDir = 'streams/data';
    }
}
exports.FixturesDirectoryStorage = FixturesDirectoryStorage;
const dsoptions = (basePath) => ({ basePath, encoding: 'utf8', json: { pretty: true } });
exports.fs = {
    project: new ProjectDirectoryStorage(dsoptions(getProjectRootPath())),
    fixtures: new FixturesDirectoryStorage(dsoptions((0, path_1.resolve)(__dirname, '..', 'fixtures'))),
};
class FS {
    constructor() {
        let path = getProjectRootPath();
        if (path) {
            this.rootPath = path;
        }
    }
    path(...parts) { return (0, path_1.join)(this.rootPath, ...parts); }
    resolvePath(path) { return (0, path_1.isAbsolute)(path) ? path : this.path(path); }
    createStream(name, data) {
        this.delete(`streams/${name}.json`);
        this.delete(`streams/data/${name}.json`);
        this.create(`streams/${name}.json`, data);
    }
    create(path, data, override = true) {
        path = this.resolvePath(path);
        if ((0, fs_1.existsSync)(path)) {
            if (!override) {
                return false;
            }
            (0, fs_1.unlinkSync)(path);
        }
        if (typeof data !== 'string') {
            data = JSON.stringify(data, null, 4);
        }
        (0, fs_1.writeFileSync)(path, data, 'utf8');
        return true;
    }
    get(path) {
        path = this.resolvePath(path);
        if (!(0, fs_1.existsSync)(path)) {
            throw new Error(`Could not read file from "${path}". File does not exist`);
        }
        return (0, fs_1.readFileSync)(path, 'utf8');
    }
    getJson(path) {
        const content = this.get(path);
        const obj = JSON.parse(content);
        return obj;
    }
    delete(path) {
        path = this.resolvePath(path);
        if ((0, fs_1.existsSync)(path)) {
            (0, fs_1.unlinkSync)(path);
        }
        return true;
    }
    exists(path) {
        return (0, fs_1.existsSync)(this.resolvePath(path));
    }
}
exports.FS = FS;
const dot = (obj) => new Dot(obj);
exports.dot = dot;
class Dot {
    constructor(obj = {}) {
        this.obj = obj;
        this.before = () => null;
        let proxy = new Proxy(this, {
            get(target, p, receiver) {
                if (Reflect.has(target, p)) {
                    return Reflect.get(target, p, receiver);
                }
                if (Reflect.has(target.obj, p)) {
                    return Reflect.get(target.obj, p);
                }
            },
            set(target, p, value, receiver) {
                if (Reflect.has(target, p)) {
                    return Reflect.set(target, p, value, receiver);
                }
                return Reflect.set(target.obj, p, value);
            },
        });
        return proxy;
    }
    set(obj) {
        this.obj = obj;
        return this;
    }
    get(path, defaultValue) {
        this.before(this);
        return (0, lodash_1.get)(this.obj, path, defaultValue);
    }
    has(path) {
        this.before(this);
        return (0, lodash_1.has)(this.obj, path);
    }
    put(path, value) {
        this.before(this);
        (0, lodash_1.set)(this.obj, path, value);
        return this;
    }
    unset(path) {
        this.before(this);
        (0, lodash_1.unset)(this.obj, path);
        return this;
    }
    merge(data) {
        this.obj = (0, lodash_1.merge)({}, this.obj, data);
        return this;
    }
}
exports.Dot = Dot;
//
// export class FSStream<T extends object = object> extends Dot<T> {
//     protected fs: FS;
//     protected _data: Dot;
//     protected loaded = false;
//
//     before = () => {
//         this.refresh();
//     };
//
//     isLoaded(): boolean {return this.loaded;}
//
//     get data(): Dot {return this._data;}
//
//     constructor(public readonly name: string, streamObj: T) {
//         super();
//         this.fs = new FS;
//         this.create(streamObj);
//         this.refresh();
//     }
//
//     static get<T extends object = object>(name: string, obj: any): FSStream<T> {
//         return new FSStream<T>(name, obj);
//     }
//
//     protected create(streamObj) {
//         if ( !this.fs.exists(`streams/${this.name}.json`) ) {
//             this.fs.create(`streams/${this.name}.json`, streamObj);
//         }
//         if ( !this.fs.exists(`streams/data/${this.name}.json`) ) {
//             this.fs.create(`streams/data/${this.name}.json`, {});
//         }
//
//         this.refreshData();
//         this.loaded = true;
//     }
//
//     refresh() {
//         let obj = this.fs.getJson(`streams/${this.name}.json`);
//         this.set(obj as any);
//         this.refreshData();
//         return this;
//     }
//
//     protected refreshData() {
//         let obj = this.fs.getJson(`streams/data/${this.name}.json`);
//         let dot = new Dot();
//         dot.set(obj as any);
//         this._data = dot;
//         return this;
//     }
//
//     clean() {
//         this.fs.delete(`streams/${this.name}.json`);
//         this.fs.delete(`streams/data/${this.name}.json`);
//         this.loaded = false;
//     }
//
// }
//# sourceMappingURL=utils.js.map