import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { TypeOrmModule } from '../typeorm/typeorm.module';
import { User } from 'src/modules/user/entities/user.entity';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { JwtStrategy } from 'src/strategies/jwt.strategy';
import { UserSession } from '../user/entities/user-session.entity';
import { UserModule } from '../user/user.module';
import { PermissionModule } from '../permission/permission.module';
import { MailModule } from '../mail/mail.module';
import { SignedUrlController } from './signed-url.controller';
import { SignedUrlService } from './signed-url.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, UserSession]),
    ConfigModule,
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        return {
          secret: configService.get('JWT_SECRET'),
          signOptions: {
            expiresIn: configService.get('JWT_EXP_IN'),
          },
        };
      },
    }),
    UserModule,
    PermissionModule,
    UserModule,
    MailModule,
  ],
  controllers: [AuthController, SignedUrlController],
  providers: [AuthService, JwtStrategy, SignedUrlService],
  exports: [
    TypeOrmModule,
    JwtStrategy,
    PassportModule,
    JwtModule,
    SignedUrlService,
  ],
})
export class AuthModule {}
