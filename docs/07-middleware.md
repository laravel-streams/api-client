---
sort_order: 7
title: Middleware System
description: 'Request/response middleware and custom middleware creation'
category: advanced
status: published
---

# Middleware System

The middleware system allows you to intercept and modify requests and responses. Middleware can transform data, add authentication, handle errors, and more.

## Built-in Middleware

### AuthorizationMiddleware

Adds Bearer token authentication to requests.

```javascript
import { Client, AuthorizationMiddleware } from '@laravel-streams/api-client';

const client = new Client({
    baseUrl: 'https://api.example.com',
    middleware: [
        new AuthorizationMiddleware('your-api-token')
    ]
});
```

**What it does:**
- Adds `Authorization: Bearer {token}` header to all requests
- Enables authenticated API access

### CriteriaMiddleware

Converts Criteria objects to query parameters.

```javascript
import { Client, CriteriaMiddleware, Criteria } from '@laravel-streams/api-client';

const client = new Client({
    baseUrl: 'https://api.example.com',
    middleware: [
        new CriteriaMiddleware()
    ]
});

// Criteria is automatically converted to query params
const criteria = new Criteria()
    .where('status', 'published')
    .limit(10);

const response = await client.entries.get('posts', { criteria });
```

**What it does:**
- Transforms `Criteria` objects into URL query parameters
- Enables fluent query building with Laravel-style syntax

### QueryMiddleware

Adds query parameters to requests.

```javascript
import { Client, QueryMiddleware } from '@laravel-streams/api-client';

const client = new Client({
    baseUrl: 'https://api.example.com',
    middleware: [
        new QueryMiddleware()
    ]
});

// Add query params via options
const response = await client.get('/posts', {
    query: {
        status: 'published',
        limit: 10
    }
});
// GET /posts?status=published&limit=10
```

**What it does:**
- Converts `query` option to URL query string
- Handles URL encoding automatically

### RequestDataMiddleware

Transforms request data based on content type.

```javascript
import { Client, RequestDataMiddleware } from '@laravel-streams/api-client';

const client = new Client({
    baseUrl: 'https://api.example.com',
    middleware: [
        new RequestDataMiddleware()
    ]
});

// JSON (default)
await client.post('/posts', {
    data: { title: 'Hello', content: 'World' }
});
// Content-Type: application/json
// Body: {"title":"Hello","content":"World"}

// Form data
await client.post('/upload', {
    data: { file: fileBlob },
    headers: { 'Content-Type': 'multipart/form-data' }
});
// Content-Type: multipart/form-data
// Body: FormData object
```

**What it does:**
- JSON: Stringifies data and sets `Content-Type: application/json`
- Form Data: Converts to FormData and sets `Content-Type: multipart/form-data`
- URL Encoded: Converts to URLSearchParams and sets `Content-Type: application/x-www-form-urlencoded`

### ResponseDataMiddleware

Parses response data based on content type.

```javascript
import { Client, ResponseDataMiddleware } from '@laravel-streams/api-client';

const client = new Client({
    baseUrl: 'https://api.example.com',
    middleware: [
        new ResponseDataMiddleware()
    ]
});

const response = await client.get('/posts');
// Automatically parses JSON response
console.log(response.data); // Parsed object
```

**What it does:**
- Parses JSON responses automatically
- Handles text responses
- Returns raw response for other content types

### ETagMiddleware

Implements HTTP caching with ETags.

```javascript
import { Client, ETagMiddleware } from '@laravel-streams/api-client';

const client = new Client({
    baseUrl: 'https://api.example.com',
    middleware: [
        new ETagMiddleware()
    ]
});

// First request - stores ETag
const response1 = await client.get('/posts/1');
// Response includes: ETag: "abc123"

// Second request - sends If-None-Match
const response2 = await client.get('/posts/1');
// Request includes: If-None-Match: "abc123"
// If not modified: 304 status, returns cached data
```

**What it does:**
- Stores ETags from responses
- Adds `If-None-Match` header on subsequent requests
- Returns cached data for 304 (Not Modified) responses
- Reduces bandwidth and improves performance

## Creating Custom Middleware

### Basic Middleware

```javascript
import { Middleware } from '@laravel-streams/api-client';

class LoggingMiddleware extends Middleware {
    async handle(request, next) {
        console.log('Request:', request.url);
        
        const response = await next(request);
        
        console.log('Response:', response.status);
        return response;
    }
}

// Use it
const client = new Client({
    baseUrl: 'https://api.example.com',
    middleware: [
        new LoggingMiddleware()
    ]
});
```

### Request Transformation

```javascript
class ApiVersionMiddleware extends Middleware {
    constructor(version = 'v1') {
        super();
        this.version = version;
    }
    
    async handle(request, next) {
        // Add version to URL
        request.url = `/api/${this.version}${request.url}`;
        
        // Add version header
        request.headers.set('X-API-Version', this.version);
        
        return next(request);
    }
}

const client = new Client({
    baseUrl: 'https://api.example.com',
    middleware: [
        new ApiVersionMiddleware('v2')
    ]
});

await client.get('/posts');
// GET https://api.example.com/api/v2/posts
// Headers: X-API-Version: v2
```

### Response Transformation

```javascript
class DataWrapperMiddleware extends Middleware {
    async handle(request, next) {
        const response = await next(request);
        
        // Unwrap nested data structure
        if (response.data && response.data.data) {
            response.data = response.data.data;
        }
        
        return response;
    }
}
```

### Error Handling

```javascript
class RetryMiddleware extends Middleware {
    constructor(maxRetries = 3) {
        super();
        this.maxRetries = maxRetries;
    }
    
    async handle(request, next) {
        let lastError;
        
        for (let i = 0; i < this.maxRetries; i++) {
            try {
                return await next(request);
            } catch (error) {
                lastError = error;
                
                // Only retry on network errors or 5xx status
                if (error.status < 500) {
                    throw error;
                }
                
                // Wait before retry
                await new Promise(resolve => 
                    setTimeout(resolve, 1000 * Math.pow(2, i))
                );
            }
        }
        
        throw lastError;
    }
}
```

### Request/Response Logging

```javascript
class DetailedLoggingMiddleware extends Middleware {
    async handle(request, next) {
        const startTime = Date.now();
        
        console.log('→ Request:', {
            method: request.method,
            url: request.url,
            headers: Object.fromEntries(request.headers.entries()),
            body: request.body
        });
        
        try {
            const response = await next(request);
            const duration = Date.now() - startTime;
            
            console.log('← Response:', {
                status: response.status,
                statusText: response.statusText,
                duration: `${duration}ms`,
                headers: Object.fromEntries(response.headers.entries()),
                data: response.data
            });
            
            return response;
        } catch (error) {
            const duration = Date.now() - startTime;
            
            console.error('✗ Error:', {
                duration: `${duration}ms`,
                message: error.message,
                status: error.status
            });
            
            throw error;
        }
    }
}
```

## Real-World Examples

### API Key Authentication

```javascript
class ApiKeyMiddleware extends Middleware {
    constructor(apiKey) {
        super();
        this.apiKey = apiKey;
    }
    
    async handle(request, next) {
        request.headers.set('X-API-Key', this.apiKey);
        return next(request);
    }
}

const client = new Client({
    baseUrl: 'https://api.example.com',
    middleware: [
        new ApiKeyMiddleware('your-api-key-here')
    ]
});
```

### Request Throttling

```javascript
class ThrottleMiddleware extends Middleware {
    constructor(requestsPerSecond = 10) {
        super();
        this.delay = 1000 / requestsPerSecond;
        this.lastRequest = 0;
    }
    
    async handle(request, next) {
        const now = Date.now();
        const timeSinceLastRequest = now - this.lastRequest;
        
        if (timeSinceLastRequest < this.delay) {
            await new Promise(resolve => 
                setTimeout(resolve, this.delay - timeSinceLastRequest)
            );
        }
        
        this.lastRequest = Date.now();
        return next(request);
    }
}

const client = new Client({
    baseUrl: 'https://api.example.com',
    middleware: [
        new ThrottleMiddleware(5) // Max 5 requests per second
    ]
});
```

### Response Caching

```javascript
class CacheMiddleware extends Middleware {
    constructor(ttl = 60000) { // 60 seconds default
        super();
        this.cache = new Map();
        this.ttl = ttl;
    }
    
    getCacheKey(request) {
        return `${request.method}:${request.url}`;
    }
    
    async handle(request, next) {
        // Only cache GET requests
        if (request.method !== 'GET') {
            return next(request);
        }
        
        const cacheKey = this.getCacheKey(request);
        const cached = this.cache.get(cacheKey);
        
        if (cached && Date.now() - cached.timestamp < this.ttl) {
            console.log('Cache hit:', cacheKey);
            return cached.response;
        }
        
        const response = await next(request);
        
        this.cache.set(cacheKey, {
            response: response,
            timestamp: Date.now()
        });
        
        return response;
    }
}

const client = new Client({
    baseUrl: 'https://api.example.com',
    middleware: [
        new CacheMiddleware(30000) // Cache for 30 seconds
    ]
});
```

### Request/Response Transformation

```javascript
class TimestampMiddleware extends Middleware {
    async handle(request, next) {
        // Add timestamp to requests
        if (request.body && typeof request.body === 'object') {
            request.body.timestamp = Date.now();
        }
        
        const response = await next(request);
        
        // Parse date strings in response
        if (response.data) {
            this.parseDates(response.data);
        }
        
        return response;
    }
    
    parseDates(obj) {
        const dateFields = ['created_at', 'updated_at', 'published_at'];
        
        for (const key in obj) {
            if (dateFields.includes(key) && typeof obj[key] === 'string') {
                obj[key] = new Date(obj[key]);
            } else if (typeof obj[key] === 'object') {
                this.parseDates(obj[key]);
            }
        }
    }
}
```

## Middleware Execution Order

Middleware executes in the order it's added:

```javascript
const client = new Client({
    baseUrl: 'https://api.example.com',
    middleware: [
        new LoggingMiddleware(),      // 1. Logs request
        new AuthMiddleware(),          // 2. Adds auth
        new CriteriaMiddleware(),      // 3. Converts criteria
        new RequestDataMiddleware(),   // 4. Transforms request data
        // --- Request sent ---
        // --- Response received ---
        new ResponseDataMiddleware(),  // 5. Parses response data
        new DataWrapperMiddleware()    // 6. Unwraps data
    ]
});
```

The execution flow:
1. Request goes through middleware from top to bottom
2. Response comes back through middleware from bottom to top
3. Each middleware can modify request before calling `next()`
4. Each middleware can modify response after calling `next()`

## Best Practices

### Keep Middleware Focused

```javascript
// Good: Single responsibility
class AuthMiddleware extends Middleware {
    async handle(request, next) {
        request.headers.set('Authorization', `Bearer ${this.token}`);
        return next(request);
    }
}

// Bad: Too many responsibilities
class MegaMiddleware extends Middleware {
    async handle(request, next) {
        // Adds auth, transforms data, logs, caches, retries...
        // Too much in one middleware!
    }
}
```

### Error Handling

```javascript
class SafeMiddleware extends Middleware {
    async handle(request, next) {
        try {
            // Your middleware logic
            return await next(request);
        } catch (error) {
            // Handle or re-throw
            console.error('Middleware error:', error);
            throw error;
        }
    }
}
```

### Configuration

```javascript
class ConfigurableMiddleware extends Middleware {
    constructor(options = {}) {
        super();
        this.options = {
            enabled: true,
            timeout: 5000,
            ...options
        };
    }
    
    async handle(request, next) {
        if (!this.options.enabled) {
            return next(request);
        }
        
        // Use this.options...
        return next(request);
    }
}
```

## Next Steps

- [Examples](08-examples.md) - See middleware in real-world scenarios
- [Client Configuration](03-client.md) - Learn more about client setup
