import userApi from '@/api/userApi'
import { roundMoney } from '@/helper/util'
import { defineStore } from 'pinia'

import { User } from '@/types/user'

export const useUserStore = defineStore({
  id: 'user',
  state: (): User => ({
    id: null,
    username: null,
    balance: 0,
  }),
  getters: {
    isUserLoggedIn: (state) => state.id !== null && state.username !== null,
  },
  actions: {
    async getUser() {
      try {
        const user = await userApi.getUser()
        this.setUser(user)
      } catch (err) {
        console.error(err)
        this.resetUser()
      }
    },
    setUser(user: User) {
      this.id = user.id
      this.username = user.username
      this.balance = user.balance
    },
    resetUser() {
      this.id = null
      this.username = null
      this.balance = 0
    },
    changeBalance(amount: number) {
      this.balance = roundMoney(this.balance + amount)
    },
    setBalance(balance: number) {
      this.balance = balance
    },
  },
})
