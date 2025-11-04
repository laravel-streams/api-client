---
sort_order: 5
title: Working with Entries
description: 'CRUD operations for stream entries'
category: core
status: published
---

# Working with Entries

Entries represent the data within your configured Streams. Use the Entries API to interact with stream data.

## Get Entries

Return entries from a configured stream:

**Method:** `client.entries.get(stream, config)`

```javascript
const response = await client.entries.get('posts');
console.log(response.data); // Array of entries
```

### With Pagination

```javascript
const response = await client.entries.get('posts', {
    query: {
        per_page: 25,
        page: 2
    }
});
```

### With Criteria

```javascript
import { Criteria } from '@laravel-streams/api-client';

const criteria = new Criteria()
    .where('status', 'published')
    .orderBy('created_at', 'desc')
    .limit(10);

const response = await client.entries.get('posts', { criteria });
```

### Response Structure

```javascript
{
    "data": [
        {
            "id": "1",
            "title": "Hello World",
            "status": "published"
        }
    ],
    "meta": {
        "total": 100,
        "per_page": 25,
        "current_page": 1,
        "last_page": 4
    },
    "links": {
        "self": "http://api.example.com/streams/posts/entries",
        "first": "http://api.example.com/streams/posts/entries?page=1",
        "next": "http://api.example.com/streams/posts/entries?page=2"
    }
}
```

## Find Entry

Return a single entry by ID:

**Method:** `client.entries.find(stream, id, config)`

```javascript
const response = await client.entries.find('posts', 1);
console.log(response.data); // Single entry object
```

### Response Structure

```javascript
{
    "data": {
        "id": "1",
        "title": "Hello World",
        "content": "This is my first post",
        "status": "published",
        "created_at": "2024-01-01T00:00:00.000Z"
    },
    "links": {
        "self": "http://api.example.com/streams/posts/entries/1",
        "stream": "http://api.example.com/streams/posts"
    }
}
```

## Create Entry

Create a new entry in a stream:

**Method:** `client.entries.post(stream, data, config)`

```javascript
const response = await client.entries.post('posts', {
    title: 'My New Post',
    content: 'This is the content',
    status: 'draft'
});

console.log(response.data.id); // ID of created entry
```

### Response Structure

```javascript
{
    "data": {
        "id": "123",
        "title": "My New Post",
        "content": "This is the content",
        "status": "draft",
        "created_at": "2024-01-01T12:00:00.000Z"
    },
    "links": {
        "self": "http://api.example.com/streams/posts/entries/123",
        "location": "http://api.example.com/streams/posts/entries/123"
    }
}
```

## Update Entry (Partial)

Update specific fields of an entry:

**Method:** `client.entries.patch(stream, id, data, config)`

```javascript
// Only update the title
const response = await client.entries.patch('posts', 1, {
    title: 'Updated Title'
});

// Other fields remain unchanged
console.log(response.data);
```

## Update Entry (Full)

Replace all fields of an entry:

**Method:** `client.entries.put(stream, id, data, config)`

```javascript
// Replace entire entry
const response = await client.entries.put('posts', 1, {
    title: 'New Title',
    content: 'New content',
    status: 'published'
});

// Omitted fields will be set to null/default
```

### PATCH vs PUT

- **PATCH**: Updates only the provided fields, keeps others unchanged
- **PUT**: Replaces the entire entry, omitted fields become null

```javascript
// Original entry
{ id: 1, title: 'Hello', content: 'World', status: 'draft' }

// PATCH { title: 'Hi' }
{ id: 1, title: 'Hi', content: 'World', status: 'draft' }

// PUT { title: 'Hi' }
{ id: 1, title: 'Hi', content: null, status: null }
```

## Delete Entry

Delete an entry from a stream:

**Method:** `client.entries.delete(stream, id, config)`

```javascript
await client.entries.delete('posts', 1);
// Returns empty response on success
```

## Filtering Results

Use Criteria to filter entries:

```javascript
import { Criteria } from '@laravel-streams/api-client';

const criteria = new Criteria()
    .where('status', 'published')
    .where('created_at', '>=', '2024-01-01')
    .where('views', '>', 100);

const response = await client.entries.get('posts', { criteria });
```

### Available Operators

```javascript
// Comparison
.where('views', '>', 100)
.where('views', '>=', 100)
.where('views', '<', 100)
.where('views', '<=', 100)
.where('status', '==', 'published')
.where('status', '!=', 'draft')

// Logical
.where('tags', 'IN', ['tech', 'news'])
.where('content', 'LIKE', '%tutorial%')
```

## Sorting Results

```javascript
const criteria = new Criteria()
    .orderBy('created_at', 'desc')
    .orderBy('title', 'asc');

const response = await client.entries.get('posts', { criteria });
```

## Pagination

```javascript
// Simple pagination
const criteria = new Criteria()
    .paginate(25, 2); // 25 per page, page 2

const response = await client.entries.get('posts', { criteria });

console.log(response.meta.total);
console.log(response.meta.current_page);
console.log(response.meta.last_page);
```

## Error Handling

```javascript
try {
    const response = await client.entries.find('posts', 999);
} catch (error) {
    if (error.status === 404) {
        console.log('Entry not found');
    } else if (error.status === 422) {
        console.log('Validation error:', error.response.data.errors);
    } else {
        console.error('Error:', error.message);
    }
}
```

## Real-World Examples

### Blog Post Management

```javascript
// Get recent published posts
async function getRecentPosts(limit = 10) {
    const criteria = new Criteria()
        .where('status', 'published')
        .orderBy('published_at', 'desc')
        .limit(limit);
    
    return await client.entries.get('posts', { criteria });
}

// Publish a draft
async function publishPost(id) {
    return await client.entries.patch('posts', id, {
        status: 'published',
        published_at: new Date().toISOString()
    });
}

// Search posts
async function searchPosts(query) {
    const criteria = new Criteria()
        .where('title', 'LIKE', `%${query}%`)
        .orWhere('content', 'LIKE', `%${query}%`)
        .where('status', 'published')
        .orderBy('relevance', 'desc');
    
    return await client.entries.get('posts', { criteria });
}
```

### User Management

```javascript
// Get active users
async function getActiveUsers() {
    const criteria = new Criteria()
        .where('status', 'active')
        .where('last_login', '>=', getLastWeek())
        .orderBy('last_login', 'desc');
    
    return await client.entries.get('users', { criteria });
}

// Update user profile
async function updateProfile(userId, data) {
    return await client.entries.patch('users', userId, {
        name: data.name,
        email: data.email,
        bio: data.bio,
        updated_at: new Date().toISOString()
    });
}
```

## Next Steps

- [Criteria Query Builder](06-criteria.md) - Learn advanced querying
- [Middleware](07-middleware.md) - Add custom functionality
- [Examples](08-examples.md) - See more examples
