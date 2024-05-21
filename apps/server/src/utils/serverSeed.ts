import { randomBytes } from 'crypto'

function generateServerSeed() {
  const serverSeed = randomBytes(32).toString('hex')
  return serverSeed
}

export { generateServerSeed }
