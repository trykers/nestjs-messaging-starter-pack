import { genSalt as bgenSalt, hash as bhash, compare as bcompare} from 'bcrypt'
import { JwtService } from '@nestjs/jwt';
import { Injectable, UnauthorizedException, Inject, forwardRef } from '@nestjs/common';
import { JwtPayload } from './interfaces/jwt-payload.interface';
import { UserService } from '../user/user.service';
import { User } from '../user/interfaces/user.interface';
import { CredentialsDto } from './dto/credentials.dto';

@Injectable()
export class AuthService {
  constructor(
    @Inject(forwardRef(() => UserService)) // Circular dependency...
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) { }

  async hashPassword(password: String): Promise<string> {
    return new Promise((resolve, reject) => {
      bgenSalt(10, (err, salt) => {
        if (err) {
          return reject(err)
        }

        bhash(password, salt, (err, hash) => {
          if (err) {
            return reject(err)
          }

          return resolve(hash)
        })
      })
    })
  }

  async verifyJwt(jwt: string): Promise<Boolean> {
    return await this.jwtService.verify(jwt)
  }

  async decodeJwt(jwt: string): Promise<JwtPayload> {
    const decodedJwt = <JwtPayload> await this.jwtService.decode(jwt)
    return decodedJwt
  }

  async signInWithJwt(credentials: CredentialsDto): Promise<string> {
    // On essaye de récupérer l'utilisateur depuis le module User
    const user: User = await this.userService.getByEmail(credentials.email)

    if (!user) {
      throw new UnauthorizedException() // User introuvable. Accès refusé.
    }

    const passwordMatch = await bcompare(credentials.password, user.password) // Utilisateur trouvé, le password match ?
    if (!passwordMatch) {
      throw new UnauthorizedException() // Password ne match pas. Accès refusé
    }


    const payload: JwtPayload = { token: user.token } // On crée notre payload
    return this.jwtService.sign(payload) // On le signe et on le retourne
  }

  async refreshWithJwt(token: String): Promise<string> {
    const user: User = await this.userService.getByToken(token)
    if (!user) {
      throw new UnauthorizedException() // User introuvable. Accès refusé.
    }

    const payload: JwtPayload = { token: user.token } // On crée notre payload
    return this.jwtService.sign(payload) // On le signe et on le retourne
  }


  async validateUserByJwt(token: String): Promise<User> {
    return await this.userService.getByToken(token)
  }

  async validateUserByToken(token: string): Promise<any> {
    // Validate if token passed along with HTTP request
    // is associated with any registered account in the database
    // return await this.usersService.findOneByToken(token);
    if (token !== "HELLO") {
      return null;
    }
    const todelete = async () => { // For testing token is valid.
      return {
        firstname: 'foo',
        lastname: 'bar',
        email: 'foo@bar.com'
      }
    }
    return await todelete
  }
}
