import express, { Router } from 'express'

import { login, logout } from '../controllers/auth'

const router = express.Router() as Router

router.get('/auth/user', (req, res) => {
  res.send('a')
})
router.post('auth/signin')
router.post('auth/login', login)
router.post('auth/logout', logout)

export { router as authRouter }
