
import { MONGO_USER, MONGO_PASS, MONGO_CONNECT_STR, DB_CONNECTION_TOKEN } from './database.constants';
import * as mongoose from 'mongoose';

export const DatabaseProviders = [
    {
        provide: DB_CONNECTION_TOKEN,
        useFactory: async (): Promise<typeof mongoose> =>
            await mongoose.connect(`mongodb+srv://${MONGO_USER}:${MONGO_PASS}@${MONGO_CONNECT_STR}`, {
                autoIndex: false,
                useNewUrlParser: true,
            }),
    },
]
