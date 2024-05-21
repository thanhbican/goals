import { model, Schema, Types } from 'mongoose'

interface RoundDoc extends Document {
  gameId: Types.ObjectId
  roll: number
  rollColor: string
  roundId: string
}

const roundSchema = new Schema(
  {
    gameId: { type: Schema.Types.ObjectId, ref: 'game' },
    roll: Number,
    rollColor: String,
    roundId: String,
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

const Round = model<RoundDoc>('round', roundSchema)

export { Round }
