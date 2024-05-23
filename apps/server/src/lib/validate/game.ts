import { z } from 'zod'

export const gameChooseSchema = z.object({
  place: z.enum(['black', 'green', 'red']),
  betAmount: z.number(),
})

export type GameChooseSchema = z.infer<typeof gameChooseSchema>
