import type { Dialog as SheetPrimitive } from '@base-ui/react/dialog';

export type SheetProps = SheetPrimitive.Root.Props;

export type SheetTriggerProps = SheetPrimitive.Trigger.Props;

export type SheetCloseProps = SheetPrimitive.Close.Props;

export type SheetPortalProps = SheetPrimitive.Portal.Props;

export type SheetOverlayProps = SheetPrimitive.Backdrop.Props;

export type SheetContentProps = SheetPrimitive.Popup.Props & {
    side?: 'top' | 'right' | 'bottom' | 'left';
    showCloseButton?: boolean;
};

export type SheetHeaderProps = React.ComponentProps<'div'>;

export type SheetFooterProps = React.ComponentProps<'div'>;

export type SheetTitleProps = SheetPrimitive.Title.Props;

export type SheetDescriptionProps = SheetPrimitive.Description.Props;
