import type { VariantProps } from 'class-variance-authority';
import type { LabelProps } from '@/components/ui/Label/types';
import type { fieldVariants } from './utils/variants';

export type FieldSetProps = React.ComponentProps<'fieldset'>;

export type FieldLegendProps = React.ComponentProps<'legend'> & { variant?: 'legend' | 'label' };

export type FieldGroupProps = React.ComponentProps<'div'>;

export type FieldProps = React.ComponentProps<'div'> & VariantProps<typeof fieldVariants>;

export type FieldContentProps = React.ComponentProps<'div'>;

export type FieldLabelProps = LabelProps;

export type FieldTitleProps = React.ComponentProps<'div'>;

export type FieldDescriptionProps = React.ComponentProps<'p'>;

export type FieldSeparatorProps = React.ComponentProps<'div'>;

export type FieldErrorProps = React.ComponentProps<'div'> & {
    errors?: Array<{ message?: string } | undefined>;
};
