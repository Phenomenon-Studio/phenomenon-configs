import type { FallbackProps } from 'react-error-boundary';
import { OctagonX, RotateCcw } from 'lucide-react';
import { getErrorMessage } from 'react-error-boundary';
import { COMMON_ERROR_MESSAGE } from '@/lib/constants';
import { Button } from '@/components/ui/Button';
import { EmptyState } from '@/components/ui/EmptyState';

function GlobalError({ error, resetErrorBoundary }: FallbackProps) {
    return (
        <EmptyState Icon={OctagonX} title="Error" description={getErrorMessage(error) || COMMON_ERROR_MESSAGE}>
            <Button onClick={resetErrorBoundary}>
                <RotateCcw aria-hidden />
                Retry
            </Button>
        </EmptyState>
    );
}

export { GlobalError };
