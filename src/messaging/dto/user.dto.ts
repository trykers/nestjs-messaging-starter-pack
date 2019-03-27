import { IsString } from 'class-validator'
import { Exclude } from 'class-transformer'
import { Message } from '../interfaces/message.interface';

export class UserDto {
    @Exclude()
    readonly id?: String
    readonly firstname: String
    readonly lastname: String
    readonly email: String
    readonly avatar?: String
}
