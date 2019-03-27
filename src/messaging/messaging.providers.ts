import { DB_MESSAGING_MODEL_TOKEN, DB_MESSAGE_MODEL_TOKEN, DB_CONNECTION_TOKEN } from '../database/database.constants'
import { Connection } from 'mongoose'
import { MessagingSchema } from './schemas/Messaging.schema'
import { MessageSchema } from './schemas/Message.schema'

export const MessagingProvider = [
    {
        provide: DB_MESSAGING_MODEL_TOKEN,
        useFactory: (connection: Connection) => connection.model('Messaging', MessagingSchema),
        inject: [DB_CONNECTION_TOKEN]
    },
    {
        provide: DB_MESSAGE_MODEL_TOKEN,
        useFactory: (connection: Connection) => connection.model('Message', MessageSchema),
        inject: [DB_CONNECTION_TOKEN]
    }
]
