import { Request, Response } from 'express'

import { Game } from '../models/Game'

const getGames = async (req: Request, res: Response) => {
  const perPage = 10
  const page = parseInt(req.query.page as string) || 1
  const totalGames = await Game.countDocuments()
  const totalPages = Math.ceil(totalGames / perPage)
  const games = await Game.find({})
    .sort({ createdAt: -1 })
    .skip((page - 1) * perPage)
    .limit(perPage)

  res.status(200).json({
    games,
    page,
    totalPages,
    perPage,
    totalGames,
  })
}

export { getGames }
