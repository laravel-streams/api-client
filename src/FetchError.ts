import { FetchRequest } from './fetch/FetchRequest';
import { ClientResponse } from './types';


export class FetchError extends Error {
    public get response(): ClientResponse { return this.request.response;}
    public readonly status: number;
    public readonly statusText: string;
    public readonly url: string;

    constructor(public readonly request: FetchRequest) {
        super(`HTTP ${request.response.status} error:\n ${request.response.statusText}`);
        this.status= request.response.status
        this.statusText= request.response.statusText
        this.url= request.response.url
    }
}