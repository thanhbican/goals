import { model, Schema } from 'mongoose'

const userSchema = new Schema(
  {
    password: {
      type: String,
      required: true, // Makes the password field required
    },
    username: {
      type: String,
      unique: true,
      required: true,
    },
  },
  { _id: false, id: true, timestamps: true }
)

const User = model('user', userSchema)

export { User }
