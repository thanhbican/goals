import express, { Router } from 'express'

import { login, logout, signIn } from '../controllers/auth'
import { currentUser } from '../middlewares/currentUser'
import { requireAuth } from '../middlewares/requireAuth'

const router = express.Router() as Router

router.get('/auth/user', currentUser, (req, res) => {
  res.send(req.currentUser || null)
})
router.post('/auth/signup', signIn)
router.post('/auth/login', login)
router.post('/auth/logout', requireAuth, logout)

export { router as authRouter }
