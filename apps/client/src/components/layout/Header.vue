<template>
  <header
    class="bg-grey fixed top-0 left-0 h-[50px] w-full opacity-100 z-[9999] pr-8"
  >
    <div class="flex items-center justify-between h-full">
      <div class="w-[250px] text-center">
        <h1 class="font-bold text-2xl space-x-2">
          <span class="text-white">S4mD</span>
          <span class="text-yellow-400">Roulette</span>
        </h1>
      </div>
      <div class="flex-1 flex items-center justify-between">
        <Navigation />
        <div>
          <div v-if="userStore.isUserLoggedIn">
            <UserInfo :user="userStore.$state" />
          </div>
          <!-- <AuthModal v-else /> -->
        </div>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
import { useUserStore } from '@/store/user'
import { onMounted } from 'vue'

import Navigation from '../Navigation.vue'
import AuthModal from '../user/AuthModal.vue'
import UserInfo from '../user/UserInfo.vue'

const userStore = useUserStore()

onMounted(() => {
  userStore.getUser()
})
</script>
