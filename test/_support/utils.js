"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FS = exports.proxyEnv = exports.getEnv = exports.getDotEnv = exports.getProjectRootPath = exports.getDotEnvPath = exports.getBigDataObject = void 0;
require("reflect-metadata");
const path_1 = require("path");
const fs_1 = require("fs");
const dotenv_1 = require("dotenv");
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
