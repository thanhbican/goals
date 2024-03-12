import randomBytes from 'randomBytes'

function generateServerSeed() {
  // Generate a random string for the server seed
  const serverSeed = randomBytes(32).toString('hex')
  // Hash the server seed
  // console.log('Server seed generated and hashed:', hashedSeed)
  return serverSeed
}

export { generateServerSeed }
