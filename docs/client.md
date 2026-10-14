---
title: Client Configuration
nav_title: Client Configuration
description: Configure the API client for your application
section: packages
package: client
order: 40
tags: [client]
status: ready
---

The `Client` class is the main entry point for interacting with the Streams API.

## Basic Configuration

```javascript
import { Client } from '@laravel-streams/api-client';

const client = new Client({
    baseURL: 'http://localhost/api'
});
```

## Configuration Options

### baseURL (required)

The base URL for your API endpoint:

```javascript
const client = new Client({
    baseURL: 'https://api.example.com'
});
```

### request

Default request configuration applied to all requests:

```javascript
const client = new Client({
    baseURL: 'http://localhost/api',
    request: {
        mode: 'cors',
        headers: {
            'X-Requested-With': 'XMLHttpRequest',
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        credentials: 'include', // Send cookies
        cache: 'no-cache'
    }
});
```

### middlewares

Array of middleware to apply to requests:

```javascript
import { Client, AuthorizationMiddleware } from '@laravel-streams/api-client';

const client = new Client({
    baseURL: 'http://localhost/api',
    middlewares: [
        new AuthorizationMiddleware({
            token: 'api-token',
            type: 'Bearer'
        })
    ]
});
```

## Default Middlewares

The client includes these middlewares by default:

- `RequestDataMiddleware` - Handles request body serialization
- `CriteriaMiddleware` - Processes Criteria query parameters
- `QueryMiddleware` - Converts query parameters to query strings
- `ResponseDataMiddleware` - Parses response data

You can customize the default middlewares:

```javascript
const client = new Client({
    baseURL: 'http://localhost/api',
    defaultMiddlewares: [], // Disable default middlewares
    middlewares: [
        // Add your custom middlewares
    ]
});
```

## Adding Middleware Dynamically

You can add middleware after client creation:

```javascript
const client = new Client({
    baseURL: 'http://localhost/api'
});

// Add authentication later
const auth = new AuthorizationMiddleware({
    token: getUserToken()
});

client.use(auth);
```

## Environment-Based Configuration

```javascript
const config = {
    development: {
        baseURL: 'http://localhost:8000/api',
        request: {
            mode: 'cors',
            credentials: 'include'
        }
    },
    production: {
        baseURL: 'https://api.production.com',
        request: {
            mode: 'cors',
            credentials: 'same-origin'
        }
    }
};

const env = process.env.NODE_ENV || 'development';
const client = new Client(config[env]);
```

## Resources

The client automatically initializes resource instances:

### Streams Resource

```javascript
client.streams.get()
client.streams.find(stream)
client.streams.post(data)
client.streams.patch(stream, data)
client.streams.put(stream, data)
client.streams.delete(stream)
```

### Entries Resource

```javascript
client.entries.get(stream, config)
client.entries.find(stream, id, config)
client.entries.post(stream, data, config)
client.entries.patch(stream, id, data, config)
client.entries.put(stream, id, data, config)
client.entries.delete(stream, id, config)
```

## Request Method

For custom requests, use the `request` method directly:

```javascript
const response = await client.request('GET', '/custom/endpoint', {
    query: { filter: 'active' },
    headers: { 'X-Custom-Header': 'value' }
});
```

## Retries, Cancellation, and Timeouts

Request options can be configured under `request` on the client or overridden for a single call:

```javascript
const client = new Client({
    baseURL: 'https://api.example.com',
    request: {
        retries: 2,          // Additional attempts; default 0, maximum 10
        retryDelay: 250,     // Initial backoff in milliseconds; default 250
        maxRetryDelay: 30000,// Backoff cap in milliseconds; default 30000
        timeout: 10000       // Total request deadline in milliseconds; default 0 (disabled)
    }
});

const controller = new AbortController();
const pending = client.entries.get('posts', { signal: controller.signal });
controller.abort();
await pending; // Rejects with AbortError, or the caller's custom abort reason
```

Retries cover transport failures and HTTP 408, 429, 500, 502, 503, and 504. Backoff doubles after each failure and honors `Retry-After` seconds or HTTP dates up to `maxRetryDelay`. GET, HEAD, OPTIONS, PUT, and DELETE can be retried. POST and PATCH require an `Idempotency-Key` header or the `idempotencyKey` option:

```javascript
await client.entries.post('posts', { title: 'Hello' }, {
    idempotencyKey: 'create-post-unique-operation-id',
    retries: 2
});
```

The key and prepared body stay the same across attempts. Choose a unique key for each logical mutation and reuse it when resubmitting that same operation. The API server must support deduplication for this header; the client only sends the key. Avoid putting a mutation key in shared client defaults.

The timeout covers middleware, all attempts, backoff, and response parsing. Timeout failures have `name === 'TimeoutError'`; aborts and timeouts are never retried. For `responseType: 'stream'`, the deadline ends when the response stream is returned, so callers manage subsequent stream consumption. Request middleware runs once before attempts, response middleware runs on success, and error middleware receives the final failure once. Pending error middleware cannot delay an abort or timeout. Per-call overrides do not alter client defaults.

## Laravel Validation Errors

HTTP 422 responses reject with `FetchError`. Laravel's validation payload is available as `error.errors` (field names mapped to message arrays), `error.data` (the parsed payload), and `error.message` (the server message). Nested field paths are preserved:

```javascript
import { FetchError } from '@laravel-streams/api-client';

try {
    await client.entries.post('posts', { title: '' });
} catch (error) {
    if (error instanceof FetchError && error.status === 422) {
        showFieldErrors(error.errors);
    } else {
        throw error;
    }
}
```

Validation mapping happens before error middleware. The original `error.response` remains readable. Non-JSON or malformed validation responses remain `FetchError` with an empty `errors` object, and 422 responses are never retried.

## Complete Example

```javascript
import { 
    Client, 
    AuthorizationMiddleware,
    ETagMiddleware 
} from '@laravel-streams/api-client';

// Custom logging middleware
class LoggingMiddleware {
    constructor() {
        this.options = {
            priority: {
                request: 10,
                response: 90,
                error: 50
            }
        };
    }

    async request(request, client) {
        console.log(`→ ${request.method} ${request.url}`);
        return request;
    }

    async response(response, client) {
        console.log(`← ${response.status} ${response.statusText}`);
        return response;
    }

    async error(error, client) {
        console.error(`✗ ${error.message}`);
        throw error;
    }
}

// Create client with full configuration
const client = new Client({
    baseURL: process.env.API_URL || 'http://localhost/api',
    
    request: {
        mode: 'cors',
        credentials: 'include',
        headers: {
            'X-Requested-With': 'XMLHttpRequest',
            'Accept': 'application/json'
        }
    },
    
    middlewares: [
        new LoggingMiddleware(),
        new AuthorizationMiddleware({
            token: process.env.API_TOKEN,
            type: 'Bearer'
        }),
        new ETagMiddleware()
    ]
});

export default client;
```

## Next Steps

- [Working with Streams](/docs/client/streams)
- [Working with Entries](/docs/client/entries)
- [Middleware](/docs/client/middleware)
