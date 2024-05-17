import http from '@/services/http'

import { RoundResponse } from '@/types/round'

const getRounds = async (gameId: string): Promise<RoundResponse> => {
  try {
    const res = await http.get<RoundResponse>(`/rounds/${gameId}`)
    return res.data
  } catch (err) {
    throw err
  }
}

export { getRounds }
