<template>
  <div class="grid grid-cols-12 gap-4">
    <button
      v-for="place in places"
      :key="place"
      class="col-span-4 border border-white"
      :disabled="!isBetEnabled"
      @click="bet(place)"
    >
      {{ place }}

      <div class="flex justify-between items-center">
        <h2>{{ betPlayersTotal[place]?.length }} bets in totals</h2>
        <p>{{ betPlayersTotal[place]?.totals || 0 }}</p>
      </div>
      <ul>
        <li v-for="player in betPlayers[place]">
          {{ player.username }} : {{ player.betAmount }}
        </li>
      </ul>
      <!-- </ul> -->
    </button>
  </div>
</template>

<script setup lang="ts">
import { roundMoney } from '@/helper/util'
import { useGameStore } from '@/store/game'
import { useUserStore } from '@/store/user'
import { computed, onMounted, ref } from 'vue'

import { socket } from '../services/socket'

// store
const gameStore = useGameStore()
const userStore = useUserStore()

// variable
const places = ['black', 'green', 'red']
const betPlayers: any = ref([])
const isBetEnabled = ref(false)

// socket
socket.on('game:waiting', ({ betList }) => {
  betPlayers.value = betList
  isBetEnabled.value = true
})
socket.on('game:rolling', () => {
  isBetEnabled.value = false
})
socket.on('game:choosing', ({ betList }) => {
  betPlayers.value = betList
})
socket.on('game:balance-after-choose', ({ balance }) => {
  userStore.setBalance(balance)
})

// func
const bet = async (place: string) => {
  if (gameStore.amount && gameStore.amount <= userStore.balance) {
    const betAmount = roundMoney(gameStore.amount)
    const res = await socket.emitWithAck('game:choosing', { place, betAmount })
    if (res.status === 'OK') {
      userStore.setBalance(res.data.balance)
    }
  }
}

const betPlayersTotal = computed(() => {
  const arr: any = {}
  Object.keys(betPlayers.value).forEach((place) => {
    arr[place] = {
      totals: betPlayers.value[place].reduce((a: any, b: any) => {
        return a + b.betAmount
      }, 0),
      length: betPlayers.value[place].length,
    }
  })
  return arr
})

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
