import { COMMON_ERROR_MESSAGE } from '@/lib/constants';
import { toast } from '@/components/ui/Toast';

export const copyToClipboard = async (value: string, successMessage?: string) => {
    try {
        await navigator.clipboard.writeText(value);
        toast.add({ type: 'success', title: successMessage ?? 'Copied to clipboard' });
    } catch (error) {
        if (error instanceof DOMException) {
            toast.add({ type: 'error', title: error.message });
        } else {
            toast.add({ type: 'error', title: COMMON_ERROR_MESSAGE });
        }
    }
};
