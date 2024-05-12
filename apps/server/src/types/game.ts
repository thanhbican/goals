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
  red: Bet[]
  green: Bet[]
  black: Bet[]
}
export interface BetListTotal {
  red: BetTotal
  green: BetTotal
  black: BetTotal
}
export interface RoundHistory {
  roll: number
  rollColor: string
  roundId: string
}

export interface GameConfig {
  isBetEnabled: boolean
  betList: BetList
  betListTotal: BetListTotal
  intervalId: NodeJS.Timeout | null
  startTime: number | null
  timerWaitingDuration: number
  timerRollingDuration: number
  timerAwardingDuration: number
  updateInterval: number
  status: string
  rollColor: RollColor | null
  roundHistory: RoundHistory[]
}

export type RollColor = 'red' | 'green' | 'black'
