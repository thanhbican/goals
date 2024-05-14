import { model, Schema } from 'mongoose'

interface GameDoc extends Document {
  serverSeed: string
  publicSeed: string
  createdAt: NativeDate
}
const gameSchema = new Schema(
  {
    serverSeed: String,
    publicSeed: String,
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

const Game = model<GameDoc>('game', gameSchema)

export { Game }
