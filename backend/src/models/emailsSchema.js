import {Schema, model} from 'mongoose'

const emailSchema = new Schema(
    {
        orgId:{
            type: Schema.Types.ObjectId,
            ref: 'Organization',
            required: true,
        },
        opened:{
            type: Boolean,
            default: false
        },
        openedAt:{
            type: Date,
        },
        recipientEmail:{
            type: String,
            required: true
        }
    }
    ,
    {timestamps: true}
)

export const Email = model('Email', emailSchema);