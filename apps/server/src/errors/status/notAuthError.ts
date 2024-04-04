import { CustomError } from '../customError'

export class NotAuthError extends CustomError {
  constructor(message = 'Not auth') {
    super(401, message)
  }
  serializeErrors() {
    return [{ message: this.message }]
  }
}
