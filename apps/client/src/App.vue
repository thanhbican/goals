<template>
  <div data-theme="dark">
    <Header />
    <PolicyModal />
    <div class="flex h-screen pt-[50px]">
      <Chat />
      <div class="flex-1 overflow-hidden px-8 pt-4">
        <div class="max-w-[1100px] mx-auto space-y-4">
          <router-view></router-view>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'

import Chat from './components/Chat.vue'
import Header from './components/layout/Header.vue'
import PolicyModal from './components/PolicyModal.vue'
import { socket } from './services/socket'

onMounted(() => {
  socket.connect()
  socket.on('disconnect', () => {
    socket.connect()
  })
})
</script>
