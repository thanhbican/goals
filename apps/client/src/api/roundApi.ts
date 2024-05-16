import http from '@/services/http'

// import { RoundResponse } from '@/types/game'

const getRounds = async (gameId: string): Promise<any> => {
  try {
    const res = await http.get<any>(`/rounds/${gameId}`)
    return res.data
  } catch (err) {
    throw err
  }
}

export { getRounds }
