<template>
  <section class="flex justify-center items-center h-10">
    <div class="flex border-2 border-grey border-solid">
      <label class="input-bet">
        <input
          v-model="state.betAmount"
          type="number"
          placeholder="Enter bet amount..."
          class="h-10 w-full bg-black pl-8 pr-4 appearance-none border-r border-solid border-grey"
          :class="{ 'is-invalid': !isBetAmountValid }"
        />
      </label>
      <div class="bg-black h-10 space-x-4 text-xs flex items-center px-4">
        <button class="bg-grey w-11 h-5" @click="clearBetAmount">CLEAR</button>
        <button
          v-for="increment in state.increments"
          :key="increment"
          @click="changeBetAmount(increment)"
          class="bg-grey w-11 h-5"
        >
          +{{ increment }}
        </button>

        <button class="bg-grey w-11 h-6" @click="halfBetAmount">1/2</button>
        <button class="bg-grey w-11 h-5" @click="doubleBetAmount">x2</button>
        <button class="bg-grey w-11 h-5" @click="maxBetAmount">Max</button>
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
