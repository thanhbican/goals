import { Model, model, Schema, Types } from 'mongoose'

import { roundMoney } from '../../helpers/util'

interface UserAttrs {
  username: string
  password: string
  balance: Types.Decimal128
}
interface UserDoc extends Document {
  username: string
  password: string
  balance: Types.Decimal128
}
interface UserModel extends Model<UserDoc> {
  build(attrs: UserAttrs): UserDoc
}

const userSchema = new Schema(
  {
    username: {
      type: String,
      unique: true,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    balance: {
      type: Schema.Types.Decimal128,
      default: '500.00', // Store as a string to avoid precision issues
    },
  },
  {
    timestamps: true,
    toJSON: {
      transform(doc, ret: any) {
        ret.id = ret._id
        ret.balance = parseFloat(ret.balance.toString())
        delete ret._id
        delete ret.password
        delete ret.__v
      },
    },
  }
)

const User = model<UserDoc, UserModel>('user', userSchema)

export { User }
