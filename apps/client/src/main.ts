import { createPinia } from 'pinia'
import { createApp } from 'vue'

import '@/sass/style.sass'

import router from '@/router/index'

import App from './App.vue'

const pinia = createPinia()

const app = createApp(App)

app.use(pinia).use(router).mount('#app')
