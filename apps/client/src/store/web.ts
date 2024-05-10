import { defineStore } from 'pinia'

interface WebState {
  isPolicyConsent: boolean
}

export const useWebStore = defineStore({
  id: 'web',
  state: (): WebState => ({
    isPolicyConsent: false,
  }),
  getters: {},
  actions: {
    setPolicyConsent(value: boolean) {
      this.isPolicyConsent = value
    },
  },

  persist: {
    key: 'web-config',
  },
})
