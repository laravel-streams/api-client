export namespace  streams {
    export interface  BaseEntry {
        [key:string]: any
    }
    export interface  BaseStream {
        entries?: BaseEntry
        [key:string]: any
    }
    export interface  Entries {
        [key:string]: any
    }
    export interface  Streams {
        [key:string]: any
    }
    export type StreamID = keyof Streams
}