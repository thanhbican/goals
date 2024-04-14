<template>
  <header>
    <!-- If user is logged in, show UserInfo component -->
    <div v-if="userStore.isUserLoggedIn">
      <UserInfo :user="userStore.$state" />
    </div>

    <!-- Otherwise, show Auth component -->
    <AuthModal v-else />
  </header>
</template>

<script setup lang="ts">
import { useUserStore } from '@/store/user'
import { onMounted } from 'vue'

import AuthModal from '../user/AuthModal.vue'
import UserInfo from '../user/UserInfo.vue'

const userStore = useUserStore()

onMounted(() => {
  //first load
  userStore.getUser()
})
</script>
