import About from '@/view/About.vue'
import Fairness from '@/view/Fairness.vue'
import History from '@/view/History.vue'
import HomeView from '@/view/Home.vue'
import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  { path: '/', component: HomeView },
  { path: '/fairness', component: Fairness },
  { path: '/about', component: About },
  { path: '/history/rounds/:gameId', component: History },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router
