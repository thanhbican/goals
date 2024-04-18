import 'express'

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
