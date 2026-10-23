import type { Toast as ToastPrimitive } from '@base-ui/react/toast';

export type ToasterProps = ToastPrimitive.Provider.Props;

export type ToastProviderProps = ToastPrimitive.Provider.Props;

export type ToastPortalProps = ToastPrimitive.Portal.Props;

export type ToastViewportProps = ToastPrimitive.Viewport.Props;

export type ToastProps = ToastPrimitive.Root.Props;

export type ToastContentProps = ToastPrimitive.Content.Props;

export type ToastTitleProps = ToastPrimitive.Title.Props;

export type ToastDescriptionProps = ToastPrimitive.Description.Props;

export type ToastActionProps = ToastPrimitive.Action.Props;

export type ToastCloseProps = ToastPrimitive.Close.Props;

export type ToastIconProps = Pick<ToastPrimitive.Root.ToastObject, 'type'>;

export type ToastState = ToastPrimitive.Root.State;

export type ToastContentState = ToastPrimitive.Content.State;
