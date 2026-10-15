import type { useRender } from '@base-ui/react/use-render';
import type { VariantProps } from 'class-variance-authority';
import type { badgeVariants } from './utils/variants';

export type BadgeProps = useRender.ComponentProps<'span'> & VariantProps<typeof badgeVariants>;
