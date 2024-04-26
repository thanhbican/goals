<template>
  <section
    v-if="state"
    class="bg-grey flex justify-between items-center px-10 py-2"
  >
    <h2>
      This website is for myself educational purposes only, not for profiteering
      or illegal purposes
    </h2>
    <div>
      <button class="btn btn-warning btn-sm" @click="onChangeState">
        Got it
      </button>
    </div>
  </section>
</template>

<script setup>
import { ref } from 'vue'

const state = ref(true)
const onChangeState = () => {
  state.value = false
}
</script>

<style lang="scss" scoped></style>
