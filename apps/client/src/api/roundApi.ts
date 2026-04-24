import http from '@/services/http'

import { RoundResponse } from '@/types/round'

const getRoundNumber = (roundId: string) => {
  const value = Number.parseInt(roundId, 10)
  return Number.isNaN(value) ? 0 : value
}

const normalizeRounds = (rounds: RoundResponse): RoundResponse => {
  const uniqueRounds = new Map<string, RoundResponse[number]>()

  rounds
    .slice()
    .sort(
      (current, next) =>
        getRoundNumber(next.roundId) - getRoundNumber(current.roundId)
    )
    .forEach((round) => {
      if (!uniqueRounds.has(round.roundId)) {
        uniqueRounds.set(round.roundId, round)
      }
    })

  return Array.from(uniqueRounds.values())
}

const getRounds = async (gameId: string): Promise<RoundResponse> => {
  try {
    const res = await http.get<RoundResponse>(`/rounds/${gameId}`)
    return normalizeRounds(res.data)
  } catch (err) {
    throw err
  }
}

export { getRounds }
