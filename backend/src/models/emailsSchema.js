import {Schema, model} from 'mongoose'

const emailSchema = new Schema(
    {
        senderId:{
            type: Schema.Types.ObjectId,
            ref: 'Organization',
            required: true,
        },
        recipientEmail:{
            type: String,
            required: true
        },
        opened:{
            type: Boolean,
            default: false
        },
        openedAt:{
            type: Date,
        },
    }
    ,
    {timestamps: true}
)

export const Email = model('Email', emailSchema);