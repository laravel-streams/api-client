
export type Constructor<Type = any> = new (...args: any[]) => Type

export type ToRecord<K> = {
    [T in keyof K]: string
}
