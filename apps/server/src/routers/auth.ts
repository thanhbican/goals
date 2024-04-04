import express from 'express'

const router = express.Router()

router.get('auth/user')
router.post('auth/signin')
router.post('auth/login')
router.post('auth/logout')
