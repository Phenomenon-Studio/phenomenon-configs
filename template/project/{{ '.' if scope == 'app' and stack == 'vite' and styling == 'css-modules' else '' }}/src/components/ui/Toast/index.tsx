import type { ToasterProps, ToastIconProps } from './types';
import { Toast as ToastPrimitive } from '@base-ui/react/toast';
import { XIcon } from 'lucide-react';
import { TOAST_ICONS } from './constants';
import s from './styles.module.css';

// Imperative API: `toast.add({ type: 'error', title: '…' })` from anywhere (query client, event handlers).
const toast = ToastPrimitive.createToastManager();

function ToastIcon({ type }: ToastIconProps) {
    const Icon = type === undefined ? undefined : TOAST_ICONS[type];

    if (!Icon) {
        return null;
    }

    return (
        <span className={s.icon} data-type={type}>
            <Icon size={16} aria-hidden={true} />
        </span>
    );
}

function ToastList() {
    const { toasts } = ToastPrimitive.useToastManager();

    return toasts.map((toastItem) => {
        return (
            <ToastPrimitive.Root key={toastItem.id} toast={toastItem} className={s.toast}>
                <ToastPrimitive.Content className={s.content}>
                    <ToastIcon type={toastItem.type} />
                    <div className={s.text}>
                        <ToastPrimitive.Title className={s.title} />
                        <ToastPrimitive.Description className={s.description} />
                    </div>
                    <ToastPrimitive.Close className={s.close} aria-label="Close toast">
                        <XIcon size={16} aria-hidden={true} />
                    </ToastPrimitive.Close>
                </ToastPrimitive.Content>
            </ToastPrimitive.Root>
        );
    });
}

function Toaster({ children, toastManager = toast, ...props }: ToasterProps) {
    return (
        <ToastPrimitive.Provider toastManager={toastManager} {...props}>
            {children}
            <ToastPrimitive.Portal>
                <ToastPrimitive.Viewport className={s.viewport}>
                    <ToastList />
                </ToastPrimitive.Viewport>
            </ToastPrimitive.Portal>
        </ToastPrimitive.Provider>
    );
}

export { Toaster, toast };
