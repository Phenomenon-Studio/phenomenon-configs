import type {
    FieldContentProps,
    FieldDescriptionProps,
    FieldErrorProps,
    FieldGroupProps,
    FieldLabelProps,
    FieldLegendProps,
    FieldProps,
    FieldSeparatorProps,
    FieldSetProps,
    FieldTitleProps,
} from './types';
import { cn } from 'cn';
import { Label } from '@/components/ui/Label';
import { Separator } from '@/components/ui/Separator';
import { fieldVariants } from './utils/variants';

function FieldSet({ className, ...props }: FieldSetProps) {
    return (
        <fieldset
            data-slot="field-set"
            className={cn`flex flex-col gap-4 has-[>[data-slot=checkbox-group]]:gap-3 has-[>[data-slot=radio-group]]:gap-3 ${className}`}
            {...props}
        />
    );
}

function FieldLegend({ className, variant = 'legend', ...props }: FieldLegendProps) {
    return (
        <legend
            data-slot="field-legend"
            data-variant={variant}
            className={cn`mb-1.5 font-medium data-[variant=label]:text-sm data-[variant=legend]:text-base ${className}`}
            {...props}
        />
    );
}

function FieldGroup({ className, ...props }: FieldGroupProps) {
    return (
        <div
            data-slot="field-group"
            className={cn`group/field-group @container/field-group flex w-full flex-col gap-5 data-[slot=checkbox-group]:gap-3 *:data-[slot=field-group]:gap-4 ${className}`}
            {...props}
        />
    );
}

function Field({ className, orientation = 'vertical', ...props }: FieldProps) {
    return (
        <div
            role="group"
            data-slot="field"
            data-orientation={orientation}
            className={cn`${fieldVariants({ orientation })} ${className}`}
            {...props}
        />
    );
}

function FieldContent({ className, ...props }: FieldContentProps) {
    return (
        <div
            data-slot="field-content"
            className={cn`group/field-content flex flex-1 flex-col gap-0.5 leading-snug ${className}`}
            {...props}
        />
    );
}

function FieldLabel({ className, htmlFor, ...props }: FieldLabelProps) {
    return (
        <Label
            data-slot="field-label"
            className={cn`group/field-label peer/field-label flex w-fit gap-2 leading-snug group-data-[disabled=true]/field:opacity-50 has-data-checked:border-primary/30 has-data-checked:bg-primary/5 has-[>[data-slot=field]]:w-full has-[>[data-slot=field]]:flex-col has-[>[data-slot=field]]:rounded-lg has-[>[data-slot=field]]:border *:data-[slot=field]:p-2.5 dark:has-data-checked:border-primary/20 dark:has-data-checked:bg-primary/10 ${className}`}
            htmlFor={htmlFor}
            {...props}
        />
    );
}

function FieldTitle({ className, ...props }: FieldTitleProps) {
    return (
        <div
            data-slot="field-label"
            className={cn`flex w-fit items-center gap-2 text-sm leading-snug font-medium group-data-[disabled=true]/field:opacity-50 ${className}`}
            {...props}
        />
    );
}

function FieldDescription({ className, ...props }: FieldDescriptionProps) {
    return (
        <p
            data-slot="field-description"
            className={cn`text-left text-sm leading-normal font-normal text-muted-foreground group-has-data-horizontal/field:text-balance last:mt-0 nth-last-2:-mt-1 [&>a]:underline [&>a]:underline-offset-4 [&>a:hover]:text-primary [[data-variant=legend]+&]:-mt-1.5 ${className}`}
            {...props}
        />
    );
}

function FieldSeparator({ children, className, ...props }: FieldSeparatorProps) {
    return (
        <div
            data-slot="field-separator"
            data-content={!!children}
            className={cn`relative -my-2 h-5 text-sm group-data-[variant=outline]/field-group:-mb-2 ${className}`}
            {...props}
        >
            <Separator className="absolute inset-0 top-1/2" />
            {children ? (
                <span
                    className="relative mx-auto block w-fit bg-background px-2 text-muted-foreground"
                    data-slot="field-separator-content"
                >
                    {children}
                </span>
            ) : null}
        </div>
    );
}

function FieldError({ className, children, errors, ...props }: FieldErrorProps) {
    let content: React.ReactNode;

    if (children) {
        content = children;
    } else if (!errors) {
        content = null;
    } else if (errors?.length === 1 && errors[0]?.message) {
        content = errors[0].message;
    } else {
        content = (
            <ul className="ml-4 flex list-disc flex-col gap-1">
                {errors.map((error) => {
                    return error?.message ? <li key={error.message}>{error.message}</li> : null;
                })}
            </ul>
        );
    }

    if (!content) {
        return null;
    }

    return (
        <div
            role="alert"
            data-slot="field-error"
            className={cn`text-sm font-normal text-destructive ${className}`}
            {...props}
        >
            {content}
        </div>
    );
}

export {
    Field,
    fieldVariants,
    FieldLabel,
    FieldDescription,
    FieldError,
    FieldGroup,
    FieldLegend,
    FieldSeparator,
    FieldSet,
    FieldContent,
    FieldTitle,
};
