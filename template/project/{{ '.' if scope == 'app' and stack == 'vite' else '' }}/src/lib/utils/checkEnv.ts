import type { ZodObject, ZodRawShape } from 'zod';
import { z, ZodError } from 'zod';

export const checkEnv = <T extends ZodRawShape>(
    envSchema: ZodObject<T>,
    buildEnv: Record<string, string | undefined> = import.meta.env
) => {
    try {
        envSchema.parse(buildEnv);
    } catch (error) {
        if (error instanceof ZodError) {
            let message = 'Missing required environment variables:\n';
            message += Object.keys(z.flattenError(error).fieldErrors).join('\n');
            const newError = new Error(message, { cause: error });
            newError.stack = '';
            throw newError;
        } else {
            throw error;
        }
    }
};
