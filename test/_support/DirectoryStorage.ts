import { join, resolve } from 'path';
import { ensureDirSync, ensureFile, readJSONSync, writeJsonSync } from 'fs-extra';
import { existsSync, readFileSync, rmdirSync, rmSync, statSync, unlinkSync, writeFileSync } from 'fs';
import envPaths, { EnvPaths } from './envPaths';
import { compressToUTF16, decompressFromUTF16 } from 'lz-string';
import glob, { IOptions } from 'glob';
export interface DirectoryStorageOptions {
    basePath: string;
    encoding?: BufferEncoding;
    json?: DirectoryStorage.JsonOptions;
}

export namespace DirectoryStorage {
    export interface JsonOptions {
        compression?: boolean;
        pretty?: boolean;
    }
}

const defaultOptions: Partial<DirectoryStorageOptions> = {
    encoding: 'utf-8',
    json    : {
        compression: false,
        pretty     : false,
    },
};

export class DirectoryStorage {
    protected options: DirectoryStorageOptions = defaultOptions as any;

    protected get encoding(): BufferEncoding {return this.options.encoding;}

    protected set encoding(encoding: BufferEncoding) { this.options.encoding = encoding;}

    constructor(options: DirectoryStorageOptions) {
        this.mergeOptions(options);
        let exists = this.exists();
        if ( !exists ) {
            this.ensureDir();
        }
    }

    mergeOptions(options: DirectoryStorageOptions) {
        this.options = {
            ...this.options,
            ...options,
            json: {
                ...this.options.json,
                ...options.json,
            },
        };
    }

    static env(type: keyof EnvPaths, name: string, suffix?: string) {
        return new this({ basePath: envPaths(name, { suffix })[ type ] });
    }

    withEncoding<T>(encoding: BufferEncoding, callback: (storage: DirectoryStorage) => T): T {
        let prev      = this.encoding;
        this.encoding = encoding;
        let result    = callback(this);
        this.encoding = prev;
        return result;
    }

    setEncoding(_encoding: BufferEncoding = 'utf8') {
        this.encoding = _encoding;
        return this;
    }

    compress(data: string) {return compressToUTF16(data); }

    decompress(data: string) {return decompressFromUTF16(data); }

    path(...parts) {
        let path = join(...parts.filter(Boolean));
        return path.startsWith(this.options.basePath) ? path : resolve(this.options.basePath, path);
        // return resolve(this.options.basePath, ...(parts.filter(Boolean)));
    }

    ensureDir(...parts: string[]) {
        ensureDirSync(this.path(...parts));
        return this.path(...parts);
    }

    ensureFile(...parts: string[]) {
        ensureFile(this.path(...parts));
        return this.path(...parts);
    }

    ensureFileWithContent(content: string, ...parts: string[]) {
        if ( !this.exists(...parts) ) {
            this.write(this.path(...parts), content);
        }
        return this.path(...parts);
    }

    exists(...parts: string[]) {
        return existsSync(this.path(...parts));
    }

    stat(...parts: string[]) {
        if(!this.exists(...parts)){
            throw new Error(`stat on non existing "${this.path(...parts)}"`)
        }
        return statSync(this.path(...parts));
    }

    isFile(...parts: string[]) {
        return this.exists(...parts) && this.stat(...parts).isFile();
    }

    isDirectory(...parts: string[]) {
        return this.exists(...parts) && this.stat(...parts).isDirectory();
    }

    isSymbolicLink(...parts: string[]) {
        return this.exists(...parts) && this.stat(...parts).isSymbolicLink();
    }

    read(path: string) {
        return readFileSync(this.path(path), this.encoding);
    }

    write(path: string, content: string) {
        writeFileSync(this.path(path), content, this.encoding);
        return this;
    }

    glob(pattern:string, options:IOptions={}):string[]{
        options.cwd = this.path()
        return glob.sync(pattern, options);
    }

    delete(path:string){
        rmSync(path, {force:true, recursive:true})
        return this;
    }

    readJson<T>(path: string, options: DirectoryStorage.JsonOptions = {}): T {
        if ( options.compression ) {
            let data: any = this.read(path);
            data          = this.decompress(data);
            data          = JSON.parse(data);
            return data as T;
        }
        return readJSONSync(this.path(path), { encoding: this.encoding });
    }

    writeJson(path: string, data: any, options: DirectoryStorage.JsonOptions = {}): this {
        if ( options.compression ) {
            this.withEncoding('utf8', s => s.write(path, this.compress(JSON.stringify(data))));
            return this;
        }
        writeJsonSync(this.path(path), data, { encoding: this.encoding, spaces: options.pretty ? 4 : 0 });
        return this;
    }
}
