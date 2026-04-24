<template>
  <div data-theme="dark" class="min-h-screen">
    <Header />
    <PolicyModal />
    <div class="flex flex-col lg:flex-row lg:pt-[50px]">
      <Chat />
      <main class="w-full flex-1 px-3 sm:px-5 lg:px-8 pt-4 pb-6 min-w-0 overflow-hidden">
        <div class="w-full max-w-[1100px] mx-auto space-y-4 min-w-0">
          <router-view></router-view>
        </div>
      </main>
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
