import { Request, Response } from 'express'

import { Round } from '../models/Round'

const getRounds = async (req: Request, res: Response) => {
  const { gameId } = req.params

  const rounds = await Round.find({ gameId })
  const uniqueRounds = new Map<string, (typeof rounds)[number]>()

  rounds
    .sort((current, next) => {
      const currentRoundId = Number.parseInt(current.roundId, 10)
      const nextRoundId = Number.parseInt(next.roundId, 10)

      if (currentRoundId !== nextRoundId) {
        return nextRoundId - currentRoundId
      }

      return next.createdAt.getTime() - current.createdAt.getTime()
    })
    .forEach((round) => {
      if (!uniqueRounds.has(round.roundId)) {
        uniqueRounds.set(round.roundId, round)
      }
    })

  res.status(200).send(Array.from(uniqueRounds.values()))
}

export { getRounds }
