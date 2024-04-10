<template>
  <header>
    <button class="btn btn-success" onclick="singInModal.showModal()">
      Sign In
    </button>
    <dialog id="singInModal" class="modal">
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
            :class="{ 'tab-active': activeTab === 'signIn' }"
            @click="activeTab = 'signIn'"
            >Sign In</a
          >
        </div>

        <Form @submit="onSubmit" :validation-schema="validationSchema">
          <Field name="username" placeholder="Username" />
          <ErrorMessage name="username" />

          <Field
            name="password"
            as="input"
            type="password"
            placeholder="Password"
          />
          <ErrorMessage name="password" />

          <div v-if="activeTab === 'signIn'">
            <button type="submit">Sign In</button>
          </div>
          <div v-if="activeTab === 'login'">
            <button type="submit">Login In</button>
          </div>
        </Form>
      </div>
    </dialog>
  </header>
</template>

<script setup lang="ts">
import userApi from '@/api/userApi'
import { userSchema, UserSchema } from '@/schemas/userSchema'
import { toTypedSchema } from '@vee-validate/zod'
import { ErrorMessage, Field, Form, useForm } from 'vee-validate'
import { computed, ref } from 'vue'

const activeTab = ref('signIn')

const validationSchema = toTypedSchema(userSchema)

const onSubmit = async (payload: UserSchema) => {
  try {
    await userApi.signIn(payload)
  } catch (err) {
    console.error(err)
  }
}
</script>

<style lang="scss" scoped></style>
