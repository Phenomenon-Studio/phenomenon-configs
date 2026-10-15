# Icons

This project uses `lucide-react` for all icons. Always import from `lucide-react`.

---

## Icons in Button use data-icon attribute

Add `data-icon="inline-start"` (prefix) or `data-icon="inline-end"` (suffix). No sizing classes.

**Incorrect:**

```tsx
<Button>
    <SearchIcon className="mr-2 size-4" />
    Search
</Button>
```

**Correct:**

```tsx
<Button>
    <SearchIcon data-icon="inline-start" />
    Search
</Button>

<Button>
    Next
    <ArrowRightIcon data-icon="inline-end" />
</Button>
```

---

## No sizing classes on icons inside components

Components handle icon sizing via CSS. Don't add `size-4`, `w-4 h-4`, or other sizing classes to icons inside `Button`, `DropdownMenuItem`, `Alert`, `Sidebar*`, or other shadcn components.

**Incorrect:**

```tsx
<DropdownMenuItem>
    <SettingsIcon className="mr-2 size-4" />
    Settings
</DropdownMenuItem>
```

**Correct:**

```tsx
<DropdownMenuItem>
    <SettingsIcon />
    Settings
</DropdownMenuItem>
```

---

## Pass icons as component objects, not string keys

**Incorrect:**

```tsx
const iconMap = {
    check: CheckIcon,
    alert: AlertIcon,
};

function StatusBadge({ icon }: { icon: string }) {
    const Icon = iconMap[icon];
    return <Icon />;
}

<StatusBadge icon="check" />
```

**Correct:**

```tsx
import { CheckIcon } from 'lucide-react';

function StatusBadge({ icon: Icon }: { icon: React.ComponentType }) {
    return <Icon />;
}

<StatusBadge icon={CheckIcon} />
```
