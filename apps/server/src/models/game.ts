import { model, Schema } from 'mongoose'

const gameSchema = new Schema(
  {
    serverSeed: String,
    publicSeed: String,
  },
  { _id: false, id: true, timestamps: true }
)

const Game = model('game', gameSchema)

export { Game }
