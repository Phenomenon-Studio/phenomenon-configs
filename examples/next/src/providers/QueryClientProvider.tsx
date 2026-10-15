'use client';

import React from 'react';
import { QueryClientProvider as TanstackQueryClientProvider } from '@tanstack/react-query';
import { getQueryClient } from '@/services/@queryClient';

export default function QueryClientProvider({ children }: React.PropsWithChildren) {
    const [queryClient] = React.useState(() => {
        return getQueryClient();
    });

    return <TanstackQueryClientProvider client={queryClient}>{children}</TanstackQueryClientProvider>;
}
