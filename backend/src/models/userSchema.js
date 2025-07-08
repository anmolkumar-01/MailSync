import {model, Schema} from 'mongoose'

const userSchema = new Schema(
    {
        email: {
            type: 'String',
            required: true,
            unique: true
        }

    },
    {timestamps: true}
)

export const User = new model('User', userSchema)