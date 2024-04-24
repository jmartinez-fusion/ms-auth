import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { MetaUserController } from './meta-user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { UserActivationCode } from './entities/user-activation-code.entity';
import { MailModule } from '../mail/mail.module';
import { PassportModule } from '@nestjs/passport';
import { ClientUserController } from './client-user.controller';
import { ApiServiceModule } from '../../api-service/api-service.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, UserActivationCode]),
    MailModule,
    PassportModule.register({ defaultStrategy: 'jwt' }),
    ApiServiceModule,
  ],
  controllers: [MetaUserController, ClientUserController],
  providers: [UserService],
  exports: [UserService, TypeOrmModule],
})
export class UserModule {}
