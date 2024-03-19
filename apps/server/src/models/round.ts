import { model, Schema } from 'mongoose'

const roundSchema = new Schema(
  {
    gameId: { type: Schema.Types.ObjectId, ref: 'game' },
    resultNumber: Number,
    resultColor: String,
    blackAmount: Number,
    redAmount: Number,
    greenAmount: Number,
  },
  { _id: false, id: true, timestamps: true }
)

const Round = model('round', roundSchema)

export { Round }
