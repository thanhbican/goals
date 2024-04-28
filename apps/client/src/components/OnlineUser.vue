<template>
  <h2 class="ml-auto text-lg space-x-2">
    <span class="circle-green"></span>
    <span>{{ users }} online</span>
  </h2>
</template>

<script setup lang="ts">
import { ref } from 'vue'

import { socket } from '../services/socket'

const users = ref(0)

socket.on('user:online', ({ onlineUsers }: { onlineUsers: number }) => {
  users.value = onlineUsers
})
</script>

<style scoped lang="scss">
.circle-green {
  display: inline-block;
  width: 10px;
  height: 10px;
  background: #449d44;
  border-radius: 100%;
}
</style>
