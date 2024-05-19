import express, { Router } from 'express'
import { body, param } from 'express-validator'

import {
  getCurrentUser,
  getUser,
  login,
  logout,
  signIn,
} from '../controllers/auth'
import { currentUser } from '../middlewares/currentUser'
import { validateRequest } from '../middlewares/validateRequest'

const router = express.Router() as Router

router.get('/auth/user', currentUser, getCurrentUser)
router.get(
  '/auth/user/:userId',
  [param('userId').isMongoId()],
  validateRequest,
  getUser
)
router.post(
  '/auth/signup',
  [
    body('username').isString().isLength({ min: 6 }),
    body('password').isString().isLength({ min: 6 }),
  ],
  validateRequest,
  signIn
)
router.post(
  '/auth/login',
  [
    body('username').isString().isLength({ min: 6 }),
    body('password').isString().isLength({ min: 6 }),
  ],
  validateRequest,
  login
)
router.post('/auth/logout', currentUser, logout)

export { router as authRouter }
