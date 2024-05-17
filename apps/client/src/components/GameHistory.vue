<template>
  <section class="min-h-8">
    <ul v-if="historyRound" class="flex justify-center gap-x-4">
      <li
        v-for="round in historyRound"
        :key="round.id"
        class="w-4 h-4 rounded-full flex items-center justify-center p-4 text-white"
        :class="`bg-${round.rollColor}`"
      >
        {{ round.roll }}
      </li>
    </ul>
  </section>
</template>

<script setup lang="ts">
import { socket } from '@/services/socket'
import { onMounted, ref } from 'vue'

import { RoundHistory } from '@/types/round'

const historyRound = ref<RoundHistory[] | null>(null)
const isLoaded = ref(false)

socket.on('game:round-history', ({ roundHistory }) => {
  isLoaded.value = true
  historyRound.value = roundHistory
})

onMounted(async () => {
  if (isLoaded.value) return

  try {
    const res = await socket.emitWithAck('game:first-load-history')
    if (res.status === 'OK') {
      historyRound.value = res.data.roundHistory
    }
  } catch (err) {
    console.error(err)
  }
})
</script>

<style scoped></style>
