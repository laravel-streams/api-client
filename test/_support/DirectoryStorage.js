"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DirectoryStorage = void 0;
const tslib_1 = require("tslib");
const path_1 = require("path");
const fs_extra_1 = require("fs-extra");
const fs_1 = require("fs");
const envPaths_1 = (0, tslib_1.__importDefault)(require("./envPaths"));
const lz_string_1 = require("lz-string");
const glob_1 = (0, tslib_1.__importDefault)(require("glob"));
const defaultOptions = {
    encoding: 'utf-8',
    json: {
        compression: false,
        pretty: false,
    },
};
class DirectoryStorage {
    constructor(options) {
        this.options = defaultOptions;
        this.mergeOptions(options);
        let exists = this.exists();
        if (!exists) {
            this.ensureDir();
        }
    }
    get encoding() { return this.options.encoding; }
    set encoding(encoding) { this.options.encoding = encoding; }
    mergeOptions(options) {
        this.options = Object.assign(Object.assign(Object.assign({}, this.options), options), { json: Object.assign(Object.assign({}, this.options.json), options.json) });
    }
    static env(type, name, suffix) {
        return new this({ basePath: (0, envPaths_1.default)(name, { suffix })[type] });
    }
    withEncoding(encoding, callback) {
        let prev = this.encoding;
        this.encoding = encoding;
        let result = callback(this);
        this.encoding = prev;
        return result;
    }
    setEncoding(_encoding = 'utf8') {
        this.encoding = _encoding;
        return this;
    }
    compress(data) { return (0, lz_string_1.compressToUTF16)(data); }
    decompress(data) { return (0, lz_string_1.decompressFromUTF16)(data); }
    path(...parts) {
        let path = (0, path_1.join)(...parts.filter(Boolean));
        return path.startsWith(this.options.basePath) ? path : (0, path_1.resolve)(this.options.basePath, path);
        // return resolve(this.options.basePath, ...(parts.filter(Boolean)));
    }
    ensureDir(...parts) {
        (0, fs_extra_1.ensureDirSync)(this.path(...parts));
        return this.path(...parts);
    }
    ensureFile(...parts) {
        (0, fs_extra_1.ensureFile)(this.path(...parts));
        return this.path(...parts);
    }
    ensureFileWithContent(content, ...parts) {
        if (!this.exists(...parts)) {
            this.write(this.path(...parts), content);
        }
        return this.path(...parts);
    }
    exists(...parts) {
        return (0, fs_1.existsSync)(this.path(...parts));
    }
    stat(...parts) {
        if (!this.exists(...parts)) {
            throw new Error(`stat on non existing "${this.path(...parts)}"`);
        }
        return (0, fs_1.statSync)(this.path(...parts));
    }
    isFile(...parts) {
        return this.exists(...parts) && this.stat(...parts).isFile();
    }
    isDirectory(...parts) {
        return this.exists(...parts) && this.stat(...parts).isDirectory();
    }
    isSymbolicLink(...parts) {
        return this.exists(...parts) && this.stat(...parts).isSymbolicLink();
    }
    read(path) {
        return (0, fs_1.readFileSync)(this.path(path), this.encoding);
    }
    write(path, content) {
        (0, fs_1.writeFileSync)(this.path(path), content, this.encoding);
        return this;
    }
    glob(pattern, options = {}) {
        options.cwd = this.path();
        return glob_1.default.sync(pattern, options);
    }
    delete(path) {
        (0, fs_1.rmSync)(path, { force: true, recursive: true });
        return this;
    }
    readJson(path, options = {}) {
        if (options.compression) {
            let data = this.read(path);
            data = this.decompress(data);
            data = JSON.parse(data);
            return data;
        }
        return (0, fs_extra_1.readJSONSync)(this.path(path), { encoding: this.encoding });
    }
    writeJson(path, data, options = {}) {
        if (options.compression) {
            this.withEncoding('utf8', s => s.write(path, this.compress(JSON.stringify(data))));
            return this;
        }
        (0, fs_extra_1.writeJsonSync)(this.path(path), data, { encoding: this.encoding, spaces: options.pretty ? 4 : 0 });
        return this;
    }
}
exports.DirectoryStorage = DirectoryStorage;
//# sourceMappingURL=DirectoryStorage.js.map