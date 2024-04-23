<template>
  <div class="grid grid-cols-12 gap-4">
    <button
      v-for="place in places"
      :key="place"
      class="col-span-4 border border-white"
      :class="{
        'cursor-pointer': !!isBetEnabled,
        'cursor-not-allowed': !!!isBetEnabled,
      }"
      :disabled="!isBetEnabled"
      @click="onBet(place)"
    >
      {{ place }}

      <div class="flex justify-between items-center">
        <h2>{{ betListTotal[place].length }} bets in totals</h2>
        <p>{{ betListTotal[place].total || 0 }}</p>
      </div>
      <ul>
        <li v-for="player in betList[place]">
          {{ player.username }} : {{ player.betAmount }}
        </li>
      </ul>
    </button>
  </div>
</template>

<script setup lang="ts">
import { roundMoney } from '@/helper/util'
import { useGameStore } from '@/store/game'
import { useUserStore } from '@/store/user'
import { onMounted, ref } from 'vue'

import { BetList, BetListTotal } from '@/types/game'

import { socket } from '../services/socket'

// store
const gameStore = useGameStore()
const userStore = useUserStore()

// variable
const places = ['black', 'green', 'red'] as const
const isBetEnabled = ref(false)
const betList = ref<BetList>({
  black: [],
  green: [],
  red: [],
})
const betListTotal = ref<BetListTotal>({
  black: {
    total: 0,
    length: 0,
  },
  green: {
    total: 0,
    length: 0,
  },
  red: {
    total: 0,
    length: 0,
  },
})

// socket
socket.on('game:waiting', ({ betList: list, betListTotal: listTotal }) => {
  betList.value = list
  betListTotal.value = listTotal
  isBetEnabled.value = true
})
socket.on('game:waiting-timer', () => {
  isBetEnabled.value = true
})
socket.on('game:rolling', () => {
  isBetEnabled.value = false
})
socket.on(
  'game:choosing-list',
  ({ betList: list, betListTotal: listTotal }) => {
    betList.value = list
    betListTotal.value = listTotal
    console.log(betListTotal.value)
  }
)
socket.on('game:refresh-user', async () => {
  try {
    await userStore.getUser()
  } catch (error) {
    console.error(error)
  }
})

// func
const onBet = async (place: string) => {
  if (gameStore.amount && gameStore.amount <= userStore.balance) {
    const betAmount = roundMoney(gameStore.amount)
    const res = await socket.emitWithAck('game:choosing', { place, betAmount })
    if (res.status === 'OK') {
      userStore.setBalance(res.data.balance)
    }
  }
}

onMounted(async () => {
  const res = await socket.emitWithAck('game:status')
  if (res.status === 'OK') {
    isBetEnabled.value = res.data.isBetEnabled
  }
})
</script>

<style scoped>
/* Add your scoped styles here */
</style>
