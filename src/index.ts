import 'reflect-metadata';
import { Streams } from './Streams';
import { ETag } from './cache';
export * from './types';

export * from './Collection';
export * from './Criteria';
export * from './Entry';
export * from './EntryCollection';
export * from './Field';
export * from './FieldCollection';
export * from './Http';
export * from './Repository';
export * from './Request';
export * from './Response';
export * from './Stream';
export * from './Streams';
export * from './utils';
export * from './cache';

export default Streams;

declare module 'axios' {
    export interface AxiosInstance {
        etag: ETag;
    }
}
