import { IsString } from 'class-validator'
import { Exclude, Expose } from 'class-transformer'
import { Message } from '../interfaces/message.interface';
import { User } from '../interfaces/user.interface';

export class MessageDto {
    @Exclude() readonly id?: String
    @Expose() readonly readby?: [User?]
    @Expose() readonly date?: Date
    @Expose() readonly author: User
    @Expose() readonly body: String
    @Expose() readonly msgid: String
    @Expose() readonly threadid?: String
}
