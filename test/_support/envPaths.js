"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const node_path_1 = (0, tslib_1.__importDefault)(require("node:path"));
const node_os_1 = (0, tslib_1.__importDefault)(require("node:os"));
const node_process_1 = (0, tslib_1.__importDefault)(require("node:process"));
const homedir = node_os_1.default.homedir();
const tmpdir = node_os_1.default.tmpdir();
const { env } = node_process_1.default;
const macos = name => {
    const library = node_path_1.default.join(homedir, 'Library');
    return {
        data: node_path_1.default.join(library, 'Application Support', name),
        config: node_path_1.default.join(library, 'Preferences', name),
        cache: node_path_1.default.join(library, 'Caches', name),
        log: node_path_1.default.join(library, 'Logs', name),
        temp: node_path_1.default.join(tmpdir, name),
    };
};
const windows = name => {
    const appData = env.APPDATA || node_path_1.default.join(homedir, 'AppData', 'Roaming');
    const localAppData = env.LOCALAPPDATA || node_path_1.default.join(homedir, 'AppData', 'Local');
    return {
        // Data/config/cache/log are invented by me as Windows isn't opinionated about this
        data: node_path_1.default.join(localAppData, name, 'Data'),
        config: node_path_1.default.join(appData, name, 'Config'),
        cache: node_path_1.default.join(localAppData, name, 'Cache'),
        log: node_path_1.default.join(localAppData, name, 'Log'),
        temp: node_path_1.default.join(tmpdir, name),
    };
};
// https://specifications.freedesktop.org/basedir-spec/basedir-spec-latest.html
const linux = name => {
    const username = node_path_1.default.basename(homedir);
    return {
        data: node_path_1.default.join(env.XDG_DATA_HOME || node_path_1.default.join(homedir, '.local', 'share'), name),
        config: node_path_1.default.join(env.XDG_CONFIG_HOME || node_path_1.default.join(homedir, '.config'), name),
        cache: node_path_1.default.join(env.XDG_CACHE_HOME || node_path_1.default.join(homedir, '.cache'), name),
        // https://wiki.debian.org/XDGBaseDirectorySpecification#state
        log: node_path_1.default.join(env.XDG_STATE_HOME || node_path_1.default.join(homedir, '.local', 'state'), name),
        temp: node_path_1.default.join(tmpdir, username, name),
    };
};
/**
 Get paths for storing things like data, config, cache, etc.
 Note: It only generates the path strings. It doesn't create the directories for you. You could use [`make-dir`](https://github.com/sindresorhus/make-dir) to create the directories.
 @param name - The name of your project. Used to generate the paths.
 @returns The paths to use for your project on current OS.
 @example
 ```
 import envPaths from 'env-paths';
 const paths = envPaths('MyApp');
 paths.data;
 //=> '/home/sindresorhus/.local/share/MyApp-nodejs'
 paths.config
 //=> '/home/sindresorhus/.config/MyApp-nodejs'
 ```
 */
function envPaths(name, options = { suffix: 'nodejs' }) {
    const { suffix } = options;
    if (typeof name !== 'string') {
        throw new TypeError(`Expected a string, got ${typeof name}`);
    }
    if (suffix) {
        // Add suffix to prevent possible conflict with native apps
        name += `-${suffix}`;
    }
    if (node_process_1.default.platform === 'darwin') {
        return macos(name);
    }
    if (node_process_1.default.platform === 'win32') {
        return windows(name);
    }
    return linux(name);
}
exports.default = envPaths;
//# sourceMappingURL=envPaths.js.map