<template>
  <GamePolicy />
  <Roulette />
  <GameHistory />
  <GameAmount />
  <GameBoard />
  <GameSound />
</template>

<script setup lang="ts">
import { socket } from '@/services/socket'
import { onMounted } from 'vue'

import GameAmount from '@/components/GameAmount.vue'
import GameBoard from '@/components/GameBoard.vue'
import GameHistory from '@/components/GameHistory.vue'
import GamePolicy from '@/components/GamePolicy.vue'
import GameSound from '@/components/GameSound.vue'
import Roulette from '@/components/Roulette.vue'

onMounted(() => {
  // console.log('z')
  //   socket.disconnect()
  //   socket.connect()
})
</script>
