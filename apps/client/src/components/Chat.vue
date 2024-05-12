<template>
  <aside class="flex flex-col flex-nowrap w-[250px] px-4 bg-grey">
    <div
      class="fixed top-0 left-0 pt-[50px] h-[calc(100%-100px)] w-[250px] px-2"
    >
      <div class="h-12 text-right">
        <OnlineUser />
      </div>

      <ul
        ref="chatTable"
        class="h-full block space-y-2 overflow-y-auto py-4 chat"
      >
        <li class="break-words" v-for="(chat, index) in chats" :key="index">
          <span class="text-white font-bold">{{ chat.from }}</span
          >: {{ chat.message }}
        </li>
      </ul>
      <div>
        <input
          v-model="chatValue"
          type="text"
          placeholder="Type message..."
          className="input w-full border-white"
          @keyup.enter="onChat"
        />
      </div>
    </div>
  </aside>
</template>
<script setup lang="ts">
import { inject, nextTick, reactive, ref } from 'vue'

import OnlineUser from '@/components/OnlineUser.vue'

import { socket } from '../services/socket'

const chatValue = ref('')
const chats: any = reactive([])
const chatTable = ref<HTMLElement | null>(null)
const showModal = inject('showModal')

const onChat = async () => {
  try {
    const payload = {
      message: chatValue.value,
    }
    const res = await socket.emitWithAck('chat:send', payload)
    console.log(res)
    if (res.status === 'OK') {
      chats.push(res.data.message)
      chatValue.value = ''
      if (chatTable.value) {
        await nextTick()
        chatTable.value.scrollTop = chatTable.value.scrollHeight
      }
    } else {
      // console.log(showModal);
      // if (showModal) {
      //   showModal()
      // }
    }
  } catch (err) {
    console.log('z')
  }
}

socket.on('chat:sent', async (message) => {
  chats.push(message)
  if (chatTable.value) {
    await nextTick()
    chatTable.value.scrollTop = chatTable.value.scrollHeight
  }
})
</script>
<style lang="scss">
.chat {
  /* width */
  &::-webkit-scrollbar {
    width: 10px;
  }

  /* Track */
  &::-webkit-scrollbar-track {
    background: #f1f1f1;
  }

  /* Handle */
  &::-webkit-scrollbar-thumb {
    background: #888;
  }

  /* Handle on hover */
  &::-webkit-scrollbar-thumb:hover {
    background: #555;
  }
}
</style>
