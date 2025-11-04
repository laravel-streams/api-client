---
sort_order: 6
title: Criteria Query Builder
description: 'PHP Laravel-style query building for filtering and sorting'
category: core
status: published
---

# Criteria Query Builder

The Criteria class provides a fluent, PHP Laravel-style interface for building queries.

## Basic Usage

```javascript
import { Criteria } from '@laravel-streams/api-client';

const criteria = new Criteria()
    .where('status', 'published')
    .orderBy('created_at', 'desc')
    .limit(10);

const response = await client.entries.get('posts', { criteria });
```

## Creating Criteria

### Static Factory

```javascript
const criteria = Criteria.make()
    .where('status', 'active');
```

### Constructor

```javascript
const criteria = new Criteria();
criteria.where('status', 'active');
```

## Where Clauses

### Basic Where

```javascript
// Simple equality
criteria.where('status', 'published');
// Generates: WHERE status == 'published'

// With operator
criteria.where('views', '>', 100);
// Generates: WHERE views > 100
```

### Available Operators

#### Comparison Operators

```javascript
criteria.where('views', '>', 100);     // Greater than
criteria.where('views', '>=', 100);    // Greater than or equal
criteria.where('views', '<', 100);     // Less than
criteria.where('views', '<=', 100);    // Less than or equal
criteria.where('status', '==', 'active'); // Equal
criteria.where('status', '!=', 'deleted'); // Not equal
criteria.where('value', '<>', 0);      // Not equal (alternative)
```

#### Logical Operators

```javascript
criteria.where('status', 'IN', ['published', 'featured']);
criteria.where('title', 'LIKE', '%tutorial%');
criteria.where('content', 'NOT', null);
criteria.where('tags', 'ALL', ['javascript', 'tutorial']);
criteria.where('categories', 'ANY', ['tech', 'news']);
```

### OR Where Clauses

```javascript
const criteria = new Criteria()
    .where('status', 'published')
    .orWhere('status', 'featured');
// WHERE status == 'published' OR status == 'featured'
```

### Chaining Where Clauses

```javascript
const criteria = new Criteria()
    .where('status', 'published')
    .where('views', '>', 100)
    .where('category', 'technology')
    .where('created_at', '>=', '2024-01-01');
// WHERE status == 'published' 
//   AND views > 100 
//   AND category == 'technology'
//   AND created_at >= '2024-01-01'
```

## Ordering Results

### Order By

```javascript
// Descending (default)
criteria.orderBy('created_at');

// Ascending
criteria.orderBy('title', 'asc');

// Descending
criteria.orderBy('views', 'desc');
```

### Multiple Order By

```javascript
const criteria = new Criteria()
    .orderBy('priority', 'desc')  // First by priority
    .orderBy('created_at', 'desc') // Then by date
    .orderBy('title', 'asc');      // Then by title
```

## Limiting Results

### Limit

```javascript
criteria.limit(10); // Return maximum 10 results
```

### First

```javascript
criteria.first(); // Same as limit(1)
```

### Find by ID

```javascript
criteria.find(123); 
// Same as: where('id', 123).limit(1)
```

## Pagination

```javascript
// paginate(perPage, page)
criteria.paginate(25, 1); // 25 per page, page 1

// Default pagination (100 per page, page 1)
criteria.paginate();
```

## Complex Queries

### Combining Conditions

```javascript
const criteria = new Criteria()
    // Published or featured
    .where('status', 'published')
    .orWhere('status', 'featured')
    // With minimum views
    .where('views', '>=', 100)
    // In specific categories
    .where('category', 'IN', ['tech', 'tutorial'])
    // Recent posts
    .where('created_at', '>=', '2024-01-01')
    // Sort by popularity, then date
    .orderBy('views', 'desc')
    .orderBy('created_at', 'desc')
    // Paginate
    .paginate(20, 1);
```

### Search Functionality

```javascript
function searchPosts(query) {
    return new Criteria()
        .where('title', 'LIKE', `%${query}%`)
        .orWhere('content', 'LIKE', `%${query}%`)
        .orWhere('tags', 'LIKE', `%${query}%`)
        .where('status', 'published')
        .orderBy('relevance', 'desc')
        .limit(50);
}

const criteria = searchPosts('javascript');
const results = await client.entries.get('posts', { criteria });
```

## Working with Parameters

### Get Parameters

```javascript
const criteria = new Criteria()
    .where('status', 'published')
    .orderBy('created_at', 'desc')
    .limit(10);

const params = criteria.getParameters();
console.log(params);
// [
//   { name: 'where', value: ['status', '==', 'published', null] },
//   { name: 'orderBy', value: ['created_at', 'desc'] },
//   { name: 'limit', value: 10 }
// ]
```

### Set Parameters

```javascript
const criteria = new Criteria();
criteria.setParameters([
    { name: 'where', value: ['status', '==', 'published', null] },
    { name: 'limit', value: 10 }
]);
```

### Add Parameter

```javascript
const criteria = new Criteria();
criteria.addParameter('where', ['status', '==', 'published', null]);
```

### Standardize Parameters

```javascript
const criteria = new Criteria()
    .where('status', 'published')
    .limit(10);

const standardized = criteria.standardizeParameters();
console.log(standardized);
// {
//   where: ['status', '==', 'published', null],
//   limit: 10
// }
```

## Real-World Examples

### Blog Post Filtering

```javascript
// Featured posts from last month
const criteria = new Criteria()
    .where('featured', true)
    .where('published_at', '>=', getLastMonth())
    .where('status', 'published')
    .orderBy('published_at', 'desc')
    .limit(5);

// Posts by category with minimum engagement
const criteria = new Criteria()
    .where('category', 'javascript')
    .where('likes', '>', 50)
    .where('comments', '>', 10)
    .orderBy('engagement_score', 'desc')
    .paginate(20, 1);
```

### E-commerce Product Filtering

```javascript
// Products in price range, in stock
const criteria = new Criteria()
    .where('price', '>=', 10)
    .where('price', '<=', 100)
    .where('stock', '>', 0)
    .where('category', 'electronics')
    .orderBy('popularity', 'desc')
    .paginate(24, 1);

// Sale items
const criteria = new Criteria()
    .where('on_sale', true)
    .where('discount', '>=', 20)
    .where('stock', '>', 0)
    .orderBy('discount', 'desc')
    .orderBy('price', 'asc');
```

### User Management

```javascript
// Active users who logged in recently
const criteria = new Criteria()
    .where('status', 'active')
    .where('last_login', '>=', getLastWeek())
    .where('email_verified', true)
    .orderBy('last_login', 'desc')
    .limit(100);

// Premium users expiring soon
const criteria = new Criteria()
    .where('subscription', 'premium')
    .where('expires_at', '<=', getNextMonth())
    .where('expires_at', '>=', getToday())
    .orderBy('expires_at', 'asc');
```

## Builder Pattern

The Criteria class uses the builder pattern, allowing you to chain methods:

```javascript
const criteria = new Criteria()
    .where('a', 1)     // Returns this
    .where('b', 2)     // Returns this
    .orderBy('c')      // Returns this
    .limit(10);        // Returns this

// Same as:
const criteria = new Criteria();
criteria.where('a', 1);
criteria.where('b', 2);
criteria.orderBy('c');
criteria.limit(10);
```

## Reusable Criteria

```javascript
// Create base criteria
const publishedPosts = () => new Criteria()
    .where('status', 'published')
    .where('deleted_at', null);

// Extend it
const recentPublishedPosts = publishedPosts()
    .where('created_at', '>=', getLastWeek())
    .orderBy('created_at', 'desc');

const popularPublishedPosts = publishedPosts()
    .where('views', '>', 1000)
    .orderBy('views', 'desc');
```

## Next Steps

- [Working with Entries](05-entries.md) - Apply criteria to entry queries
- [Examples](08-examples.md) - See more complex examples
