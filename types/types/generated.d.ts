export declare namespace streams {
    interface BaseEntry {
        [key: string]: any;
    }
    interface BaseStream {
        entries?: BaseEntry;
        [key: string]: any;
    }
    interface Entries {
        [key: string]: any;
    }
    interface Streams {
        [key: string]: any;
    }
    type StreamID = keyof Streams;
}
