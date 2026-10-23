import type { VariantProps } from 'class-variance-authority';
import type { emptyMediaVariants } from './utils/variants';

export type EmptyProps = React.ComponentProps<'div'>;

export type EmptyHeaderProps = React.ComponentProps<'header'>;

export type EmptyMediaProps = React.ComponentProps<'div'> & VariantProps<typeof emptyMediaVariants>;

export type EmptyTitleProps = React.ComponentProps<'h2'>;

export type EmptyDescriptionProps = React.ComponentProps<'p'>;

export type EmptyContentProps = React.ComponentProps<'div'>;
