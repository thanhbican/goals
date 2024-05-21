import { model, Schema, Types } from 'mongoose'

interface ChatDoc extends Document {
  userId: Types.ObjectId
  message: string
  createdAt: Date
  updatedAt: Date
}

const chatSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'user' },
    message: String,
  },
  {
    timestamps: true,
    toJSON: {
      transform(doc, ret: any) {
        ret.id = ret._id
        delete ret._id
        delete ret.__v
      },
    },
  }
)

const Chat = model<ChatDoc>('chat', chatSchema)

export { Chat }
