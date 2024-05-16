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

  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const processedGames = games.map((game) => {
    const createdAt = new Date(game.createdAt)
    createdAt.setHours(0, 0, 0, 0)

    if (createdAt.getTime() === today.getTime()) {
      // Send only publicSeed if the game was created today
      return { publicSeed: game.publicSeed, date: game.createdAt, id: game.id }
    } else {
      // Send both publicSeed and serverSeed otherwise
      return {
        publicSeed: game.publicSeed,
        serverSeed: game.serverSeed,
        date: game.createdAt,
        id: game.id,
      }
    }
  })

  res.status(200).json({
    games: processedGames,
    page,
    totalPages,
    perPage,
    totalGames,
  })
}

export { getGames }
