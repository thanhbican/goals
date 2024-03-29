<template>
  <div class="grid grid-cols-12">
    <div
      v-for="place in places"
      :key="place"
      class="col-span-3"
      @click="bet(place)"
    >
      {{ place }}
      <h1>{{ betAmounts[place] }}</h1>
    </div>
  </div>
</template>

<script setup lang="ts">
import { roundMoney } from '@/helper/util'
import { useGameStore } from '@/store/game'
import { useUserStore } from '@/store/user'
import { ref } from 'vue'

const gameStore = useGameStore()
const userStore = useUserStore()
const betAmounts = ref<{ [key: string]: number }>({
  // Define a reactive object to store bet amounts for each place
  black: 0,
  green: 0,
  red: 0,
})

const places = ['black', 'green', 'red']

const bet = (place: string) => {
  if (gameStore.amount && gameStore.amount <= userStore.balance) {
    betAmounts.value[place] = roundMoney(
      gameStore.amount + betAmounts.value[place]
    ) // Update the bet amount for the selected place
    userStore.changeBalance(-gameStore.amount)
  }
}
</script>

<style scoped>
/* Add your scoped styles here */
</style>
