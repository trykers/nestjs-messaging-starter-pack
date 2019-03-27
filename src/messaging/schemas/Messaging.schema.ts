import * as mongoose from 'mongoose'
const ObjectId = mongoose.Schema.Types.ObjectId

export const MessagingSchema = new mongoose.Schema({
    messages: [{ type: ObjectId, ref: 'Message' }],
    users: [{ type: ObjectId, ref: 'User' }],
    threadid: { type: String, required: true, index: true }
})
