<template>
  <header class="bg-grey sticky lg:fixed top-0 left-0 min-h-[56px] lg:h-[50px] w-full opacity-100 z-[9999] px-3 sm:px-5 lg:pr-8 lg:pl-0">
    <div class="flex flex-wrap lg:flex-nowrap items-center justify-between gap-2 h-full py-2 lg:py-0 min-w-0">
      <div class="shrink-0 lg:w-[250px] lg:text-center">
        <h1 class="font-bold text-lg sm:text-xl lg:text-2xl">
          <RouterLink to="/" class="space-x-2">
            <span class="text-white">S4mD</span>
            <span class="text-yellow-400">Roulette</span></RouterLink
          >
        </h1>
      </div>
      <div class="flex-1 flex min-w-0 items-center justify-end lg:justify-between gap-2 sm:gap-3">
        <Navigation />
        <div class="shrink-0">
          <div v-if="userStore.isUserLoggedIn">
            <UserInfo :user="userStore.$state" />
          </div>
          <AuthModal v-else />
        </div>
        <button
          class="btn btn-ghost btn-square min-h-11 h-11 w-11 lg:hidden"
          type="button"
          aria-label="Open navigation menu"
          :aria-expanded="isMenuOpen"
          @click="isMenuOpen = true"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
            <path d="M4 7h16" />
            <path d="M4 12h16" />
            <path d="M4 17h16" />
          </svg>
        </button>
      </div>
    </div>

    <Transition name="fade">
      <button
        v-if="isMenuOpen"
        class="fixed inset-0 z-[10000] bg-black/50 lg:hidden"
        type="button"
        aria-label="Close navigation menu"
        @click="isMenuOpen = false"
      ></button>
    </Transition>
    <Transition name="nav-drawer">
      <aside
        v-if="isMenuOpen"
        class="fixed right-0 top-0 z-[10001] flex h-dvh w-[min(82vw,320px)] flex-col bg-grey p-4 shadow-2xl lg:hidden"
      >
        <div class="mb-5 flex items-center justify-between">
          <span class="font-bold text-yellow-400">Menu</span>
          <button class="btn btn-ghost btn-square min-h-11 h-11 w-11" type="button" aria-label="Close navigation menu" @click="isMenuOpen = false">
            <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
              <path d="M18 6 6 18" />
              <path d="m6 6 12 12" />
            </svg>
          </button>
        </div>
        <Navigation variant="drawer" @navigate="isMenuOpen = false" />
      </aside>
    </Transition>
  </header>
</template>

<script setup lang="ts">
import { useUserStore } from '@/store/user'
import { onMounted, ref } from 'vue'

import Navigation from '../Navigation.vue'
import AuthModal from '../user/AuthModal.vue'
import UserInfo from '../user/UserInfo.vue'

const userStore = useUserStore()
const isMenuOpen = ref(false)

onMounted(() => {
  userStore.getUser()
})
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active,
.nav-drawer-enter-active,
.nav-drawer-leave-active {
  transition: opacity 180ms ease, transform 220ms ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.nav-drawer-enter-from,
.nav-drawer-leave-to {
  transform: translateX(100%);
}
</style>
