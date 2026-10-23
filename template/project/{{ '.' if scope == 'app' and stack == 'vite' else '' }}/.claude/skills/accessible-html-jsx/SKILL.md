---
name: accessible-html-jsx
description: Write clean, modern, and highly accessible HTML & JSX code, using semantically correct elements and attributes. Use when writing or reviewing HTML/JSX markup, creating forms, handling ARIA attributes, building interactive widgets, or implementing keyboard navigation.
user-invocable: false
---

# Accessible HTML & JSX

Accessibility is a baseline requirement, not an enhancement. Follow `eslint-plugin-jsx-a11y-x` recommended rules enforced in this repo (same rule set as upstream `jsx-a11y`, rule prefix `jsx-a11y-x/`).

## Semantic HTML First

- **PREFER** semantic elements (`header`, `nav`, `main`, `section`, `article`, `aside`, `footer`, `fieldset`, `legend`) over generic `div`/`span`
- **PREFER** `<button>` over `<div role="button">` — native elements provide focus, keyboard activation, and AT announcement for free
- **NEVER** use `<a href="#">` or `<a href="javascript:void(0)">` — use `<button>` for actions, `<a href="/path">` for navigation
- Use correct heading hierarchy (`h1` → `h6`) without skipping levels; headings must contain accessible text
- Use `<ul>`/`<li>` for lists and navigation menus (as the `Sidebar` component does)

## ARIA Rules

- **PREFER** native HTML semantics over ARIA — ARIA is a supplement, not a replacement
- **NEVER** put `aria-hidden="true"` on focusable elements — hides from AT but remains in tab order
- **ALWAYS** use valid ARIA attributes (`aria-labelledby` not `aria-labeledby`), valid roles, and correct value types
- **NEVER** add redundant roles (`<button role="button">`)
- **NEVER** use `tabIndex > 0` — breaks natural tab order; only use `0` or `-1`
- Mark decorative icons with `aria-hidden={true}` (e.g., `<HomeIcon aria-hidden />`)
- Use `aria-invalid` on inputs with validation errors — this repo styles it via `aria-invalid:ring-destructive/20 aria-invalid:border-destructive`
- Use `aria-pressed` for toggle buttons, `aria-expanded` for collapsible controls, `aria-controls` to link triggers to controlled elements

## Forms & Inputs

- **ALWAYS** associate `<Label>` with form controls via `htmlFor` — ESLint enforces `label-has-associated-control` with custom components: `Label`, `FieldLabel`, `Input`, `PasswordInput` (depth: 3)
- **PREFER** specific input types (`email`, `url`, `tel`, `search`, `number`)
- Wrap related fields in `<FieldSet>` with `<FieldLegend>` (from `src/components/ui/Field`)
- Use `<FieldError>` with `role="alert"` for validation errors — announces to screen readers immediately
- On submit failure, focus the first invalid input using the `focusFirstError` utility from `src/lib/utils/focusFirstError`

## Interactive Elements & Keyboard

- **EVERY** `onClick` must have a keyboard equivalent (`onKeyDown`/`onKeyUp`) — or just use `<button>`/Base UI components which handle this natively
- **EVERY** `onMouseOver`/`onMouseOut` must pair with `onFocus`/`onBlur`
- **ALWAYS** provide visible focus indicators — use `focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50` (project standard)

## Images & Media

- **ALWAYS** provide meaningful `alt` text — never include "image", "photo", or "picture" in alt (screen readers already announce the type)
- Use `alt="" aria-hidden={true}` for purely decorative images
- `<video>`/`<audio>` must have `<track kind="captions">`

## Screen Reader Support

- Use `sr-only` class for visually hidden text that screen readers need (icon-only buttons, sidebar toggles, close buttons)
- For loading states: keep original content in the accessibility tree via `sr-only`, show spinner visually with `aria-hidden`

## Advanced Patterns

See [REFERENCE.md](REFERENCE.md) for live regions, focus management, keyboard navigation patterns, and widget-specific requirements.
