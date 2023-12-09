import {z} from 'zod';

export const serverEventSchema = z.object({
	message: z.string(),
	timestamp: z.union([z.string().datetime(), z.date()]),
});

export type ServerEvent = z.infer<typeof serverEventSchema>;
