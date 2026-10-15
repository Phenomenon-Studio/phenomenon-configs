# Data Loading with shadcn Components

Patterns for integrating TanStack Query (Suspense-first) with shadcn/ui components in this repo.

## Contents

- Suspense + Skeleton for loading states
- Mutation loading with Button isLoading
- Empty states with query data
- Error handling with toast
- Form submission with TanStack Form + mutations

---

## Suspense + Skeleton for loading states

Components using `useSuspenseQuery` never check `isPending` -- Suspense handles it. Create a matching Skeleton fallback and wrap with `<Suspense>`.

```tsx
import { Suspense } from 'react';

import { useSuspenseQuery } from '@tanstack/react-query';

import { Skeleton } from '@/components/ui/Skeleton';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/Avatar';

// Fallback matches the layout of the real component
function UserCardFallback() {
    return (
        <div className="flex items-center gap-3">
            <Skeleton className="size-10 rounded-full" />
            <div className="flex flex-col gap-1.5">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-3 w-32" />
            </div>
        </div>
    );
}

// Data component -- no loading checks needed
function UserCard() {
    const { data: user } = useSuspenseQuery(userQueryOptions());

    return (
        <div className="flex items-center gap-3">
            <Avatar>
                <AvatarImage src={user.avatar} />
                <AvatarFallback>{user.initials}</AvatarFallback>
            </Avatar>
            <div>{user.name}</div>
        </div>
    );
}

// Parent wraps with Suspense boundary
function UserSection() {
    return (
        <Suspense fallback={<UserCardFallback />}>
            <UserCard />
        </Suspense>
    );
}
```

**Key rules:**

- Skeleton fallback should mirror the real component's layout dimensions
- Place `<Suspense>` boundaries at meaningful UI sections, not around every component
- Multiple `useSuspenseQuery` calls in one component cause sequential waterfalls -- use `useSuspenseQueries` for parallel fetching

---

## Mutation loading with Button isLoading

This project's `Button` has an `isLoading` prop that shows a `Loader` and disables the button.

```tsx
import { useMutation } from '@tanstack/react-query';

import { Button } from '@/components/ui/Button';

function DeleteButton({ id }: { id: string }) {
    const { mutate: deleteItem, isPending } = useMutation(deleteItemMutationOptions());

    return (
        <Button
            variant="destructive"
            isLoading={isPending}
            onClick={() => {
                deleteItem(id);
            }}
        >
            Delete
        </Button>
    );
}
```

For form submission, use `form.Subscribe` to access `isSubmitting`:

```tsx
<form.Subscribe selector={(state) => [state.canSubmit, state.isSubmitting]}>
    {([canSubmit, isSubmitting]) => {
        return (
            <Button type="submit" disabled={!canSubmit} isLoading={isSubmitting}>
                Save
            </Button>
        );
    }}
</form.Subscribe>
```

---

## Empty states with query data

After data loads via Suspense, check for empty results and use the `Empty` component:

```tsx
import { useSuspenseQuery } from '@tanstack/react-query';

import { Button } from '@/components/ui/Button';
import { Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyTitle } from '@/components/ui/Empty';

function ItemsList() {
    const { data: items } = useSuspenseQuery(itemsListQueryOptions());

    if (items.length === 0) {
        return (
            <Empty>
                <EmptyHeader>
                    <EmptyTitle>No items found</EmptyTitle>
                    <EmptyDescription>Create your first item to get started.</EmptyDescription>
                </EmptyHeader>
                <EmptyContent>
                    <Button>Create Item</Button>
                </EmptyContent>
            </Empty>
        );
    }

    return <div>{/* render items */}</div>;
}
```

---

## Error handling with toast

Global error toasts are handled by `QueryCache.onError` in `src/lib/@queryClient.ts` -- no per-component setup needed for background refetch failures.

For mutation-specific error feedback:

```tsx
import { toast } from '@/components/ui/Toast';

const { mutateAsync } = useMutation(updateMutationOptions());

await mutateAsync(
    { json: data },
    {
        onSuccess() {
            toast.add({ type: 'success', title: 'Changes saved.' });
        },
        onError(error) {
            toast.add({ type: 'error', title: error.message });
        },
    },
);
```

For form-level errors from API responses, map them to field errors:

```tsx
async onSubmit({ value, formApi }) {
    await mutateAsync(
        { json: value },
        {
            async onError(error) {
                const errorData = await error.response.json();

                formApi.setErrorMap({
                    onSubmit: {
                        fields: {
                            email: { message: errorData.message },
                        },
                    },
                });
            },
        },
    );
},
```

---

## Key patterns summary

| State | shadcn component | TanStack integration |
|---|---|---|
| Loading (query) | `Skeleton` inside `<Suspense>` | `useSuspenseQuery` |
| Loading (mutation) | `Button isLoading` | `useMutation` + `isPending` |
| Loading (form submit) | `Button isLoading` | `form.Subscribe` + `isSubmitting` |
| Empty data | `Empty` + sub-components | Check `data.length` after Suspense |
| Error (background) | `toast.error` | Global `QueryCache.onError` |
| Error (mutation) | `toast.error` or field errors | `onError` callback |
| Error (boundary) | `ErrorComponent` | `useQueryErrorResetBoundary` |
