export class CustomError extends Error {
  status: number
  message: string
  constructor(status: number, message: string) {
    super(message)
    this.status = status
    this.message = message

    // set the property explicity
    Object.setPrototypeOf(this, CustomError.prototype)
  }

  serializeErrors() {
    return [{ message: this.message }]
  }
}
