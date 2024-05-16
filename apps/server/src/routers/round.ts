import express, { Router } from 'express'

import { getRounds } from '../controllers/round'

const router = express.Router() as Router

router.get('/rounds/:gameId', getRounds)

export { router as roundRouter }
