<template>
  <div class="flex justify-end items-center gap-4">
    <h1>{{ user.username }}</h1>
    <button class="btn btn-error text-white" @click="logout">Logout</button>
  </div>
</template>

<script setup lang="ts">
import userApi from '@/api/userApi'

import { User } from '@/types/user'

defineProps<{ user: User }>()

const logout = () => {
  userApi.logout()
}
</script>

<style scoped></style>
