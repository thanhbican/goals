import 'dotenv/config'

import { json } from 'body-parser'
import cors from 'cors'
import express, { Express } from 'express'

import 'express-async-errors'

import cookieSession from 'cookie-session'
import morgan from 'morgan'

import { errorHandler } from './middlewares/errorHandler'
import { authRouter } from './routers/auth'
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
app.use(cors(corsOptions))

app.use('/api', authRouter)
app.use(errorHandler)

app.get('/', (req, res) => {
  res.status(200).send('ok')
})

export { app }
