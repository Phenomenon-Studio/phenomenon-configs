# Accessible HTML & JSX — Advanced Reference

## Live Regions

Use live regions to announce dynamic content changes to screen readers.

- `role="alert"` — implicit `aria-live="assertive"` + `aria-atomic="true"` — for errors, urgent messages
- `role="status"` — implicit `aria-live="polite"` + `aria-atomic="true"` — for success toasts, confirmations
- **NEVER** combine `role="alert"` with `aria-live="assertive"` — some screen readers double-announce
- **CRITICAL:** Mount the live region container in the DOM **before** populating it — if rendered simultaneously with the message, screen readers may miss the announcement

```tsx
// Mount with empty message, update later
function LiveRegion({ message }: { message: string }) {
  return (
    <div role="status" aria-live="polite" aria-atomic="true">
      {message}
    </div>
  );
}
```

This repo uses `role="alert"` in `<FieldError>` (`src/components/ui/Field`) for form validation errors.

## Focus Management

### When to move focus

- **Modal opens** → focus first focusable element inside dialog (Base UI `Dialog` handles this automatically via `Sheet` component)
- **Modal closes** → return focus to the trigger element
- **SPA route change** → consider moving focus to `<h1>` or page container
- **Form validation failure** → focus first invalid input (use `focusFirstError` from `src/lib/utils/focusFirstError`)

### Focus trap in dialogs

- Base UI's `Dialog` component (used by `Sheet`) manages focus trap automatically
- If building a custom dialog: set `aria-modal="true"` on the container, implement JS focus trap intercepting `Tab`/`Shift+Tab`, and close on `Escape`

```tsx
const triggerRef = useRef<HTMLButtonElement>(null);

const handleClose = () => {
  setOpen(false);
  triggerRef.current?.focus(); // return focus to trigger
};
```

## Keyboard Navigation Patterns

### Roving tabindex (lists, toolbars, tab panels)

- One item has `tabIndex={0}`, all others `tabIndex={-1}`
- Arrow keys move focus and update which item has `tabIndex={0}`
- Browser auto-scrolls the focused element into view

### `aria-activedescendant` (comboboxes, grids)

- Container gets `tabIndex={0}` and `aria-activedescendant="id-of-active-child"`
- Children are never focused directly
- You must handle scrolling manually (no auto-scroll)

## Widget Keyboard Requirements (WAI-ARIA APG)

| Widget | Required keys |
|---|---|
| Dialog/Modal | `Escape` closes; `Tab`/`Shift+Tab` trapped inside |
| Menu/Menubar | Arrow keys navigate; `Enter`/`Space` activate; `Escape` closes |
| Tabs | `Left`/`Right` switch tabs; `Tab` moves to panel content |
| Listbox | `Up`/`Down` navigate; `Space` selects; `Home`/`End` jump to first/last |
| Combobox | `Down` opens list; `Up`/`Down` navigate; `Enter` selects; `Escape` closes |
| Accordion | `Enter`/`Space` toggles panel; `Tab` moves between headers |

## Base UI & shadcn/ui — Built-in Accessibility

This repo uses Base UI React (`@base-ui/react`) as the foundation for UI components. Base UI provides:

- Built-in ARIA attributes and roles
- Keyboard navigation and focus management
- Focus trapping in dialogs/modals
- Semantic HTML structure

**Always prefer Base UI primitives** (`Input`, `Button`, `Dialog`, `Menu`, `Tooltip`, `Separator`) over building custom interactive widgets — they handle a11y correctly out of the box.

Used in: `Input`, `Button`, `Sheet` (Dialog), `DropdownMenu` (Menu), `Tooltip`, `Separator`.

## Static Linting Limitations

`eslint-plugin-jsx-a11y-x` is a static AST checker only. It **cannot** catch:

- Missing live region announcements
- Focus not returning to trigger after modal close
- Dynamically injected content without accessible labels
- Computed ARIA values that resolve to invalid strings at runtime

For runtime validation, consider pairing with manual screen reader testing (VoiceOver on macOS, NVDA/JAWS on Windows).

## Disabled State Patterns

This repo uses a consistent disabled approach:

- **Buttons:** `disabled:pointer-events-none disabled:opacity-50`
- **Inputs:** `disabled:bg-input/50 disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50`
- **Labels:** `peer-disabled:opacity-50 peer-disabled:cursor-not-allowed` (responds to sibling input disabled state)
- **Sidebar items:** `aria-disabled:pointer-events-none aria-disabled:opacity-50`

Use `disabled` attribute for native elements; use `aria-disabled` only when you need the element to remain focusable (e.g., to explain why it's disabled via a tooltip).
