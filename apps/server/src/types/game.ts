import { Server, Socket } from 'socket.io'

export interface GameSocket {
  io: Server
}
export interface GameSocketEvent {
  socket: Socket
  io: Server
}

export interface Bet {
  username: string
  betAmount: number
}
export interface BetTotal {
  total: number
  length: number
}

export interface BetList {
  black: Bet[]
  green: Bet[]
  red: Bet[]
}
export interface BetListTotal {
  black: BetTotal
  green: BetTotal
  red: BetTotal
}

export interface GameConfig {
  isBetEnabled: boolean
  betList: BetList
  betListTotal: BetListTotal
  intervalId: NodeJS.Timeout | null
  startTime: number | null
  timerWaitingDuration: number
  timerRollingDuration: number
  updateInterval: number
  status: string
}

export type RollColor = 'black' | 'red' | 'green'
