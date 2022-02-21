var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import Axios from 'axios';
import deepmerge from 'deepmerge';
import { AsyncSeriesWaterfallHook, SyncWaterfallHook } from 'tapable';
import { Response } from './Response';
const isAxiosError = (val) => val && val.isAxiosError;
const hasException = (val) => { var _a, _b; return isAxiosError(val) && ((_b = (_a = val === null || val === void 0 ? void 0 : val.response) === null || _a === void 0 ? void 0 : _a.data) === null || _b === void 0 ? void 0 : _b.exception) !== undefined; };
export class Request {
    constructor(config) {
        this.hooks = {
            createAxios: new SyncWaterfallHook(['axios', 'request']),
            send: new AsyncSeriesWaterfallHook(['config', 'axios', 'request']),
            response: new SyncWaterfallHook(['response', 'config', 'request']),
        };
        this.CancelToken = Axios.CancelToken;
        this.CancelTokenSource = this.CancelToken.source();
        this.config = deepmerge.all([
            Request.getDefaultConfig(),
            config,
        ], { clone: true });
        this.config.cancelToken = this.CancelTokenSource.token;
        // this.config.paramsSerializer = params => stringify(params);
        // this.config.paramsSerializer = params => this.stringifyFunction(params, this.stringifyOptions)
    }
    get cancelToken() { return this.CancelTokenSource.token; }
    static create(config) {
        return new Request(config);
    }
    send(config = {}) {
        return __awaiter(this, void 0, void 0, function* () {
            const axios = this.createAxios();
            config = yield this.hooks.send.promise(config, axios, this);
            let response;
            try {
                let axiosResponse = yield axios.request(config);
                response = Response.fromAxiosResponse(axiosResponse);
            }
            catch (e) {
                if (isAxiosError(e) && hasException(e)) {
                    let { message, exception, file, line } = e.response.data;
                    e.message += `:\n${exception}: ${message}\n${line}:${file}`;
                }
                throw e;
            }
            response = this.hooks.response.call(response, config, this);
            return response;
        });
    }
    createAxios() {
        let axios = Axios.create(this.config);
        axios = this.hooks.createAxios.call(axios, this);
        return axios;
    }
    mergeConfig(config) {
        this.config = deepmerge(this.config, config, { clone: true });
        return this;
    }
    cancel(message) {
        this.CancelTokenSource.cancel(message);
        return this;
    }
    header(key, value) {
        this.config.headers[key] = value;
        return this;
    }
    Accept(mime) {
        this.header('Accept', mime);
        return this;
    }
    ContentType(mime) {
        this.header('Content-Type', mime);
        return this;
    }
    IfNoneMatch(etag) {
        this.header('If-None-Match', etag);
        return this;
    }
    basic(username, password) {
        return this.authorization('Basic', btoa(username + ':' + password));
    }
    bearer(token) {
        return this.authorization('Bearer', token);
    }
    authorization(key, value) {
        this.header('Authorization', key + ' ' + value);
        return this;
    }
}
(function (Request) {
    Request.getDefaultConfig = () => ({
        baseURL: '',
        headers: {
            'X-Requested-With': 'XMLHttpRequest',
        },
        // `responseType` indicates the type of data that the server will respond with
        // options are: 'arraybuffer', 'document', 'json', 'text', 'stream'
        //   browser only: 'blob'
        responseType: 'json',
        // `xsrfCookieName` is the name of the cookie to use as a value for xsrf token
        xsrfCookieName: 'XSRF-TOKEN',
        // `xsrfHeaderName` is the name of the http header that carries the xsrf token value
        xsrfHeaderName: 'X-XSRF-TOKEN',
        withCredentials: false,
        validateStatus: function (status) {
            return status >= 200 && status < 300; // default
        },
        // `decompress` indicates whether or not the response body should be decompressed
        // automatically. If set to `true` will also remove the 'content-encoding' header
        // from the responses objects of all decompressed responses
        // - Node only (XHR cannot turn off decompression)
        decompress: true, // default
    });
})(Request || (Request = {}));
