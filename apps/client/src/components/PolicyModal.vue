<template>
  <dialog
    v-if="!isPolicyConsent"
    ref="policyModal"
    id="policyModal"
    class="modal"
  >
    <div class="modal-box">
      <h3 class="font-bold text-lg">Hello!</h3>
      <ul class="py-4 space-y-2">
        <li class="leading-5">
          - This website is for educational purposes only and not for
          profiteering or illegal activities.
        </li>
        <li class="leading-5">
          - Feel free to sign up and test the game with $100 in virtual
          currency.
        </li>
        <li class="leading-5">
          - Currently, this website is hosted in <s>Helsinki, Finland, EU, without a CDN</s> (moved to Singapore)
          which may cause it to load a bit slowly.
        </li>
      </ul>
      <label class="label cursor-pointer w-[150px] ml-auto">
        <span class="label-text">Do not show again</span>
        <input type="checkbox" class="checkbox" v-model="isConsent" />
      </label>
      <div class="modal-action">
        <form method="dialog">
          <!-- if there is a button in form, it will close the modal -->
          <button class="btn" @click="onClick">OK</button>
        </form>
      </div>
    </div>
  </dialog>
</template>

<script setup lang="ts">
import { useWebStore } from '@/store/web'
import { storeToRefs } from 'pinia'
import { onMounted, ref } from 'vue'

const policyModal = ref<HTMLDialogElement>()
const isConsent = ref(false)

const webStore = useWebStore()
const { isPolicyConsent } = storeToRefs(webStore)

const onClick = () => {
  webStore.setPolicyConsent(isConsent.value)
}

onMounted(() => {
  policyModal?.value?.showModal()
})
</script>

<style scoped></style>
