<script setup lang="ts">
import Roulette from './components/Roulette.vue';
import Chat from './components/Chat.vue';
</script>

<template>
  <div class="flex">
    <aside class="h-screen min-w-[350px] m-w-[375px] bg-white border-r">
      <Chat />
    </aside>
    <div class="flex-1">
      <Roulette />
    </div>
  </div>


</template>
