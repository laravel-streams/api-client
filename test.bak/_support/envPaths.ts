import path from 'node:path';
import os from 'node:os';
import process from 'node:process';

const homedir = os.homedir();
const tmpdir = os.tmpdir();
const {env} = process;

const macos = name => {
    const library = path.join(homedir, 'Library');

    return {
        data: path.join(library, 'Application Support', name),
        config: path.join(library, 'Preferences', name),
        cache: path.join(library, 'Caches', name),
        log: path.join(library, 'Logs', name),
        temp: path.join(tmpdir, name),
    };
};

const windows = name => {
    const appData = env.APPDATA || path.join(homedir, 'AppData', 'Roaming');
    const localAppData = env.LOCALAPPDATA || path.join(homedir, 'AppData', 'Local');

    return {
        // Data/config/cache/log are invented by me as Windows isn't opinionated about this
        data: path.join(localAppData, name, 'Data'),
        config: path.join(appData, name, 'Config'),
        cache: path.join(localAppData, name, 'Cache'),
        log: path.join(localAppData, name, 'Log'),
        temp: path.join(tmpdir, name),
    };
};

// https://specifications.freedesktop.org/basedir-spec/basedir-spec-latest.html
const linux = name => {
    const username = path.basename(homedir);

    return {
        data: path.join(env.XDG_DATA_HOME || path.join(homedir, '.local', 'share'), name),
        config: path.join(env.XDG_CONFIG_HOME || path.join(homedir, '.config'), name),
        cache: path.join(env.XDG_CACHE_HOME || path.join(homedir, '.cache'), name),
        // https://wiki.debian.org/XDGBaseDirectorySpecification#state
        log: path.join(env.XDG_STATE_HOME || path.join(homedir, '.local', 'state'), name),
        temp: path.join(tmpdir, username, name),
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

export default function envPaths(name, options:EnvPathsOptions ={suffix: 'nodejs'}):EnvPaths {
    const {suffix} = options
    if (typeof name !== 'string') {
        throw new TypeError(`Expected a string, got ${typeof name}`);
    }

    if (suffix) {
        // Add suffix to prevent possible conflict with native apps
        name += `-${suffix}`;
    }

    if (process.platform === 'darwin') {
        return macos(name);
    }

    if (process.platform === 'win32') {
        return windows(name);
    }

    return linux(name);
}

export interface EnvPathsOptions {
    /**
     __Don't use this option unless you really have to!__
     Suffix appended to the project name to avoid name conflicts with native apps. Pass an empty string to disable it.
     @default 'nodejs'
     */
    readonly suffix?: string;
}

export interface EnvPaths {
    /**
     Directory for data files.
     Example locations (with the default `nodejs` suffix):
     - macOS: `~/Library/Application Support/MyApp-nodejs`
     - Windows: `%LOCALAPPDATA%\MyApp-nodejs\Data` (for example, `C:\Users\USERNAME\AppData\Local\MyApp-nodejs\Data`)
     - Linux: `~/.local/share/MyApp-nodejs` (or `$XDG_DATA_HOME/MyApp-nodejs`)
     */
    readonly data: string;

    /**
     Directory for data files.
     Example locations (with the default `nodejs` suffix):
     - macOS: `~/Library/Preferences/MyApp-nodejs`
     - Windows: `%APPDATA%\MyApp-nodejs\Config` (for example, `C:\Users\USERNAME\AppData\Roaming\MyApp-nodejs\Config`)
     - Linux: `~/.config/MyApp-nodejs` (or `$XDG_CONFIG_HOME/MyApp-nodejs`)
     */
    readonly config: string;

    /**
     Directory for non-essential data files.
     Example locations (with the default `nodejs` suffix):
     - macOS: `~/Library/Caches/MyApp-nodejs`
     - Windows: `%LOCALAPPDATA%\MyApp-nodejs\Cache` (for example, `C:\Users\USERNAME\AppData\Local\MyApp-nodejs\Cache`)
     - Linux: `~/.cache/MyApp-nodejs` (or `$XDG_CACHE_HOME/MyApp-nodejs`)
     */
    readonly cache: string;

    /**
     Directory for log files.
     Example locations (with the default `nodejs` suffix):
     - macOS: `~/Library/Logs/MyApp-nodejs`
     - Windows: `%LOCALAPPDATA%\MyApp-nodejs\Log` (for example, `C:\Users\USERNAME\AppData\Local\MyApp-nodejs\Log`)
     - Linux: `~/.local/state/MyApp-nodejs` (or `$XDG_STATE_HOME/MyApp-nodejs`)
     */
    readonly log: string;

    /**
     Directory for temporary files.
     Example locations (with the default `nodejs` suffix):
     - macOS: `/var/folders/jf/f2twvvvs5jl_m49tf034ffpw0000gn/T/MyApp-nodejs`
     - Windows: `%LOCALAPPDATA%\Temp\MyApp-nodejs` (for example, `C:\Users\USERNAME\AppData\Local\Temp\MyApp-nodejs`)
     - Linux: `/tmp/USERNAME/MyApp-nodejs`
     */
    readonly temp: string;
}

