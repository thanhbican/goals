import { Server, Socket } from 'socket.io'

export interface GameSocket {
  io: Server
}
export interface GameSocketEvent {
  socket: Socket
  io: Server
}

interface Bet {
  username: string
  betAmount: number
}

export interface BetList {
  black: Bet[]
  green: Bet[]
  red: Bet[]
}

export interface GameConfig {
  isBetEnabled: boolean
  betList: BetList
  intervalId: NodeJS.Timeout | null
  startTime: number | null
  timerWaitingDuration: number
  timerRollingDuration: number
  updateInterval: number
  status: string
}
