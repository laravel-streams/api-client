// Compile-time usage of the auth, token storage and organization exports.

import {
    Auth,
    AuthorizationMiddleware,
    Client,
    OrganizationMiddleware,
    MemoryTokenStorage,
    WebStorageTokenStorage,
    createTokenStorage,
    secureStorageAdapter,
    type TokenStorage,
} from '@laravel-streams/api-client';

const memoryStorage: TokenStorage = new MemoryTokenStorage();
const webStorage: TokenStorage = new WebStorageTokenStorage(localStorage, 'k');
const secure: TokenStorage = secureStorageAdapter({
    get: async ({ key }) => ({ value: key }),
    set: async () => undefined,
    remove: async () => undefined,
});
const picked: TokenStorage = createTokenStorage(localStorage, { key: 'k' });
const fallback: TokenStorage = createTokenStorage(null, { token: null });

const authz = new AuthorizationMiddleware({
    storage: memoryStorage,
    onUnauthorized: (error, client) => {
        void error;
        void client;
    },
});
const org = new OrganizationMiddleware({ organizationId: 7 }).setOrganization('acme');
const client = new Client({ organizationId: 'acme', middlewares: [authz, org] });
void client.get('x', { organization: false });
void client.get('x', { organization: 42, authorization: false });

const auth = new Auth(client, { authorization: authz, paths: { me: 'me' } });
void auth.requestMagicLink({ email: 'a@example.test' });
void auth.claim({ email: 'a@example.test' });
void auth.consumeMagicLink({ token: 'link' });
void auth.activate({ token: 'link' });
void auth.login({ email: 'a@example.test', password: 'x' });
void auth.me({ organization: false });
void auth.organizations();
void authz.clearToken();
void [webStorage, secure, picked, fallback];
