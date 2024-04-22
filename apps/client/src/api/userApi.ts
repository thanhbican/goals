import { UserSchema } from '@/schemas/userSchema'
import http from '@/services/http'

const getCurrentUser = async () => {
  try {
    const res = await http.get('/auth/user')
    return res.data
  } catch (err) {
    throw err
  }
}
const getUser = async (userId: string) => {
  try {
    const res = await http.get(`/auth/user/${userId}`)
    return res.data
  } catch (err) {
    throw err
  }
}
const signup = async (payload: UserSchema) => {
  try {
    const res = await http.post('/auth/signup', payload)
    return res.data
  } catch (err) {
    throw err
  }
}
const login = async (payload: UserSchema) => {
  try {
    const res = await http.post('/auth/login', payload)
    return res.data
  } catch (err) {
    throw err
  }
}
const logout = async () => {
  try {
    const res = await http.post('/auth/logout')
    return res.data
  } catch (err) {
    throw err
  }
}

export default {
  getUser,
  getCurrentUser,
  signup,
  login,
  logout,
}
