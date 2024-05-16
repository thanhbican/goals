import { Request, Response } from 'express'

import { Round } from '../models/Round'

const getRounds = async (req: Request, res: Response) => {
  const { gameId } = req.params

  const rounds = await Round.find({ gameId }).sort({ createdAt: -1 })

  res.status(200).send(rounds)
}

export { getRounds }
