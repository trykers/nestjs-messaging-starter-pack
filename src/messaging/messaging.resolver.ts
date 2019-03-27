import { Resolver, Query, Args, Mutation, Subscription } from '@nestjs/graphql'
import { Inject, UseGuards, UnauthorizedException } from '@nestjs/common'
import { GqlAuthGuard } from 'src/auth/gql-auth.guard'
import { MyUser } from 'src/user/user.decorator'
import { User } from './interfaces/user.interface'
import { MessagingService } from './messaging.service'
import { Messaging } from './interfaces/messaging.interface'
import { withFilter } from 'graphql-subscriptions'
import { RedisService } from 'src/redis/redis.service'
import { MessageDto } from './dto/message.dto';

@Resolver('Messaging')
export class MessagingResolver {
    constructor(
        private readonly pubSub: RedisService,
        private readonly messsagingService: MessagingService
        ) {}

    @Query('allthread')
    @UseGuards(GqlAuthGuard)
    async getAllThread(@MyUser() myUser: User): Promise<String[]> {
        return await this.messsagingService.getAllThread(myUser)
    }

    @Query('thread')
    @UseGuards(GqlAuthGuard)
    async getThread(@Args('threadid') threadId: String, @MyUser() myUser: User): Promise<Messaging> {
        return await this.messsagingService.getThread(myUser, threadId)
    }

    @Mutation('createThread') // Create a thread messaging
    @UseGuards(GqlAuthGuard)
    async createThread(@Args('recipientemail') recipientEmail: String, @MyUser() myUser: User): Promise<Messaging> {
        return await this.messsagingService.createThread(myUser, [recipientEmail]) // Seul une conversion entre deux personne est autorisé ici
    }

    @Mutation('sendMessage') // Envoyer un message
    @UseGuards(GqlAuthGuard)
    async sendMessage(@Args('threadid') threadId: String, @Args('body') body: String, @MyUser() myUser: User): Promise<MessageDto> {
        const messageCreated = await this.messsagingService.sendMessage(myUser, threadId, body)
        if (!messageCreated) {
            throw new UnauthorizedException()
        }
        this.pubSub.publish('newMessage', { newMessageAppend: messageCreated})

        return messageCreated
    }

    @Subscription('newMessageAppend') // On permet de s'inscire pour recevoir tout les nouveaux messages !
    newMessageAppend() {
        return {
            subscribe: withFilter(
                () => this.pubSub.asyncIterator('newMessage'), (payload, args, context) => {
                    if (!this.messsagingService.getThread(context.user, args.threadId))  { // For debug only ; Do not execute this function each time when message received -> not optimized
                        context.socket.off() // Stop listening
                        context.socket.disconnect() // Disconnect the socket
                        return false
                    }

                    return payload.newMessageAppend.threadId === args.threadId
                }
            )
        }
    }
}
