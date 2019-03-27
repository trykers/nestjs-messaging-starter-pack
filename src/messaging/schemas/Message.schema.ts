import * as mongoose from 'mongoose'
const ObjectId = mongoose.Schema.Types.ObjectId

export const MessageSchema = new mongoose.Schema({
    date: { type: Date, default: Date.now },
    readby: [{ type: ObjectId, ref: 'User' }],
    messaging: { type: ObjectId, ref: 'Messaging' },
    author: { type: ObjectId, ref: 'User', required: true, index: true },
    body: { type: String, required: true }
})
