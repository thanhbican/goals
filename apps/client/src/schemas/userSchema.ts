import { z } from 'zod'

export const userSchema = z.object({
  username: z.string().min(4, 'Username must be at least 4 characters'),
  password: z.string().min(4, 'Password must be at least 4 characters'),
})

export type UserSchema = z.infer<typeof userSchema>
