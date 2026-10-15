# Base UI APIs

This project uses `base` (@base-ui/react) primitives. These API patterns differ from Radix.

## Contents

- Composition: render (not asChild)
- Button / trigger as non-button element
- Select (items prop, placeholder, positioning, multiple, object values)
- ToggleGroup (multiple, not type)
- Slider (scalar, not array)
- Accordion (no type, array defaultValue)

---

## Composition: render (not asChild)

Base UI uses `render` prop to replace the default element. Never use `asChild`.

**Incorrect:**

```tsx
<DialogTrigger asChild>
    <Button>Open</Button>
</DialogTrigger>
```

**Correct:**

```tsx
<DialogTrigger render={<Button />}>Open</DialogTrigger>
```

Applies to: `DialogTrigger`, `SheetTrigger`, `AlertDialogTrigger`, `DropdownMenuTrigger`, `PopoverTrigger`, `TooltipTrigger`, `CollapsibleTrigger`, `DialogClose`, `SheetClose`, `NavigationMenuLink`, `BreadcrumbLink`, `SidebarMenuButton`, `Badge`, `Item`.

---

## Button / trigger as non-button element

When `render` changes to a non-button (`<a>`, `<span>`), add `nativeButton={false}`.

**Incorrect:**

```tsx
<Button render={<a href="/docs" />}>Read the docs</Button>
```

**Correct:**

```tsx
<Button render={<a href="/docs" />} nativeButton={false}>
    Read the docs
</Button>
```

Same for triggers:

```tsx
<PopoverTrigger render={<InputGroupAddon />} nativeButton={false}>
    Pick date
</PopoverTrigger>
```

---

## Select

**items prop required.** Base requires an `items` prop on the root:

```tsx
const items = [
    { label: 'Select a fruit', value: null },
    { label: 'Apple', value: 'apple' },
    { label: 'Banana', value: 'banana' },
];

<Select items={items}>
    <SelectTrigger>
        <SelectValue />
    </SelectTrigger>
    <SelectContent>
        <SelectGroup>
            {items.map((item) => {
                return (
                    <SelectItem key={item.value} value={item.value}>
                        {item.label}
                    </SelectItem>
                );
            })}
        </SelectGroup>
    </SelectContent>
</Select>
```

**Placeholder:** Use `{ value: null }` item (not `<SelectValue placeholder="...">`).

**Content positioning:** Use `alignItemWithTrigger` (not `position`):

```tsx
<SelectContent alignItemWithTrigger={false} side="bottom">
```

**Multiple selection:**

```tsx
<Select items={items} multiple defaultValue={[]}>
    <SelectTrigger>
        <SelectValue>
            {(value: string[]) => {
                return value.length === 0 ? 'Select fruits' : `${value.length} selected`;
            }}
        </SelectValue>
    </SelectTrigger>
    {/* ... */}
</Select>
```

**Object values:**

```tsx
<Select defaultValue={plans[0]} itemToStringValue={(plan) => plan.name}>
    <SelectTrigger>
        <SelectValue>{(value) => value.name}</SelectValue>
    </SelectTrigger>
    {/* ... */}
</Select>
```

---

## ToggleGroup

Base uses `multiple` boolean, not `type`. `defaultValue` is always an array.

**Incorrect:**

```tsx
<ToggleGroup type="single" defaultValue="daily">
```

**Correct:**

```tsx
// Single selection (no prop needed, defaultValue is array)
<ToggleGroup defaultValue={['daily']} spacing={2}>
    <ToggleGroupItem value="daily">Daily</ToggleGroupItem>
    <ToggleGroupItem value="weekly">Weekly</ToggleGroupItem>
</ToggleGroup>

// Multi-selection
<ToggleGroup multiple>
    <ToggleGroupItem value="bold">Bold</ToggleGroupItem>
    <ToggleGroupItem value="italic">Italic</ToggleGroupItem>
</ToggleGroup>
```

**Controlled single value -- wrap/unwrap arrays:**

```tsx
const [value, setValue] = useState('normal');

<ToggleGroup value={[value]} onValueChange={(v) => { setValue(v[0]); }}>
```

---

## Slider

Base accepts a plain number for single thumb (not array).

**Incorrect:**

```tsx
<Slider defaultValue={[50]} max={100} step={1} />
```

**Correct:**

```tsx
<Slider defaultValue={50} max={100} step={1} />
```

Both base and radix use arrays for range sliders.

---

## Accordion

Base has no `type` prop, uses `multiple` boolean, `defaultValue` is always an array.

**Incorrect:**

```tsx
<Accordion type="single" collapsible defaultValue="item-1">
```

**Correct:**

```tsx
<Accordion defaultValue={['item-1']}>
    <AccordionItem value="item-1">{/* ... */}</AccordionItem>
</Accordion>

// Multi-select
<Accordion multiple defaultValue={['item-1', 'item-2']}>
    <AccordionItem value="item-1">{/* ... */}</AccordionItem>
    <AccordionItem value="item-2">{/* ... */}</AccordionItem>
</Accordion>
```
