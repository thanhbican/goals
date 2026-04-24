<template>
  <section class="min-w-0">
    <div class="mb-4">
      <h2 class="text-2xl text-center">Roll History</h2>
      <p class="text-center text-xl">{{ currentDate }}</p>
    </div>

    <ul v-if="rounds" class="gap-x-2 gap-y-4 grid grid-cols-2 min-[360px]:grid-cols-3 sm:grid-cols-5 lg:grid-cols-10">
      <li v-for="round in rounds" :key="round.id" class="mb-4 min-w-0 text-center">
        <div
          class="w-14 h-14 sm:w-16 sm:h-16 mx-auto text-lg sm:text-xl font-bold col-span-1 rounded-full flex items-center justify-center p-4 text-white"
          :class="`bg-${round.rollColor}`"
        >
          <div>{{ round.roll }}</div>
        </div>
        <div class="text-center mt-1 text-xs sm:text-sm truncate">Round: {{ round.roundId }}</div>
      </li>
    </ul>
  </section>
</template>

<script setup lang="ts">
import { getRounds } from '@/api/roundApi'
import { formatDate } from '@/helper/util'
import { onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'

import { RoundResponse } from '@/types/round'

const route = useRoute()
const rounds = ref<RoundResponse | null>(null)
const currentDate = ref('')

onMounted(async () => {
  const gameId = route.params.gameId as string
  if (gameId) {
    rounds.value = await getRounds(gameId)
    if (rounds.value.length) {
      currentDate.value = formatDate(rounds.value[0].createdAt)
    }
  }
})
</script>

<style scoped></style>
