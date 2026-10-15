export const getFieldErrorMessage = (errors: unknown[]): string | undefined => {
    if (!errors || errors.length === 0) {
        return undefined;
    }

    for (const error of errors) {
        if (!error) {
            continue;
        }

        if (typeof error === 'string') {
            return error;
        }

        if (typeof error === 'object' && 'message' in error && typeof error.message === 'string') {
            return error.message;
        }

        if (Array.isArray(error)) {
            const nested = getFieldErrorMessage(error);

            if (nested) {
                return nested;
            }
        }
    }

    return undefined;
};
