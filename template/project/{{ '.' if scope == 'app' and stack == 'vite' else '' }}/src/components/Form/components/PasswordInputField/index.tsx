import type { PasswordInputProps } from '@/components/ui/PasswordInput/types';
import { getFieldErrorMessage } from '@/lib/utils/getFieldErrorMessage';
import { PasswordInput } from '@/components/ui/PasswordInput';
import { useFieldContext } from '../../context/FormContext';

function PasswordInputField({
    onChange,
    onBlur,
    ...props
}: Omit<PasswordInputProps, 'name' | 'id' | 'aria-invalid' | 'value'>) {
    const field = useFieldContext<string>();
    const fieldErrorMessage = getFieldErrorMessage(field.state.meta.errors);
    const id = `${field.name}${field.form.formId}`;

    return (
        <PasswordInput
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

export { PasswordInputField };
