import type { FallbackProps } from 'react-error-boundary';
import { OctagonX, RotateCcw } from 'lucide-react';
import { getErrorMessage } from 'react-error-boundary';
import { COMMON_ERROR_MESSAGE } from '@/lib/constants';
import { Button } from '@/components/ui/Button';
import { Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from '@/components/ui/Empty';

function GlobalError({ error, resetErrorBoundary }: FallbackProps) {
    return (
        <Empty>
            <EmptyHeader className="max-w-2xl">
                <EmptyMedia variant="icon">
                    <OctagonX />
                </EmptyMedia>
                <EmptyTitle className="text-4xl">Error</EmptyTitle>
                <EmptyDescription className="text-xl">
                    {getErrorMessage(error) || COMMON_ERROR_MESSAGE}
                </EmptyDescription>
            </EmptyHeader>
            <EmptyContent className="max-w-2xl">
                <Button onClick={resetErrorBoundary}>
                    <RotateCcw aria-hidden />
                    Retry
                </Button>
            </EmptyContent>
        </Empty>
    );
}

export { GlobalError };
