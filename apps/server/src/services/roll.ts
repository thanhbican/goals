import dayjs from 'dayjs'
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
  const today = dayjs().startOf('day')
  const creationDate = dayjs(date).startOf('day')
  return creationDate.isSame(today)
}

const generateSeed = async () => {
  try {
    const [round, latestGame] = await Promise.all([
      Round.findOne().sort({ createdAt: -1 }),
      Game.findOne().sort({ createdAt: -1 }),
    ])

    countNumber = parseInt(round?.roundId || '0', 10)

    if (latestGame && isCreatedToday(latestGame.createdAt)) {
      serverSeed = latestGame.serverSeed
      publicSeed = latestGame.publicSeed
    } else {
      serverSeed = generateServerSeed()
      publicSeed = generatePublicSeed()
      await Game.create({ publicSeed, serverSeed })
    }

    console.log(`${serverSeed}-${publicSeed}`)
  } catch (error) {
    console.error('Error generating seed:', error)
  }
}

const generateRoll = () => {
  countNumber += 1
  const roundId = countNumber.toString()
  console.log(roundId)

  const hash = sha256(`${serverSeed}-${publicSeed}-${roundId}`)
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

  return { roll, rollColor, rate, roundId }
}

generateSeed()

// Schedule the task to run every day at 00:00
cron.schedule('0 0 * * *', generateSeed)

export { generateRoll }
