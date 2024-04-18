<template>
  <div class="grid grid-cols-12">
    <button
      v-for="place in places"
      :key="place"
      class="col-span-3"
      :disabled="isBetEnabled"
      @click="bet(place)"
    >
      {{ place }}
      <!-- <h1>{{ betAmounts[place] }}</h1> -->
      <!-- <ul v-for="player in playerList"> -->
      <ul>
        <li v-for="player in playerList[place]">
          {{ player.username }} : {{ player.amount }}
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
import { ref } from 'vue'

import { socket } from '../services/socket'

const gameStore = useGameStore()
const userStore = useUserStore()
const betAmounts = ref<{ [key: string]: number }>({
  // Define a reactive object to store bet amounts for each place
  black: 0,
  green: 0,
  red: 0,
})
const playerList: any = ref([])
const isBetEnabled = ref(true)
socket.on('game:start-game', () => {
  isBetEnabled.value = false
})
socket.on('game:start-roll', () => {
  isBetEnabled.value = true
})
socket.on('game:choose-list', (players) => {
  playerList.value = players
})

const places = ['black', 'green', 'red']
// const result = { black: [], green: [], red: [] }

const bet = (place: string) => {
  if (gameStore.amount && gameStore.amount <= userStore.balance) {
    betAmounts.value[place] = roundMoney(
      gameStore.amount + betAmounts.value[place]
    ) // Update the bet amount for the selected place
    userStore.changeBalance(-gameStore.amount)

    socket.emit('game:choose', betAmounts.value)
  }
}
</script>

<style scoped>
/* Add your scoped styles here */
</style>
