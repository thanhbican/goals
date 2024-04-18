import { NextFunction, Request, Response } from 'express'
import jwt from 'jsonwebtoken'

import { UserPayload } from '../types/user'

const currentUser = (req: Request, res: Response, next: NextFunction) => {
  if (!req?.session?.jwt) {
    return next()
  }

  const token = req.session.jwt

  try {
    const payload = jwt.verify(token, process.env.JWT_TOKEN!) as UserPayload
    req.currentUser = payload
  } catch (err) {
    console.error(err)
  }

  next()
}

export { currentUser }
