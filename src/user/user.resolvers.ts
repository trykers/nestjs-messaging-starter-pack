import { Query, Resolver, Mutation, Args } from '@nestjs/graphql';
import { User } from './interfaces/user.interface'
import { UserService } from './user.service';
import { GqlAuthGuard } from '../auth/gql-auth.guard';
import { UseGuards, UnauthorizedException, Inject, forwardRef } from '@nestjs/common';
import { MyUser } from './user.decorator';
import { AuthService } from '../auth/auth.service';
import * as uniqid from 'uniqid'

@Resolver('User')
export class UserResolver {
    constructor(
        private readonly userService: UserService,
        @Inject(forwardRef(() => AuthService))  // Circular dependency...
        private readonly authService: AuthService,
    ) {}

    @Query('user')
    @UseGuards(GqlAuthGuard)
    async getUser(@Args('email') email: String, @MyUser() myUser: User): Promise<User> {
        if (email !== myUser.email) {
            throw new UnauthorizedException()
        }
        return await this.userService.getByEmail(email)
    }

    @Mutation()
    async createUser(
        @Args('firstname') firstname: String,
        @Args('lastname') lastname: String,
        @Args('password') password: String,
        @Args('email') email: String,
        @MyUser() myUser: User
    ) {
        if (myUser) {
            throw new UnauthorizedException()
        }
        
        const hashedPassword = await this.authService.hashPassword(password)

        const avatarDemo = [
            'https://cdn.quasar-framework.org/img/avatar1.jpg',
            'https://cdn.quasar-framework.org/img/avatar2.jpg',
            'https://cdn.quasar-framework.org/img/avatar3.jpg',
            'https://cdn.quasar-framework.org/img/avatar4.jpg',
            'https://cdn.quasar-framework.org/img/avatar5.jpg',
            'https://cdn.quasar-framework.org/img/avatar6.jpg',
        ]

        const token = `${uniqid('tok-')}-${uniqid()}`
        const avatar = avatarDemo[parseInt((Math.random() * 6).toFixed(0))] // For the demo we set an avatar randomly

        return await this.userService.create({firstname, lastname, password: hashedPassword, email, token, avatar})
    }
}
