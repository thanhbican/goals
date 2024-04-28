import 'express'

import { UserPayload } from './user'

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
