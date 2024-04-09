import { CustomError } from '../customError'

export class BadRequestError extends CustomError {
  status = 400
  constructor(message = 'Bad request') {
    super(message)

    Object.setPrototypeOf(this, BadRequestError.prototype)
  }
  serializeErrors() {
    return [{ message: this.message }]
  }
}
