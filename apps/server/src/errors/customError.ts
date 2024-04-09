export abstract class CustomError extends Error {
  abstract status: number

  constructor(message: string) {
    super(message)

    // set the property explicity
    Object.setPrototypeOf(this, CustomError.prototype)
  }

  abstract serializeErrors(): { message: string; field?: string }[]
}
