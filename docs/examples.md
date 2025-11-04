---
sort_order: 8
title: Examples
description: 'Real-world usage patterns and complete examples'
category: guides
status: published
---

# Examples

Complete examples demonstrating real-world usage patterns.

## Basic Blog Application

### Setup

```javascript
import { Client, AuthorizationMiddleware, CriteriaMiddleware, Criteria } from '@laravel-streams/api-client';

const client = new Client({
    baseUrl: 'https://api.example.com',
    middleware: [
        new AuthorizationMiddleware('your-api-token'),
        new CriteriaMiddleware()
    ]
});
```

### List Blog Posts

```javascript
async function getBlogPosts(page = 1, perPage = 10) {
    const criteria = new Criteria()
        .where('status', 'published')
        .orderBy('published_at', 'desc')
        .paginate(perPage, page);
    
    const response = await client.entries.get('posts', { criteria });
    
    return {
        posts: response.data,
        page: page,
        perPage: perPage
    };
}

// Usage
const { posts } = await getBlogPosts(1, 10);
posts.forEach(post => {
    console.log(`${post.title} - ${post.published_at}`);
});
```

### Get Single Post

```javascript
async function getPost(id) {
    const response = await client.entries.find('posts', id);
    return response.data;
}

// Usage
const post = await getPost(123);
console.log(post.title);
console.log(post.content);
```

### Create Post

```javascript
async function createPost(data) {
    const post = {
        title: data.title,
        slug: data.slug || slugify(data.title),
        content: data.content,
        excerpt: data.excerpt,
        author_id: data.authorId,
        category_id: data.categoryId,
        status: 'draft',
        published_at: null
    };
    
    const response = await client.entries.post('posts', post);
    return response.data;
}

// Usage
const newPost = await createPost({
    title: 'Getting Started with Laravel Streams',
    content: 'This is a comprehensive guide...',
    excerpt: 'Learn the basics of Laravel Streams',
    authorId: 1,
    categoryId: 5
});
```

### Update Post

```javascript
async function updatePost(id, updates) {
    const response = await client.entries.patch('posts', id, updates);
    return response.data;
}

// Usage
await updatePost(123, {
    title: 'Updated Title',
    content: 'Updated content...'
});
```

### Publish Post

```javascript
async function publishPost(id) {
    const updates = {
        status: 'published',
        published_at: new Date().toISOString()
    };
    
    return await updatePost(id, updates);
}

// Usage
await publishPost(123);
```

### Delete Post

```javascript
async function deletePost(id) {
    await client.entries.delete('posts', id);
}

// Usage
await deletePost(123);
```

### Search Posts

```javascript
async function searchPosts(query, filters = {}) {
    const criteria = new Criteria()
        // Search in title and content
        .where('title', 'LIKE', `%${query}%`)
        .orWhere('content', 'LIKE', `%${query}%`)
        // Always published
        .where('status', 'published');
    
    // Optional filters
    if (filters.category) {
        criteria.where('category_id', filters.category);
    }
    
    if (filters.author) {
        criteria.where('author_id', filters.author);
    }
    
    if (filters.tag) {
        criteria.where('tags', 'LIKE', `%${filters.tag}%`);
    }
    
    criteria.orderBy('published_at', 'desc').limit(20);
    
    const response = await client.entries.get('posts', { criteria });
    return response.data;
}

// Usage
const results = await searchPosts('javascript', {
    category: 5,
    tag: 'tutorial'
});
```

### Posts by Category

```javascript
async function getPostsByCategory(categoryId, page = 1) {
    const criteria = new Criteria()
        .where('category_id', categoryId)
        .where('status', 'published')
        .orderBy('published_at', 'desc')
        .paginate(10, page);
    
    const response = await client.entries.get('posts', { criteria });
    return response.data;
}

// Usage
const techPosts = await getPostsByCategory(5);
```

## E-commerce Application

### Product Catalog

```javascript
async function getProducts(filters = {}) {
    const criteria = new Criteria()
        .where('is_active', true);
    
    // Price range
    if (filters.minPrice) {
        criteria.where('price', '>=', filters.minPrice);
    }
    if (filters.maxPrice) {
        criteria.where('price', '<=', filters.maxPrice);
    }
    
    // Category
    if (filters.category) {
        criteria.where('category_id', filters.category);
    }
    
    // In stock only
    if (filters.inStock) {
        criteria.where('stock', '>', 0);
    }
    
    // On sale
    if (filters.onSale) {
        criteria.where('sale_price', '!=', null);
    }
    
    // Sorting
    const sortBy = filters.sortBy || 'created_at';
    const sortOrder = filters.sortOrder || 'desc';
    criteria.orderBy(sortBy, sortOrder);
    
    criteria.paginate(24, filters.page || 1);
    
    const response = await client.entries.get('products', { criteria });
    return response.data;
}

// Usage
const products = await getProducts({
    category: 10,
    minPrice: 10,
    maxPrice: 100,
    inStock: true,
    sortBy: 'price',
    sortOrder: 'asc',
    page: 1
});
```

### Shopping Cart

```javascript
class ShoppingCart {
    constructor(client) {
        this.client = client;
    }
    
    async addItem(productId, quantity = 1) {
        const item = {
            product_id: productId,
            quantity: quantity
        };
        
        const response = await this.client.entries.post('cart_items', item);
        return response.data;
    }
    
    async updateQuantity(itemId, quantity) {
        const response = await this.client.entries.patch('cart_items', itemId, {
            quantity: quantity
        });
        return response.data;
    }
    
    async removeItem(itemId) {
        await this.client.entries.delete('cart_items', itemId);
    }
    
    async getItems() {
        const criteria = new Criteria()
            .where('user_id', this.getCurrentUserId())
            .orderBy('created_at', 'desc');
        
        const response = await this.client.entries.get('cart_items', { criteria });
        return response.data;
    }
    
    async clear() {
        const items = await this.getItems();
        
        for (const item of items) {
            await this.removeItem(item.id);
        }
    }
    
    getCurrentUserId() {
        // Get from your auth system
        return 1;
    }
}

// Usage
const cart = new ShoppingCart(client);
await cart.addItem(123, 2);
await cart.updateQuantity(456, 3);
const items = await cart.getItems();
```

### Order Management

```javascript
async function createOrder(cartItems) {
    // Calculate totals
    const subtotal = cartItems.reduce((sum, item) => 
        sum + (item.price * item.quantity), 0
    );
    const tax = subtotal * 0.1; // 10% tax
    const total = subtotal + tax;
    
    // Create order
    const order = {
        subtotal: subtotal,
        tax: tax,
        total: total,
        status: 'pending',
        items: cartItems.map(item => ({
            product_id: item.product_id,
            quantity: item.quantity,
            price: item.price
        }))
    };
    
    const response = await client.entries.post('orders', order);
    return response.data;
}

async function getOrderHistory(userId, page = 1) {
    const criteria = new Criteria()
        .where('user_id', userId)
        .orderBy('created_at', 'desc')
        .paginate(10, page);
    
    const response = await client.entries.get('orders', { criteria });
    return response.data;
}

// Usage
const order = await createOrder(cartItems);
const orders = await getOrderHistory(1);
```

## User Management

### Authentication

```javascript
class AuthService {
    constructor(client) {
        this.client = client;
        this.token = localStorage.getItem('auth_token');
    }
    
    async login(email, password) {
        const response = await this.client.post('/auth/login', {
            data: { email, password }
        });
        
        this.token = response.data.token;
        localStorage.setItem('auth_token', this.token);
        
        // Update client with new token
        this.client.middleware.forEach(middleware => {
            if (middleware instanceof AuthorizationMiddleware) {
                middleware.token = this.token;
            }
        });
        
        return response.data.user;
    }
    
    async logout() {
        await this.client.post('/auth/logout');
        this.token = null;
        localStorage.removeItem('auth_token');
    }
    
    async register(userData) {
        const response = await this.client.post('/auth/register', {
            data: userData
        });
        
        return response.data;
    }
    
    async getCurrentUser() {
        const response = await this.client.get('/auth/me');
        return response.data;
    }
}

// Usage
const auth = new AuthService(client);
const user = await auth.login('user@example.com', 'password');
```

### User Profiles

```javascript
async function getUserProfile(userId) {
    const response = await client.entries.find('users', userId);
    return response.data;
}

async function updateProfile(userId, updates) {
    const response = await client.entries.patch('users', userId, updates);
    return response.data;
}

async function uploadAvatar(userId, file) {
    const formData = new FormData();
    formData.append('avatar', file);
    
    const response = await client.post(`/users/${userId}/avatar`, {
        data: formData,
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    });
    
    return response.data.avatar_url;
}

// Usage
const profile = await getUserProfile(1);
await updateProfile(1, { bio: 'Updated bio' });
await uploadAvatar(1, avatarFile);
```

## Content Management

### Media Library

```javascript
class MediaLibrary {
    constructor(client) {
        this.client = client;
    }
    
    async upload(file, metadata = {}) {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('metadata', JSON.stringify(metadata));
        
        const response = await this.client.post('/media/upload', {
            data: formData,
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });
        
        return response.data;
    }
    
    async getFiles(filters = {}) {
        const criteria = new Criteria();
        
        if (filters.type) {
            criteria.where('mime_type', 'LIKE', `${filters.type}/%`);
        }
        
        if (filters.search) {
            criteria.where('filename', 'LIKE', `%${filters.search}%`);
        }
        
        criteria.orderBy('created_at', 'desc')
                .paginate(filters.perPage || 20, filters.page || 1);
        
        const response = await this.client.entries.get('media', { criteria });
        return response.data;
    }
    
    async delete(fileId) {
        await this.client.entries.delete('media', fileId);
    }
}

// Usage
const media = new MediaLibrary(client);
const file = await media.upload(imageFile, { alt: 'Product image' });
const images = await media.getFiles({ type: 'image' });
await media.delete(123);
```

### Multi-language Content

```javascript
async function getTranslations(streamId, entryId) {
    const criteria = new Criteria()
        .where('translatable_type', streamId)
        .where('translatable_id', entryId);
    
    const response = await client.entries.get('translations', { criteria });
    return response.data;
}

async function setTranslation(streamId, entryId, locale, field, value) {
    const translation = {
        translatable_type: streamId,
        translatable_id: entryId,
        locale: locale,
        field: field,
        value: value
    };
    
    const response = await client.entries.post('translations', translation);
    return response.data;
}

// Usage
await setTranslation('posts', 123, 'es', 'title', 'Título en Español');
await setTranslation('posts', 123, 'es', 'content', 'Contenido en Español');
const translations = await getTranslations('posts', 123);
```

## Analytics and Reporting

### View Tracking

```javascript
async function trackView(streamId, entryId) {
    await client.post('/analytics/view', {
        data: {
            stream: streamId,
            entry: entryId,
            timestamp: Date.now(),
            user_agent: navigator.userAgent
        }
    });
}

async function getPopularPosts(days = 7) {
    const since = new Date();
    since.setDate(since.getDate() - days);
    
    const criteria = new Criteria()
        .where('status', 'published')
        .where('published_at', '>=', since.toISOString())
        .orderBy('views', 'desc')
        .limit(10);
    
    const response = await client.entries.get('posts', { criteria });
    return response.data;
}

// Usage
await trackView('posts', 123);
const popular = await getPopularPosts(7);
```

## Error Handling

### Comprehensive Error Handling

```javascript
async function safeApiCall(operation) {
    try {
        return await operation();
    } catch (error) {
        if (error.status === 401) {
            // Unauthorized - redirect to login
            console.error('Authentication required');
            window.location.href = '/login';
        } else if (error.status === 403) {
            // Forbidden
            console.error('Access denied');
            throw new Error('You do not have permission to perform this action');
        } else if (error.status === 404) {
            // Not found
            console.error('Resource not found');
            throw new Error('The requested resource was not found');
        } else if (error.status === 422) {
            // Validation error
            console.error('Validation failed:', error.data);
            throw new Error('Please check your input and try again');
        } else if (error.status >= 500) {
            // Server error
            console.error('Server error:', error);
            throw new Error('A server error occurred. Please try again later.');
        } else {
            // Other errors
            console.error('API error:', error);
            throw error;
        }
    }
}

// Usage
const post = await safeApiCall(() => getPost(123));
```

## Next Steps

- [Client Configuration](client) - Advanced client setup
- [Criteria](criteria) - Query building techniques
- [Middleware](middleware) - Custom middleware patterns
