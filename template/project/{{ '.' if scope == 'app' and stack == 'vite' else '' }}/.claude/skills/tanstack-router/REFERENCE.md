# TanStack Router — Reference

## File-Based Routing Structure

```
src/routes/
├── __root.tsx                    # Root layout (providers, devtools, Outlet)
├── index.tsx                     # Home page (/)
├── _authenticated/
│   ├── route.tsx                 # Auth guard layout
│   ├── dashboard/index.tsx       # /dashboard
│   ├── merchants/index.tsx       # /merchants (permission-gated)
│   └── vouchers/index.tsx        # /vouchers (permission-gated)
├── _public/
│   ├── route.tsx                 # Public layout (works for both auth & anon)
│   └── index.tsx                 # / (home)
└── _unauthenticated/
    ├── route.tsx                 # Guest-only layout (redirects if logged in)
    └── login/index.tsx           # /login
```

### File naming conventions

| File/Pattern     | Purpose                                          |
| ---------------- | ------------------------------------------------ |
| `__root.tsx`     | Root layout — always at routes root              |
| `index.tsx`      | Exact match for parent path                      |
| `_prefix/`       | Pathless layout — no URL segment contributed     |
| `$paramName.tsx` | Dynamic path segment                             |
| `$.tsx`          | Catch-all / splat route                          |
| `(folder)/`      | Route group — organizational only, no URL        |
| `-folder/`       | Excluded from route generation (colocated files) |

---

## Route Guards & Authentication

### Auth guard (pathless layout)

Uses `getAuthToken()` as a fast synchronous gate, then `queryClient.query({ ...meQueryOptions(), staleTime: 'static' })` (cache-or-fetch) to server-validate and populate user data in route context. On success it returns a discriminated `AuthenticatedState` **and the CASL ability built from the resolved user**, both merged into context for child routes. On failure it clears tokens and redirects.

The component is a wrapper that mounts `PermsProvider` — the provider is mounted by the layout **route**, not by `MainLayout`, and is handed that route's own id as `from`.

```tsx
// src/routes/_authenticated/route.tsx
import type { AuthenticatedState } from '@/services/authExample/types';
import { createFileRoute, isRedirect, redirect } from '@tanstack/react-router';
import { createAppAbility } from '@/lib/utils/auth/perms/createAppAbility';
import { getAuthToken, removeAuthToken, removeRefreshToken } from '@/lib/utils/auth/tokens';
import { PermsProvider } from '@/context/PermsContext';
import { meQueryOptions } from '@/services/authExample/queries';
import { MainLayout } from '@/components/layouts/MainLayout';

export const Route = createFileRoute('/_authenticated')({
    async beforeLoad({ context: { queryClient }, location }) {
        const unauthRedirectOptions = {
            to: '/login',
            search: { redirect: location.href },
            replace: true,
        } as const;

        if (!getAuthToken()) {
            throw redirect(unauthRedirectOptions);
        }

        try {
            const me = await queryClient.query({ ...meQueryOptions(), staleTime: 'static' });

            return {
                auth: { isAuthenticated: true, me } satisfies AuthenticatedState,
                ability: createAppAbility(me),
            };
        } catch (error) {
            if (isRedirect(error)) {
                throw error;
            }

            removeAuthToken();
            removeRefreshToken();
            throw redirect(unauthRedirectOptions);
        }
    },
    component: RouteWrap,
});

function RouteWrap() {
    return (
        <PermsProvider from="/_authenticated">
            <MainLayout />
        </PermsProvider>
    );
}
```

### Permission check (per-route)

There is no guard helper. A restricted route reads `ability` off router context and checks it inline, throwing `notFound()` when denied. `PERM_ACTIONS` and `PERM_SUBJECTS` come from `src/lib/utils/auth/perms/constants.ts`.

```tsx
// src/routes/_authenticated/merchants/index.tsx
import { createFileRoute, notFound } from '@tanstack/react-router';
import { PERM_ACTIONS, PERM_SUBJECTS } from '@/lib/utils/auth/perms/constants';
import { usersQueryOptions } from '@/services/users/queries';
import { Merchants } from '@/modules/Merchants';

export const Route = createFileRoute('/_authenticated/merchants/')({
    beforeLoad({ context: { ability } }) {
        if (ability.cannot(PERM_ACTIONS.READ, PERM_SUBJECTS.MERCHANT)) {
            throw notFound();
        }
    },
    async loader({ context: { queryClient } }) {
        await queryClient.query({ ...usersQueryOptions(), staleTime: 'static' });
    },
    component: Merchants,
});
```

**A wrong pair still type-checks.** `ability.cannot(action, subject)` only proves that the action and the subject belong to their unions — it cannot know which resource this route serves. Gating `/vouchers` on `PERM_SUBJECTS.MERCHANT` passes `tsc`, `lint` and `build`, and fails open for every role that can read merchants. Read each pair against its own route file; nothing mechanical will catch it.

### Guest-only guard (unauthenticated layout)

```tsx
// src/routes/_unauthenticated/route.tsx
import { createFileRoute, Outlet, redirect } from '@tanstack/react-router';
import { z } from 'zod';
import { FALLBACK_REDIRECT } from '@/lib/constants';
import { getAuthToken } from '@/lib/utils/auth/tokens';

export const Route = createFileRoute('/_unauthenticated')({
    validateSearch: z.object({
        redirect: z.string().optional().catch(''),
    }),
    beforeLoad({ search }) {
        if (getAuthToken()) {
            throw redirect({
                to: search.redirect || FALLBACK_REDIRECT,
                replace: true,
            });
        }
    },
    component: RouteWrap,
});

function RouteWrap() {
    return <Outlet />;
}
```

No `PermsProvider` is mounted here, so `usePerms()` is unavailable anywhere under `/login`. Routes below still see the router's initial deny-all `ability` in context.

### Public routes (accessible by both authenticated and anonymous users)

No redirects — `beforeLoad` optionally resolves auth state. If a token exists it validates with `queryClient.query({ ...meQueryOptions(), staleTime: 'static' })` and builds the ability from the resolved user; otherwise it returns unauthenticated state with a deny-all ability. Child components can check `auth.isAuthenticated` to show different UI. This is the second layout route that builds an ability and mounts `PermsProvider`.

Every branch returns an `ability`, so the field never disappears from context on this side of the tree.

```tsx
// src/routes/_public/route.tsx
import type { AuthenticatedState, UnauthenticatedState } from '@/services/authExample/types';
import { createFileRoute, Outlet } from '@tanstack/react-router';
import { createAppAbility } from '@/lib/utils/auth/perms/createAppAbility';
import { getAuthToken } from '@/lib/utils/auth/tokens';
import { PermsProvider } from '@/context/PermsContext';
import { meQueryOptions } from '@/services/authExample/queries';

export const Route = createFileRoute('/_public')({
    async beforeLoad({ context: { queryClient } }) {
        if (!getAuthToken()) {
            return {
                auth: {
                    me: null,
                    isAuthenticated: false,
                } satisfies UnauthenticatedState,
                ability: createAppAbility(),
            };
        }

        try {
            const me = await queryClient.query({ ...meQueryOptions(), staleTime: 'static' });

            return {
                auth: { me, isAuthenticated: true } satisfies AuthenticatedState,
                ability: createAppAbility(me),
            };
        } catch {
            return {
                auth: { me: null, isAuthenticated: false } satisfies UnauthenticatedState,
                ability: createAppAbility(),
            };
        }
    },
    component: RouteWrap,
});

function RouteWrap() {
    return (
        <PermsProvider from="/_public">
            <Outlet />
        </PermsProvider>
    );
}
```

### Auth context type (discriminated union)

```tsx
// src/services/authExample/types.ts
type AuthenticatedState = { isAuthenticated: true; me: UserData };
type UnauthenticatedState = { isAuthenticated: false; me: null };
type AuthContext = AuthenticatedState | UnauthenticatedState;
```

### Ability in router context

| Where | What it does |
| --- | --- |
| `src/lib/@router.tsx` | Seeds context with `ability: createAppAbility()` — no user, so no rules, so deny-all |
| `src/routes/_authenticated/route.tsx` | Replaces it with `createAppAbility(me)`; mounts `PermsProvider from="/_authenticated"` |
| `src/routes/_public/route.tsx` | `createAppAbility(me)` when a token resolves, `createAppAbility()` when anonymous or the lookup throws; mounts `PermsProvider from="/_public"` |
| `src/routes/_unauthenticated/route.tsx` | Builds no ability and mounts no provider |

`createAppAbility(user?)` owns the role-to-rules lookup (`roleRules[user.role](user)`), so no route repeats it — pass the user, not a rules array. No user, or a `role` the API returns that has no factory, yields no rules: deny-all rather than a crash.

React consumers read the same ability through `usePerms()`, which only works under a `PermsProvider`:

```tsx
// src/context/PermsContext.tsx
import type { AppRouteId } from '@/lib/types';
import type { AppAbility } from '@/lib/utils/auth/perms/types';
import { AbilityProvider, useAbility } from '@casl/react';
import { useRouteContext } from '@tanstack/react-router';

type PermsProviderProps = {
    from: Extract<AppRouteId, '/_authenticated' | '/_public'>;
    children: React.ReactNode;
};

// NOTE: Two `@casl/react@7` API questions, both settled against the installed type declarations
// (`node_modules/@casl/react/dist/types/hooks/useAbility.d.ts`) rather than the README, which
// contradicts itself:
// 1. `AbilityProvider` takes the ability as `value` — there is no `ability` prop.
// 2. `useAbility` kept its type parameter in v7; only the context argument was dropped. So the
//    companion hook below is a real generic call, not a cast.
// The v7 major also removed the context-binding factory (`createContextualCan`), its exported prop
// type and the `ability` prop on `Can` — most published examples still show that older API.
function PermsProvider({ from, children }: PermsProviderProps) {
    const ability = useRouteContext({
        from,
        select(context) {
            return context.ability;
        },
    });

    return <AbilityProvider value={ability}>{children}</AbilityProvider>;
}

const usePerms = () => {
    const ability = useAbility<AppAbility>();

    return ability;
};

export { PermsProvider, usePerms };
```

The provider takes the route it is mounted under as a **typed** `from` prop: `Extract<AppRouteId, '/_authenticated' | '/_public'>`, where `AppRouteId` is `RouteIds<RegisteredRouter['routeTree']>` from `src/lib/types.ts`. That prop is what keeps `context.ability` non-optional — with `from`, `useRouteContext` types the context as that route's own, so the provider needs neither a narrowing throw nor a cast. Do not reach for `strict: false` here: it makes **every** context field optional, `queryClient` included, buying nothing and costing a runtime guard. A third mount point means widening the `Extract` union, and a route id that builds no ability will not type-check.

### Verifying permission gating

No test runner is configured, so the role-to-rule mapping is unverified by machine. That is an accepted risk, not an omission — the cheapest available substitute is a throwaway Node script, since the rules layer is import-clean: register a module resolver hook that maps the `@/` alias to `src/` and retries extensionless relative specifiers with a `.ts` suffix, import the real `constants.ts` and `createAppAbility.ts` (which pulls in `roleRules.ts` itself), then print a matrix of every role plus the no-user default against every action-and-subject pair the app gates on.

It reads the shipped source rather than a copy, and it confirms the **rules**. It does not confirm that each route passes the right pair — that stays a reading exercise — and the per-role browser matrix (direct navigation on a fresh load to each denied page, not just a missing sidebar item) stays manual.

### Key rules for beforeLoad

- Runs top-down: root -> parent -> child
- Throw `redirect()` to guard; throw `notFound()` for missing resources and for denied permissions
- Return an object to extend context for children — child `beforeLoad` sees merged context
- If catching errors, always re-throw redirects: `if (isRedirect(error)) throw error`
- Auth guard uses `getAuthToken()` (sync, localStorage) + `queryClient.query({ ..., staleTime: 'static' })` (async, server validation)
- `staleTime: 'static'` returns from cache instantly on subsequent navigations; fetches only on first load/refresh. Without it `query()` refetches by factory `staleTime` (default `0`) and blocks `beforeLoad` on every navigation
- Only `queryClient.query`/`queryClient.infiniteQuery` — `ensureQueryData`/`fetchQuery`/`prefetchQuery` are deprecated (see `tanstack-query` skill § Imperative QueryClient API)
- Permission checks read `context.ability`; the ability itself is built by the two layout routes that resolve a user

---

## Search Params

### Define with Zod — always use `.catch()` for resilience

```tsx
import { createFileRoute } from '@tanstack/react-router';
import { z } from 'zod';

const searchSchema = z.object({
    page: z.number().int().positive().catch(1),
    sort: z.enum(['asc', 'desc']).catch('desc'),
    query: z.string().optional(),
});

export const Route = createFileRoute('/_authenticated/posts/')({
    validateSearch: searchSchema,
});
```

**Why `.catch()` over `.default()`**: `.catch()` recovers from malformed URL params silently; `.default()` only fills missing values but throws on invalid ones.

### Access in components

```tsx
// Option 1: Route hook (inside route component)
const { page, sort } = Route.useSearch();

// Option 2: getRouteApi (in child components — avoids circular imports)
const routeApi = getRouteApi('/_authenticated/posts/');
const search = routeApi.useSearch();
```

### Navigate with search params

```tsx
// Set specific values
<Link to="/posts" search={{ page: 2, sort: 'asc' }} />

// Functional updater — preserves other params
<Link to="." search={(prev) => {
    return { ...prev, page: prev.page + 1 };
}} />

// Programmatic
const navigate = useNavigate();
navigate({ search: (prev) => {
    return { ...prev, page: 2 };
} });
```

### Search params as loader deps

Never access search params directly in loaders. Use `loaderDeps`:

```tsx
export const Route = createFileRoute('/_authenticated/posts/')({
    validateSearch: searchSchema,
    loaderDeps: ({ search: { page } }) => {
        return { page };
    },
    loader: ({ deps: { page }, context: { queryClient } }) => {
        return queryClient.query({ ...postsQueryOptions(page), staleTime: 'static' });
    },
});
```

Only include deps you actually use — extra deps cause unnecessary cache invalidations.

---

## TanStack Query Integration

### Router context setup

Router context includes `queryClient`, `auth` (discriminated union) and `ability` (CASL). The router is created in `src/lib/@router.tsx`:

```tsx
// src/lib/@router.tsx
import type { QueryClient } from '@tanstack/react-query';
import type { AppAbility } from '@/lib/utils/auth/perms/types';
import type { AuthContext } from '@/services/authExample/types';
import { createAppAbility } from '@/lib/utils/auth/perms/createAppAbility';

type RouterContext = { queryClient: QueryClient; auth: AuthContext; ability: AppAbility };

const router = createRouter({
    routeTree,
    context: {
        queryClient,
        auth: { isAuthenticated: false, me: null },
        ability: createAppAbility(),
    },
    defaultPreload: 'intent',
    defaultPreloadStaleTime: 0,
    // ...
});
```

```tsx
// src/routes/__root.tsx
import type { RouterContext } from '@/lib/@router';

export const Route = createRootRouteWithContext<RouterContext>()({
    component() {
        return <Outlet />;
    },
});
```

The `_authenticated/route.tsx` `beforeLoad` returns `{ auth: { isAuthenticated: true, me }, ability: createAppAbility(me) }` which merges into context for all child routes. Child `beforeLoad` and components can access `context.auth.me` with the user guaranteed to be non-null, and `context.ability` with the user's rules already applied.

### Blocking data (guaranteed before render)

`staleTime: 'static'` = cache-or-fetch (old `ensureQueryData`): instant on repeat navigations and hover preloads; the `useSuspenseQuery` observer background-refetches stale data after render.

```tsx
// In module — data is guaranteed, use Suspense query
import { useSuspenseQuery } from '@tanstack/react-query';
import { createFileRoute } from '@tanstack/react-router';
import { postsQueryOptions } from '@/services/posts/queries';
import { Posts } from '@/modules/Posts';

export const Route = createFileRoute('/_authenticated/posts/')({
    loader: ({ context: { queryClient } }) => {
        return queryClient.query({ ...postsQueryOptions(), staleTime: 'static' });
    },
    component: Posts,
});

function Posts() {
    const { data } = useSuspenseQuery(postsQueryOptions());

    return <PostsList posts={data} />;
}
```

### Non-blocking data (fire-and-forget, show loading in component)

`query()` rejects on error — always `.catch(noop)`.

```tsx
// In module
import { useQuery } from '@tanstack/react-query';
import { createFileRoute } from '@tanstack/react-router';
import { noop } from '@/lib/utils/noop';
import { statsQueryOptions } from '@/services/dashboard/queries';
import { Dashboard } from '@/modules/Dashboard';

export const Route = createFileRoute('/_authenticated/dashboard/')({
    loader: ({ context: { queryClient } }) => {
        queryClient.query(statsQueryOptions()).catch(noop); // fire and forget
    },
    component: Dashboard,
});

function Dashboard() {
    const { data, isLoading } = useQuery(statsQueryOptions());

    if (isLoading) {
        return <Skeleton />;
    }

    return <Stats data={data} />;
}
```

### Mixed — fast critical + deferred slow

```tsx
async loader({ context: { queryClient } }) {
    // Block navigation until user data loads
    await queryClient.query({ ...userQueryOptions(), staleTime: 'static' });
    // Start loading recommendations without blocking
    queryClient.query(recommendationsQueryOptions()).catch(noop);
},
```

### Post-mutation cache update

```tsx
// src/services/authExample/queries.ts pattern
export const loginMutationOptions = () => {
    return mutationOptions({
        mutationKey: authExampleKeys.loginMutationOptionsKey(),
        mutationFn: login,
        onSuccess(data, _variables, _onMutateResult, { client }) {
            setAuthToken(data.accessToken);
            setRefreshToken(data.refreshToken);
            // staleTime: 0 forces a fresh identity — a prior user's `me` can survive token expiry (no client.clear())
            return client.query({ ...meQueryOptions(), staleTime: 0 });
        },
    });
};

export const logoutMutationOptions = () => {
    return mutationOptions({
        mutationFn: logout,
        onSuccess(_data, _variables, _onMutateResult, { client }) {
            removeAuthToken();
            removeRefreshToken();
            client.clear();
            router.invalidate(); // re-runs all beforeLoad guards
        },
    });
};
```

---

## Navigation Patterns

### Link component

```tsx
import { Link } from '@tanstack/react-router';

<Link
    to="/dashboard"
    activeOptions={{ exact: true }}
    activeProps={{ className: 'bg-sidebar-accent text-sidebar-accent-foreground' }}
>
    Dashboard
</Link>;
```

**Type-safe relative links** — use `from` to enable type narrowing:

```tsx
<Link from="/posts" to="./$postId" params={{ postId }} />
```

### Programmatic navigation

```tsx
import { getRouteApi, useNavigate, useRouter } from '@tanstack/react-router';

// From route API (type-safe to that route's search/params)
const routeApi = getRouteApi('/_unauthenticated/login/');
const navigate = routeApi.useNavigate();
navigate({ to: search.redirect || '/dashboard', replace: true });

// Generic
const navigate = useNavigate();
navigate({ to: '/login', ignoreBlocker: true }); // bypass form dirty guards
```

### Router invalidation (retry after error)

```tsx
const router = useRouter();
router.invalidate(); // re-runs loaders, re-renders
```

---

## Not-Found Handling

### Global default

```tsx
import { NotFound } from '@/components/NotFound';

const router = createRouter({
    defaultNotFoundComponent: NotFound,
});
```

### Manual not-found in loaders

```tsx
import { createFileRoute, notFound } from '@tanstack/react-router';

export const Route = createFileRoute('/_authenticated/posts/$postId')({
    async loader({ params }) {
        const post = await fetchPost(params.postId);
        if (!post) {
            throw notFound();
        }
        return post;
    },
    notFoundComponent() {
        return <p>Post not found</p>;
    },
});
```

### Permission-based not-found

```tsx
// src/routes/_authenticated/vouchers/index.tsx
beforeLoad({ context: { ability } }) {
    if (ability.cannot(PERM_ACTIONS.READ, PERM_SUBJECTS.VOUCHER)) {
        throw notFound();
    }
},
```

**Note:** Leaf routes (no children) cannot render their own `notFoundComponent` since they have no `<Outlet>`. Place it on a parent layout instead, or use the global default.

---

## Router Configuration

**File:** `src/lib/@router.tsx`

```tsx
import type { QueryClient } from '@tanstack/react-query';
import type { AppAbility } from '@/lib/utils/auth/perms/types';
import type { AuthContext } from '@/services/authExample/types';

type RouterContext = { queryClient: QueryClient; auth: AuthContext; ability: AppAbility };

const router = createRouter({
    routeTree,
    context: {
        queryClient,
        auth: { isAuthenticated: false, me: null },
        ability: createAppAbility(), // no rules = deny-all until a layout route rebuilds it
    },
    defaultPreload: 'intent', // prefetch on hover/focus
    defaultPreloadStaleTime: 0, // always refetch on preload
    scrollRestoration: true, // restore scroll on back/forward
    defaultPendingMs: 100, // show pending UI after 100ms
    defaultPendingMinMs: 500, // keep pending UI for at least 500ms
    defaultNotFoundComponent: NotFound,
    defaultErrorComponent: ErrorComponent,
    defaultPendingComponent() {
        return <Loader className="size-16 m-auto" />;
    },
});
```

**App entry (`src/App.tsx`):**

```tsx
function App() {
    return (
        <QueryClientProvider client={queryClient}>
            <ThemeProvider>
                <RouterProvider router={router} />
            </ThemeProvider>
        </QueryClientProvider>
    );
}
```

---

## Code Splitting

Handled automatically by `@tanstack/router-plugin/vite` with `autoCodeSplitting: true`.

**What gets split** (non-critical): `component`, `pendingComponent`, `errorComponent`, `notFoundComponent`

**What stays in main bundle** (critical): `validateSearch`, `loader`, `beforeLoad`, `loaderDeps`, `context`

No manual `lazyRouteComponent` or `.lazy()` calls are needed in this repo.

For non-route lazy loading (e.g., devtools), use standard React `lazy()`:

```tsx
import { lazy } from 'react';
import { noopReturnNull } from '@/lib/utils/noopReturnNull';

const TanStackRouterDevtools = import.meta.env.DEV
    ? lazy(async () => {
          const res = await import('@tanstack/react-router-devtools');
          return {
              default: res.TanStackRouterDevtools,
          };
      })
    : noopReturnNull;
```
