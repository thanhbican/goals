<template>
  <aside class="hidden lg:flex flex-col flex-nowrap w-full min-w-0 lg:w-[250px] lg:px-4 order-last lg:order-none mt-4 lg:mt-0">
    <div class="bg-grey rounded-md lg:rounded-none lg:fixed lg:top-0 lg:left-0 lg:pt-[50px] lg:h-[calc(100%-100px)] lg:w-[250px]">
      <div class="h-12 flex items-center justify-end px-4">
        <OnlineUser />
      </div>

      <ul
        ref="desktopChatTable"
        class="chat-scroll max-h-56 lg:max-h-none lg:h-full block space-y-2 overflow-y-auto py-4 px-3 lg:px-2 bg-grey min-w-0"
      >
        <li class="break-words [overflow-wrap:anywhere]" v-for="(chat, index) in chats" :key="index">
          <span class="text-white font-bold">{{ chat.username }}</span
          >: {{ chat.message }}
        </li>
      </ul>
      <div class="p-3 lg:p-0">
        <input
          v-model="chatValue"
          type="text"
          placeholder="Type message..."
          class="input w-full min-h-11 border-white"
          @keyup.enter="onChat"
        />
      </div>
    </div>
  </aside>

  <button
    class="btn btn-success btn-circle fixed bottom-4 left-4 z-[9998] h-14 min-h-14 w-14 shadow-2xl lg:hidden"
    type="button"
    aria-label="Open chat"
    :aria-expanded="isChatOpen"
    @click="openChat"
  >
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <path d="M21 15a4 4 0 0 1-4 4H8l-5 3V7a4 4 0 0 1 4-4h10a4 4 0 0 1 4 4z" />
    </svg>
  </button>

  <Transition name="fade">
    <button
      v-if="isChatOpen"
      class="fixed inset-0 z-[10000] bg-black/50 lg:hidden"
      type="button"
      aria-label="Close chat"
      @click="isChatOpen = false"
    ></button>
  </Transition>
  <Transition name="chat-drawer">
    <aside
      v-if="isChatOpen"
      class="fixed left-0 top-0 z-[10001] flex h-dvh w-[min(88vw,360px)] flex-col bg-grey shadow-2xl lg:hidden"
    >
      <div class="flex h-14 shrink-0 items-center justify-between border-b border-white/10 px-4">
        <OnlineUser />
        <button class="btn btn-ghost btn-square min-h-11 h-11 w-11" type="button" aria-label="Close chat" @click="isChatOpen = false">
          <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
            <path d="M18 6 6 18" />
            <path d="m6 6 12 12" />
          </svg>
        </button>
      </div>

      <ul
        ref="mobileChatTable"
        class="chat-scroll min-h-0 flex-1 space-y-2 overflow-y-auto bg-grey px-3 py-4"
      >
        <li class="break-words [overflow-wrap:anywhere]" v-for="(chat, index) in chats" :key="index">
          <span class="text-white font-bold">{{ chat.username }}</span
          >: {{ chat.message }}
        </li>
      </ul>
      <div class="border-t border-white/10 p-3">
        <input
          v-model="chatValue"
          type="text"
          placeholder="Type message..."
          class="input w-full min-h-11 border-white"
          @keyup.enter="onChat"
        />
      </div>
    </aside>
  </Transition>
</template>
<script setup lang="ts">
import { useAuthModalStore } from '@/store/authModal'
import { nextTick, onUnmounted, ref, watch } from 'vue'

import { ChatType } from '@/types/chat'
import OnlineUser from '@/components/OnlineUser.vue'

import { socket } from '../services/socket'

const chatValue = ref('')
const chats = ref<ChatType[] | null>(null)
const desktopChatTable = ref<HTMLElement | null>(null)
const mobileChatTable = ref<HTMLElement | null>(null)
const authModal = useAuthModalStore()
const isChatOpen = ref(false)
let bodyScrollY = 0
let isBodyScrollLocked = false
const bodyScrollStyles = {
  overflow: '',
  position: '',
  top: '',
  width: '',
}

const lockBodyScroll = () => {
  if (isBodyScrollLocked || typeof window === 'undefined') {
    return
  }

  bodyScrollY = window.scrollY
  bodyScrollStyles.overflow = document.body.style.overflow
  bodyScrollStyles.position = document.body.style.position
  bodyScrollStyles.top = document.body.style.top
  bodyScrollStyles.width = document.body.style.width

  document.body.style.overflow = 'hidden'
  document.body.style.position = 'fixed'
  document.body.style.top = `-${bodyScrollY}px`
  document.body.style.width = '100%'
  isBodyScrollLocked = true
}

const unlockBodyScroll = () => {
  if (!isBodyScrollLocked || typeof window === 'undefined') {
    return
  }

  document.body.style.overflow = bodyScrollStyles.overflow
  document.body.style.position = bodyScrollStyles.position
  document.body.style.top = bodyScrollStyles.top
  document.body.style.width = bodyScrollStyles.width
  window.scrollTo(0, bodyScrollY)
  isBodyScrollLocked = false
}

const scrollChats = async () => {
  await nextTick()
  ;[desktopChatTable.value, mobileChatTable.value].forEach((table) => {
    if (table) {
      table.scrollTop = table.scrollHeight
    }
  })
}

const openChat = async () => {
  isChatOpen.value = true
  await scrollChats()
}

watch(isChatOpen, (isOpen) => {
  if (isOpen) {
    lockBodyScroll()
  } else {
    unlockBodyScroll()
  }
})

onUnmounted(unlockBodyScroll)

const onChat = async () => {
  try {
    const payload = {
      message: chatValue.value,
    }
    const res = await socket.emitWithAck('chat:send', payload)
    if (res.status === 'OK') {
      chats.value?.push(res.data.message)
      chatValue.value = ''
      await scrollChats()
    } else {
      authModal.openModal()
    }
  } catch (err) {
    console.error(err)
  }
}

socket.on('chat:sent', async (message) => {
  chats.value?.push(message)
  await scrollChats()
})

socket.on('chat:get-latest', ({ latestChat }) => {
  chats.value = latestChat
})
</script>
<style lang="scss">
.chat-scroll {
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

.fade-enter-active,
.fade-leave-active,
.chat-drawer-enter-active,
.chat-drawer-leave-active {
  transition: opacity 180ms ease, transform 220ms ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.chat-drawer-enter-from,
.chat-drawer-leave-to {
  transform: translateX(-100%);
}
</style>
