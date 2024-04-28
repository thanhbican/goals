<script setup lang="ts">
import Chat from './components/Chat.vue'
import GameAmount from './components/GameAmount.vue'
import GameBoard from './components/GameBoard.vue'
import GamePolicy from './components/GamePolicy.vue'
import Header from './components/layout/Header.vue'
import Roulette from './components/Roulette.vue'
import { socket } from './services/socket'

socket.connect()
socket.on('disconnect', () => {
  socket.connect()
})
</script>

<template>
  <div data-theme="dark">
    <Header />
    <div class="flex h-screen pt-[50px]">
      <Chat />
      <div class="flex-1 overflow-hidden select-none px-8 pt-4">
        <div class="max-w-[1100px] mx-auto space-y-4">
          <GamePolicy />
          <Roulette />
          <GameAmount />
          <GameBoard />
        </div>
      </div>
    </div>
  </div>
</template>
