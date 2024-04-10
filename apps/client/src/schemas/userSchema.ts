import { z } from 'zod'

export const userSchema = z.object({
  username: z.string().min(1, 'Username is required'),
  password: z.string().min(1, 'Password is required'),
})

export type UserSchema = z.infer<typeof userSchema>
