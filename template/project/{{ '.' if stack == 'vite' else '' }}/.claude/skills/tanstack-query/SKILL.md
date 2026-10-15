---
name: tanstack-query
description: TanStack Query patterns for this repo — queryOptions/mutationOptions factories, query key hierarchies, service layer integration, optimistic updates, Suspense usage, error handling, and TanStack Router data loading. Use when creating queries, mutations, API services, query keys, cache invalidation, optimistic updates, or integrating data fetching with routes.
user-invocable: false
---

# TanStack Query

## Quick start

This repo uses **TanStack Query v5** with strict ESLint rules (`flat/recommended-strict`). Data fetching is organized per service domain in `src/services/<domain>/`.

### Adding a new query

1. Create or extend `src/services/<domain>/queryKeys.ts` — hierarchical key factory
2. Create or extend `src/services/<domain>/queries.ts` — `queryOptions`/`mutationOptions` factories
3. Create or extend `src/services/<domain>/api.ts` — typed API functions using `http`/`httpPrivate`
4. Consume in components via `useSuspenseQuery` (default) — fall back to `useQuery` only when `enabled` is needed; if you need to keep previous data during key changes, use `startTransition` (see [REFERENCE.md](REFERENCE.md) § Suspense-First Approach)

```tsx
// queries.ts
import { queryOptions } from '@tanstack/react-query';
import { fetchPosts } from './api';
import { postsKeys } from './queryKeys';

export const postsListQueryOptions = (filters?: PostFilters) => {
    return queryOptions({
        queryKey: postsKeys.listQueryKey(filters),
        queryFn: () => fetchPosts(filters),
    });
};
```

## Workflows

### Adding a new service domain

- [ ] Create `src/services/<domain>/types.ts` — request/response types
- [ ] Create `src/services/<domain>/api.ts` — API functions
- [ ] Create `src/services/<domain>/queryKeys.ts` — key factory
- [ ] Create `src/services/<domain>/queries.ts` — query/mutation options
- [ ] Wire into route loader or component

### Adding a mutation with cache invalidation

- [ ] Add mutation key to `queryKeys.ts` (if needed for optimistic updates)
- [ ] Create `mutationOptions()` factory in `queries.ts`
- [ ] Handle `onSuccess` — invalidate or update related queries via `{ client }` context arg
- [ ] Consume with `useMutation` in component

### Adding optimistic updates

- [ ] Use `useOptimisticMutation` hook from `src/hooks/useOptimisticMutation.ts`
- [ ] Provide `queryKey`, `updater`, and `invalidates` array
- [ ] See [REFERENCE.md](REFERENCE.md) § Optimistic Updates

## Key conventions

| Pattern | This repo's approach |
|---|---|
| Query options | Always use `queryOptions()`/`mutationOptions()` factories — never inline config |
| Query keys | Hierarchical factory per domain with `as const`; methods, not plain properties |
| API functions | Typed wrappers around `http`/`httpPrivate` (ky) in `api.ts` |
| Imperative fetch | Only `queryClient.query()`/`queryClient.infiniteQuery()`. Loaders/`beforeLoad`: spread `staleTime: 'static'` (cache-or-fetch). Fire-and-forget: `.catch(noop)` — `query()` rejects. `ensureQueryData`/`fetchQuery`/`prefetchQuery`/`fetchInfiniteQuery`/`prefetchInfiniteQuery`/`ensureInfiniteQueryData` are deprecated (removed in v6) |
| Query hooks | **Suspense-first**: prefer `useSuspenseQuery`/`useSuspenseQueries`/`useSuspenseInfiniteQuery`; only fall back to `useQuery`/`useQueries` when `enabled` is required |
| Error handling | Global `QueryCache.onError` for toasts; `throwOnError: true` for boundaries |
| Error type | Registered globally as `HTTPError<BaseErrorData>` |
| Data transforms | Use `select` option, not inline transforms in `queryFn` |
| Mutations context | Access `client` (QueryClient) via 4th arg in callbacks: `onSuccess(data, vars, onMutateResult, { client })` |
| Import order | Follow Prettier import sorting — types first, then `@tanstack`, then local |

## Advanced features

See [REFERENCE.md](REFERENCE.md) for detailed patterns:

- Service layer architecture (api, queryKeys, queries)
- Query key factory design
- QueryClient configuration and error registration
- Optimistic mutations (useOptimisticMutation hook)
- Imperative QueryClient API (`query`/`infiniteQuery`, `staleTime: 'static'`, deprecated → replacement table)
- TanStack Router integration (loaders, prefetching, loaderDeps)
- Error handling strategies
- Dependent and parallel queries
- Infinite queries
- Data transformations with `select`
- Cache invalidation strategies
