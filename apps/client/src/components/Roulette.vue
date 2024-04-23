<template>
  <div class="roulette_overflow">
    <div
      v-show="isTimerCount"
      class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-white text-2xl z-10"
    >
      {{ timer }}
    </div>
    <div
      ref="wheel"
      class="roulette_area"
      :class="{ 'bg-black opacity-20': isTimerCount }"
    ></div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

import { socket } from '../services/socket'

const wheel = ref<HTMLElement | null>(null)
const timer = ref('0')
const isTimerCount = ref(true)

socket.on('game:waiting', () => {
  isTimerCount.value = true
})
socket.on('game:waiting-timer', (value) => {
  timer.value = value
  isTimerCount.value = true
})
socket.on('game:rolling', (position: number) => {
  isTimerCount.value = false
  rolling(position)
})

const rolling = (position: number) => {
  wheel.value!.style.backgroundPositionX = position + 'px'
}
</script>

<style lang="sass">
.roulette_overflow
  position: relative
  overflow: hidden
  width: 600px
  margin: auto
  margin-top: 10px

.roulette_area
  background-image: url("@/assets/roulette_img.png")
  height: 75px
  position: relative
  background-position-x: -262.5px
  background-size: auto 75px
  background-repeat: repeat-x
  transform: translateZ(0)
  transition: none 0s ease 0s

  &:before
    content: ""
    position: absolute
    background: #ffd02d
    height: 100%
    width: 3px
    margin: 0 auto
    left: 0
    right: 0
</style>
