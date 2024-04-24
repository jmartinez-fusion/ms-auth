import {
  Inject,
  Injectable,
  UnauthorizedException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Raw } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { LoginUserData } from 'src/data/login-user.data';
import { JwtPayload } from 'src/contracts';
import { User, UserStatus } from '../user/entities/user.entity';
import { ValidateCodeData } from 'src/data/validate-code.data';
import { ChangePasswordData } from 'src/data';
import { UserService } from '../user/user.service';
import { MailService } from '../mail/mail.service';
import { RecoverPasswordData } from '../../data/recover-password.data';
import { UserActivationCode } from '../user/entities/user-activation-code.entity';
import { ConfigService } from '@nestjs/config';
import { UserSession } from '../user/entities/user-session.entity';
import * as ms from 'ms';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(UserActivationCode)
    private readonly userActivationCodeRepository: Repository<UserActivationCode>,
    @InjectRepository(UserSession)
    private readonly userSessionRepository: Repository<UserSession>,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    @Inject(UserService)
    private readonly userService: UserService,
    @Inject(MailService)
    private readonly mailService: MailService,
  ) {}

  async recoverPassword(recoverPasswordDto: RecoverPasswordData) {
    const { email } = recoverPasswordDto;
    const user = await this.userRepository.findOne({
      where: { email, status: UserStatus.Active },
    });

    if (user) {
      const code = await this.userService.addActivationCode(user);
      this.mailService.recoverPassword(user, code);
    }
  }

  async login(loginUserDto: LoginUserData) {
    const { password, email } = loginUserDto;
    const user = await this.getUserByEmail(email);

    if (!user || user.status == UserStatus.Inactive) {
      throw new UnauthorizedException('Credentials are not valid');
    }

    if (!bcrypt.compareSync(password, user.password)) {
      throw new UnauthorizedException('Credentials are not valid');
    }

    const code = await this.userService.addActivationCode(user);

    await this.mailService.authenticateUserByCode(user, code);
  }

  async getUserByEmail(email: string) {
    const user = await this.userRepository.findOne({
      where: { email },
      select: {
        id: true,
        email: true,
        fullName: true,
        password: true,
        type: true,
        isAdmin: true,
        status: true,
      },
      relations: ['roles', 'roles.permissions'],
    });

    return user;
  }

  async authenticate(user: User) {
    const session = await this.generateSession(user);
    const accessToken = this.jwtService.sign({ sub: user.id, jti: session.id });

    delete user.password;
    const permissions = user.roles
      ? user.roles.flatMap((role) => role.permissions)
      : [];

    return {
      user,
      accessToken,
      permissions,
    };
  }

  getJwtToken(payload: JwtPayload): string {
    const token = this.jwtService.sign(payload);
    return token;
  }

  async validateCode(validateCodeDto: ValidateCodeData) {
    const { code, email } = validateCodeDto;
    const user = await this.userRepository.findOne({
      where: { email, status: UserStatus.Active },
      relations: ['roles', 'roles.permissions'],
    });

    if (!user) {
      throw new BadRequestException('Credentials are not valid');
    }

    const existingCode = await this.userActivationCodeRepository.findOne({
      where: {
        code,
        user: { id: user.id },
        expirationDate: Raw((alias: any) => `${alias} > NOW()`),
      },
    });

    if (!existingCode) {
      throw new BadRequestException('Invalid code');
    }

    const session = await this.generateSession(user);
    const accessToken = this.jwtService.sign({
      sub: user.id,
      expiresIn: this.configService.get('JWT_CODE_VALIDATION_EXP_IN'),
      jti: session.id,
    });
    const permissions = user.roles.flatMap((role) => role.permissions);

    await this.userActivationCodeRepository.update(existingCode.id, {
      expirationDate: new Date(),
    });

    return {
      user,
      accessToken,
      permissions,
    };
  }

  async changePassword(changePasswordData: ChangePasswordData, userId: string) {
    if (changePasswordData.newPassword !== changePasswordData.confirmPassword) {
      throw new UnauthorizedException('New passwords do not match');
    }

    const hashedPassword = bcrypt.hashSync(changePasswordData.newPassword, 10);

    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new UnauthorizedException('User not found');
    }
    await this.userRepository.update(userId, { password: hashedPassword });

    return await this.authenticate(user);
  }

  async logout(token: string) {
    const bearerToken = token.split(' ')[1];
    const decodedToken: any = this.jwtService.decode(bearerToken);

    if (!decodedToken || !decodedToken.jti) {
      throw new UnauthorizedException('Invalid token');
    }

    const jti = decodedToken.jti;

    const session = await this.userSessionRepository.findOne({
      where: { id: jti },
    });

    if (!session) {
      throw new UnauthorizedException('Session not found');
    }

    await this.userSessionRepository.softRemove(session);
  }

  private async generateSession(user: User): Promise<UserSession> {
    const session = new UserSession();
    session.expiresAt = new Date(
      Date.now() + ms(this.configService.get('JWT_EXP_IN')),
    );

    session.user = user;
    await this.userSessionRepository.save(session);

    return session;
  }
}
