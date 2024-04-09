import { NextFunction, Request, Response } from 'express'

import { NotAuthError } from '../errors/status/notAuthError'

const requireAuth = (req: Request, res: Response, next: NextFunction) => {
  if (!req.currentUser) {
    throw new NotAuthError()
  }
  next()
}

export { requireAuth }
