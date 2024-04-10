import { UserSchema } from '@/schemas/userSchema'
import http from '@/services/http'

const signIn = async (payload: UserSchema) => {
  try {
    const res = await http.post('/auth/signin', payload)
    return res.data
  } catch (err) {
    // console.error('Error signIn', err)
    throw err
  }
}

export default {
  signIn,
}
