import cron from 'node-cron'

import { Game } from '../models/Game'
import { Round } from '../models/Round'
import { RollColor } from '../types/game'
import { generatePublicSeed } from '../utils/publicSeed'
import { generateServerSeed } from '../utils/serverSeed'
import { sha256 } from '../utils/util'

let serverSeed = ''
let publicSeed = ''
let countNumber = 0

const isCreatedToday = (date: Date) => {
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const creationDate = new Date(date)
  creationDate.setHours(0, 0, 0, 0)
  return creationDate.getTime() === today.getTime()
}

const generateSeed = async () => {
  // Fetch the latest Round and Game simultaneously
  const [round, latestGame] = await Promise.all([
    Round.findOne().sort({ createdAt: -1 }),
    Game.findOne().sort({ createdAt: -1 }),
  ])

  countNumber = parseInt(round?.roundId || '0', 10)
  let serverSeed, publicSeed

  if (latestGame && isCreatedToday(latestGame.createdAt)) {
    serverSeed = latestGame.serverSeed
    publicSeed = latestGame.publicSeed
  } else {
    serverSeed = generateServerSeed()
    publicSeed = generatePublicSeed()
    await Game.create({ publicSeed, serverSeed })
  }

  console.log(serverSeed + '-' + publicSeed)
}

const generateRoll = () => {
  countNumber += 1
  const roundId = countNumber.toString()
  console.log(roundId)
  const hash = sha256(serverSeed + '-' + publicSeed + '-' + roundId)
  const roll = parseInt(hash.substring(0, 8), 16) % 15

  let rollColor: RollColor = 'black'
  let rate = 2

  if (roll === 0) {
    rollColor = 'green'
    rate = 14
  } else if (roll >= 1 && roll <= 7) {
    rollColor = 'red'
    rate = 2
  } else if (roll >= 8 && roll <= 14) {
    rollColor = 'black'
    rate = 2
  }
  // console.log(`Roll: ${roll}`)
  return { roll, rollColor, rate, roundId }
}

generateSeed()
// Schedule the task to run every day at 00:00
cron.schedule('0 0 * * *', generateSeed)
// cron.schedule('*/5 * * * * *', generateRoll)
export { generateRoll }
