import { SHA256 } from 'crypto-js'

const sha256 = (input: string) => {
  return SHA256(input).toString()
}

const randomCircleNumber = (min: number, max: number) => {
  return Math.random() * (max - min) + min
}

const roundMoney = (amount: number) => {
  return Math.round(amount * 100) / 100
}

export { sha256, randomCircleNumber, roundMoney }
