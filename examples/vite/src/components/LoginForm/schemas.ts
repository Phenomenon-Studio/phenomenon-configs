import { z } from 'zod';

export type LoginSchema = z.infer<typeof loginSchema>;
export const loginSchema = z.object({
    username: z
        .string()
        .trim()
        .min(1, {
            error(iss) {
                if (!iss.input) {
                    return 'This field is required';
                }

                return 'Invalid username';
            },
        }),
    password: z.string().min(5, {
        error(iss) {
            if (!iss.input) {
                return 'This field is required';
            }

            return 'Invalid password';
        },
    }),
});
