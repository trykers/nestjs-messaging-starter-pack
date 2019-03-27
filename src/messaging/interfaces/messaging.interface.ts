import { Message } from './message.interface';
import { User } from './user.interface';
export interface Messaging {
    readonly messages: Array<Message>
    readonly users: Array<User>
    readonly threadid: String
}
