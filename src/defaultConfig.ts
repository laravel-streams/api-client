import { RequestConfig, StreamsConfiguration } from './types';


const url = new URL(window.location.toString());
const baseURL = [url.protocol,'//',url.host,'/api'].join('')

export const defaultConfig: StreamsConfiguration = {
    baseURL,
    request: {
        headers: {
            'X-Requested-With': 'XMLHttpRequest',
        },
        // `responseType` indicates the type of data that the server will respond with
        // options are: 'arraybuffer', 'document', 'json', 'text', 'stream'
        //   browser only: 'blob'
        responseType: 'json', // default

        // `xsrfCookieName` is the name of the cookie to use as a value for xsrf token
        xsrfCookieName: 'XSRF-TOKEN', // default

        // `xsrfHeaderName` is the name of the http header that carries the xsrf token value
        xsrfHeaderName: 'X-XSRF-TOKEN', // default

        withCredentials: false,

        validateStatus: function (status) {
            return status >= 200 && status < 300; // default
        },


        // `decompress` indicates whether or not the response body should be decompressed
        // automatically. If set to `true` will also remove the 'content-encoding' header
        // from the responses objects of all decompressed responses
        // - Node only (XHR cannot turn off decompression)
        decompress: true, // default
    },
};
