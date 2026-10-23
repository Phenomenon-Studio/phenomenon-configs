import type { Toast as ToastPrimitive } from '@base-ui/react/toast';

export type ToasterProps = ToastPrimitive.Provider.Props;

export type ToastIconProps = Pick<ToastPrimitive.Root.ToastObject, 'type'>;
