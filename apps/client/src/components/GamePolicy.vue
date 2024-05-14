<template>
  <section
    v-if="!isPolicyGotIt"
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

<script setup lang="ts">
import { useWebStore } from '@/store/web'
import { storeToRefs } from 'pinia'

const webStore = useWebStore()
const { isPolicyGotIt } = storeToRefs(webStore)
const onChangeState = () => {
  webStore.setPolicyGotIt(true)
}
</script>

<style lang="scss" scoped></style>
