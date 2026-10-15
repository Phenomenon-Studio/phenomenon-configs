import type { InputProps } from '@/components/ui/Input/types';
import { getFieldErrorMessage } from '@/lib/utils/getFieldErrorMessage';
import { Input } from '@/components/ui/Input';
import { useFieldContext } from '../../context/FormContext';

function InputField({ onChange, onBlur, ...props }: Omit<InputProps, 'name' | 'id' | 'aria-invalid' | 'value'>) {
    const field = useFieldContext<string | number | undefined>();
    const fieldErrorMessage = getFieldErrorMessage(field.state.meta.errors);
    const id = `${field.name}${field.form.formId}`;

    return (
        <Input
            id={id}
            name={field.name}
            aria-invalid={!!fieldErrorMessage}
            value={field.state.value ?? ''}
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

export { InputField };
