import { model, Schema } from 'mongoose'

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

const Game = model('game', gameSchema)

export { Game }
