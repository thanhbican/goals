import Fairness from '@/view/Fairness.vue'
import HomeView from '@/view/Home.vue'
import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  { path: '/', component: HomeView },
  { path: '/fairness', component: Fairness },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router
