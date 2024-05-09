<template>
  <dialog ref="policyModal" id="policyModal" class="modal">
    <div class="modal-box">
      <h3 class="font-bold text-lg">Hello!</h3>
      <ul class="py-4 space-y-2">
        <li class="leading-5">
          - This website is for myself educational purposes only, not for
          profiteering or illegal purposes
        </li>
        <li>- Free to sign in and test the game</li>
      </ul>
      <label class="label cursor-pointer w-[200px] ml-auto">
        <span class="label-text">Do not show again</span>
        <input type="checkbox" class="checkbox" />
      </label>
      <div class="modal-action">
        <form method="dialog">
          <!-- if there is a button in form, it will close the modal -->
          <button class="btn">OK</button>
        </form>
      </div>
    </div>
  </dialog>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'

const policyModal = ref<HTMLDialogElement>()

onMounted(() => {
  policyModal?.value?.showModal()
})
</script>

<style scoped></style>
