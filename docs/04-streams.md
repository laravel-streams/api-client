---
sort_order: 4
title: Streams
description: 'Working with stream resources and CRUD operations'
category: core
status: published
---

# Streams

Streams represent collections or resource types in the Laravel Streams API. The `Streams` class provides methods for managing stream resources.

## Getting Streams

### Get All Streams

```javascript
const response = await client.streams.get();
console.log(response.data); // Array of stream objects
```

### Get Specific Stream

```javascript
const response = await client.streams.find('posts');
console.log(response.data); // Single stream object
```

### With Criteria

```javascript
import { Criteria } from '@laravel-streams/api-client';

const criteria = new Criteria()
    .where('type', 'content')
    .orderBy('name', 'asc');

const response = await client.streams.get({ criteria });
```

## Creating Streams

### Basic Creation

```javascript
const stream = {
    id: 'posts',
    name: 'Posts',
    description: 'Blog posts stream',
    fields: {
        title: {
            type: 'string',
            required: true
        },
        content: {
            type: 'text',
            required: true
        },
        author: {
            type: 'relationship',
            related: 'users'
        },
        published_at: {
            type: 'datetime',
            nullable: true
        }
    }
};

const response = await client.streams.post(stream);
```

### With Validation

```javascript
const stream = {
    id: 'products',
    name: 'Products',
    rules: {
        title: 'required|string|max:255',
        price: 'required|numeric|min:0',
        sku: 'required|unique:products,sku'
    },
    fields: {
        title: { type: 'string' },
        price: { type: 'decimal' },
        sku: { type: 'string' }
    }
};

const response = await client.streams.post(stream);
```

## Updating Streams

### Full Update (PUT)

```javascript
const updatedStream = {
    id: 'posts',
    name: 'Blog Posts',
    description: 'Updated description',
    fields: {
        title: { type: 'string', required: true },
        content: { type: 'text', required: true },
        excerpt: { type: 'text' }, // New field
        published_at: { type: 'datetime' }
    }
};

const response = await client.streams.put('posts', updatedStream);
```

### Partial Update (PATCH)

```javascript
const updates = {
    description: 'Updated description only',
    fields: {
        featured: { type: 'boolean', default: false }
    }
};

const response = await client.streams.patch('posts', updates);
```

## Deleting Streams

```javascript
const response = await client.streams.delete('posts');
console.log(response.status); // 204 No Content
```

## Stream Structure

### Basic Stream Definition

```javascript
const stream = {
    // Identity
    id: 'posts',                    // Required: Unique identifier
    name: 'Posts',                  // Required: Human-readable name
    description: 'Blog posts',      // Optional: Description
    
    // Configuration
    source: {
        type: 'eloquent',           // Storage type
        model: 'App\\Models\\Post'  // Model class
    },
    
    // Fields
    fields: {
        title: {
            type: 'string',
            required: true,
            rules: 'max:255'
        },
        content: {
            type: 'text',
            required: true
        }
    },
    
    // Validation
    rules: {
        title: 'required|string|max:255',
        content: 'required|string'
    }
};
```

### Field Types

```javascript
const stream = {
    id: 'examples',
    name: 'Examples',
    fields: {
        // Text fields
        string_field: { type: 'string' },
        text_field: { type: 'text' },
        markdown_field: { type: 'markdown' },
        
        // Number fields
        integer_field: { type: 'integer' },
        decimal_field: { type: 'decimal', decimals: 2 },
        
        // Boolean
        boolean_field: { type: 'boolean', default: false },
        
        // Date/Time
        date_field: { type: 'date' },
        datetime_field: { type: 'datetime' },
        timestamp_field: { type: 'timestamp' },
        
        // Relationships
        user: {
            type: 'relationship',
            related: 'users',
            relationship_type: 'belongsTo'
        },
        
        // JSON
        metadata: { type: 'object' },
        tags: { type: 'array' },
        
        // Files
        image: { type: 'image' },
        file: { type: 'file' }
    }
};
```

## Real-World Examples

### Blog Stream

```javascript
const blogStream = {
    id: 'posts',
    name: 'Blog Posts',
    description: 'Blog content management',
    fields: {
        title: {
            type: 'string',
            required: true,
            rules: 'max:255'
        },
        slug: {
            type: 'string',
            required: true,
            unique: true
        },
        excerpt: {
            type: 'text',
            rules: 'max:500'
        },
        content: {
            type: 'markdown',
            required: true
        },
        featured_image: {
            type: 'image'
        },
        author: {
            type: 'relationship',
            related: 'users',
            relationship_type: 'belongsTo'
        },
        category: {
            type: 'relationship',
            related: 'categories',
            relationship_type: 'belongsTo'
        },
        tags: {
            type: 'relationship',
            related: 'tags',
            relationship_type: 'belongsToMany'
        },
        status: {
            type: 'string',
            default: 'draft',
            rules: 'in:draft,published,archived'
        },
        published_at: {
            type: 'datetime',
            nullable: true
        }
    },
    rules: {
        title: 'required|string|max:255',
        slug: 'required|unique:posts,slug',
        content: 'required',
        status: 'required|in:draft,published,archived'
    }
};

const response = await client.streams.post(blogStream);
```

### E-commerce Product Stream

```javascript
const productStream = {
    id: 'products',
    name: 'Products',
    description: 'E-commerce product catalog',
    fields: {
        name: {
            type: 'string',
            required: true
        },
        sku: {
            type: 'string',
            required: true,
            unique: true
        },
        description: {
            type: 'text'
        },
        price: {
            type: 'decimal',
            decimals: 2,
            required: true
        },
        sale_price: {
            type: 'decimal',
            decimals: 2,
            nullable: true
        },
        cost: {
            type: 'decimal',
            decimals: 2
        },
        stock: {
            type: 'integer',
            default: 0
        },
        images: {
            type: 'array',
            items: {
                type: 'image'
            }
        },
        category: {
            type: 'relationship',
            related: 'categories'
        },
        attributes: {
            type: 'object'
        },
        is_active: {
            type: 'boolean',
            default: true
        },
        weight: {
            type: 'decimal',
            decimals: 2
        },
        dimensions: {
            type: 'object'
        }
    },
    rules: {
        name: 'required|string|max:255',
        sku: 'required|unique:products,sku',
        price: 'required|numeric|min:0',
        stock: 'integer|min:0'
    }
};

const response = await client.streams.post(productStream);
```

### User Management Stream

```javascript
const userStream = {
    id: 'users',
    name: 'Users',
    description: 'User accounts and profiles',
    fields: {
        email: {
            type: 'email',
            required: true,
            unique: true
        },
        name: {
            type: 'string',
            required: true
        },
        username: {
            type: 'string',
            required: true,
            unique: true
        },
        password: {
            type: 'password',
            required: true
        },
        avatar: {
            type: 'image',
            nullable: true
        },
        bio: {
            type: 'text',
            nullable: true
        },
        role: {
            type: 'relationship',
            related: 'roles'
        },
        status: {
            type: 'string',
            default: 'active',
            rules: 'in:active,inactive,banned'
        },
        email_verified_at: {
            type: 'datetime',
            nullable: true
        },
        last_login_at: {
            type: 'datetime',
            nullable: true
        }
    },
    rules: {
        email: 'required|email|unique:users,email',
        name: 'required|string|max:255',
        username: 'required|unique:users,username|alpha_dash',
        password: 'required|min:8',
        status: 'in:active,inactive,banned'
    }
};

const response = await client.streams.post(userStream);
```

## Listing and Managing Streams

### Get All Streams with Details

```javascript
const response = await client.streams.get();

response.data.forEach(stream => {
    console.log(`Stream: ${stream.name} (${stream.id})`);
    console.log(`Fields: ${Object.keys(stream.fields).length}`);
    console.log(`Description: ${stream.description}`);
});
```

### Filter Streams

```javascript
import { Criteria } from '@laravel-streams/api-client';

// Get only content-type streams
const criteria = new Criteria()
    .where('source.type', 'eloquent')
    .orderBy('name', 'asc');

const response = await client.streams.get({ criteria });
```

### Update Stream Configuration

```javascript
// Add new field to existing stream
const updates = {
    fields: {
        view_count: {
            type: 'integer',
            default: 0
        }
    }
};

await client.streams.patch('posts', updates);
```

## Response Structure

```javascript
// Success response
{
    data: {
        id: 'posts',
        name: 'Posts',
        description: 'Blog posts',
        fields: { /* ... */ },
        rules: { /* ... */ }
    },
    status: 200,
    headers: { /* ... */ }
}

// List response
{
    data: [
        { id: 'posts', name: 'Posts', /* ... */ },
        { id: 'users', name: 'Users', /* ... */ }
    ],
    status: 200,
    headers: { /* ... */ }
}
```

## Next Steps

- [Working with Entries](05-entries.md) - CRUD operations on stream entries
- [Criteria](06-criteria.md) - Query builder for filtering and sorting
- [Examples](08-examples.md) - Real-world usage patterns
