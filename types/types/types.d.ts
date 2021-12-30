export declare type Constructor<Type = any> = new (...args: any[]) => Type;
export declare type ToRecord<K> = {
    [T in keyof K]: string;
};
