# Forms & Inputs

This project uses **TanStack Form** (not React Hook Form) with **Zod** validation and shadcn's Field system.

## Contents

- Field system overview (FieldGroup + Field)
- TanStack Form integration
- InputGroup patterns
- ToggleGroup for option sets
- FieldSet for grouped controls
- Validation and disabled states

---

## Field system overview

Always use `FieldGroup` + `Field` -- never raw `div` with `space-y-*`:

```tsx
<FieldGroup>
    <Field>
        <FieldLabel htmlFor="email">Email</FieldLabel>
        <Input id="email" type="email" />
    </Field>
    <Field>
        <FieldLabel htmlFor="password">Password</FieldLabel>
        <PasswordInput id="password" />
    </Field>
</FieldGroup>
```

Use `Field orientation="horizontal"` for settings pages. Use `FieldLabel className="sr-only"` for visually hidden labels.

**Available Field sub-components:** `Field`, `FieldSet`, `FieldGroup`, `FieldLabel`, `FieldTitle`, `FieldContent`, `FieldDescription`, `FieldError`, `FieldLegend`, `FieldSeparator`.

**Choosing form controls:**

- Text input -> `Input`
- Password -> `PasswordInput` (has built-in show/hide toggle)
- Dropdown -> `Select`
- Searchable dropdown -> `Combobox`
- Boolean toggle -> `Switch` (settings) or `Checkbox` (forms)
- Single choice -> `RadioGroup`
- Toggle 2-5 options -> `ToggleGroup` + `ToggleGroupItem`
- OTP code -> `InputOTP`
- Multi-line -> `Textarea`

---

## TanStack Form integration

Use `useForm` with Zod validation, render fields via `form.Field` render prop, and subscribe to form state for the submit button:

```tsx
import { useForm } from '@tanstack/react-form';
import { useMutation } from '@tanstack/react-query';

import { Button } from '@/components/ui/Button';
import { Field, FieldError, FieldGroup, FieldLabel, FieldSet } from '@/components/ui/Field';
import { Input } from '@/components/ui/Input';
import { PasswordInput } from '@/components/ui/PasswordInput';

function LoginForm() {
    const { mutateAsync: login } = useMutation(loginMutationOptions());

    const loginForm = useForm({
        defaultValues: { email: '', password: '' },
        validators: {
            onSubmit: loginSchema,
        },
        async onSubmit({ value }) {
            await login({ json: value });
        },
    });

    return (
        <form
            onSubmit={(e) => {
                e.preventDefault();
                loginForm.handleSubmit();
            }}
        >
            <FieldSet>
                <FieldGroup>
                    <loginForm.Field name="email">
                        {(field) => {
                            const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;

                            return (
                                <Field data-invalid={isInvalid || undefined}>
                                    <FieldLabel htmlFor="email">Email</FieldLabel>
                                    <Input
                                        id="email"
                                        type="email"
                                        value={field.state.value}
                                        onChange={(e) => {
                                            field.handleChange(e.target.value);
                                        }}
                                        onBlur={field.handleBlur}
                                        aria-invalid={isInvalid || undefined}
                                    />
                                    {isInvalid && <FieldError errors={field.state.meta.errors} />}
                                </Field>
                            );
                        }}
                    </loginForm.Field>

                    <loginForm.Field name="password">
                        {(field) => {
                            const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;

                            return (
                                <Field data-invalid={isInvalid || undefined}>
                                    <FieldLabel htmlFor="password">Password</FieldLabel>
                                    <PasswordInput
                                        id="password"
                                        value={field.state.value}
                                        onChange={(e) => {
                                            field.handleChange(e.target.value);
                                        }}
                                        onBlur={field.handleBlur}
                                        aria-invalid={isInvalid || undefined}
                                    />
                                    {isInvalid && <FieldError errors={field.state.meta.errors} />}
                                </Field>
                            );
                        }}
                    </loginForm.Field>
                </FieldGroup>
            </FieldSet>

            <loginForm.Subscribe selector={(state) => [state.canSubmit, state.isSubmitting]}>
                {([canSubmit, isSubmitting]) => {
                    return (
                        <Button type="submit" disabled={!canSubmit} isLoading={isSubmitting}>
                            Log in
                        </Button>
                    );
                }}
            </loginForm.Subscribe>
        </form>
    );
}
```

**Key patterns:**

- `form.Field` uses render prop (`children` function) for field access
- `form.Subscribe` observes form state reactively (submit button, global errors)
- Zod schema passed to `validators.onSubmit` (not a resolver)
- `data-invalid` on `Field`, `aria-invalid` on the control -- both must be `undefined` when valid (not `false`)
- `FieldError` accepts `errors` array from `field.state.meta.errors`
- For API error mapping, use `formApi.setErrorMap()` in mutation `onError`

---

## InputGroup requires InputGroupInput/InputGroupTextarea

Never use raw `Input` or `Textarea` inside an `InputGroup`.

**Incorrect:**

```tsx
<InputGroup>
    <Input placeholder="Search..." />
</InputGroup>
```

**Correct:**

```tsx
<InputGroup>
    <InputGroupInput placeholder="Search..." />
</InputGroup>
```

Buttons inside inputs use `InputGroup` + `InputGroupAddon`:

```tsx
<InputGroup>
    <InputGroupInput placeholder="Search..." />
    <InputGroupAddon>
        <Button size="icon">
            <SearchIcon data-icon="inline-start" />
        </Button>
    </InputGroupAddon>
</InputGroup>
```

---

## ToggleGroup for option sets (2-7 choices)

Don't manually loop `Button` with active state.

**Incorrect:**

```tsx
const [selected, setSelected] = useState('daily');

<div className="flex gap-2">
    {['daily', 'weekly', 'monthly'].map((option) => {
        return (
            <Button
                key={option}
                variant={selected === option ? 'default' : 'outline'}
                onClick={() => {
                    setSelected(option);
                }}
            >
                {option}
            </Button>
        );
    })}
</div>
```

**Correct (base UI -- no `type` prop, `defaultValue` is array):**

```tsx
<ToggleGroup defaultValue={['daily']} spacing={2}>
    <ToggleGroupItem value="daily">Daily</ToggleGroupItem>
    <ToggleGroupItem value="weekly">Weekly</ToggleGroupItem>
    <ToggleGroupItem value="monthly">Monthly</ToggleGroupItem>
</ToggleGroup>
```

---

## FieldSet + FieldLegend for grouping

Use for related checkboxes, radios, or switches:

```tsx
<FieldSet>
    <FieldLegend variant="label">Preferences</FieldLegend>
    <FieldDescription>Select all that apply.</FieldDescription>
    <FieldGroup className="gap-3">
        <Field orientation="horizontal">
            <Checkbox id="dark" />
            <FieldLabel htmlFor="dark" className="font-normal">Dark mode</FieldLabel>
        </Field>
    </FieldGroup>
</FieldSet>
```

---

## Validation and disabled states

Both attributes needed -- `data-invalid`/`data-disabled` styles the field wrapper, `aria-invalid`/`disabled` styles the control:

```tsx
// Invalid
<Field data-invalid>
    <FieldLabel htmlFor="email">Email</FieldLabel>
    <Input id="email" aria-invalid />
    <FieldError errors={['Invalid email address.']} />
</Field>

// Disabled
<Field data-disabled>
    <FieldLabel htmlFor="email">Email</FieldLabel>
    <Input id="email" disabled />
</Field>
```
