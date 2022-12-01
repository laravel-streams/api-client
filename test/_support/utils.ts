import 'reflect-metadata';
import { basename, dirname, isAbsolute, join, resolve } from 'path';
import { existsSync, readFileSync, unlinkSync, writeFileSync } from 'fs';
import { config } from 'dotenv';
import { get, has, merge, set, unset } from 'lodash';
import { DirectoryStorage, DirectoryStorageOptions } from './DirectoryStorage';
import { IStream } from '../../src2';
import { Generator } from './generator';

export function getBigDataObject() {
    return require('./package-lock-data.json');
}

export function getDotEnvPath(): string | false {
    let dirPath = __dirname;
    while ( true ) {
        let envPath = join(dirPath, '.env');
        if ( existsSync(envPath) ) {
            return envPath;
        }
        if ( dirname(dirPath) === dirPath ) {
            return false;
        }
        dirPath = dirname(dirPath);
    }
}

export function getProjectRootPath(): string | false {
    let dirPath = __dirname;
    while ( true ) {
        let rootPath = join(dirPath, 'artisan');
        if ( existsSync(rootPath) ) {
            return dirname(rootPath);
        }
        if ( dirname(dirPath) === dirPath ) {
            return false;
        }
        dirPath = dirname(dirPath);
    }
}

export function getDotEnv(): any {
    let dotEnvPath = getDotEnvPath();
    let parsed     = {};
    if ( dotEnvPath ) {
        let env = config({
            path    : dotEnvPath,
            encoding: 'utf8',
        });
        parsed  = env.parsed;
    }
    return parsed;
}

export function getEnv<T = any>(): ProxyEnv<T> {
    getDotEnv();
    return proxyEnv(process.env) as any;
}

export const enum ProxyFlags {
    IS_PROXY = '__s_is_proxy',
    UNPROXY  = '__s_unproxy'
}

export type ProxyEnv<T> =
    T
    & {
        [ key: string ]: any
        get<T>(key: string, defaultValue?: any): T
        set(key: string, value: any): boolean
        has(key: string): boolean

    }

export function proxyEnv<T extends object>(env: T): ProxyEnv<T> {
    const get = (key: string, defaultValue?: any) => env[ key ];
    const has = (key: string) => env[ key ] !== undefined;
    const set = (key: string, value: any) => env[ key ] = value;
    return new Proxy(env, {
        get(target: any, p: string | symbol, receiver: any): any {
            if ( Reflect.has(target, p) ) {
                return Reflect.get(target, p, receiver);
            }
            let name = p.toString();
            if ( name === ProxyFlags.IS_PROXY ) return true;
            if ( name === ProxyFlags.UNPROXY ) return target;
            if ( name === 'get' ) return get;
            if ( name === 'has' ) return has;
            if ( name === 'set' ) return set;
        },
        set(target: any, p: string | symbol, value: any, receiver: any): boolean {
            return Reflect.set(target, p, value, receiver);
        },
        has(target: any, p: string | symbol): boolean {
            return Reflect.has(target, p);
        },
    }) as any;
}

export abstract class StreamDirectoryStorage extends DirectoryStorage {
    static defaultStreamConfig: Partial<IStream['config']> = {
        key_name: 'id',
        source  : {
            type: 'filebase',
        },
    };
    protected abstract streamsDir: string;
    protected abstract dataDir: string;

    createStream(name: string, stream: IStream) {
        stream.config = merge({} as any, StreamDirectoryStorage.defaultStreamConfig, stream.config || {});
        this.deleteStream(name);
        this.writeJson(this.path(this.streamsDir, name + '.json'), stream, { pretty: true });
        return this.getStream(name);
    }

    deleteStream(name: string) {
        this.delete(this.path(this.streamsDir, name + '.json'));
        this.deleteStreamData(name);
    }

    deleteStreamData(name: string) {
        this.delete(this.path(this.dataDir, name + '.json'));
        if ( this.isFile(this.dataDir, name + '.json') ) {
            this.delete(this.path(this.dataDir, name + '.json'));
        }
        if ( this.isDirectory(this.dataDir, name) ) {
            this.delete(this.path(this.dataDir, name));
        }
    }

    hasStream(name: string) {return this.exists(this.streamsDir, name + '.json'); }

    hasStreamData(name: string) { return this.isDirectory(this.dataDir, name) || this.exists(this.dataDir, name + '.json'); }

    getStream(name) {
        return dot<IStream>(this.readJson<IStream>(this.streamsDir + '/' + name + '.json'));
    }

    getStreamEntries(name): any {
        if ( !this.hasStreamData(name) ) {
            return [];
        }
        if ( this.isDirectory(this.dataDir, name) ) {
            return this.glob(join(this.dataDir, name + '/*.json')).map(jsonFile => {
                let obj: any = this.readJson(jsonFile, { pretty: true });
                Object.defineProperty(obj, '__filename', {
                    enumerable: false,
                    get       : () => basename(jsonFile),
                });
                return obj;
            });
        }
        if ( this.exists(this.dataDir, name + '.json') ) {
            let obj: any = this.readJson(this.path(this.dataDir, name + '.json'));
            // obj.id       = name;
            return obj;
        }
    }

    generateFakeStreamEntries(name: string, amount: number) {
        let stream  = this.getStream(name);
        let entries = Generator.fromStream(stream, amount);
        this.createStreamEntries(name, Object.values(entries));
        return entries;
    }

    createStreamEntries(name, data: Array<any>) {
        this.ensureDir(this.dataDir);
        const stream=this.getStream(name);
        const usesMultipleFiles = stream?.config?.source?.type !== 'file';
        if ( usesMultipleFiles ) {
            this.ensureDir(this.dataDir, name);
            for ( const entry of data ) {
                let fileName = (entry.id || entry.handle || entry.__filename).toString();
                if ( !fileName.endsWith('.json') ) fileName += '.json';
                this.writeJson(this.path(this.dataDir, name, fileName), entry);
            }
        } else {
            this.writeJson(this.path(this.dataDir, name + '.json'), data);
        }
    }

    copyStream(name, dest: StreamDirectoryStorage) {
        let stream = this.getStream(name);
        dest.createStream(name, stream.obj);
        dest.createStreamEntries(name, this.getStreamEntries(name));
        return this;
    }

}

export class ProjectDirectoryStorage extends StreamDirectoryStorage {
    streamsDir = 'streams';
    dataDir    = 'streams/data';
}

export class FixturesDirectoryStorage extends StreamDirectoryStorage {
    streamsDir = 'streams';
    dataDir    = 'streams/data';
}


const dsoptions = (basePath: string): DirectoryStorageOptions => ({ basePath, encoding: 'utf8', json: { pretty: true } });

export const fs = {
    project : new ProjectDirectoryStorage(dsoptions(getProjectRootPath() as string)),
    fixtures: new FixturesDirectoryStorage(dsoptions(resolve(__dirname, '..', 'fixtures'))),
};

export class FS {
    rootPath: string;

    constructor() {
        let path = getProjectRootPath();
        if ( path ) {
            this.rootPath = path;
        }
    }

    path(...parts: string[]): string {return join(this.rootPath, ...parts); }

    resolvePath(path: string) {return isAbsolute(path) ? path : this.path(path); }

    createStream(name: string, data: any) {
        this.delete(`streams/${name}.json`);
        this.delete(`streams/data/${name}.json`);
        this.create(`streams/${name}.json`, data);
    }

    create(path: string, data: any, override: boolean = true): boolean {
        path = this.resolvePath(path);
        if ( existsSync(path) ) {
            if ( !override ) {
                return false;
            }
            unlinkSync(path);
        }
        if ( typeof data !== 'string' ) {
            data = JSON.stringify(data, null, 4);
        }
        writeFileSync(path, data, 'utf8');
        return true;
    }

    get(path: string): string {
        path = this.resolvePath(path);
        if ( !existsSync(path) ) {
            throw new Error(`Could not read file from "${path}". File does not exist`);
        }
        return readFileSync(path, 'utf8');
    }

    getJson<T>(path: string): T {
        const content = this.get(path);
        const obj     = JSON.parse(content);
        return obj;
    }

    delete(path: string): boolean {
        path = this.resolvePath(path);
        if ( existsSync(path) ) {
            unlinkSync(path);
        }
        return true;
    }

    exists(path: string): boolean {
        return existsSync(this.resolvePath(path));
    }
}

export const dot = <T extends object = object>(obj: T): Dot<T> & T => new Dot<T>(obj) as any;

export class Dot<T extends object = object> {
    constructor(public obj: T = {} as any) {
        let proxy = new Proxy(this, {
            get(target: Dot<T>, p: string | symbol, receiver: any): any {
                if ( Reflect.has(target, p) ) {
                    return Reflect.get(target, p, receiver);
                }
                if ( Reflect.has(target.obj, p) ) {
                    return Reflect.get(target.obj, p);
                }
            },
            set(target: Dot<T>, p: string | symbol, value: any, receiver: any): boolean {
                if ( Reflect.has(target, p) ) {
                    return Reflect.set(target, p, value, receiver);
                }
                return Reflect.set(target.obj, p, value);
            },
        });
        return proxy;
    }

    protected before: (self: this) => any = () => null;

    set(obj: T) {
        this.obj = obj;
        return this;
    }

    get<R>(path: keyof T | string, defaultValue?: any): R {
        this.before(this);
        return get(this.obj, path, defaultValue);
    }

    has(path: string) {
        this.before(this);
        return has(this.obj, path);
    }

    put(path: string, value: any) {
        this.before(this);
        set(this.obj, path, value);
        return this;
    }

    unset(path: string) {
        this.before(this);
        unset(this.obj, path);
        return this;
    }

    merge(data: any) {
        this.obj = merge({}, this.obj, data);
        return this;
    }
}

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
