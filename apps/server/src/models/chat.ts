import { model, Schema } from 'mongoose'

const chatSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'user' },
    message: String,
  },
  { _id: false, id: true, timestamps: true }
)

const Chat = model('chat', chatSchema)

export { Chat }
