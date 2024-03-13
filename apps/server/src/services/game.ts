import { GameSocket } from '../types/game'
import { generateRoll } from './roll'

// setInterval
let gameId: any
let timer = 5

const gameStart = ({ io }: GameSocket) => {
  console.log(timer)
  timer--
  if (timer === 0) {
    gameEnd()
    io.emit('game:start-roll', generateRoll())

    // progress
    setTimeout(() => {
      gameAwards({ io })
    }, 3000)
  } else {
    io.emit('game:countdown-time', timer)
  }
}

const gameEnd = () => {
  clearInterval(gameId)
}

const gameRolling = () => {}

const gameAwards = ({ io }: GameSocket) => {
  // progress

  gameRestart({ io })
}

const gameRestart = ({ io }: GameSocket) => {
  timer = 15
  gameWaitList({ io })
}
const gameWaitList = ({ io }: GameSocket) => {
  gameId = setInterval(() => {
    gameStart({ io })
  }, 1000)
}

export { gameWaitList }
