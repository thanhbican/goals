import randomBytes from 'randomBytes'

function generateServerSeed() {
  const serverSeed = randomBytes(32).toString('hex')
  return serverSeed
}

export { generateServerSeed }
