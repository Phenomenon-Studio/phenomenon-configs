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
