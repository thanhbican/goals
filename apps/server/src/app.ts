import 'dotenv/config'

import { json } from 'body-parser'
import cors from 'cors'
import express, { Express } from 'express'

import 'express-async-errors'

import cookieSession from 'cookie-session'
import helmet from 'helmet'
import morgan from 'morgan'

import { currentUser } from './middlewares/currentUser'
import { errorHandler } from './middlewares/errorHandler'
import { authRouter } from './routers/auth'
import { gameRouter } from './routers/game'
import { roundRouter } from './routers/round'
import { corsOptions } from './utils/cors'

const app = express() as Express

app.set('trust proxy', 1) // trust first proxy
app.use(json())
app.use(
  cookieSession({
    signed: false,
    secure: process.env.NODE_ENV !== 'dev',
  })
)
app.use(morgan('dev'))
app.use(helmet())
app.use(cors(corsOptions))

app.use(currentUser)
app.use('/api', authRouter)
app.use('/api', gameRouter)
app.use('/api', roundRouter)
app.use(errorHandler)

app.get('/', (req, res) => {
  res.status(200).send('ok')
})

export { app }
