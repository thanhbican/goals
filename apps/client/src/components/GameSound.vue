<template>
  <!-- <button @click="playSound">Play Sound</button> -->
</template>

<script setup>
import audioSrc from '@/assets/sound.mp3'
import { socket } from '@/services/socket'
import { onMounted, onUnmounted } from 'vue'

let audioContext
let audioBuffer

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

socket.on('game:result', () => {
  playSound()
})

onUnmounted(() => {
  audioContext.close()
  playSound()
})
</script>

<style scoped></style>
