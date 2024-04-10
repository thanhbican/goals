import { NextFunction, Request, Response } from 'express'

import { CustomError } from '../errors/customError'

export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.error(err)
  if (err instanceof CustomError) {
    return res.status(err.status).send(err.serializeErrors())
  }

  // next(err)
  return res.status(500).send('Something went wrong')
}
