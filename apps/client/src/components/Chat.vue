<script setup lang="ts">
import { reactive, ref } from 'vue'

import { socket } from '../services/socket'

const chatValue = ref('')
const chats: any = reactive([])

const onChat = async () => {
  const payload = {
    content: chatValue.value,
  }
  const res = await socket.emitWithAck('chat:send', payload)
  chats.push(res.data.message)

  //clear input
  chatValue.value = ''
}

socket.on('chat:sent', (message) => {
  chats.push(message)
})
</script>
<template>
  <aside class="flex h-full flex-col flex-nowrap w-[250px] px-4">
    <div class="h-12 text-right">
      <h1 class="ml-auto text-lg">2</h1>
    </div>
    <ul class="h-full flex-1">
      <li v-for="(chat, index) in chats" :key="index">
        {{ chat.from }}: {{ chat.content }}
      </li>
    </ul>

    <div>
      <input
        v-model="chatValue"
        type="text"
        placeholder="Type message"
        className="input w-full border-white"
        @keyup.enter="onChat"
      />
    </div>
  </aside>
</template>

<style lang="sass">
// .section-chat
//   padding: 0 2rem
//   border-right: 1px solid #000
</style>
