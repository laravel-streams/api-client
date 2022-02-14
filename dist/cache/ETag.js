const byLowerCase = toFind => value => toLowerCase(value) === toFind;
const toLowerCase = value => value.toLowerCase();
const getKeys = headers => Object.keys(headers);
const isCacheableMethod = (config) => ~['GET', 'HEAD'].indexOf(config.method.toUpperCase());
const getHeaderCaseInsensitive = (headerName, headers = {}) => headers[getKeys(headers).find(byLowerCase(headerName))];
const getBase64UrlFromConfig = (config) => {
    let url = config.url;
    if (config.paramsSerializer) {
        url += '?' + config.paramsSerializer(config.params);
    }
    else {
        url += '?' + JSON.stringify(config.params);
    }
    return btoa(url);
};
export class ETag {
    constructor(axios, cache) {
        this.axios = axios;
        this.cache = cache;
        this.request = null;
        this.response = null;
        this.enabled = false;
        Object.defineProperty(axios, 'etag', {
            get: () => { return this; },
            configurable: true,
            enumerable: true,
        });
    }
    enableEtag() {
        if (this.enabled)
            return;
        this.request = this.axios.interceptors.request.use(this.getRequestInterceptor());
        this.response = this.axios.interceptors.response.use(this.getResponseInterceptor(), this.getResponseErrorInterceptor());
        this.enabled = true;
    }
    disableEtag() {
        if (!this.enabled)
            return;
        this.axios.interceptors.request.eject(this.request);
        this.axios.interceptors.response.eject(this.response);
        this.enabled = false;
    }
    isEnabled() { return this.enabled; }
    getCacheByAxiosConfig(config) {
        return this.cache.get(getBase64UrlFromConfig(config));
    }
    getRequestInterceptor() {
        return (config) => {
            if (isCacheableMethod(config)) {
                const uuid = getBase64UrlFromConfig(config);
                const lastCachedResult = this.cache.get(uuid);
                if (lastCachedResult) {
                    config.headers = Object.assign(Object.assign({}, config.headers), { 'If-None-Match': lastCachedResult.etag });
                }
            }
            return config;
        };
    }
    getResponseInterceptor() {
        return (response) => {
            if (isCacheableMethod(response.config)) {
                const responseETAG = getHeaderCaseInsensitive('etag', response.headers);
                if (responseETAG) {
                    this.cache.set(getBase64UrlFromConfig(response.config), responseETAG, response.data);
                }
            }
            return response;
        };
    }
    getResponseErrorInterceptor() {
        return (error) => {
            if (error.response && error.response.status === 304) {
                const getCachedResult = this.getCacheByAxiosConfig(error.response.config);
                if (!getCachedResult) {
                    return Promise.reject(error);
                }
                const newResponse = error.response;
                newResponse.status = 200;
                newResponse.data = getCachedResult.value;
                return Promise.resolve(newResponse);
            }
            return Promise.reject(error);
        };
    }
}
