import { DB_CONNECTION_TOKEN, DB_USER_MODEL_TOKEN } from '../database/database.constants'
import { Connection } from 'mongoose'
import { UserSchema } from './schemas/user.schema'

export const userProviders = [
    {
        provide: DB_USER_MODEL_TOKEN,
        useFactory: (connection: Connection) => connection.model('User', UserSchema),
        inject: [DB_CONNECTION_TOKEN],
    },
]
