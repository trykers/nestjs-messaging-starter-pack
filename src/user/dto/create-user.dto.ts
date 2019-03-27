import { IsString } from 'class-validator'
import { Exclude } from 'class-transformer'

export class CreateUserDto {
    readonly firstname: String
    readonly lastname: String

    @Exclude()
    readonly password: String
    readonly email: String
    readonly token: String
    readonly avatar?: String
}
