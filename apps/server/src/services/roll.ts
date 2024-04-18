import cron from 'node-cron'

import { generatePublicSeed } from '../utils/publicSeed'
import { generateServerSeed } from '../utils/serverSeed'
import { sha256 } from '../utils/util'

let serverSeed = '',
  publicSeed = ''
const generateSeed = () => {
  serverSeed = generateServerSeed()
  publicSeed = generatePublicSeed()
}

let count = 0
const generateRoll = () => {
  count += 1
  const round = count + ''
  console.log(round)
  console.log(serverSeed)
  const hash = sha256(serverSeed + '-' + publicSeed + '-' + round)
  const roll = parseInt(hash.substring(0, 8), 16) % 15

  let rollColor = ''

  if (roll === 0) {
    rollColor = 'green'
  } else if (roll >= 1 && roll <= 7) {
    rollColor = 'red'
  } else if (roll >= 8 && roll <= 14) {
    rollColor = 'black'
  }
  console.log(`Roll: ${roll}`)
  console.log(`Colour: ${rollColor}`)
  return roll
}

generateSeed()
// Schedule the task to run every day at 00:00
cron.schedule('0 0 * * *', generateSeed)
// cron.schedule('*/5 * * * * *', generateRoll)
export { generateRoll }
