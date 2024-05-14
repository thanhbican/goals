import { defineStore } from 'pinia'

interface AuthModalState {
  state: boolean
}

export const useAuthModalStore = defineStore({
  id: 'authModal',
  state: (): AuthModalState => ({
    state: false,
  }),
  getters: {},
  actions: {
    openModal() {
      this.state = true
    },
    closeModal() {
      this.state = false
    },
  },
})
