import { Middleware } from './Middleware.js';

/**
 * Sends X-Organization-ID on each request.
 *
 * Configure an id on the middleware or on client.options.organizationId.
 * Opt out of one request with `{ organization: false }`. Pass a string or
 * number as `organization` to override the id for that request only.
 */
export class OrganizationMiddleware extends Middleware {
    static headerName = 'X-Organization-ID';

    constructor(options = {}) {
        const { priority, organizationId, ...rest } = options;
        super(rest);
        this.organizationId = organizationId ?? null;
        // Run after the default request middleware (priority 50), which can
        // rebuild the FetchRequest and would otherwise drop this header.
        this.options = {
            ...this.options,
            priority: {
                request: priority?.request ?? 60,
                response: priority?.response ?? this.options?.priority?.response ?? 50,
                error: priority?.error ?? this.options?.priority?.error ?? 50,
            },
        };
    }

    /**
     * Replace the organization id. Null or '' clears it.
     */
    setOrganization(organizationId) {
        this.organizationId = organizationId ?? null;
        return this;
    }

    async request(request, client) {
        const headerName = this.constructor.headerName;

        if (isOptOut(request?.organization)) {
            request.headers.delete(headerName);
            return request;
        }

        const organizationId = this.resolveOrganizationId(request, client);
        if (organizationId === null) {
            return request;
        }

        request.headers.set(headerName, organizationId);
        return request;
    }

    resolveOrganizationId(request, client) {
        const override = organizationIdValue(request?.organization);
        if (override !== null) {
            return override;
        }

        const configured = organizationIdValue(this.organizationId);
        if (configured !== null) {
            return configured;
        }

        return organizationIdValue(client?.options?.organizationId);
    }
}

function isOptOut(value) {
    return value === false || value === null || value === '';
}

function organizationIdValue(value) {
    if (typeof value === 'number' && Number.isFinite(value)) {
        return String(value);
    }
    if (typeof value === 'string' && value !== '') {
        return value;
    }
    return null;
}
