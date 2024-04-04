import { CustomError } from '../customError'

export class SeverError extends CustomError {
  constructor(message = 'Sever error') {
    super(500, message)
  }
  serializeErrors() {
    return [{ message: this.message }]
  }
}
