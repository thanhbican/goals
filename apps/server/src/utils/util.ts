import { SHA256 } from 'crypto-js'

function sha256(input: string): string {
  return SHA256(input).toString()
}

export { sha256 }
