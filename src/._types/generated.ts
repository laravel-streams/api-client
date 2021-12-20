export interface IBaseEntry {
    [ key: string ]: any;
}

export interface IBaseStream<ID=any> {
    id?: ID
    handle?: ID
    created_at?: string
    updated_at?: string
    name: string
    description: string
    source: {
        type: string
        [ key: string ]: any
    },
    fields?: any
    rules?: any
    routes?: Array<any>,
    validators?: Array<any>,
    config?: Record<string, any>
    entries?: IBaseEntry[];

    [ key: string ]: any;
}

export interface IEntries {
    [ key: string ]: IBaseEntry;
}

export interface IStreams {
    [ key: string ]: any;
}

export type StreamID = keyof IStreams
