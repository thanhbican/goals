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

export interface Game {
  publicSeed: string
  date: string
  serverSeed?: string
  id: string
}

export interface GamesResponse {
  games: Game[]
  page: number
  totalPages: number
  perPage: number
  totalGames: number
}

export type RollColor = 'black' | 'red' | 'green'
