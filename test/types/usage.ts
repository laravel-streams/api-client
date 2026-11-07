// Compile-time usage of the public API surface. Type-checked by
// `npm run types:check` (npx tsc --noEmit -p test/types/tsconfig.json).

import {
    Client,
    Criteria,
    Endpoint,
    Entries,
    Streams,
    FetchError,
    FetchRequest,
    AuthorizationMiddleware,
    CriteriaMiddleware,
    ETagMiddleware,
    Middleware,
    QueryMiddleware,
    RequestDataMiddleware,
    ResponseDataMiddleware,
    type ApiResponse,
    type StreamId,
    type TodosEntry,
    type UsersEntry,
    type EndpointDefinition,
    type Method,
} from '@laravel-streams/api-client';

const client = new Client({
    baseURL: 'https://api.example.com',
    request: {
        timeout: 5000,
        retries: 2,
        headers: { 'X-Requested-With': 'XMLHttpRequest' },
    },
    middlewares: [
        new AuthorizationMiddleware({ token: 'secret-token', type: 'Bearer' }),
        new QueryMiddleware(),
        new RequestDataMiddleware(),
        new ResponseDataMiddleware(),
        new CriteriaMiddleware(),
        new ETagMiddleware(),
    ],
});

client.use(new AuthorizationMiddleware());

// Middleware can be reused and re-prioritized.
const query = new QueryMiddleware();
query.priority(90, 'request');
const base: Middleware = query;

const streams: Streams = client.streams;
const entries: Entries = client.entries;

async function exercise(): Promise<void> {
    const listResponse = await entries.get('todos');
    const todos: TodosEntry[] | undefined = listResponse.data?.data;

    const created = await entries.post('todos', { description: 'Buy milk' });
    const createdEntry: TodosEntry | undefined = created.data?.data;

    const found = await entries.find('users', 1);
    const user: UsersEntry | undefined = found.data?.data;

    const updated = await entries.patch('todos', 'entry-id', { completed: true });
    const updatedEntry: TodosEntry | undefined = updated.data?.data;

    await entries.put('todos', 'entry-id', { description: 'Renamed' });
    await entries.delete('todos', 'entry-id');

    const raw: ApiResponse = await client.request('GET', '/custom', { query: { filter: 'active' } });
    const status: number = raw.status;

    const streamId: StreamId = 'todos';
    void [todos, createdEntry, user, updatedEntry, status, streamId, streams];
}

const criteria = new Criteria()
    .where('status', 'published')
    .where('views', '>', 100)
    .orderBy('created_at', 'desc')
    .limit(10)
    .paginate(25, 1);

const compiled: string = criteria.compile();

// --- Custom endpoint registry (task 215) ---

interface GroupMember {
    id: string;
    name: string;
    role: string;
}

interface GroupMembersResponse {
    data: GroupMember[];
}

interface GroupMemberNotes {
    id: string;
    body: string;
}

// register accepts a named definition with an HTTP method and URI template.
client.register('groups.members', { method: 'get', uri: '/groups/{group}/members' });

// The registered definition is a typed EndpointDefinition.
const definition: EndpointDefinition = { method: 'get', uri: '/groups/{group}/members' };
client.register('typed.definition', definition);

const method: Method = 'get';

// register binds the response type to the endpoint name at the type level, so
// capture the client it returns and endpoint(name) infers the registered type
// without a type argument.
const registry = new Client({ baseURL: 'https://api.example.com' })
    .register<'groups.members', GroupMembersResponse>('groups.members', { method: 'get', uri: '/groups/{group}/members' })
    .register<'group.member', GroupMember>('group.member', { method: 'get', uri: '/groups/{group}/members/{member}' })
    .register<'group.member.notes', GroupMemberNotes>('group.member.notes', { method: 'post', uri: '/groups/{group}/members/{member}/notes' });

const groupMembers = registry.endpoint('groups.members');
const membersResponse = await groupMembers.call({ group: '1' }, { query: { page: 1 } });
const members: GroupMembersResponse | undefined = membersResponse.data;
const memberRows: GroupMember[] | undefined = membersResponse.data?.data;

// Verb methods return the same registered response type.
const memberResponse = await groupMembers.get({ group: '1' });
const memberList: GroupMembersResponse | undefined = memberResponse.data;

const member = registry.endpoint('group.member');
const found = await member.call({ group: '1', member: 'a1' });
const foundMember: GroupMember | undefined = found.data;

const notes = registry.endpoint('group.member.notes');
const created = await notes.post({ group: '1', member: 'a1' }, { data: { body: 'Hello' } });
const createdNote: GroupMemberNotes | undefined = created.data;

// Prove the inferred types are exact, not merely assignable.
type Equal<A, B> = (<T>() => T extends A ? 1 : 2) extends (<T>() => T extends B ? 1 : 2) ? true : false;
type Expect<T extends true> = T;

type _groupsMembersInferred = Expect<Equal<typeof groupMembers, Endpoint<GroupMembersResponse>>>;
type _groupMemberInferred = Expect<Equal<typeof member, Endpoint<GroupMember>>>;
type _groupMemberNotesInferred = Expect<Equal<typeof notes, Endpoint<GroupMemberNotes>>>;

// A name that was never registered is untyped at compile time (the runtime throws).
const unknownEndpoint = registry.endpoint('not.registered');
type _unknownEndpointFallsBack = Expect<Equal<typeof unknownEndpoint, Endpoint<unknown>>>;

// The caller can no longer force an arbitrary response type on a registered name.
// @ts-expect-error endpoint() is not generic; the registered type is inferred.
registry.endpoint<GroupMember>('groups.members');

void [
    method,
    members,
    memberRows,
    memberList,
    foundMember,
    createdNote,
    groupMembers,
    member,
    notes,
    unknownEndpoint,
    registry,
    definition,
];

async function catchValidation(): Promise<void> {
    try {
        await client.entries.post('todos', { description: '' });
    } catch (error) {
        if (error instanceof FetchError) {
            const httpStatus: number = error.status;
            const fieldErrors: Record<string, string[]> = error.errors;
            void [httpStatus, fieldErrors];
        }
    }
}

void [client, base, entries, criteria, compiled, catchValidation, exercise];
