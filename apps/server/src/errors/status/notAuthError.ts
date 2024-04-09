import { CustomError } from '../customError'

export class NotAuthError extends CustomError {
  status = 401
  constructor(message = 'Not auth') {
    super(message)

    Object.setPrototypeOf(this, NotAuthError.prototype)
  }
  serializeErrors() {
    return [{ message: this.message }]
  }
}
