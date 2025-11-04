# Streams API - JS Client

A simplified JavaScript client for interacting with the [Laravel Streams API](https://github.com/laravel-streams/streams-api).

## Installation

```bash
npm install @laravel-streams/api-client
```

## Quick Start

```javascript
import { Client } from '@laravel-streams/api-client';

const client = new Client({
    baseURL: 'http://localhost/api'
});

// Get all streams
const streams = await client.streams.get();

// Get entries from a stream
const entries = await client.entries.get('posts');

// Find a specific entry
const entry = await client.entries.find('posts', 1);

// Create an entry
const newEntry = await client.entries.post('posts', {
    title: 'Hello World',
    content: 'This is my first post'
});

// Update an entry
await client.entries.patch('posts', 1, {
    title: 'Updated Title'
});

// Delete an entry
await client.entries.delete('posts', 1);
```

## Using Criteria (Query Builder)

The Criteria class provides a fluent interface similar to Laravel's query builder:

```javascript
import { Criteria } from '@laravel-streams/api-client';

const criteria = new Criteria()
    .where('status', 'published')
    .where('views', '>', 100)
    .orderBy('created_at', 'desc')
    .limit(10);

// Use with entries
const response = await client.entries.get('posts', {
    criteria: criteria
});
```

## Middleware

The client supports middleware for request/response processing:

```javascript
import { Client, AuthorizationMiddleware } from '@laravel-streams/api-client';

const auth = new AuthorizationMiddleware({
    token: 'your-api-token',
    type: 'Bearer'
});

const client = new Client({
    baseURL: 'http://localhost/api',
    middlewares: [auth]
});
```

## API Reference

### Client

- `client.streams.get()` - Get all streams
- `client.streams.find(stream)` - Get a specific stream
- `client.entries.get(stream)` - Get entries from a stream
- `client.entries.find(stream, id)` - Find a specific entry
- `client.entries.post(stream, data)` - Create an entry
- `client.entries.patch(stream, id, data)` - Update an entry
- `client.entries.delete(stream, id)` - Delete an entry

### Criteria

- `where(field, value)` - Add a where clause
- `where(field, operator, value)` - Add a where clause with operator
- `orWhere(field, value)` - Add an OR where clause
- `orderBy(field, direction)` - Order results
- `limit(number)` - Limit results
- `paginate(perPage, page)` - Paginate results

## License

MIT
