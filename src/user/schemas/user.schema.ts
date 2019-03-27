import * as mongoose from 'mongoose'

export const UserSchema = new mongoose.Schema({
    firstname: { type: String, required: true },
    lastname: { type: String, required: true },
    password: { type: String, required: true },
    email: { type: String, required: true, unique: true, index: true },
    role: { type: String, enum: ['USER', 'TECHNICIAN', 'ADMINISTRATOR'], default: 'USER' },
    token: { type: String, required: true },
    contacts: [{ type: String }],
    avatar: { type: String, default: '' },
}, { strict: true })
