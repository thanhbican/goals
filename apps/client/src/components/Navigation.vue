<template>
  <ul :class="navigationClasses">
    <li class="cursor-pointer">
      <router-link to="/" :class="linkClasses" @click="emit('navigate')">Roulette</router-link>
    </li>
    <li class="cursor-pointer">
      <router-link to="/fairness" :class="linkClasses" @click="emit('navigate')">Fairness</router-link>
    </li>
    <li class="cursor-pointer">
      <router-link to="/about" :class="linkClasses" @click="emit('navigate')">About</router-link>
    </li>
    <li class="cursor-pointer">
      <a href="https://s4md.com" target="_blank" rel="noopener" :class="linkClasses" @click="emit('navigate')"
        >Another projects</a
      >
    </li>
    <li class="cursor-pointer">
      <a
        href="https://github.com/thanhbican/goals"
        target="_blank"
        rel="noopener"
        :class="linkClasses"
        @click="emit('navigate')"
        >Github</a
      >
    </li>
  </ul>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = withDefaults(
  defineProps<{
    variant?: 'bar' | 'drawer'
  }>(),
  {
    variant: 'bar',
  }
)

const emit = defineEmits<{
  navigate: []
}>()

const navigationClasses = computed(() =>
  props.variant === 'drawer'
    ? 'flex flex-col gap-2 text-lg font-semibold'
    : 'hidden lg:flex items-center gap-x-4 text-base whitespace-nowrap'
)

const linkClasses = computed(() =>
  props.variant === 'drawer'
    ? 'flex min-h-12 items-center rounded-md px-3 hover:bg-white/10'
    : 'inline-flex min-h-11 items-center'
)
</script>

<style scoped></style>
