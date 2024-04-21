import { SHA256 } from 'crypto-js'

const sha256 = (input: string) => {
  return SHA256(input).toString()
}

const randomCircleNumber = (min: number, max: number) => {
  return Math.random() * (max - min) + min
}

export { sha256, randomCircleNumber }
