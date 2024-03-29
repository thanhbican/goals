import { defineStore } from 'pinia'

interface GameState {
  amount: number | null // Type annotation for amount
}

export const useGameStore = defineStore({
  id: 'game',
  state: (): GameState => ({
    amount: null,
  }),
  getters: {},
  actions: {
    changeAmount(amount: number) {
      this.amount = amount
    },
  },
})
