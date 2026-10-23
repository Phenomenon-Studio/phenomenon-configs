import type { ErrorComponentProps } from '@tanstack/react-router';
import { useEffect } from 'react';
import { useQueryErrorResetBoundary } from '@tanstack/react-query';
import { useRouter } from '@tanstack/react-router';
import { isHTTPError } from 'ky';
import { OctagonX, RotateCcw } from 'lucide-react';
import { COMMON_ERROR_MESSAGE } from '@/lib/constants';
import { Button } from '@/components/ui/Button';
import { Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from '@/components/ui/Empty';

function ErrorComponent({ error }: ErrorComponentProps) {
    const router = useRouter();
    const queryErrorResetBoundary = useQueryErrorResetBoundary();

    useEffect(
        function resetErrorBoundary() {
            queryErrorResetBoundary.reset();
        },
        [queryErrorResetBoundary]
    );

    return (
        <Empty>
            <EmptyHeader className="max-w-2xl">
                <EmptyMedia variant="icon">
                    <OctagonX />
                </EmptyMedia>
                <EmptyTitle className="text-4xl">Error</EmptyTitle>
                <EmptyDescription className="text-xl">
                    {(() => {
                        if (
                            isHTTPError(error) &&
                            error.data &&
                            typeof error.data === 'object' &&
                            'message' in error.data &&
                            typeof error.data.message === 'string'
                        ) {
                            // TODO: The API error messages should be aligned with BE engineers
                            return error.data.message;
                        }

                        if (error instanceof Error) {
                            return error.message;
                        }

                        return COMMON_ERROR_MESSAGE;
                    })()}
                </EmptyDescription>
            </EmptyHeader>
            <EmptyContent className="max-w-2xl">
                <Button
                    onClick={() => {
                        router.invalidate();
                    }}
                >
                    <RotateCcw aria-hidden />
                    Retry
                </Button>
            </EmptyContent>
        </Empty>
    );
}

export { ErrorComponent };
