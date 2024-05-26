import { Request } from 'express'

import { gameChooseSchema, GameChooseSchema } from '../lib/validate/game'
import { Game } from '../models/Game'
import { Round } from '../models/Round'
import { User } from '../models/User'
import {
  Bet,
  BetList,
  BetListTotal,
  GameConfig,
  GameSocket,
  GameSocketEvent,
  GameSocketOnly,
  RollColor,
  RoundHistory,
} from '../types/game'
import { CallBack } from '../types/socket'
import { randomCircleNumber, roundMoney } from '../utils/util'
import { generateRoll } from './roll'

const numbers: { [key: number]: number } = {
  0: 525,
  1: 0,
  2: 150,
  3: 300,
  4: 450,
  5: 675,
  6: 825,
  7: 975,
  8: 1050,
  9: 900,
  10: 750,
  11: 600,
  12: 375,
  13: 225,
  14: 75,
}
const config: GameConfig = {
  isBetEnabled: false,
  betList: {
    red: [],
    green: [],
    black: [],
  },
  betListTotal: {
    red: {
      total: 0,
      length: 0,
    },
    green: {
      total: 0,
      length: 0,
    },
    black: {
      total: 0,
      length: 0,
    },
  },
  intervalId: null,
  startTime: null,
  timerWaitingDuration: 15000,
  timerRollingDuration: 5000,
  timerAwardingDuration: 2500,
  updateInterval: 10,
  status: 'none',
  rollColor: null,
  roundHistory: [],
}

const gameChoose = ({ io, socket }: GameSocketEvent) => {
  return async (payload: GameChooseSchema, callback: CallBack) => {
    try {
      gameChooseSchema.parse(payload)
      const { betAmount, place } = payload
      if (!config.isBetEnabled) return

      const request = socket.request as Request
      const currentUser = request.currentUser
      if (!currentUser) return

      const { username } = currentUser

      const user = await User.findOneAndUpdate(
        { username: username, balance: { $gte: betAmount } },
        { $inc: { balance: -betAmount } },
        { new: true }
      )
      if (!user) {
        throw new Error()
      }

      const betPlace = config.betList[place]
      const player = betPlace.find((p) => p.username === username)
      if (!player) {
        betPlace.push({ username, betAmount })
      } else {
        player.betAmount = roundMoney(player.betAmount + betAmount)
      }

      // sort
      Object.keys(config.betList).forEach((place) => {
        const key = place as keyof BetList
        config.betList[key] = config.betList[key].sort(
          (a, b) => b.betAmount - a.betAmount
        )
      })

      Object.keys(config.betList).forEach((place) => {
        const key = place as keyof BetListTotal
        config.betListTotal[key] = {
          total: config.betList[key].reduce(
            (accumulator: number, currentBet: Bet) => {
              return accumulator + currentBet.betAmount
            },
            0
          ),
          length: config.betList[key].length,
        }
      })

      io.emit('game:choosing-list', {
        betList: getLimitConfigBetList(),
        betListTotal: config.betListTotal,
      })

      // socket.join(user.username)

      callback({
        status: 'OK',
        data: {
          balance: parseFloat(user.balance.toString()),
        },
      })
    } catch (error) {
      callback({
        status: 'ERROR',
        error,
      })
    }
  }
}

const gameRealTimeTimer = ({ io }: GameSocket) => {
  config.isBetEnabled = true

  if (!config.startTime) {
    config.startTime = Date.now()
  }

  const currentTime = Date.now()
  const elapsed = currentTime - config.startTime

  let timer = config.timerWaitingDuration - elapsed
  if (timer <= 0) {
    io.emit('game:waiting-timer', 0)
    gameResetTimer()
    const { rollColor, roundId, roll, rate } = gameRolling({ io })
    setTimeout(() => {
      gameAwarding({ io }, { rollColor, rate })
      gameCreateRound({ io }, { rollColor, roll, roundId })
      setTimeout(() => {
        gameReset({ io })
      }, config.timerAwardingDuration)
    }, config.timerRollingDuration) // Delay for 6 seconds for game awards
  } else {
    const formattedTimer = (timer / 1000).toFixed(2) // Convert to seconds with two decimal places
    io.emit('game:waiting-timer', formattedTimer)
  }
}

const gameCreateRound = async (
  { io }: GameSocket,
  {
    rollColor,
    roll,
    roundId,
  }: { rollColor: RollColor; roll: number; roundId: string }
) => {
  const latestGame = await Game.findOne().sort({ createdAt: -1 })
  if (!latestGame) {
    return
  }

  const newRound = await Round.create({
    gameId: latestGame.id,
    roll,
    rollColor,
    roundId,
  })

  config.roundHistory.push(newRound)
  if (config.roundHistory.length >= 9) {
    config.roundHistory.shift()
  }

  io.emit('game:round-history', { roundHistory: config.roundHistory })
}

const getRounds = async () => {
  const rounds = await Round.find({}).sort({ createdAt: -1 }).limit(10)
  config.roundHistory = rounds.reverse() as RoundHistory[]
}

const gameGetPositionRolling = (number: number) => {
  const cycles = Math.floor(randomCircleNumber(2, 4))
  const scrollForNumber = randomCircleNumber(0, 72)
  const scrollAmount = 825 + numbers[number] + scrollForNumber + 1125 * cycles

  return scrollAmount
}

const gameRealTimeRolling = (
  { io }: GameSocket,
  startValue: number,
  endValue: number,
  duration: number
) => {
  const startTime = Date.now()
  const endTime = startTime + duration
  const totalChange = endValue - startValue

  const interval = setInterval(() => {
    const currentTime = Date.now()
    const timeElapsed = currentTime - startTime
    const progress = timeElapsed / duration

    const currentValue =
      startValue + totalChange * (1 - Math.pow(1 - progress, 2))

    if (currentTime >= endTime) {
      io.emit('game:rolling', endValue)
      clearInterval(interval)
    } else {
      io.emit('game:rolling', currentValue)
    }
  }, 1)
}

const gameResetTimer = () => {
  // reset timer
  if (config.intervalId !== null) {
    clearInterval(config.intervalId)
    config.intervalId = null
    config.startTime = null
  }
}

const gameReset = ({ io }: GameSocket) => {
  // reset game
  config.isBetEnabled = false
  config.betList = {
    red: [],
    green: [],
    black: [],
  }
  config.betListTotal = {
    red: {
      total: 0,
      length: 0,
    },
    green: {
      total: 0,
      length: 0,
    },
    black: {
      total: 0,
      length: 0,
    },
  }
  config.rollColor = null
  // start game again
  gameWaiting({ io })
}

// start
const gameWaiting = ({ io }: GameSocket) => {
  if (config.intervalId === null) {
    config.status = 'waiting'
    io.emit('game:waiting', {
      betList: getLimitConfigBetList(),
      betListTotal: config.betListTotal,
    })

    config.intervalId = setInterval(() => {
      gameRealTimeTimer({ io })
    }, config.updateInterval)
  }
}

// roll
const gameRolling = ({ io }: GameSocket) => {
  config.status = 'rolling'
  const { rollColor, roll, rate, roundId } = generateRoll()
  const position = gameGetPositionRolling(roll)
  gameRealTimeRolling({ io }, 525, -position, config.timerRollingDuration)

  return { rollColor, roll, roundId, rate }
}

// award and end
const gameAwarding = async (
  { io }: GameSocket,
  { rollColor, rate }: { rollColor: RollColor; rate: number }
) => {
  config.status = 'rewarding'
  config.rollColor = rollColor
  if (rollColor === 'green') {
    config.betListTotal[rollColor].total =
      config.betListTotal[rollColor].total * 14
  } else {
    config.betListTotal[rollColor].total =
      config.betListTotal[rollColor].total * 2
  }
  io.emit('game:result', { rollColor, betListTotal: config.betListTotal })

  const users = config.betList[rollColor]
  console.log(users)
  if (!users.length) {
    return
  }

  await User.bulkWrite(
    users.map((user) => {
      const winAmount = roundMoney(user.betAmount * rate)
      console.log('đâshjdasdhaskjdas')
      io.to(user.username).emit('game:refresh-user')
      return {
        updateOne: {
          filter: { username: user.username },
          update: { $inc: { balance: winAmount } },
        },
      }
    })
  )
}

const gameStatus = () => {
  return (callback: CallBack) => {
    if (typeof callback !== 'function') {
      return
    }
    callback({
      status: 'OK',
      data: {
        status: config.status,
        isBetEnabled: config.isBetEnabled,
      },
    })
  }
}

const getLimitConfigBetList = () => {
  const list = { ...config.betList }
  Object.keys(list).forEach((place) => {
    const key = place as keyof BetList
    list[key] = list[key].slice(0, 10)
  })
  return list
}

const getFirstLoadHistory = () => {
  return (callback: CallBack) => {
    if (typeof callback !== 'function') {
      return
    }
    callback({
      status: 'OK',
      data: {
        roundHistory: config.roundHistory,
      },
    })
  }
}
const getFirstLoadBoard = () => {
  return (callback: CallBack) => {
    if (typeof callback !== 'function') {
      return
    }
    callback({
      status: 'OK',
      data: {
        betList: getLimitConfigBetList(),
        betListTotal: config.betListTotal,
        rollColor: config.rollColor,
      },
    })
  }
}

const gameRegisterRoom = ({ socket }: GameSocketOnly) => {
  const request = socket.request as Request
  const currentUser = request.currentUser
  if (!currentUser) return

  const { username } = currentUser
  socket.join(username)
}

const initGame = ({ io }: GameSocket) => {
  getRounds()
  gameWaiting({ io })

  io.on('connection', (socket) => {
    gameRegisterRoom({ socket })

    socket.on('game:status', gameStatus())
    socket.on('game:choosing', gameChoose({ io, socket }))
    socket.on('game:first-load-history', getFirstLoadHistory())
    socket.on('game:first-load-board', getFirstLoadBoard())

    io.emit('game:first-load-board', {
      betList: getLimitConfigBetList(),
      betListTotal: config.betListTotal,
      rollColor: config.rollColor,
    })

    io.emit('game:round-history', {
      roundHistory: config.roundHistory,
    })
  })
}

// **** Start game
export { initGame }
