import type {
    FieldDescriptionProps,
    FieldErrorProps,
    FieldGroupProps,
    FieldLabelProps,
    FieldProps,
    FieldSetProps,
} from './types';
import clsx from 'clsx';
import { Label } from '@/components/ui/Label';
import s from './styles.module.css';

function FieldSet({ className, ...props }: FieldSetProps) {
    return <fieldset data-slot="field-set" className={clsx(s.set, className)} {...props} />;
}

function FieldGroup({ className, ...props }: FieldGroupProps) {
    return <div data-slot="field-group" className={clsx(s.group, className)} {...props} />;
}

function Field({ className, ...props }: FieldProps) {
    return <div role="group" data-slot="field" className={clsx(s.field, className)} {...props} />;
}

function FieldLabel({ className, htmlFor, ...props }: FieldLabelProps) {
    return <Label data-slot="field-label" className={clsx(s.label, className)} htmlFor={htmlFor} {...props} />;
}

function FieldDescription({ className, ...props }: FieldDescriptionProps) {
    return <p data-slot="field-description" className={clsx(s.description, className)} {...props} />;
}

function FieldError({ className, children, ...props }: FieldErrorProps) {
    if (!children) {
        return null;
    }

    return (
        <div role="alert" data-slot="field-error" className={clsx(s.error, className)} {...props}>
            {children}
        </div>
    );
}

export { Field, FieldDescription, FieldError, FieldGroup, FieldLabel, FieldSet };
