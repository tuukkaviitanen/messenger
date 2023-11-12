import {z} from 'zod';

export const userCredentialsSchema = z.object({
	username: z.string().min(3).max(25),
	password: z.string().min(8),
});

export type UserCredentials = z.infer<typeof userCredentialsSchema>;
