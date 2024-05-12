import http from '@/services/http'

import { GamesResponse } from '@/types/game'

const getGames = async (page: number = 1): Promise<GamesResponse> => {
  try {
    const query = `?page=${page}`
    const res = await http.get<GamesResponse>(`/games${query}`)
    return res.data
  } catch (err) {
    throw err
  }
}

export { getGames }
