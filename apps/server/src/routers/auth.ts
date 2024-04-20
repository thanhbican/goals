import express, { Router } from 'express'

import { login, logout, signIn } from '../controllers/auth'
import { NotAuthError } from '../errors/status/notAuthError'
import { currentUser } from '../middlewares/currentUser'
import { requireAuth } from '../middlewares/requireAuth'
import { User } from '../models/user'

const router = express.Router() as Router

router.get('/auth/user', requireAuth, async (req, res) => {
  const user = await User.findOne({ username: req.currentUser.username })
  if (!user) {
    throw new NotAuthError()
  }

  res.status(200).send({
    username: user.username,
    id: user.id,
    balance: user.balance,
  })
})
router.post('/auth/signup', signIn)
router.post('/auth/login', login)
router.post('/auth/logout', logout)

export { router as authRouter }
