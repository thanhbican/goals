import { Request } from 'express'

import { roundMoney } from '../../helpers/util'
import { gameChooseSchema, GameChooseSchema } from '../../lib/validate/game'
import { User } from '../models/user'
import { GameConfig, GameSocket, GameSocketEvent } from '../types/game'
import { CallBack } from '../types/socket'
import { generateRoll } from './roll'

const config: GameConfig = {
  isBetEnabled: false,
  betList: {
    black: [],
    green: [],
    red: [],
  },
  intervalId: null,
  startTime: null,
  timerDuration: 5000,
  updateInterval: 10,
  status: 'none',
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
      const user = await User.findOne({ username })
      if (!user) {
        throw new Error()
      }
      const updatedUser = await User.findOneAndUpdate(
        { username: username },
        { $set: { balance: roundMoney(user.balance - betAmount) } },
        { new: true }
      )

      if (!updatedUser) {
        throw new Error()
      }
      const betPlace = config.betList[place]
      const player = betPlace.find((p) => p.username === username)
      if (!player) {
        betPlace.push({ username, betAmount })
      } else {
        player.betAmount = roundMoney(player.betAmount + betAmount)
      }

      io.emit('game:after-choose', {
        betList: config.betList,
      })

      callback({
        status: 'OK',
        data: {
          balance: updatedUser.balance,
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

const gameRealTime = ({ io }: GameSocket) => {
  config.isBetEnabled = true

  if (!config.startTime) {
    config.startTime = Date.now()
  }

  const currentTime = Date.now()
  const elapsed = currentTime - config.startTime

  let timer = config.timerDuration - elapsed
  if (timer <= 0) {
    io.emit('game:timer', 0)
    gameResetTimer()
    gameRolling({ io })
    setTimeout(() => {
      gameAwarding({ io })
      gameReset({ io })
    }, 6000) // Delay for 6 seconds for game awards
  } else {
    const formattedTimer = (timer / 1000).toFixed(2) // Convert to seconds with two decimal places
    io.emit('game:timer', formattedTimer)
  }
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
    black: [],
    green: [],
    red: [],
  }
  // start game again
  gameWaiting({ io })
}

// start
const gameWaiting = ({ io }: GameSocket) => {
  if (config.intervalId === null) {
    config.status = 'waiting'
    io.emit('game:waiting', { betList: config.betList })

    config.intervalId = setInterval(() => {
      gameRealTime({ io })
    }, config.updateInterval)
  }
}

// roll
const gameRolling = ({ io }: GameSocket) => {
  io.emit('game:rolling', generateRoll())
  config.status = 'rolling'
}

// award and end
const gameAwarding = ({ io }: GameSocket) => {
  config.status = 'rewarding'
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

const initGame = ({ io }: GameSocket) => {
  gameWaiting({ io })

  io.on('connection', (socket) => {
    socket.on('game:status', gameStatus)
    socket.on('game:choose', gameChoose({ io, socket }))

    io.emit('game:choosing', {
      betList: config.betList,
    })
  })
}

// **** Start game
export { initGame }
