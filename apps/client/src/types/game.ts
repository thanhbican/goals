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
