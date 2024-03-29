import { roundMoney } from '@/helper/util'
import { defineStore } from 'pinia'

interface UserState {
  balance: number // Type annotation for amount
}

export const useUserStore = defineStore({
  id: 'user',
  state: (): UserState => ({
    balance: 1000,
  }),
  getters: {},
  actions: {
    changeBalance(amount: number) {
      this.balance = roundMoney(this.balance + amount)
    },
    setBalance(balance: number) {
      this.balance = balance
    },
  },
})
