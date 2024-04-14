import { useUserStore } from '@/store/user'
import axios from 'axios'

const http = axios.create({
  baseURL: import.meta.env.VITE_BASE_URL,
  withCredentials: true,
})

http.interceptors.response.use(
  (response) => {
    // Handle successful response
    return response
  },
  async (error) => {
    const userStore = useUserStore()
    if (error.response && error.response.status === 401) {
      // If unauthorized, reset user

      userStore.resetUser()

      // Optionally redirect to login or handle re-authentication
      // router.push('/login').catch(err => {});
    }
    return Promise.reject(error)
  }
)

export default http
