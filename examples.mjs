/**
 * Comprehensive Examples for Laravel Streams API Client
 */

import { Client, Criteria, AuthorizationMiddleware } from './src-js/index.js';

// ========================================
// 1. Basic Setup
// ========================================

const client = new Client({
    baseURL: 'http://localhost/api'
});

console.log('📦 Client initialized with base URL:', client.options.baseURL);

// ========================================
// 2. Adding Authentication
// ========================================

const authMiddleware = new AuthorizationMiddleware({
    token: 'your-api-token-here',
    type: 'Bearer'
});

client.use(authMiddleware);
console.log('🔐 Authentication middleware added');

// ========================================
// 3. Working with Streams
// ========================================

// Get all streams
// const allStreams = await client.streams.get();

// Get a specific stream
// const postsStream = await client.streams.find('posts');

// ========================================
// 4. Working with Entries (Basic CRUD)
// ========================================

// Get all entries from a stream
// const entries = await client.entries.get('posts');

// Find a specific entry
// const entry = await client.entries.find('posts', 1);

// Create a new entry
// const newPost = await client.entries.post('posts', {
//     title: 'My New Post',
//     content: 'This is the content of my post',
//     status: 'draft'
// });

// Update an entry
// const updated = await client.entries.patch('posts', 1, {
//     title: 'Updated Title',
//     status: 'published'
// });

// Delete an entry
// await client.entries.delete('posts', 1);

// ========================================
// 5. Using Criteria (Query Builder)
// ========================================

// Simple criteria
const simpleCriteria = new Criteria()
    .where('status', 'published')
    .limit(10);

console.log('📋 Simple criteria created');

// Advanced criteria with multiple conditions
const advancedCriteria = new Criteria()
    .where('status', 'published')
    .where('views', '>', 100)
    .where('category', 'technology')
    .orderBy('created_at', 'desc')
    .limit(20);

console.log('📋 Advanced criteria created with', advancedCriteria.getParameters().length, 'parameters');

// Using criteria with requests
// const results = await client.entries.get('posts', {
//     criteria: advancedCriteria
// });

// OR WHERE clause
const orWhereCriteria = new Criteria()
    .where('status', 'published')
    .orWhere('status', 'featured')
    .orderBy('created_at', 'desc');

console.log('📋 OR WHERE criteria created');

// Pagination
const paginatedCriteria = new Criteria()
    .where('status', 'published')
    .orderBy('created_at', 'desc')
    .paginate(25, 1); // 25 per page, page 1

console.log('📋 Paginated criteria created');

// ========================================
// 6. Comparison Operators
// ========================================

const operatorExamples = new Criteria()
    .where('views', '>', 100)      // Greater than
    .where('rating', '>=', 4)      // Greater than or equal
    .where('price', '<', 100)      // Less than
    .where('stock', '<=', 50)      // Less than or equal
    .where('status', '==', 'active') // Equal
    .where('deleted', '!=', true); // Not equal

console.log('📋 Criteria with various operators created');

// ========================================
// 7. Complex Example
// ========================================

const complexExample = new Criteria()
    .where('category', 'technology')
    .where('published_at', '>=', '2024-01-01')
    .where('views', '>', 500)
    .orWhere('featured', true)
    .orderBy('views', 'desc')
    .orderBy('published_at', 'desc')
    .paginate(50, 1);

console.log('📋 Complex criteria example created');

// Use it like this:
// const techPosts = await client.entries.get('posts', {
//     criteria: complexExample
// });

// ========================================
// 8. Custom Middleware Example
// ========================================

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
        console.log('📤 Request:', request.method, request.url);
        return request;
    }

    async response(response, client) {
        console.log('📥 Response:', response.status, response.statusText);
        return response;
    }

    async error(error, client) {
        console.error('❌ Error:', error.message);
        throw error;
    }
}

// Add custom middleware
const logger = new LoggingMiddleware();
client.use(logger);
console.log('📝 Logging middleware added');

// ========================================
// Summary
// ========================================

console.log('\n✅ All examples loaded successfully!');
console.log('\n💡 To use these examples:');
console.log('   1. Uncomment the async/await lines');
console.log('   2. Set your actual API baseURL');
console.log('   3. Add your authentication token');
console.log('   4. Run the script');
console.log('\n📚 For more information, check the README.md');
