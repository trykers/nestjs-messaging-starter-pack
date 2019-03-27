import { IsString } from 'class-validator'

export class CredentialsDto {
    @IsString()
    readonly email: String

    @IsString()
    readonly password: String
}
