import {z} from 'zod';
import {userPublicSchema} from './UserPublic';

export const messageContentSchema = z.object({
	message: z.string(),
	sender: z.string(),
	timestamp: z.date(),
	recipients: z.array(userPublicSchema).optional(),
});

export const messageContentStringTimestampSchema = z.object({
	message: z.string(),
	sender: z.string(),
	timestamp: z.string().datetime(),
	recipients: z.array(userPublicSchema).optional(),
});

export type MessageContent = z.infer<typeof messageContentSchema>;
