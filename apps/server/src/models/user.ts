import { model, Schema } from 'mongoose'

const userSchema = new Schema(
  {
    password: {
      type: String,
      required: true,
    },
    username: {
      type: String,
      unique: true,
      required: true,
    },
    balance: {
      type: Number,
      default: 50,
    },
  },
  { id: true, timestamps: true }
)

const User = model('user', userSchema)

export { User }
