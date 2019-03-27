import { Injectable, Inject, BadRequestException } from '@nestjs/common';
import { DB_MESSAGING_MODEL_TOKEN, DB_MESSAGE_MODEL_TOKEN } from '../database/database.constants';
import { Model } from 'mongoose';
import { Messaging } from './interfaces/messaging.interface';
import { User } from './interfaces/user.interface'
import { Message } from './interfaces/message.interface';
import { UserService } from '../user/user.service';
import * as uniqid from 'uniqid'
import { MessagingDto } from './dto/messaging.dto';
import { MessageDto } from './dto/message.dto';
import * as _ from 'lodash'
import { UserDto } from './dto/user.dto';

@Injectable()
export class MessagingService {
    constructor(
        @Inject(DB_MESSAGING_MODEL_TOKEN) private readonly messagingModel: Model<Messaging>,
        @Inject(DB_MESSAGE_MODEL_TOKEN) private readonly messageModel: Model<Message>,
        private readonly userService: UserService,
    ) { }

    /*
    * Find a thread with contributors ids
    */
    async findThreadByContributors(contributors: [User]): Promise<Model<Messaging>> {
        const contributorsIds: String[] = contributors.map(user => user.id)
        return await this.messagingModel.findOne({ users: { "$all": contributorsIds, "$size": contributorsIds.length } }).populate('users').populate({
            path: 'messages',
            populate: {
                path: 'author',
            }
        }).exec()
    }

    /*
    * Get all the user's threads
    */
   async getAllThread(myuser: User): Promise<String[]> {
        const findThreads = await this.messagingModel.find({ users: myuser.id }).select('threadid').exec()
        const threadids = _.map(findThreads, 'threadid')
        return threadids
    }

    /*
    * Get the thread messages
    */
    async getThread(myuser: User, threadId: String): Promise<Model<Messaging>> {
        if (!myuser) {
            return null
        }

        return await this.messagingModel.findOne({ users: myuser.id, threadid: threadId }).populate('users').populate({
            path: 'messages',
            populate: {
                path: 'author',
            }
        }).exec() // On retourne le thread en question SI l'utilisateur en fait parti !
    }

    /* 
    * Create a messaging thread with all recipients
    */
    async createThread(myuser: User, recipientsEmail: [String]): Promise<Model<Messaging>> {
        const recipients: [User] = await this.userService.getUsersByEmail(recipientsEmail)
        if (!recipients) throw new BadRequestException() // Pas de users valide : requête invalide !
        if (recipients.length < 2) throw new BadRequestException() // On ne peut pas créer de conversation tout seul !
        if (recipients.findIndex((user) => user.email === myuser.email) === -1) throw new BadRequestException() // On ne peut pas créer de discussion sans s'inclure dedans !

        const existantThread = await this.findThreadByContributors(recipients)
        if (existantThread) {
            return existantThread
        }

        const threadMessagingDto: MessagingDto = {
            users: recipients,
            messages: [],
            threadid: uniqid(),
        }

        const threadCreated = this.messagingModel(threadMessagingDto)
        return await threadCreated.save()
    }

    /*
    * Send a message and save it on database
    */
    async sendMessage(myuser: User, threadId: String, body: String): Promise<MessageDto> {
        const existantThread: Model<Messaging> = await this.getThread(myuser, threadId)

        if (!existantThread) {
            return null
        }

        const newMessageDto: MessageDto = {
            body,
            msgid: uniqid(),
            author: myuser,
        }

        const messageCreated = await this.messageModel(newMessageDto).save()
        existantThread.messages.push(messageCreated)
        existantThread.save()

        const userDto: UserDto = {
            firstname: myuser.firstname,
            lastname: myuser.lastname,
            email: myuser.email,
            avatar: myuser.avatar
        }

        const messageSaved: MessageDto = {
            author: userDto,
            msgid: newMessageDto.msgid,
            threadid: existantThread.threadid,
            body: messageCreated.body,
            date: messageCreated.date,
            readby: [],
        }

        return messageSaved
    }

    /*
    * Mark a message as read
    */
    /*async markAsRead(myuser: User, msgId: String): Promise<Boolean> {
        return true
    }*/
}
