import { Module } from '@nestjs/common';
import { PermissionService } from './permission.service';
import { PermissionController } from './permission.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Permission } from './entities/permission.entity';
import { PassportModule } from '@nestjs/passport';

@Module({
  imports: [
    TypeOrmModule.forFeature([Permission]),
    PassportModule.register({ defaultStrategy: 'jwt' }),
  ],
  controllers: [PermissionController],
  providers: [PermissionService],
})
export class PermissionModule {}
