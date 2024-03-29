<template>
  <h1>Balance: {{ state.userBalance }}</h1>
  <div class="grid grid-cols-12">
    <div class="col-span-4">
      <label class="input input-bordered flex items-center gap-2">
        <input
          v-model="state.betAmount"
          type="number"
          placeholder="Enter bet amount"
        />
      </label>
    </div>
    <div class="col-span-8 space-x-4">
      <button @click="clearBetAmount">CLEAR</button>
      <button
        v-for="increment in state.increments"
        :key="increment"
        @click="changeBetAmount(increment)"
      >
        +{{ increment }}
      </button>
      <button @click="halfBetAmount">1/2</button>
      <button @click="doubleBetAmount">x2</button>
      <button @click="maxBetAmount">Max</button>
      {{ gameStore.amount }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { roundMoney } from '@/helper/util'
import { useGameStore } from '@/store/game'
import { useUserStore } from '@/store/user'
import { ref, watchEffect } from 'vue'

interface BetState {
  betAmount: number | null
  userBalance: number
  increments: number[]
}

const initialState: BetState = {
  betAmount: null,
  userBalance: 0,
  increments: [0.01, 0.1, 1, 10, 100],
}

const gameStore = useGameStore()
const userStore = useUserStore()

const state = ref<BetState>({ ...initialState })

watchEffect(() => {
  // Whenever state.betAmount changes, update gameStore.amount
  if (gameStore.amount && gameStore.amount > userStore.balance) {
    state.value.betAmount = userStore.balance
  }
  if (state.value.betAmount !== null) {
    state.value.betAmount = Math.min(
      state.value.betAmount,
      state.value.userBalance
    )
    gameStore.changeAmount(state.value.betAmount)
  }

  if (userStore.balance >= 0) {
    state.value.userBalance = userStore.balance
  }
})

const clearBetAmount = () => {
  state.value.betAmount = 0
}

const changeBetAmount = (amount: number) => {
  if (state.value.betAmount === null) {
    state.value.betAmount = 0
  }
  const newAmount = Math.round((state.value.betAmount + amount) * 100) / 100
  state.value.betAmount = Math.max(
    0.01,
    Math.min(newAmount, state.value.userBalance)
  )
}

const halfBetAmount = () => {
  if (state.value.betAmount) {
    state.value.betAmount = Math.max(
      0.01,
      roundMoney(state.value.betAmount / 2)
    )
  }
}

const doubleBetAmount = () => {
  if (state.value.betAmount) {
    state.value.betAmount = Math.max(
      0.01,
      roundMoney(state.value.betAmount * 2)
    )
  }
}

const maxBetAmount = () => {
  state.value.betAmount = state.value.userBalance
}
</script>

<style scoped></style>
