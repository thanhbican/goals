<template>
  <button class="btn btn-success" onclick="authModal.showModal()">Login</button>
  <dialog ref="authModal" id="authModal" class="modal">
    <div class="modal-box">
      <div class="tabs">
        <a
          class="tab tab-bordered"
          :class="{ 'tab-active': activeTab === 'login' }"
          @click="activeTab = 'login'"
          >Login</a
        >
        <a
          class="tab tab-bordered"
          :class="{ 'tab-active': activeTab === 'signup' }"
          @click="activeTab = 'signup'"
          >Sign In</a
        >
      </div>

      <form @submit="onSubmit" :validation-schema="validationSchema">
        <input name="username" v-model="username" placeholder="Username" />
        <span>{{ errors.username }}</span>

        <input
          name="password"
          v-model="password"
          type="password"
          placeholder="Password"
        />
        <span>{{ errors.password }}</span>

        <div v-if="activeTab === 'signup'">
          <button type="submit">Sign up</button>
        </div>
        <div v-if="activeTab === 'login'">
          <button type="submit">Login In</button>
        </div>
      </form>
    </div>
  </dialog>
</template>

<script setup lang="ts">
import userApi from '@/api/userApi'
import { userSchema } from '@/schemas/userSchema'
import { socket } from '@/services/socket'
import { useUserStore } from '@/store/user'
import { toTypedSchema } from '@vee-validate/zod'
import { useField, useForm } from 'vee-validate'
import { ref } from 'vue'

const activeTab = ref('login')
const authModal = ref<HTMLDialogElement | null>(null)
const userStore = useUserStore()
const validationSchema = toTypedSchema(userSchema)

const { handleSubmit, errors } = useForm({
  validationSchema,
})

const { value: username } = useField('username')
const { value: password } = useField('password')

const onSubmit = handleSubmit(async (values) => {
  try {
    if (activeTab.value === 'signup') {
      await userApi.signup(values)
      authModal.value?.close()
    }
    if (activeTab.value === 'login') {
      await userApi.login(values)
      authModal.value?.close()
    }
    socket.on('disconnect', () => {
      socket.connect()
    })
    await userStore.getUser()
  } catch (err) {
    console.log('sam')
    console.error(err)
  }
})
</script>

<style lang="scss" scoped></style>
