<template>
  <button class="btn btn-success" onclick="authModal.showModal()">Login</button>
  <dialog ref="authModal" id="authModal" class="modal">
    <div class="modal-box">
      <div class="tabs mb-4">
        <a
          class="tab tab-bordered"
          :class="{
            'tab-active bg-green text-black font-bold': activeTab === 'login',
          }"
          @click="activeTab = 'login'"
          >Login</a
        >
        <a
          class="tab tab-bordered"
          :class="{
            'tab-active bg-green text-black font-bold': activeTab === 'signup',
          }"
          @click="activeTab = 'signup'"
          >Sign In</a
        >
      </div>

      <form
        @submit="onSubmit"
        :validation-schema="validationSchema"
        class="space-y-4 px-8"
      >
        <div>
          <input
            name="username"
            v-model="username"
            placeholder="Username"
            class="w-full p-1"
          />
          <span class="text-red mt-2 inline-block">{{ errors.username }}</span>
        </div>

        <div>
          <input
            name="password"
            v-model="password"
            type="password"
            placeholder="Password"
            class="w-full p-1"
          />
          <span class="text-red mt-2 inline-block">{{ errors.password }}</span>
        </div>

        <div>
          <button type="submit" class="btn btn-warning btn-sm block w-full">
            {{ activeTab === 'signup' ? 'Sign up' : 'Login In' }}
          </button>
        </div>

        <span v-if="authError" class="text-red mt-2 inline-block"
          >Not Auth! Please check your username and password</span
        >
      </form>
    </div>
    <form method="dialog" class="modal-backdrop">
      <button>close</button>
    </form>
  </dialog>
</template>

<script setup lang="ts">
import userApi from '@/api/userApi'
import { userSchema } from '@/schemas/userSchema'
import { socket } from '@/services/socket'
import { useAuthModalStore } from '@/store/authModal'
import { useUserStore } from '@/store/user'
import { toTypedSchema } from '@vee-validate/zod'
import { useField, useForm } from 'vee-validate'
import { ref, watchEffect } from 'vue'

const activeTab = ref('login')
const authModal = ref<HTMLDialogElement>()
const userStore = useUserStore()
const validationSchema = toTypedSchema(userSchema)
const stateAuthModal = useAuthModalStore()
const authError = ref(false)

const { handleSubmit, errors } = useForm({
  validationSchema,
})

const { value: username } = useField('username')
const { value: password } = useField('password')

const onSubmit = handleSubmit(async (values) => {
  authError.value = false
  try {
    if (activeTab.value === 'signup') {
      await userApi.signup(values)
    }
    if (activeTab.value === 'login') {
      await userApi.login(values)
    }

    authModal.value?.close()
    stateAuthModal.closeModal()
    socket.disconnect()
    await userStore.getUser()
  } catch (err) {
    console.error(err)
    authError.value = true
  }
})

// watch
watchEffect(() => {
  if (stateAuthModal.state) {
    authModal.value?.showModal()
  } else {
    authModal.value?.close()
  }
})
</script>

<style lang="scss" scoped></style>
