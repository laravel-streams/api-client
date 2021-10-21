import { StreamsConfiguration } from './types';
import { defaultConfig } from './config';

export class HTTPError extends Error {
    constructor(public response:Response) {
        super(`HTTP ${response.status} Error: ${response.statusText}`);
        this.name='HTTPError'
    }
}


export class Client {
    headers = new Headers();

    constructor(protected config: StreamsConfiguration) {

    }

    async request(method, uri) {
        const request = new Request(this.url(uri), this.getConfig());

        const response = await fetch(request, {
            method,

        });

        if(!response.ok){
            throw new HTTPError(response);
        }
    }



    protected url(uri: string) {
        return this.config.url + uri;
    }

    getConfig(): RequestInit {
        return {
            ...this.config,
            headers: this.headers,
        };
    }
}

