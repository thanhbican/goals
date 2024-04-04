import { CustomError } from '../customError'

export class BadRequestError extends CustomError {
  constructor(message = 'Bad request') {
    super(400, message)
  }
  serializeErrors() {
    return [{ message: this.message }]
  }
}
