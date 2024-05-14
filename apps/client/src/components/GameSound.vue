<template>
  <section>
    <button
      class="btn bg-transparent hover:bg-grey flex gap-x-2 items-center mr-10 cursor-pointer ml-auto"
      @click="changeState"
    >
      <div>
        <svg
          v-if="isSoundEnable"
          xmlns="http://www.w3.org/2000/svg"
          width="14"
          height="14"
          fill="currentColor"
        >
          <g clip-path="url(#icon-sound_svg__a)">
            <path
              d="M8.658 12.07c-.375.12-.658.452-.658.845 0 .498.443.883.922.747a7.003 7.003 0 0 0 0-13.466C8.443.06 8 .446 8 .943c0 .393.283.725.658.845a5.402 5.402 0 0 1 0 10.282"
            ></path>
            <path
              d="M9.04 3.488C8.548 3.195 8 3.613 8 4.185c0 .342.209.642.479.854.56.439.921 1.122.921 1.89s-.36 1.451-.921 1.89c-.27.212-.479.512-.479.854 0 .572.548.99 1.04.698A4 4 0 0 0 11 6.929a4 4 0 0 0-1.96-3.441M1 4.5a1 1 0 0 0-1 1v3a1 1 0 0 0 1 1h1.124a1 1 0 0 1 .659.247l2.888 2.527a.5.5 0 0 0 .829-.376V2.102a.5.5 0 0 0-.83-.376L2.784 4.253a1 1 0 0 1-.659.247z"
            ></path>
          </g>
          <defs>
            <clipPath id="icon-sound_svg__a">
              <path d="M0 0h14v14H0z"></path>
            </clipPath>
          </defs>
        </svg>
        <svg
          v-else
          xmlns="http://www.w3.org/2000/svg"
          width="14"
          height="14"
          fill="currentColor"
        >
          <g clip-path="url(#icon-sound-off_svg__a)">
            <path
              d="M8.658 12.07c-.375.12-.658.452-.658.845 0 .498.443.883.922.747a7 7 0 0 0 2.39-1.218l.122.122a.8.8 0 0 0 1.132-1.132l-10-10a.8.8 0 0 0-1.132 1.132l1.53 1.529-.181.158a1 1 0 0 1-.659.247H1a1 1 0 0 0-1 1v3a1 1 0 0 0 1 1h1.124a1 1 0 0 1 .659.247l2.888 2.527a.5.5 0 0 0 .829-.376V7.631l1.612 1.612a.9.9 0 0 0-.112.43c0 .572.548.99 1.04.698q.062-.037.123-.077l1.007 1.007c-.456.331-.965.593-1.512.769M14 6.93c0 1.109-.258 2.158-.717 3.09l-1.217-1.217a5.402 5.402 0 0 0-3.408-7.015C8.283 1.668 8 1.336 8 .943c0-.498.443-.883.922-.747A7 7 0 0 1 14 6.93"
            ></path>
            <path
              d="M11 6.93q-.001.38-.068.739L9.174 5.911a2.4 2.4 0 0 0-.695-.872C8.209 4.827 8 4.527 8 4.185c0-.572.548-.99 1.04-.697A4 4 0 0 1 11 6.929M6.5 2.102v1.135L5.307 2.044l.364-.318a.5.5 0 0 1 .829.376"
            ></path>
          </g>
          <defs>
            <clipPath id="icon-sound-off_svg__a">
              <path d="M0 0h14v14H0z"></path>
            </clipPath>
          </defs>
        </svg>
      </div>
      <h2>Sound {{ isSoundEnable ? 'on' : 'off' }}</h2>
    </button>
  </section>
</template>

<script setup lang="ts">
import audioSrc from '@/assets/sound.mp3'
import { socket } from '@/services/socket'
import { useWebStore } from '@/store/web'
import { storeToRefs } from 'pinia'
import { onMounted, onUnmounted, ref } from 'vue'

let audioContext: AudioContext
let audioBuffer: AudioBuffer

const webStore = useWebStore()
const { isSoundEnable } = storeToRefs(webStore)

onMounted(async () => {
  audioContext = new AudioContext()
  const response = await fetch(audioSrc)
  const arrayBuffer = await response.arrayBuffer()
  audioBuffer = await audioContext.decodeAudioData(arrayBuffer)
})

const playSound = () => {
  const source = audioContext.createBufferSource()
  source.buffer = audioBuffer
  source.connect(audioContext.destination)
  source.start()
}

const changeState = () => {
  webStore.toggleSoundEnable()
}

socket.on('game:result', () => {
  if (isSoundEnable.value) {
    playSound()
  }
})

onUnmounted(() => {
  audioContext.close()
})
</script>
