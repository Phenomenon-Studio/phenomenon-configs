---
name: tanstack-form
description: Build forms using TanStack Form with the project's useAppForm composition, composable field components, Zod validation schemas, FormFieldWrapper error tracking, and form.AppField vs form.Field patterns. Use when creating new forms, adding form fields, writing form validation, or working with TanStack Form in this project.
user-invocable: false
---

# TanStack Form — Project Composition Guide

## Architecture Layers

This project wraps TanStack Form into a 4-layer composition:

1. **Context** — `createFormHookContexts()` → `fieldContext`, `formContext`, `useFieldContext`
2. **Field Components** — composable components that consume `useFieldContext()` to read field state/errors
3. **Hook Factory** — `createFormHook()` → `useAppForm`, `withForm`, `withFieldGroup`
4. **Form Instances** — `useAppForm({ validators, defaultValues, onSubmit })`

See [REFERENCE.md](REFERENCE.md) for full file paths, all registered field components, and advanced patterns.

## Quick Start — Creating a Form

**Key patterns:**

- `form.AppField` provides pre-registered field components (`field.InputField`, `field.FormFieldWrapper`, etc.)
- `form.Field` provides raw field state for custom rendering, array fields, or conditional logic
- `form.Subscribe` observes form state reactively (submit button, global errors)
- Zod schema passed to `validators.onSubmit` (not a resolver)
- `FormFieldWrapper` is a **registered field component** — use via `field.FormFieldWrapper` inside `form.AppField`, not as a standalone import
- `FormFieldWrapper` reads `useFieldContext()` → `field.state.meta.errors` → `getFieldErrorMessage()` and renders label + input + error message using project's `Field`, `FieldLabel`, `FieldError` UI components
- For API error mapping, use `formApi.setErrorMap()` in mutation `onError`
- For focusing first invalid field on submit, use `focusFirstError()` in `onSubmitInvalid`

```tsx
// 1. Define schema (src/components/YourForm/schemas.ts)
import { z } from 'zod';

export const yourSchema = z.object({
    name: z.string().min(1, {
        error() {
            return 'This field is required';
        },
    }),
    email: z.email({
        error(iss) {
            if (!iss.input) {
                return 'This field is required';
            }

            return 'Invalid email';
        },
    }),
});

// 2. Create form instance in your component
import { focusFirstError } from '@/lib/utils/focusFirstError';
import { useAppForm } from '@/components/Form';

const form = useAppForm({
    defaultValues: { name: '', email: '' },
    validators: { onSubmit: yourSchema },
    onSubmit({ value }) {
        /* handle submit */
    },
    onSubmitInvalid({ formApi }) {
        focusFirstError('#your-form', formApi.state.errorMap.onSubmit);
    },
});

// 3. Render with form.AppField + field.FormFieldWrapper
<form
    id="your-form"
    noValidate={true}
    onSubmit={(e) => {
        e.preventDefault();
        form.handleSubmit();
    }}
>
    <FieldSet>
        <FieldGroup>
            <form.AppField
                name="name"
                children={(field) => {
                    return (
                        <field.FormFieldWrapper label="Name">
                            <field.InputField placeholder="Enter name" />
                        </field.FormFieldWrapper>
                    );
                }}
            />
            <form.AppField
                name="email"
                children={(field) => {
                    return (
                        <field.FormFieldWrapper label="Email">
                            <field.InputField placeholder="Enter email" type="email" />
                        </field.FormFieldWrapper>
                    );
                }}
            />
            <Field>
                <form.Subscribe
                    selector={(state) => {
                        return [state.canSubmit, state.isSubmitting];
                    }}
                    children={([canSubmit, isSubmitting]) => {
                        return (
                            <Button type="submit" disabled={!canSubmit} isLoading={isSubmitting}>
                                Submit
                            </Button>
                        );
                    }}
                />
            </Field>
        </FieldGroup>
    </FieldSet>
</form>
```

## form.AppField vs form.Field

| | `form.AppField` | `form.Field` |
|---|---|---|
| **Provides** | `field.InputField`, `field.FormFieldWrapper`, `field.PasswordInputField` | Raw `field.state`, `field.handleChange` only |
| **Use when** | Using a registered field component | Custom rendering, array fields, conditional logic |
| **Error tracking** | Via `field.FormFieldWrapper` + `useFieldContext` | Manual via `field.state.meta.errors` |

**Rule:** Use `form.AppField` for standard fields. Use `form.Field` for arrays (`mode="array"`), custom UI, or reading field values without a registered component.

**Choosing form controls:**

- Text input -> `field.InputField`
- Password -> `field.PasswordInputField` (has built-in show/hide toggle)
- Other controls (Textarea, Switch, Checkbox, RadioGroup, etc.) -> use `form.Field` with raw rendering

## FormFieldWrapper — Error Tracking

`FormFieldWrapper` is a **registered field component**. Access it via `field.FormFieldWrapper` inside `form.AppField`. It:

1. Calls `useFieldContext()` to access field errors
2. Extracts the first error string via `getFieldErrorMessage(field.state.meta.errors)`
3. Generates a unique ID via `${field.name}${field.form.formId}`
4. Renders using project UI components: `Field` (wrapper with `data-invalid`), `FieldLabel`, and `FieldError`

**Props:**

- `label` — label text (renders `FieldLabel`); if omitted, no label is rendered
- `labelClassName` — CSS class for the label element
- `className` — wrapper CSS class
- `children` — the field input component(s)

## Layout Helpers

Use the project's existing UI Field layout components for form structure:

- `FieldSet` — wraps a form section (`<fieldset>`)
- `FieldGroup` — groups fields together with consistent gap
- `FieldLegend` — section legend/title
- `FieldSeparator` — visual separator between field groups
- `FieldDescription` — helper text below fields

Import from `@/components/ui/Field`.

## Workflow Checklist

- [ ] Define Zod schema with custom error messages
- [ ] Call `useAppForm()` with `defaultValues`, `validators: { onSubmit: schema }`, and `onSubmit`
- [ ] Optionally add `onSubmitInvalid` with `focusFirstError()` for accessibility
- [ ] Wrap `<form>` element with `noValidate`, `e.preventDefault()` + `form.handleSubmit()`
- [ ] Use `FieldSet` + `FieldGroup` for layout structure
- [ ] Use `form.AppField` + `field.FormFieldWrapper` + `field.<Component>` for each field
- [ ] Use `form.Field` only for custom/array/conditional fields
- [ ] Use `form.Subscribe` for submit button state (`canSubmit`, `isSubmitting`)

## Advanced

See [REFERENCE.md](REFERENCE.md) for:

- All registered field components and their props
- `withForm` / `withFieldGroup` composition
- `form.Subscribe` for reactive state
- Array field patterns (editable tables)
- Custom field component creation guide
- API error handling with `formApi.setErrorMap()`
