import { Injectable, UnauthorizedException, Logger } from '@nestjs/common';
import { GqlModuleOptions, GqlOptionsFactory } from '@nestjs/graphql';
import { mapKeys, get } from 'lodash'
import * as GraphQLISODate from 'graphql-iso-date'
import { UserModule } from 'src/user/user.module'
import { MessagingModule } from 'src/messaging/messaging.module'
import { AuthService } from 'src/auth/auth.service';
import { UserService } from 'src/user/user.service';
import { User } from 'src/user/interfaces/user.interface';

@Injectable()
export class GqlConfigService {
    constructor(
        private readonly authService: AuthService,
        private readonly userService: UserService,
        ) {}

    createGqlOptions(): GqlModuleOptions {
        return {
            typePaths: ['./**/*.graphql'],
            include: [UserModule, MessagingModule],
            installSubscriptionHandlers: true,
            //context: ({ req }) => ({ req }),
            context: ({ req, connection }) => {
                if (req) {
                    return { req }
                }

                if (connection) {
                    const context = connection.context
                    return context
                }
            },
            subscriptions: {
                onConnect: async (connectionParams, ws) => {
                    connectionParams = mapKeys(connectionParams, (value: String, key: String) => key.toLowerCase())
                    const givenJwtToken = get(connectionParams, 'authorization', null)
                    if (givenJwtToken) {
                        const decodedJwt = await this.authService.decodeJwt(givenJwtToken.split(' ')[1])
                        if (decodedJwt) { // GET THE CONTEXT
                            const myUser: User = await this.userService.getByToken(decodedJwt.token)
                            return {user: myUser, socket: ws}
                        }
                        
                        return false
                    } else {
                        throw new UnauthorizedException()
                    }
                }
            },
            debug: true,
            playground: true,
            resolvers: { Date: GraphQLISODate }
        }
    }
}
