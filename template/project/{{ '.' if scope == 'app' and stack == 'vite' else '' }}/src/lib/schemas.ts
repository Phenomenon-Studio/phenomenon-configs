import { z } from 'zod';

export type EnvSchema = z.infer<typeof envSchema>;
export const envSchema = z.object({
    VITE_API_URL: z.string(),
});
