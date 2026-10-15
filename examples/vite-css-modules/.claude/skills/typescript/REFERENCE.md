# TypeScript Advanced Patterns Reference

Detailed patterns and examples for advanced TypeScript usage in this repo.

## Repo Utility Types

The project defines reusable utility types in `src/lib/types.ts`:

```ts
// Extract keys/values from objects
type ObjKeys<TObj> = keyof TObj;
type ObjValues<TObj> = TObj[ObjKeys<TObj>];

// Generic filter record for query parameters
type Filters = Record<string, string | number | boolean>;

// Every route id the generated route tree knows about
type AppRouteId = RouteIds<RegisteredRouter['routeTree']>;
```

Use `ObjValues` to extract literal union types from `as const` objects:

```ts
export const ROLES_IDS = { admin: 'admin', moderator: 'moderator', user: 'user' } as const;
export type AuthRole = ObjValues<typeof ROLES_IDS>; // 'moderator' | 'admin' | 'user'
```

The permissions layer is built the same way — `Actions` and `SubjectName` in `src/lib/utils/auth/perms/types.ts` are `ObjValues<typeof PERM_ACTIONS>` and `ObjValues<typeof PERM_SUBJECTS>`.

Narrow a library-derived union with `Extract` rather than re-declaring its members. `PermsProvider` accepts only the two layout routes that build an ability:

```ts
type PermsProviderProps = {
    from: Extract<AppRouteId, '/_authenticated' | '/_public'>;
    children: React.ReactNode;
};
```

A route id that no longer exists in the route tree becomes a compile error, so the prop cannot drift from the routes.

## Generics

### Basic Constraints

```ts
export const checkEnv = <T extends ZodRawShape>(
    envSchema: ZodObject<T>,
    buildEnv: Record<string, string | undefined> = import.meta.env,
) => { /* ... */ };
```

### Default Type Parameters

```ts
export type BaseErrorData<TData = unknown> = { message: string } & TData;
```

### Multiple Type Parameters (Mutations)

```ts
const useOptimisticMutation = <
    TData = unknown,
    TVariables = void,
    TContext = unknown,
    TError = DefaultError,
>(options: /* ... */) => { /* ... */ };
```

Keep generic parameter names short and conventional: `T`, `TData`, `TError`, `TVariables`, `TContext`.

## Conditional Types

### Distributive Conditionals

```ts
type IsString<T> = T extends string ? true : false;
```

### `infer` Keyword

```ts
// Extract array element type
type ElementType<T> = T extends (infer U)[] ? U : never;

// Extract promise value
type Awaited<T> = T extends Promise<infer U> ? U : never;

// Extract function return
type ReturnOf<T> = T extends (...args: any[]) => infer R ? R : never;
```

## Mapped Types

### Key Remapping

```ts
type Getters<T> = {
    [K in keyof T as `get${Capitalize<string & K>}`]: () => T[K];
};
```

### Property Filtering

```ts
type PickByType<T, U> = {
    [K in keyof T as T[K] extends U ? K : never]: T[K];
};
```

### Deep Transformations

```ts
type DeepReadonly<T> = {
    readonly [P in keyof T]: T[P] extends object
        ? T[P] extends Function
            ? T[P]
            : DeepReadonly<T[P]>
        : T[P];
};

type DeepPartial<T> = {
    [P in keyof T]?: T[P] extends object
        ? T[P] extends Array<infer U>
            ? Array<DeepPartial<U>>
            : DeepPartial<T[P]>
        : T[P];
};
```

## Template Literal Types

```ts
type EventName = 'click' | 'focus' | 'blur';
type EventHandler = `on${Capitalize<EventName>}`; // 'onClick' | 'onFocus' | 'onBlur'
```

## Discriminated Unions

Use a shared literal property as discriminant for exhaustive type narrowing:

```ts
type AsyncState<T> =
    | { status: 'loading' }
    | { status: 'error'; error: string }
    | { status: 'success'; data: T };

function handle<T>(state: AsyncState<T>) {
    switch (state.status) {
        case 'success':
            return state.data; // T — narrowed
        case 'error':
            return state.error; // string — narrowed
        case 'loading':
            return null;
    }
}
```

## Type Guards & Assertion Functions

### Custom Type Guards

```ts
function isString(value: unknown): value is string {
    return typeof value === 'string';
}
```

### `instanceof` Guards (used in error handling)

```ts
if (error instanceof HTTPError) {
    const data = await error.response.json();
    // error is HTTPError — narrowed
} else if (error instanceof Error) {
    toast.error(error.message);
}
```

### Assertion Functions

```ts
function assertDefined<T>(value: T | null | undefined, msg?: string): asserts value is T {
    if (value == null) {
        throw new Error(msg ?? 'Expected value to be defined');
    }
}
```

## Declaration Merging

Use `interface` (not `type`) exclusively for module augmentation / declaration merging:

```ts
// TanStack Router registration
declare module '@tanstack/react-router' {
    interface Register {
        router: typeof router;
    }
}

// TanStack Query default error
declare module '@tanstack/react-query' {
    interface Register {
        defaultError: HTTPError<BaseErrorData>;
    }
}
```

## Context Typing Pattern

```ts
type ThemeProviderState = {
    theme: Theme;
    setTheme: (theme: Theme) => void;
};

const ThemeProviderContext = createContext<ThemeProviderState>({} as ThemeProviderState);
```

The `{} as Type` assertion is acceptable for React context defaults that are always provided via a parent `<Provider>` — pair with a `useSafeContext` hook that throws if context is missing.

A provider whose value comes from router context needs neither (see `src/context/PermsContext.tsx`): a typed `from` makes `useRouteContext` return the field non-optional, so there is nothing to assert and nothing to guard.

## `satisfies` Operator

Use `satisfies` to validate a value matches a type without widening the inferred type:

```ts
const ROUTES = {
    home: '/',
    dashboard: '/dashboard',
    settings: '/settings',
} as const satisfies Record<string, string>;
// Type is still the narrow literal union, but validated against Record<string, string>
```

## Performance Guidelines

- Avoid deeply nested conditional types (>3 levels) — they slow the compiler
- Prefer simple mapped types over recursive ones when possible
- Use `as const` over manual literal types for constant objects
- Limit generic type parameter count to what is necessary (ideally ≤ 4)
- Avoid complex type computations in hot paths (frequently imported types)

## Common Pitfalls

1. **Using `any` to silence errors** — use `unknown` and narrow instead
2. **Forgetting `as const`** — values widen to `string` instead of staying literal
3. **Over-engineering generics** — if a type is hard to read, simplify it
4. **Missing `import type`** — `verbatimModuleSyntax` will error; always use type-only imports
5. **Using `enum`** — `erasableSyntaxOnly` forbids it; use `as const` objects
6. **Circular type references** — restructure to break the cycle
7. **Ignoring `strictNullChecks`** — handle `null`/`undefined` at every boundary
