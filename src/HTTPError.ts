import { ClientResponse } from './Client';

interface TraceItem {
    class: string;
    file: string;
    function: string;
    line: number;
    type: string;
}

function traceToString(trace: TraceItem[]): string {
    return trace.map(item => {
        return Object.entries(item).map(([k,v]) => `${k}: ${v}`).join("\n")
    }).join("\n")
}

export class HTTPError extends Error {
    constructor(public response: ClientResponse) {
        super(`HTTP ${response.status} Error: ${response.statusText}
        message: ${response.data.message}
        file: ${response.data.file}
        line: ${response.data.line}`);
        this.name = 'HTTPError';

    }
}
