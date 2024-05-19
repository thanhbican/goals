import { defineStore } from 'pinia'

interface WebState {
  isPolicyConsent: boolean
  isSoundEnable: boolean
  isPolicyGotIt: boolean
}

export const useWebStore = defineStore({
  id: 'web',
  state: (): WebState => ({
    isPolicyConsent: false,
    isSoundEnable: true,
    isPolicyGotIt: false,
  }),
  getters: {},
  actions: {
    setPolicyConsent(value: boolean) {
      this.isPolicyConsent = value
    },
    setPolicyGotIt(value: boolean) {
      this.isPolicyGotIt = value
    },
    toggleSoundEnable() {
      this.isSoundEnable = !this.isSoundEnable
    },
  },

  persist: {
    key: 'web-config',
  },
})
