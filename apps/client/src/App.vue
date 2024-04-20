<script setup lang="ts">
import Chat from './components/Chat.vue'
import GameAmount from './components/GameAmount.vue'
import GameBoard from './components/GameBoard.vue'
import Header from './components/layout/Header.vue'
import Roulette from './components/Roulette.vue'
import { socket } from './services/socket'

socket.connect()
</script>

<template>
  <div data-theme="dark">
    <div class="flex h-screen">
      <Chat />
      <div class="flex-1 overflow-hidden select-none">
        <Header />
        <Roulette />
        <GameAmount />
        <GameBoard />
      </div>
    </div>
  </div>
</template>
