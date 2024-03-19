import { model, Schema } from 'mongoose'

const userSchema = new Schema(
  {
    email: String,
    password: String,
    username: String,
  },
  { _id: false, id: true, timestamps: true }
)

const User = model('user', userSchema)

export { User }
