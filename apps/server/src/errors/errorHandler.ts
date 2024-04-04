import { NextFunction, Request, Response } from 'express'

import { CustomError } from './customError'

export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (err instanceof CustomError) {
    res.status(err.status).send(err.serializeErrors())
  }

  next(err)
}
