import { existsSync, mkdirSync } from 'fs';
import path from 'path';

export const ensureDirSync = (...parts: string[]) => {
    let path = resolve(...parts);
    if ( !existsSync(path) ) {
        mkdirSync(path, { recursive: true });
    }
    return path;
};
export const resolve       = (...parts) => path.join(...parts);
export const objectify = (obj, [ k, v ]) => ({ ...obj, [ k ]: v });
