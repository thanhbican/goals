function getRandomNumber(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min) + min)
}

// Function to generate a random pair of numbers in the format "01" to "39"
function generateRandomPair(): string {
  const firstDigit = getRandomNumber(1, 40).toString().padStart(2, '0')
  const secondDigit = getRandomNumber(1, 40).toString().padStart(2, '0')
  return `${firstDigit}${secondDigit}`
}

// Function to generate the public seed
function generatePublicSeed(): string {
  let publicSeed = ''
  for (let i = 0; i < 5; i++) {
    publicSeed += generateRandomPair()
  }
  return publicSeed
}

export { generatePublicSeed }
