import { Http } from './Http';
import { Stream } from './Stream';
export declare type IEntry<T, ID extends string = string> = Entry<ID> & T;
export declare class Entry<ID extends string = string> {
    protected _stream: Stream<ID>;
    protected _data: any;
    protected _fresh: boolean;
    get http(): Http;
    constructor(_stream: Stream<ID>, _data?: any, _fresh?: boolean);
    get stream(): Stream<ID>;
    save(): Promise<boolean>;
    validator(): void;
}
