# Component Composition

## Contents

- Items always inside their Group component
- Callouts use Alert
- Empty states use Empty component
- Toast notifications use `toast` manager from `@/components/ui/Toast`
- Choosing between overlay components
- Dialog, Sheet, and Drawer always need a Title
- Card structure
- Button isLoading for pending states
- TabsTrigger must be inside TabsList
- Avatar always needs AvatarFallback
- Suspense + Skeleton for loading placeholders
- Use existing components, not custom markup

---

## Items always inside their Group component

Never render items directly inside the content container.

**Incorrect:**

```tsx
<SelectContent>
    <SelectItem value="apple">Apple</SelectItem>
    <SelectItem value="banana">Banana</SelectItem>
</SelectContent>
```

**Correct:**

```tsx
<SelectContent>
    <SelectGroup>
        <SelectItem value="apple">Apple</SelectItem>
        <SelectItem value="banana">Banana</SelectItem>
    </SelectGroup>
</SelectContent>
```

This applies to all group-based components:

| Item | Group |
|------|-------|
| `SelectItem`, `SelectLabel` | `SelectGroup` |
| `DropdownMenuItem`, `DropdownMenuLabel`, `DropdownMenuSub` | `DropdownMenuGroup` |
| `MenubarItem` | `MenubarGroup` |
| `ContextMenuItem` | `ContextMenuGroup` |
| `CommandItem` | `CommandGroup` |

---

## Callouts use Alert

```tsx
<Alert>
    <AlertTitle>Warning</AlertTitle>
    <AlertDescription>Something needs attention.</AlertDescription>
</Alert>
```

---

## Empty states use Empty component

```tsx
<Empty>
    <EmptyHeader>
        <EmptyMedia variant="icon"><FolderIcon /></EmptyMedia>
        <EmptyTitle>No projects yet</EmptyTitle>
        <EmptyDescription>Get started by creating a new project.</EmptyDescription>
    </EmptyHeader>
    <EmptyContent>
        <Button>Create Project</Button>
    </EmptyContent>
</Empty>
```

---

## Toast notifications use `toast` manager from `@/components/ui/Toast`

Base UI toast (`@base-ui/react/toast`). `toast` is a global `createToastManager()` instance — works outside React (e.g. `QueryCache.onError`). `<Toaster />` mounted once in `src/routes/__root.tsx`. Types: `success | info | warning | error | loading` (drive icon + `data-type`).

```tsx
import { toast } from '@/components/ui/Toast';

toast.add({ type: 'success', title: 'Changes saved.' });
toast.add({ type: 'error', title: 'Something went wrong.', description: error.message });
const id = toast.add({
    title: 'File deleted.',
    actionProps: {
        children: 'Undo',
        onClick() {
            undoDelete();
            toast.close(id);
        },
    },
});
toast.promise(saveAsync(), { loading: 'Saving…', success: 'Saved.', error: 'Failed to save.' });
```

---

## Choosing between overlay components

| Use case | Component |
|----------|-----------|
| Focused task that requires input | `Dialog` |
| Destructive action confirmation | `AlertDialog` |
| Side panel with details or filters | `Sheet` |
| Mobile-first bottom panel | `Drawer` |
| Quick info on hover | `HoverCard` |
| Small contextual content on click | `Popover` |

---

## Dialog, Sheet, and Drawer always need a Title

Required for accessibility. Use `className="sr-only"` if visually hidden.

```tsx
<DialogContent>
    <DialogHeader>
        <DialogTitle>Edit Profile</DialogTitle>
        <DialogDescription>Update your profile.</DialogDescription>
    </DialogHeader>
    {/* content */}
</DialogContent>
```

---

## Card structure

Use full composition -- don't dump everything into `CardContent`:

```tsx
<Card>
    <CardHeader>
        <CardTitle>Team Members</CardTitle>
        <CardDescription>Manage your team.</CardDescription>
    </CardHeader>
    <CardContent>{/* ... */}</CardContent>
    <CardFooter>
        <Button>Invite</Button>
    </CardFooter>
</Card>
```

---

## Button isLoading for pending states

This project's `Button` has an `isLoading` prop that shows a `Loader` spinner and disables the button automatically.

**For mutations:**

```tsx
const { mutate, isPending } = useMutation(saveMutationOptions());

<Button isLoading={isPending}>Save</Button>
```

**For form submission (via TanStack Form Subscribe):**

```tsx
<form.Subscribe selector={(state) => [state.canSubmit, state.isSubmitting]}>
    {([canSubmit, isSubmitting]) => {
        return (
            <Button type="submit" disabled={!canSubmit} isLoading={isSubmitting}>
                Submit
            </Button>
        );
    }}
</form.Subscribe>
```

---

## TabsTrigger must be inside TabsList

Never render `TabsTrigger` directly inside `Tabs`:

```tsx
<Tabs defaultValue="account">
    <TabsList>
        <TabsTrigger value="account">Account</TabsTrigger>
        <TabsTrigger value="password">Password</TabsTrigger>
    </TabsList>
    <TabsContent value="account">{/* ... */}</TabsContent>
</Tabs>
```

---

## Avatar always needs AvatarFallback

```tsx
<Avatar>
    <AvatarImage src="/avatar.png" alt="User" />
    <AvatarFallback>JD</AvatarFallback>
</Avatar>
```

---

## Suspense + Skeleton for loading placeholders

Use `<Suspense>` boundaries with `Skeleton` fallbacks for data-loading components. See [data-loading.md](../data-loading.md) for full patterns.

```tsx
function ProfileFallback() {
    return (
        <div className="flex items-center gap-3">
            <Skeleton className="size-10 rounded-full" />
            <Skeleton className="h-4 w-24" />
        </div>
    );
}

<Suspense fallback={<ProfileFallback />}>
    <Profile />
</Suspense>
```

Don't use custom `animate-pulse` divs -- use `Skeleton`.

---

## Use existing components instead of custom markup

| Instead of | Use |
|---|---|
| `<hr>` or `<div className="border-t">` | `<Separator />` |
| `<div className="animate-pulse">` with styled divs | `<Skeleton className="h-4 w-3/4" />` |
| `<span className="rounded-full bg-green-100 ...">` | `<Badge variant="secondary">` |
