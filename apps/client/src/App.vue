<script setup lang="ts">
import Chat from './components/Chat.vue'
import GameAmount from './components/GameAmount.vue'
import GameBoard from './components/GameBoard.vue'
import Roulette from './components/Roulette.vue'
</script>

<template>
  <div class="flex h-screen" data-theme="dark">
    <Chat />
    <div class="flex-1 overflow-hidden select-none">
      <Roulette />
      <GameAmount />
      <GameBoard />
    </div>
  </div>
</template>
