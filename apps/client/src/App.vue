<template>
  <div data-theme="dark" class="min-h-screen hidden lg:block">
    <Header />
    <PolicyModal />
    <div class="flex pt-[50px]">
      <Chat />
      <div class="flex-1 px-8 pt-4">
        <div class="max-w-[1100px] mx-auto space-y-4">
          <router-view></router-view>
        </div>
      </div>
    </div>
  </div>
  <div class="lg:hidden h-screen flex items-center justify-center mx-8">
    <h2 class="text-2xl font-bold">
      I've been doing responsive perfect pixel design for many years now, so I'm a bit bored
      with it. For this project, the purpose is just for self-learning, so
      please use a PC or a device larger than 1024px, hahaha.
    </h2>
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
