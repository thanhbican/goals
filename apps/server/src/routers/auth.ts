import express, { Router } from 'express'

import {
  getCurrentUser,
  getUser,
  login,
  logout,
  signIn,
} from '../controllers/auth'
import { currentUser } from '../middlewares/currentUser'

const router = express.Router() as Router

router.get('/auth/user', currentUser, getCurrentUser)
router.get('/auth/user/:userId', getUser)
router.post('/auth/signup', signIn)
router.post('/auth/login', login)
router.post('/auth/logout', logout)

export { router as authRouter }
