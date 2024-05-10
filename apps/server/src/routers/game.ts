import express, { Router } from 'express'

import { getGames } from '../controllers/game'

const router = express.Router() as Router

router.get('/games', getGames)

export { router as gameRouter }
