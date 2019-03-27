import { Model } from 'mongoose'
import { Injectable, Inject } from '@nestjs/common'
import { User } from './interfaces/user.interface'
import { CreateUserDto } from './dto/create-user.dto'
import { DB_USER_MODEL_TOKEN } from '../database/database.constants'
import { EmailAlreadyInUseError } from './errors/emailalreadyinuse.error'

@Injectable()
export class UserService {
    constructor(@Inject(DB_USER_MODEL_TOKEN) private readonly userModel: Model<User>) { }

    async create(createUserDto: CreateUserDto): Promise<User> {
        const isEmailExists = await this.userModel.findOne({ email: createUserDto.email }).exec()
        if (isEmailExists) {
            throw new EmailAlreadyInUseError()
        }

        const userCreated = this.userModel(createUserDto)
        return await userCreated.save()
    }

    async getByEmail(email: String): Promise<User> {
        const user: User = await this.userModel.findOne({ email }).exec() // On récupère l'utilisateur par son adresse mail
        return user
    }

    async getByToken(token: String): Promise<User> {
        const user: User = await this.userModel.findOne({ token }).exec() // On récupère l'utilisateur par son token
        return user
    }

    async getContacts(myUser: User): Promise<[User?]> {
        const contactsId: [String?] = myUser.contacts
        let contacts: [User?] = []
        if (contactsId) {
            contacts = await this.userModel.find({ _id: { "$in": contactsId } }).exec()
        }

        return contacts
    }

    async getUsersByEmail(emails: [String]): Promise<[User]> {
        return await this.userModel.find({ email: { "$in": emails } }).exec()
    }
}
