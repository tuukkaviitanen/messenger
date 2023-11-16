import {z} from 'zod'

export const userWithTokenSchema = z.object({
  username: z.string(),
  token: z.string(),
})

export type UserWithToken = z.infer<typeof userWithTokenSchema>;
