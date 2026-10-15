# TanStack Form — Reference

## File Paths

| Layer | Path |
|-------|------|
| Context | `src/components/Form/context/FormContext.tsx` |
| Hook Factory + Exports | `src/components/Form/index.ts` |
| FormFieldWrapper | `src/components/Form/components/FormFieldWrapper/index.tsx` |
| FormFieldWrapper Types | `src/components/Form/components/FormFieldWrapper/types.ts` |
| InputField | `src/components/Form/components/InputField/index.tsx` |
| PasswordInputField | `src/components/Form/components/PasswordInputField/index.tsx` |
| Error Utility | `src/lib/utils/getFieldErrorMessage.ts` |
| Focus Error Utility | `src/lib/utils/focusFirstError.ts` |
| UI Field Layouts | `src/components/ui/Field/index.tsx` |
| UI Input | `src/components/ui/Input/index.tsx` |
| UI PasswordInput | `src/components/ui/PasswordInput/index.tsx` |

---

## Layer 1 — Context

```typescript
// src/components/Form/context/FormContext.tsx
import { createFormHookContexts } from '@tanstack/react-form';

export const { fieldContext, formContext, useFieldContext } = createFormHookContexts();
```

- `fieldContext` / `formContext` — passed to `createFormHook` to wire up context providers
- `useFieldContext<T>()` — call inside field components to access `field.state`, `field.handleChange`, `field.name`, `field.form.formId`, `field.state.meta.errors`

---

## Layer 2 — Registered Field Components

All field components follow the same pattern:

1. Call `useFieldContext<T>()` to get field state
2. Call `getFieldErrorMessage(field.state.meta.errors)` for error string
3. Generate unique ID via `${field.name}${field.form.formId}`
4. Render the UI component, passing `id`, `name`, `aria-invalid`, `value`, `onChange`, `onBlur`

### Registered Components

| Component | Value Type | UI Component Used | Notes |
|-----------|------------|-------------------|-------|
| `FormFieldWrapper` | any (reads from context) | `Field`, `FieldLabel`, `FieldError` | Label + error wrapper; renders children inside |
| `InputField` | `string \| number \| undefined` | `Input` from `@/components/ui/Input` | General text/email/number input |
| `PasswordInputField` | `string` | `PasswordInput` from `@/components/ui/PasswordInput` | Password with show/hide toggle; **lazy-loaded** |

### FormFieldWrapper Props

```typescript
// src/components/Form/components/FormFieldWrapper/types.ts
export type FormFieldWrapperProps = React.PropsWithChildren<{
    className?: string;
    label?: React.ReactNode;
    labelClassName?: string;
}>;
```

### Creating a Custom Field Component

Follow this pattern when the registered components don't cover your needs:

```tsx
// src/components/Form/components/YourField/index.tsx
import { getFieldErrorMessage } from '@/lib/utils/getFieldErrorMessage';
import { useFieldContext } from '../../context/FormContext';

function YourField({ onChange, onBlur, ...props }: Omit<YourUIProps, 'name' | 'id' | 'aria-invalid' | 'value'>) {
    const field = useFieldContext<YourValueType>();
    const fieldErrorMessage = getFieldErrorMessage(field.state.meta.errors);
    const id = `${field.name}${field.form.formId}`;

    return (
        <YourUIComponent
            id={id}
            name={field.name}
            aria-invalid={!!fieldErrorMessage}
            value={field.state.value}
            onChange={(e) => {
                field.handleChange(e.target.value);
                onChange?.(e);
            }}
            onBlur={(e) => {
                field.handleBlur();
                onBlur?.(e);
            }}
            {...props}
        />
    );
}

export { YourField };
```

Then register it in `src/components/Form/index.ts`:

```typescript
const { useAppForm, withForm, withFieldGroup } = createFormHook({
    fieldContext,
    formContext,
    fieldComponents: {
        // ...existing
        YourField,
    },
    formComponents: {},
});
```

After registration, it becomes available as `field.YourField` inside `form.AppField`.

---

## Layer 3 — Hook Factory (`useAppForm`)

```typescript
// src/components/Form/index.ts
import { lazy } from 'react';
import { createFormHook } from '@tanstack/react-form';
import { fieldContext, formContext } from './context/FormContext';
import { FormFieldWrapper } from './components/FormFieldWrapper';
import { InputField } from './components/InputField';

// NOTE: Tree-shaking field components if needed
const PasswordInputField = lazy(async () => {
    const res = await import('./components/PasswordInputField');
    return { default: res.PasswordInputField };
});

const { useAppForm, withForm, withFieldGroup } = createFormHook({
    fieldContext,
    formContext,
    fieldComponents: {
        FormFieldWrapper,
        InputField,
        PasswordInputField,
    },
    formComponents: {},
});

export { useAppForm, withForm, withFieldGroup };
```

Exports:

- **`useAppForm(opts)`** — creates a form instance with typed fields and pre-registered components
- **`withForm(opts)`** — HOC to pass a parent form into a child component (avoids prop drilling)
- **`withFieldGroup(opts)`** — creates scoped field groups with their own validators

**Import path:** `import { useAppForm } from '@/components/Form';`

---

## Layer 4 — Form Instance Usage

### Minimal Working Form

```tsx
import { z } from 'zod';
import { focusFirstError } from '@/lib/utils/focusFirstError';
import { useAppForm } from '@/components/Form';
import { Button } from '@/components/ui/Button';
import { Field, FieldGroup, FieldSet } from '@/components/ui/Field';

const schema = z.object({
    name: z.string().min(1, {
        error() {
            return 'This field is required';
        },
    }),
});

function MyForm() {
    const form = useAppForm({
        defaultValues: { name: '' },
        validators: { onSubmit: schema },
        onSubmit({ value }) {
            console.log(value);
        },
        onSubmitInvalid({ formApi }) {
            focusFirstError('#my-form', formApi.state.errorMap.onSubmit);
        },
    });

    return (
        <form
            id="my-form"
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
    );
}
```

### Per-Field Validation (onChange)

```tsx
<form.AppField
    name="email"
    validators={{ onChange: schema.shape.email }}
    children={(field) => {
        return (
            <field.FormFieldWrapper label="Email">
                <field.InputField placeholder="Email" type="email" />
            </field.FormFieldWrapper>
        );
    }}
/>
```

---

## form.AppField — Pre-registered Components

Use when you need a registered field component. Provides `field.FormFieldWrapper`, `field.InputField`, `field.PasswordInputField`.

```tsx
<form.AppField
    name="fieldName"
    children={(field) => {
        return (
            <field.FormFieldWrapper label="Label">
                <field.InputField placeholder="..." />
            </field.FormFieldWrapper>
        );
    }}
/>
```

---

## form.Field — Raw Field Access

Use for custom rendering, array operations, or reading values without a registered component.

### Reading a value

```tsx
<form.Field
    name="fullName"
    children={(field) => {
        return field.state.value ? <p>{field.state.value}</p> : null;
    }}
/>
```

### Custom rendering with project UI components

When using `form.Field` for controls without a registered field component, manually handle errors using the project's `Field`, `FieldLabel`, and `FieldError` UI components:

```tsx
<form.Field
    name="bio"
    children={(field) => {
        const fieldErrorMessage = getFieldErrorMessage(field.state.meta.errors);
        const isInvalid = !!fieldErrorMessage;
        const id = `${field.name}${field.form.formId}`;

        return (
            <Field data-invalid={isInvalid}>
                <FieldLabel htmlFor={id}>Bio</FieldLabel>
                <Textarea
                    id={id}
                    name={field.name}
                    aria-invalid={isInvalid}
                    value={field.state.value}
                    onChange={(e) => {
                        field.handleChange(e.target.value);
                    }}
                    onBlur={field.handleBlur}
                />
                {isInvalid && <FieldError>{fieldErrorMessage}</FieldError>}
            </Field>
        );
    }}
/>
```

### Array field operations

```tsx
<form.Field
    name="employees"
    mode="array"
    children={(field) => {
        return (
            <div>
                {field.state.value.map((_, index) => {
                    return (
                        <div key={index}>
                            {/* Render row */}
                            <button
                                onClick={() => {
                                    field.removeValue(index);
                                }}
                            >
                                Delete
                            </button>
                        </div>
                    );
                })}
                <button
                    onClick={() => {
                        field.pushValue({ firstName: '', lastName: '' });
                    }}
                >
                    Add Employee
                </button>
            </div>
        );
    }}
/>
```

Array methods: `pushValue()`, `removeValue(index)`, `moveValue(from, to)`, `insertValue(index, value)`, `replaceValue(index, value)`.

---

## FormFieldWrapper — Error Tracking Wrapper

**Registered field component** — access via `field.FormFieldWrapper` inside `form.AppField`.

```typescript
// How it works internally:
const field = useFieldContext();
const fieldErrorMessage = getFieldErrorMessage(field.state.meta.errors);
const isInvalid = !!fieldErrorMessage;
const id = `${field.name}${field.form.formId}`;

// Renders: Field (with data-invalid) > FieldLabel (if label provided) + children + FieldError (if invalid)
```

**Props:**

- `label` — label text (renders `FieldLabel`); if omitted, no label is rendered
- `labelClassName` — CSS class for the label element
- `className` — wrapper CSS class
- `children` — the field input component(s)

### FormFieldWrapper Implementation

```tsx
// src/components/Form/components/FormFieldWrapper/index.tsx
import type { FormFieldWrapperProps } from './types';
import { getFieldErrorMessage } from '@/lib/utils/getFieldErrorMessage';
import { Field, FieldError, FieldLabel } from '@/components/ui/Field';
import { useFieldContext } from '../../context/FormContext';

function FormFieldWrapper({ className, label, labelClassName, children }: FormFieldWrapperProps) {
    const field = useFieldContext();
    const fieldErrorMessage = getFieldErrorMessage(field.state.meta.errors);
    const isInvalid = !!fieldErrorMessage;
    const id = `${field.name}${field.form.formId}`;

    return (
        <Field className={className} data-invalid={isInvalid}>
            {!!label && (
                <FieldLabel className={labelClassName} htmlFor={id}>
                    {label}
                </FieldLabel>
            )}
            {children}
            {isInvalid && <FieldError>{fieldErrorMessage}</FieldError>}
        </Field>
    );
}

export { FormFieldWrapper };
```

---

## Error Utility — `getFieldErrorMessage`

```typescript
// src/lib/utils/getFieldErrorMessage.ts
// Extracts first error string from field.state.meta.errors array
// Handles: string errors, { message: string } objects, nested arrays

export const getFieldErrorMessage = (errors: unknown[]): string | undefined => {
    if (!errors || errors.length === 0) {
        return undefined;
    }

    for (const error of errors) {
        if (!error) {
            continue;
        }

        if (typeof error === 'string') {
            return error;
        }

        if (typeof error === 'object' && 'message' in error && typeof error.message === 'string') {
            return error.message;
        }

        if (Array.isArray(error)) {
            const nested = getFieldErrorMessage(error);
            if (nested) {
                return nested;
            }
        }
    }

    return undefined;
};
```

---

## Focus Error Utility — `focusFirstError`

Already exists at `src/lib/utils/focusFirstError.ts`. Use in `onSubmitInvalid` callback:

```typescript
import { focusFirstError } from '@/lib/utils/focusFirstError';

const form = useAppForm({
    // ...
    onSubmitInvalid({ formApi }) {
        focusFirstError('#form-id', formApi.state.errorMap.onSubmit);
    },
});
```

---

## form.Subscribe — Reactive State

React to form state changes without re-rendering the entire form:

```tsx
// Submit button pattern
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

// Conditional rendering based on field value
<form.Subscribe
    selector={(state) => {
        return state.values.someField;
    }}
    children={(someFieldValue) => {
        return someFieldValue ? <ConditionalSection /> : null;
    }}
/>
```

---

## withForm — HOC for Child Components

Pass a parent form to a child component without prop drilling:

```tsx
export const StepSection = withForm({
    defaultValues: {
        fieldInParent: '',
    },
    props: {} as StepSectionProps,
    render: function Render({ form, ...props }) {
        return (
            <form.AppField
                name="fieldInParent"
                children={(field) => {
                    return (
                        <field.FormFieldWrapper label="Field">
                            <field.InputField placeholder="..." />
                        </field.FormFieldWrapper>
                    );
                }}
            />
        );
    },
});
```

---

## withFieldGroup — Scoped Field Groups

Create a field group with its own validation scope:

```tsx
export const AddressFields = withFieldGroup({
    defaultValues: {
        address: '',
        city: '',
    },
    render: function Render({ group }) {
        return (
            <>
                <group.AppField
                    name="address"
                    children={(field) => {
                        return (
                            <field.FormFieldWrapper label="Address">
                                <field.InputField placeholder="Street address" />
                            </field.FormFieldWrapper>
                        );
                    }}
                />
                <group.AppField
                    name="city"
                    children={(field) => {
                        return (
                            <field.FormFieldWrapper label="City">
                                <field.InputField placeholder="City" />
                            </field.FormFieldWrapper>
                        );
                    }}
                />
            </>
        );
    },
});
```

---

## Zod Schema Patterns

This project defines Zod schemas per-form (e.g., `src/components/LoginForm/schemas.ts`), using custom error functions:

```typescript
import { z } from 'zod';

export const loginSchema = z.object({
    email: z.email({
        error(iss) {
            if (!iss.input) {
                return 'This field is required';
            }
            return 'Invalid email';
        },
    }),
    password: z.string().min(8, {
        error(iss) {
            if (!iss.input) {
                return 'This field is required';
            }
            return 'Invalid password';
        },
    }),
});
```

**Pattern:** Use the `error` callback with `iss.input` check to distinguish between empty (required) and invalid values.

---

## API Error Handling

Map API errors to form fields using `formApi.setErrorMap()`:

```tsx
const form = useAppForm({
    // ...
    async onSubmit({ value, formApi }) {
        await mutateAsync(
            { json: value },
            {
                onSuccess() {
                    /* navigate, toast, etc. */
                },
                async onError(error) {
                    const parsedErrorData = await error.response.json();
                    formApi.setErrorMap({
                        onSubmit: {
                            fields: {
                                email: { message: parsedErrorData.message },
                            },
                        },
                    });
                },
            }
        );
    },
});
```

---

## Nested Form Pattern

```tsx
// Child form that writes back to parent on submit
const editableRowForm = useAppForm({
    defaultValues: initialEmployeeData,
    validators: { onSubmit: employeeItemSchema },
    onSubmit({ value }) {
        parentForm.setFieldValue(`employees[${index}]`, value);
    },
});

// Each cell uses the child form's AppField
<editableRowForm.AppField
    name="firstName"
    children={(field) => {
        return (
            <field.FormFieldWrapper label="First Name">
                <field.InputField />
            </field.FormFieldWrapper>
        );
    }}
/>

// Parent form's Field for array operations (delete row)
<parentForm.Field
    name="employees"
    mode="array"
    children={(field) => {
        return (
            <button
                onClick={() => {
                    field.removeValue(index);
                }}
            >
                Delete
            </button>
        );
    }}
/>
```

---

## Complete Form Example — Login

```tsx
import { useMutation } from '@tanstack/react-query';
import { getRouteApi, Link } from '@tanstack/react-router';
import { isHTTPError } from 'ky';
import { FALLBACK_REDIRECT } from '@/lib/constants';
import { focusFirstError } from '@/lib/utils/focusFirstError';
import { loginMutationOptions } from '@/services/authExample/queries';
import { useAppForm } from '@/components/Form';
import { Button } from '@/components/ui/Button';
import { Field, FieldGroup, FieldSet } from '@/components/ui/Field';
import { toast } from '@/components/ui/Toast';
import { loginSchema } from './schemas';

const routeApi = getRouteApi('/_unauthenticated/login/');

function LoginForm() {
    const navigate = routeApi.useNavigate();
    const redirectSearch = routeApi.useSearch({
        select({ redirect }) {
            return redirect;
        },
    });
    const { mutateAsync: login } = useMutation(loginMutationOptions());

    const form = useAppForm({
        defaultValues: {
            username: '',
            password: '',
        },
        validators: {
            onSubmit: loginSchema,
        },
        async onSubmit({ value, formApi }) {
            await login(
                { json: value },
                {
                    onSuccess() {
                        navigate({
                            to: redirectSearch || FALLBACK_REDIRECT,
                            replace: true,
                        });
                    },
                    onError(error) {
                        if (isHTTPError(error) && typeof error.data === 'object') {
                            formApi.setErrorMap({
                                onSubmit: {
                                    fields: {
                                        username: { message: error.data.message },
                                        password: { message: error.data.message },
                                    },
                                },
                            });
                        } else {
                            toast.add({ type: 'error', title: error.message });
                        }
                    },
                }
            );
        },
        onSubmitInvalid({ formApi }) {
            focusFirstError('#login-form', formApi.state.errorMap.onSubmit);
        },
    });

    return (
        <form
            id="login-form"
            noValidate={true}
            onSubmit={(e) => {
                e.preventDefault();
                form.handleSubmit();
            }}
        >
            <FieldSet>
                <FieldGroup>
                    <form.AppField
                        name="username"
                        children={(field) => {
                            return (
                                <field.FormFieldWrapper label="Username">
                                    <field.InputField placeholder="emilys" autoComplete="username" />
                                </field.FormFieldWrapper>
                            );
                        }}
                    />
                    <form.AppField
                        name="password"
                        children={(field) => {
                            return (
                                <field.FormFieldWrapper
                                    labelClassName="flex items-center justify-between"
                                    label={
                                        <>
                                            Password{' '}
                                            <Link
                                                to="/login"
                                                className="ml-auto text-sm underline-offset-2 hover:underline text-foreground rounded-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
                                            >
                                                Forgot your password?
                                            </Link>
                                        </>
                                    }
                                >
                                    <field.PasswordInputField placeholder="Enter password" />
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
                                    <Button
                                        type="submit"
                                        className="w-full"
                                        disabled={!canSubmit}
                                        isLoading={isSubmitting}
                                    >
                                        Login
                                    </Button>
                                );
                            }}
                        />
                    </Field>
                </FieldGroup>
            </FieldSet>
        </form>
    );
}

export { LoginForm };
```
