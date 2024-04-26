<template>
  <section class="grid grid-cols-12 gap-4">
    <div v-for="place in places" :key="place" class="col-span-4">
      <button
        class="border border-white w-full"
        :class="{
          'cursor-pointer': !!isBetEnabled,
          'cursor-not-allowed': !!!isBetEnabled,
        }"
        :disabled="!isBetEnabled"
        @click="onBet(place)"
      >
        <div
          v-if="place === 'red'"
          class="flex justify-between items-center bg-red text-white p-4"
        >
          <p>1 to 7</p>
          <p>WIN 2x</p>
        </div>
        <div
          v-if="place === 'green'"
          class="flex justify-between items-center bg-green text-white p-4"
        >
          <p>0</p>
          <p>WIN 14x</p>
        </div>
        <div
          v-if="place === 'black'"
          class="flex justify-between items-center bg-black text-white p-4"
        >
          <p>8 to 14</p>
          <p>WIN 2x</p>
        </div>
      </button>

      <div class="bg-[rgba(0,0,0,.5)] text-[#c0c0c0] p-4">
        <div class="flex justify-between items-center">
          <h2>{{ betListTotal[place].length }} bets in totals</h2>
          <div class="flex items-center gap-x-2">
            <img
              src="@/assets/money_img.svg"
              width="16"
              height="16"
              alt="money icon"
            />
            <p ref="total">0</p>
          </div>
        </div>
        <ul v-if="betList[place]?.length" class="mt-4 space-y-2">
          <li
            v-for="player in betList[place]"
            class="flex justify-between items-center"
          >
            <h3>{{ player.username }}</h3>
            <p>{{ player.betAmount }}</p>
          </li>
        </ul>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { animateMoney, roundMoney } from '@/helper/util'
import { useGameStore } from '@/store/game'
import { useUserStore } from '@/store/user'
import { onMounted, ref } from 'vue'

import { BetList, BetListTotal, BetTotal, RollColor } from '@/types/game'

import { socket } from '../services/socket'

// store
const gameStore = useGameStore()
const userStore = useUserStore()

// variable
const places = ['red', 'green', 'black'] as const
const isBetEnabled = ref(false)
const betList = ref<BetList>({
  red: [],
  green: [],
  black: [],
})
const betListTotal = ref<BetListTotal>({
  red: {
    total: 0,
    length: 0,
  },
  green: {
    total: 0,
    length: 0,
  },
  black: {
    total: 0,
    length: 0,
  },
})
const total = ref<HTMLElement[] | null>(null)

// socket
socket.on('game:waiting', ({ betList: list, betListTotal: listTotal }) => {
  betList.value = list
  betListTotal.value = listTotal
  animationTotal()

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
    animationTotal()
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

const animationTotal = () => {
  Object.keys(betListTotal.value).forEach((place, index) => {
    if (!total.value) return

    const key = place as keyof BetListTotal
    animateMoney(total.value[index], betListTotal.value[key].total)
  })
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
