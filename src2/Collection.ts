
import { Collection as BaseCollection } from 'collect.js';

export class Collection<T> extends BaseCollection<T> {
    [ macroFn: string ]: any

    items: T[] & Record<string, T>;

    toObject(): Record<string, T> {
        return this.items;
    }
}
