var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
export class Http {
    constructor(streams) {
        this.streams = streams;
    }
    get config() { return this.streams.config; }
    getStreams(params = {}, config = {}) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.request('get', `/streams`, Object.assign({ params }, config));
        });
    }
    postStream(data, config = {}) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.request('post', `/streams`, Object.assign({ data }, config));
        });
    }
    getStream(stream, params = {}, config = {}) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.request('get', `/streams/${stream}`, config);
        });
    }
    patchStream(stream, data = {}, config = {}) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.request('patch', `/streams/${stream}`, Object.assign({ data }, config));
        });
    }
    putStream(stream, data = {}, config = {}) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.request('put', `/streams/${stream}`, Object.assign({ data }, config));
        });
    }
    deleteStream(stream, config = {}) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.request('delete', `/streams/${stream}`, config);
        });
    }
    getEntries(stream, params = {}, config = {}) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.request('get', `/streams/${stream}/entries`, Object.assign({ params }, config));
        });
    }
    postEntry(stream, data = {}, config = {}) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.request('post', `/streams/${stream}/entries`, Object.assign({ data }, config));
        });
    }
    getEntry(stream, entry, config = {}) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.request('get', `/streams/${stream}/entries/${entry}`, config);
        });
    }
    patchEntry(stream, entry, data = {}, config = {}) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.request('patch', `/streams/${stream}/entries/${entry}`, Object.assign({ data }, config));
        });
    }
    putEntry(stream, entry, data = {}, config = {}) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.request('put', `/streams/${stream}/entries/${entry}`, Object.assign({ data }, config));
        });
    }
    deleteEntry(stream, entry, config = {}) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.request('delete', `/streams/${stream}/entries/${entry}`, config);
        });
    }
    request(method, url, ...args) {
        return __awaiter(this, void 0, void 0, function* () {
            let config = args[0] || {};
            let data = args[1] || undefined;
            const response = yield this.streams.createRequest().send(Object.assign({ method, url, data }, config));
            return response;
        });
    }
}
