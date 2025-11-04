import { objectify } from './utils.js';

/**
 * Custom Headers class with convenient methods
 */
export class FetchHeaders extends Headers {
    constructor(init) {
        super(init && init instanceof FetchHeaders ? init.toObject() : init);
    }

    accept(mime) {
        this.set('Accept', mime);
        return this;
    }

    contentType(mime) {
        this.set('Content-Type', mime);
        return this;
    }

    ifNoneMatch(etag) {
        this.set('If-None-Match', etag);
        return this;
    }

    basic(...args) {
        return this.authorization('Basic', args[1] === undefined ? args[0] : btoa(args[0] + ':' + args[1]));
    }

    bearer(token) {
        return this.authorization('Bearer', token);
    }

    authorization(key, value) {
        this.set('Authorization', key + ' ' + value);
        return this;
    }

    toObject() {
        const result = {};
        this.forEach((value, key) => {
            result[key] = value;
        });
        return result;
    }
}
