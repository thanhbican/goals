export interface Round {
  gameId: string
  roll: number
  rollColor: string
  roundId: string
  id: string
  createdAt: string
}

export type RoundResponse = Round[]

export interface RoundHistory {
  id: string
  roll: number
  rollColor: string
  roundId: string
}
