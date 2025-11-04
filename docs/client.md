---
sort_order: 3
title: Client Configuration
description: 'Configure the API client for your application'
category: core
status: published
---

# Client Configuration

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

- [Working with Streams](streams)
- [Working with Entries](entries)
- [Middleware](middleware)
