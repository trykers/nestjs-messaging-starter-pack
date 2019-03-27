import { User } from './user.interface';
export interface Message {
    readonly date: Date
    readonly readby: Array<User>
    readonly author: User
    readonly body: String
    readonly msgid: String
    readonly threadid?: String
}
