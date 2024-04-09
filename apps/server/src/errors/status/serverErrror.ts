import { CustomError } from '../customError'

export class SeverError extends CustomError {
  status = 500
  constructor(message = 'Sever error') {
    super(message)

    Object.setPrototypeOf(this, SeverError.prototype)
  }
  serializeErrors() {
    return [{ message: this.message }]
  }
}
