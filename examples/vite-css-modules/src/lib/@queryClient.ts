import type { HTTPError } from 'ky';
import type { BaseErrorData } from '@/lib/@http';
import { QueryCache, QueryClient } from '@tanstack/react-query';
import { isHTTPError } from 'ky';
import { COMMON_ERROR_MESSAGE } from '@/lib/constants';
import { toast } from '@/components/ui/Toast';

declare module '@tanstack/react-query' {
    interface Register {
        defaultError: HTTPError<BaseErrorData>;
    }
}

export const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            retry: false,
            refetchOnWindowFocus: false,
            throwOnError: true,
        },
        mutations: {
            retry: false,
        },
    },
    queryCache: new QueryCache({
        onError(error, query) {
            const hasQueryData = query.state.data !== undefined;
            if (hasQueryData && isHTTPError(error) && error.data !== undefined) {
                // TODO: The API error messages should be aligned with BE engineers
                const message = typeof error.data === 'string' ? error.data : error.data.message;
                toast.add({ type: 'error', title: message || error.message });
            } else if (hasQueryData && error instanceof Error) {
                toast.add({ type: 'error', title: error?.message || COMMON_ERROR_MESSAGE });
            }
        },
    }),
});
