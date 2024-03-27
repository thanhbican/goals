import { GameSocket } from '../types/game'
import { generateRoll } from './roll'

let intervalId: NodeJS.Timeout | null = null
let startTime: number | null = null
const timerDuration = 5000 // 5 seconds in milliseconds
const updateInterval = 10 // 10 milliseconds for smoother updates

const gameStart = ({ io }: GameSocket) => {
  io.emit('game:start-game')
  if (!startTime) {
    startTime = Date.now()
  }

  const currentTime = Date.now()
  const elapsed = currentTime - startTime

  let timer = timerDuration - elapsed
  if (timer <= 0) {
    io.emit('game:countdown-time', 0)
    gameEnd()
    io.emit('game:start-roll', generateRoll())

    setTimeout(() => {
      gameAwards({ io })
    }, 6000) // Delay for 6 seconds for game awards
  } else {
    const formattedTimer = (timer / 1000).toFixed(2) // Convert to seconds with two decimal places
    io.emit('game:countdown-time', formattedTimer)
  }
}

const gameEnd = () => {
  if (intervalId !== null) {
    clearInterval(intervalId)
    intervalId = null
    startTime = null
  }
}

const gameAwards = ({ io }: GameSocket) => {
  gameRestart({ io })
}

const gameRestart = ({ io }: GameSocket) => {
  gameWaitList({ io })
}

const gameWaitList = ({ io }: GameSocket) => {
  if (intervalId === null) {
    intervalId = setInterval(() => {
      gameStart({ io })
    }, updateInterval)
  }
}

export { gameWaitList }
