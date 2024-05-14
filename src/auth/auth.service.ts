import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';
import { DataSource } from 'typeorm';
import * as bcrypt from 'bcryptjs';
import { User } from './users.entity';
import { JwtPayload } from './interface/jwt-payload.interface';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private dataSource: DataSource,
    private jwtService: JwtService,
  ) {}

  async register(authCredentialsDto: AuthCredentialsDto): Promise<void> {
    try {
      const { id, managerName, username, password, email } = authCredentialsDto;
      const salt = await bcrypt.genSalt();
      const hashedPwd = await bcrypt.hash(password, salt);

      const regUser = {
        id: id,
        manager_name: managerName.toLowerCase(),
        username: username.toLowerCase(),
        password: hashedPwd,
        email: email.toLowerCase(),
      };
      Logger.log('Saved User Successfully');
      await this.dataSource.manager.findOneBy(User, {
        email: email,
      });
      await this.dataSource.manager.save(User, regUser);
    } catch (error) {
      if (error.code === '23505') {
        throw new ConflictException('Username or Email already exists!');
      } else {
        throw new InternalServerErrorException(error);
      }
    }
  }

  async login(
    authCredentialsDto: AuthCredentialsDto,
  ): Promise<{ accessToken: string; refreshToken: string }> {
    try {
      const { username, password, email } = authCredentialsDto;
      let { id } = authCredentialsDto;
      const user = await this.dataSource.manager.findOne(User, {
        where: [{ email: email }, { username: username.toLowerCase() }],
      });
      id = user.id;
      if (user && (await bcrypt.compare(password, user.password))) {
        const payload: JwtPayload = { id };
        const [accessToken, refreshToken] = await Promise.all([
          this.jwtService.sign(payload, { secret: process.env.SECRET }),
          this.jwtService.sign(payload, {
            secret: process.env.REFRESH_SECRET,
          }),
        ]);
        return { accessToken, refreshToken };
      }
    } catch (error) {
      Logger.error(`ERROR IN LOGIN SERVICE! **** ${error}`);
    }
    throw new UnauthorizedException('Please check your login credentials!');
  }
}
