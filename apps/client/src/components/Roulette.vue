<script setup lang="ts">
import { onMounted, ref } from 'vue'

import { socket } from '../services/socket'

// console.log(socket)
socket.connect()
socket.on('game:countdown-time', (value) => {
  console.log(value)
})
socket.on('game:start-roll', (result: number) => {
  spin(result)
})
const wheelValue = ref('')
const wheel = ref<HTMLElement | null>(null)

const spin = (outcome: number) => {
  // const outcome = parseInt(wheelValue.value, 10)
  spinWheel(outcome)
}
const initWheel = () => {
  let row = ''

  row += "<div class='row'>"
  row += "  <div class='card red'>1</div>"
  row += "  <div class='card black'>14</div>"
  row += "  <div class='card red'>2</div>"
  row += "  <div class='card black'>13</div>"
  row += "  <div class='card red'>3</div>"
  row += "  <div class='card black'>12</div>"
  row += "  <div class='card red'>4</div>"
  row += "  <div class='card green'>0</div>"
  row += "  <div class='card black'>11</div>"
  row += "  <div class='card red'>5</div>"
  row += "  <div class='card black'>10</div>"
  row += "  <div class='card red'>6</div>"
  row += "  <div class='card black'>9</div>"
  row += "  <div class='card red'>7</div>"
  row += "  <div class='card black'>8</div>"
  row += '</div>'

  for (let x = 0; x < 29; x++) {
    if (wheel.value) {
      wheel.value.insertAdjacentHTML('beforeend', row)
    }
  }
}

const spinWheel = (roll: number) => {
  const order = [0, 11, 5, 10, 6, 9, 7, 8, 1, 14, 2, 13, 3, 12, 4]
  const position = order.indexOf(roll)

  const rows = 12
  const card = 75 + 3 * 2
  let landingPosition = rows * 15 * card + position * card

  const randomize = Math.floor(Math.random() * 75) - 75 / 2
  landingPosition += randomize

  const object = {
    x: Math.floor(Math.random() * 50) / 100,
    y: Math.floor(Math.random() * 20) / 100,
  }

  if (!wheel.value) return

  wheel.value.style.transitionTimingFunction = `cubic-bezier(0, ${object.x}, ${object.y}, 1)`
  wheel.value.style.transitionDuration = '6s'
  wheel.value.style.transform = `translate3d(-${landingPosition}px, 0px, 0px)`

  setTimeout(() => {
    if (!wheel.value) return

    wheel.value.style.transitionTimingFunction = ''
    wheel.value.style.transitionDuration = ''

    const resetTo = -(position * card + randomize)
    wheel.value.style.transform = `translate3d(${resetTo}px, 0px, 0px)`
  }, 6 * 1000)
}

onMounted(() => {
  initWheel()
})
</script>

<template>
  <div class="flex-1 overflow-hidden">
    <div class="roulette-wrapper">
      <div class="selector"></div>
      <div class="wheel" ref="wheel"></div>
    </div>
    <div>
      <!-- <img src="@/assets/roulette_img.png" alt="roulette"> -->
    </div>
  </div>
</template>

<style lang="sass">
// *
  // box-sizing: border-box
// body
  // font-family: 'Titillium Web', sans-serif
  // background: #191B28

.roulette-wrapper
  position: relative
  display: flex
  justify-content: center
  width: 100%
  margin: 0 auto
  overflow: hidden

  & .selector
    width: 3px
    background: grey
    left: 50%
    height: 100%
    transform: translate(-50%,0%)
    position: absolute
    z-index: 2

  & .wheel
    display: flex

  & .wheel .row
    display: flex

  & .wheel .row .card
    height: 75px
    width: 75px
    margin: 3px
    border-radius: 8px
    border-bottom: 3px solid rgba(0,0,0,0.2)
    display: flex
    align-items: center
    justify-content: center
    color: white
    font-size: 1.5em

.card.red
  background: #F95146

.card.black
  background: #2D3035

.card.green
  background: #00C74D
</style>
