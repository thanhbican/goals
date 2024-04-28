<template>
  <div class="flex justify-end items-center gap-4">
    <h1 class="font-bold text-xl">
      {{ user.username }}
    </h1>
    <div class="flex items-center gap-x-2 border border-solid p-1">
      <img
        src="@/assets/money_img.svg"
        width="16"
        height="16"
        alt="money icon"
      />
      <p>{{ user.balance }}</p>
    </div>

    <button class="btn btn-error text-white btn-sm" @click="logout">
      Logout
    </button>
  </div>
</template>

<script setup lang="ts">
import userApi from '@/api/userApi'
import { socket } from '@/services/socket'
import { useUserStore } from '@/store/user'

import { User } from '@/types/user'

defineProps<{ user: User }>()
const userStore = useUserStore()

const logout = async () => {
  try {
    await userApi.logout()
    socket.disconnect()
    userStore.resetUser()
  } catch (err) {
    console.error(err)
  }
}
</script>

<style scoped></style>
