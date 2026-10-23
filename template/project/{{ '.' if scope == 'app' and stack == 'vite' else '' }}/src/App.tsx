import { useState } from 'react';
import { QueryClientProvider } from '@tanstack/react-query';
import { RouterProvider } from '@tanstack/react-router';
import { ErrorBoundary } from 'react-error-boundary';
import { queryClient } from '@/lib/@queryClient';
import { router } from '@/lib/@router';
import { envSchema } from '@/lib/schemas';
import { checkEnv } from '@/lib/utils/checkEnv';
import { useRemoveInitialStyle } from '@/hooks/useRemoveInitialStyle';
import { GlobalError } from '@/components/GlobalError';

function InnerApp() {
    // eslint-disable-next-line @eslint-react/use-state -- run env check once during render so GlobalError catches it
    useState(() => {
        checkEnv(envSchema);
    });
    useRemoveInitialStyle();

    return (
        <QueryClientProvider client={queryClient}>
            <RouterProvider router={router} />
        </QueryClientProvider>
    );
}

function App() {
    return (
        <ErrorBoundary
            FallbackComponent={GlobalError}
            onReset={() => {
                window.location.reload();
            }}
        >
            <InnerApp />
        </ErrorBoundary>
    );
}

export { App };
