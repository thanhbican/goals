<template>
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
    <div class="col-span-8">
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
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

interface BetState {
  betAmount: number | null
  accountAmount: number
  increments: number[]
}

const initialState: BetState = {
  betAmount: null,
  accountAmount: 1000,
  increments: [0.01, 0.1, 1, 10, 100],
}

const state = ref<BetState>({ ...initialState })

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
    Math.min(newAmount, state.value.accountAmount)
  )
}

const halfBetAmount = () => {
  if (state.value.betAmount !== null) {
    state.value.betAmount = Math.max(
      0.01,
      Math.round((state.value.betAmount / 2) * 100) / 100
    )
  }
}

const doubleBetAmount = () => {
  if (state.value.betAmount !== null) {
    state.value.betAmount = Math.max(
      0.01,
      Math.round(state.value.betAmount * 2 * 100) / 100
    )
  }
}

const maxBetAmount = () => {
  state.value.betAmount = state.value.accountAmount
}
</script>

<style scoped></style>
