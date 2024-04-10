import bcrypt from 'bcrypt'
import { Request, Response } from 'express'
import jwt from 'jsonwebtoken'

import { BadRequestError } from '../errors/status/badRequestError'
import { NotAuthError } from '../errors/status/notAuthError'
import { User } from '../models/user'

const signIn = async (req: Request, res: Response) => {
  const { username, password } = req.body
  const existUser = await User.findOne({ username })
  if (existUser) {
    throw new BadRequestError('Username has been used')
  }

  const hashedPassword = bcrypt.hashSync(password, 12)

  const newUser = await User.create({ username, password: hashedPassword })

  res.status(200).send({ id: newUser.id, username: newUser.username })
}

const login = async (req: Request, res: Response) => {
  const { username, password } = req.body

  const existUser = await User.findOne({ username })
  if (!existUser) {
    throw new NotAuthError()
  }

  const isAuth = bcrypt.compareSync(password, existUser.password)
  if (!isAuth) {
    throw new NotAuthError()
  }

  const payload = {
    id: existUser.id,
    username: existUser.username,
  }

  const jwtToken = jwt.sign(payload, process.env.JWT_TOKEN!)
  req.session = { jwt: jwtToken }

  res.status(200).send(payload)
}

const logout = (req: Request, res: Response) => {
  req.session = null
  res.status(200).send({})
}
export { signIn, login, logout }
