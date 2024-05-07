<template>
  <section class="min-h-8">
    <ul class="flex justify-center gap-x-4">
      <li
        v-for="(round, index) in historyRound"
        :key="index"
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
import { ref } from 'vue'

const historyRound: any = ref([])

socket.on('game:round', (rounds) => {
  historyRound.value = rounds
})
</script>

<style scoped></style>
