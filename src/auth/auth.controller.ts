import { Controller, Get, UseGuards, Req, Post, Body, Res } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { CredentialsDto } from './dto/credentials.dto';
import { User } from '../user/interfaces/user.interface';
import { ReqUser } from 'src/user/user.decorator';

@Controller('auth')
export class AuthController {
    constructor(
        private readonly authService: AuthService
    ) {}

    @Get('user')
    @UseGuards(AuthGuard('myjwt'))
    getUser(@ReqUser() user: User): User {
        return user
    }

    @Get('refresh')
    @UseGuards(AuthGuard('myjwt'))
    async refresh(@ReqUser() user: User, @Res() response): Promise<String> {
        const jwt = await this.authService.refreshWithJwt(user.token)
        response.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
        response.setHeader('Access-Control-Expose-Headers', 'Authorization')
        response.setHeader('Access-Control-Allow-Headers', 'Authorization')
        response.setHeader('Authorization', `Bearer ${jwt}`)
        return response.json({token:jwt})
    }

    @Post('login')
    async signIn(@Body() credentials: CredentialsDto, @Res() response): Promise<String> {
        const jwt = await this.authService.signInWithJwt(credentials)
        response.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
        response.setHeader('Access-Control-Expose-Headers', 'Authorization')
        response.setHeader('Access-Control-Allow-Headers', 'Authorization')
        response.setHeader('Authorization', `Bearer ${jwt}`)
        return response.json({token:jwt})
    }
}
