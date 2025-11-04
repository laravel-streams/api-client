---
sort_order: 2
title: Quick Start
description: 'Get started with the Streams API Client in minutes'
category: getting-started
status: published
---

# Quick Start

Get up and running with the Streams API Client in just a few minutes.

## Basic Setup

```javascript
import { Client } from '@laravel-streams/api-client';

const client = new Client({
    baseURL: 'http://localhost/api'
});
```

## Working with Streams

### Get All Streams

```javascript
const response = await client.streams.get();
console.log(response.data); // Array of streams
```

### Get a Single Stream

```javascript
const response = await client.streams.find('posts');
console.log(response.data); // Stream object
```

## Working with Entries

### Get Entries

```javascript
// Get all entries from a stream
const response = await client.entries.get('posts');
console.log(response.data); // Array of entries
```

### Find a Specific Entry

```javascript
const response = await client.entries.find('posts', 1);
console.log(response.data); // Single entry object
```

### Create an Entry

```javascript
const response = await client.entries.post('posts', {
    title: 'My First Post',
    content: 'Hello, world!',
    status: 'published'
});

console.log(response.data); // Created entry with ID
```

### Update an Entry

```javascript
// Partial update (PATCH)
const response = await client.entries.patch('posts', 1, {
    title: 'Updated Title'
});

// Full update (PUT)
const response = await client.entries.put('posts', 1, {
    title: 'New Title',
    content: 'New content',
    status: 'draft'
});
```

### Delete an Entry

```javascript
await client.entries.delete('posts', 1);
```

## Using Criteria for Queries

```javascript
import { Criteria } from '@laravel-streams/api-client';

// Build a query
const criteria = new Criteria()
    .where('status', 'published')
    .where('views', '>', 100)
    .orderBy('created_at', 'desc')
    .limit(10);

// Execute the query
const response = await client.entries.get('posts', {
    criteria: criteria
});

console.log(response.data); // Filtered and sorted entries
```

## Adding Authentication

```javascript
import { Client, AuthorizationMiddleware } from '@laravel-streams/api-client';

// Create auth middleware
const auth = new AuthorizationMiddleware({
    token: 'your-api-token',
    type: 'Bearer'
});

// Add to client
const client = new Client({
    baseURL: 'http://localhost/api',
    middlewares: [auth]
});

// All requests will now include: Authorization: Bearer your-api-token
```

## Error Handling

```javascript
try {
    const response = await client.entries.find('posts', 999);
    console.log(response.data);
} catch (error) {
    if (error.status === 404) {
        console.log('Entry not found');
    } else {
        console.error('Error:', error.message);
    }
}
```

## Complete Example

Here's a complete example putting it all together:

```javascript
import { Client, Criteria, AuthorizationMiddleware } from '@laravel-streams/api-client';

// Setup client with authentication
const auth = new AuthorizationMiddleware({
    token: process.env.API_TOKEN,
    type: 'Bearer'
});

const client = new Client({
    baseURL: 'https://api.example.com',
    middlewares: [auth]
});

// Fetch and display published posts
async function getPublishedPosts() {
    try {
        const criteria = new Criteria()
            .where('status', 'published')
            .orderBy('created_at', 'desc')
            .limit(10);

        const response = await client.entries.get('posts', { criteria });
        
        response.data.forEach(post => {
            console.log(`${post.title} - ${post.created_at}`);
        });
    } catch (error) {
        console.error('Failed to fetch posts:', error.message);
    }
}

// Create a new post
async function createPost(data) {
    try {
        const response = await client.entries.post('posts', data);
        console.log('Post created with ID:', response.data.id);
        return response.data;
    } catch (error) {
        console.error('Failed to create post:', error.message);
    }
}

// Run examples
await getPublishedPosts();
await createPost({
    title: 'Hello World',
    content: 'This is my first post!',
    status: 'draft'
});
```

## Next Steps

- [Client Configuration](client) - Learn about all configuration options
- [Criteria Query Builder](criteria) - Master the query builder
- [Middleware](middleware) - Extend functionality with middleware
- [Examples](examples) - See more real-world examples
