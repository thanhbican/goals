<template>
  <!-- <div>{{ rounds }}</div> -->
  <ul class="flex justify-center gap-x-4">
    <li
      v-for="(round, index) in rounds"
      :key="round.id"
      class="w-4 h-4 rounded-full flex items-center justify-center p-4 text-white"
      :class="`bg-${round.rollColor}`"
    >
      {{ round.roll }}
    </li>
  </ul>
</template>

<script setup lang="ts">
import { getRounds } from '@/api/roundApi'
import { onMounted, ref, watch } from 'vue'
import { onBeforeRouteUpdate, useRoute } from 'vue-router'

const route = useRoute()
const rounds = ref([])

onMounted(async () => {
  const gameId = route.params.gameId as string
  if (gameId) {
    rounds.value = await getRounds(gameId)
  }
})
</script>

<style scoped></style>
