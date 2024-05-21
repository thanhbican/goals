<template>
  <aside class="flex flex-col flex-nowrap w-[250px] px-4">
    <div
      class="fixed top-0 left-0 pt-[50px] h-[calc(100%-100px)] w-[250px] bg-grey"
    >
      <div class="h-12 text-right px-4">
        <OnlineUser />
      </div>

      <ul
        ref="chatTable"
        class="h-full block space-y-2 overflow-y-auto py-4 px-2 chat bg-grey"
      >
        <li class="break-words" v-for="(chat, index) in chats" :key="index">
          <span class="text-white font-bold">{{ chat.username }}</span
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
import { useAuthModalStore } from '@/store/authModal'
import { nextTick, ref } from 'vue'

import { ChatType } from '@/types/chat'
import OnlineUser from '@/components/OnlineUser.vue'

import { socket } from '../services/socket'

const chatValue = ref('')
const chats = ref<ChatType[] | null>(null)
const chatTable = ref<HTMLElement | null>(null)
const authModal = useAuthModalStore()

const onChat = async () => {
  try {
    const payload = {
      message: chatValue.value,
    }
    const res = await socket.emitWithAck('chat:send', payload)
    if (res.status === 'OK') {
      chats.value?.push(res.data.message)
      chatValue.value = ''
      if (chatTable.value) {
        await nextTick()
        chatTable.value.scrollTop = chatTable.value.scrollHeight
      }
    } else {
      authModal.openModal()
    }
  } catch (err) {
    console.error(err)
  }
}

socket.on('chat:sent', async (message) => {
  chats.value?.push(message)
  if (chatTable.value) {
    await nextTick()
    chatTable.value.scrollTop = chatTable.value.scrollHeight
  }
})

socket.on('chat:get-latest', ({ latestChat }) => {
  chats.value = latestChat
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
