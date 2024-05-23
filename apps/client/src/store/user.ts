import userApi from '@/api/userApi'
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
        const currentUser = await userApi.getCurrentUser()
        if (currentUser) {
          const user = await userApi.getUser(currentUser.id)
          if (user) {
            return this.setUser(user)
          }
        }

        this.resetUser()
      } catch (err) {
        console.error(err)
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
    setBalance(balance: number) {
      this.balance = balance
    },
  },
})
