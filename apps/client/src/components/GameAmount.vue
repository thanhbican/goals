<template>
  <section class="flex justify-center items-center min-w-0">
    <div class="flex flex-col sm:flex-row w-full sm:w-auto max-w-full border-2 border-grey border-solid bg-black">
      <label class="input-bet">
        <input
          v-model="state.betAmount"
          type="number"
          placeholder="Enter bet amount..."
          class="h-11 w-full sm:w-56 bg-black pl-8 pr-4 appearance-none border-b sm:border-b-0 sm:border-r border-solid border-grey"
          :class="{ 'is-invalid': !isBetAmountValid }"
        />
      </label>
      <div class="bg-black min-h-11 gap-2 text-xs grid grid-cols-4 min-[420px]:grid-cols-8 sm:flex sm:flex-wrap items-center justify-center px-2 py-2 sm:px-4">
        <button class="bg-grey min-h-11 sm:min-h-9 min-w-0 sm:min-w-11 px-2" @click="clearBetAmount">CLEAR</button>
        <button
          v-for="increment in state.increments"
          :key="increment"
          @click="changeBetAmount(increment)"
          class="bg-grey min-h-11 sm:min-h-9 min-w-0 sm:min-w-11 px-2"
        >
          +{{ increment }}
        </button>

        <button class="bg-grey min-h-11 sm:min-h-9 min-w-0 sm:min-w-11 px-2" @click="halfBetAmount">1/2</button>
        <button class="bg-grey min-h-11 sm:min-h-9 min-w-0 sm:min-w-11 px-2" @click="doubleBetAmount">x2</button>
        <button class="bg-grey min-h-11 sm:min-h-9 min-w-0 sm:min-w-11 px-2" @click="maxBetAmount">Max</button>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { countDecimals, roundMoney, toFixedNoRounding } from '@/helper/util'
import { useGameStore } from '@/store/game'
import { useUserStore } from '@/store/user'
import { ref, watchEffect } from 'vue'

import { BetState } from '@/types/game'

const initialState: BetState = {
  betAmount: null,
  userBalance: 0,
  increments: [0.01, 0.1, 1, 10, 100],
}

const gameStore = useGameStore()
const userStore = useUserStore()

const state = ref<BetState>({ ...initialState })
const isBetAmountValid = ref(true)

watchEffect(() => {
  // Whenever state.betAmount changes, update gameStore.amount
  if (gameStore.amount && gameStore.amount > userStore.balance) {
    state.value.betAmount = userStore.balance
  }
  if (state.value.betAmount !== null) {
    const decimals = countDecimals(state.value.betAmount)
    if (decimals > 2) {
      state.value.betAmount = toFixedNoRounding(state.value.betAmount)
      isBetAmountValid.value = false
      setTimeout(() => {
        isBetAmountValid.value = true
      }, 400)
    }
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

<style scoped lang="scss">
.input-bet {
  position: relative;
  &:before {
    content: '';
    position: absolute;
    top: 50%;
    left: 10px;
    width: 16px;
    height: 16px;
    transform: translate(0, -50%);
    background: url('@/assets/money_img.svg') center/contain no-repeat;
  }
  input {
    &.is-invalid {
      &:focus {
        outline: 2px solid #c9302c;
        border-radius: 2px;
      }
    }
  }
}
</style>
