import { IsString } from 'class-validator'
import { Exclude, Expose } from 'class-transformer'
import { Message } from '../interfaces/message.interface';
import { User } from '../interfaces/user.interface';

export class MessagingDto {
    @Expose()
    readonly users: [User]
    @Expose()
    readonly messages: [Message?]
    @Expose()
    readonly threadid: String
}
