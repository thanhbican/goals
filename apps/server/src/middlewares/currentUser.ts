import { NextFunction, Request, Response } from 'express'
import jwt from 'jsonwebtoken'

import { NotAuthError } from '../errors/status/notAuthError'
import { UserPayload } from '../types/user'

declare global {
  namespace Express {
    interface Request {
      currentUser?: UserPayload
      session: {
        jwt?: string
      } | null
    }
  }
}

const currentUser = (req: Request, res: Response, next: NextFunction) => {
  if (!req?.session?.jwt) {
    throw new NotAuthError()
  }

  const token = req.session.jwt

  try {
    const payload = jwt.verify(token, process.env.JWT_TOKEN!) as UserPayload
    req.currentUser = payload
  } catch (err) {
    console.error(err)
    throw new NotAuthError()
  }

  next()
}

export { currentUser }
