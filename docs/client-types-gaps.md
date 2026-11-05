# Groups App gaps vs these types (task 104 cross-check)

Maps each GroupVitals Groups App client gap listed in task 104 (and the
Oct 2026 Groups App client findings, artifact 159) to how this change
addresses it: a shipped type, a follow-up task, or out of scope. This is the
same mapping the PR description carries; the committed draft lives in
[`../PR_DESCRIPTION.md`](../PR_DESCRIPTION.md).

| Gap (task 104 / artifact 159) | Disposition |
|-------------------------------|-------------|
| Typed entry calls (`entries.get('posts')` etc.) | **Shipped type.** `StreamId`, `StreamEntryMap`, and the generated `*Entry` interfaces type every `Entries` method per stream id, so a typo like `entries.get('todo')` or a wrong payload field fails to compile. |
| The `X-Organization-ID` header | **Follow-up task 708.** The client needs an organization middleware (an `OrganizationMiddleware` exists on `ops/run-137-a306`, not merged to master; follow-up filed as task 708). Types alone cannot add a header. |
| Auth steps (token storage, 401 hook, magic-link helpers) | **Follow-up task 709.** Needs client helpers (`Auth.js`, `TokenStorage.js`), also on `ops/run-137-a306`; follow-up filed as task 709. Types alone cannot add runtime auth behavior. |
| Non-entry API calls (bespoke routes the app calls directly instead of `streams`/`entries`) | **Out of scope here.** Covered by the endpoint registry task #215, which is explicitly out of scope for the types task. |

Entry types do not replace adding client methods or middleware for
organization context and authentication; those remain follow-up client work
(tasks 708 and 709).
