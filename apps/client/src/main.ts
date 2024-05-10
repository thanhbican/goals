import { createPinia } from 'pinia'
import { createApp } from 'vue'

import '@/sass/style.sass'

import router from '@/router/index'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'

import App from './App.vue'

const app = createApp(App)

const pinia = createPinia()
pinia.use(piniaPluginPersistedstate)

app.use(pinia).use(router).mount('#app')
