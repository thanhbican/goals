import bcrypt from 'bcrypt'
import { Request, Response } from 'express'
import jwt from 'jsonwebtoken'

import { BadRequestError } from '../errors/status/badRequestError'
import { NotAuthError } from '../errors/status/notAuthError'
import { User } from '../models/User'

const getRound = async (req: Request, res: Response) => {
  const { userId } = req.params

  const existUser = await User.findById(userId)
  if (!existUser) {
    throw new NotAuthError()
  }

  res.status(200).send(existUser)
}

export { getRound }
