import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ApiProjectService } from './api-project.service';

@Module({
  imports: [
    HttpModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async () => ({
        timeout: 5000,
        maxRedirects: 5,
        headers: {
          'Response-Content-Type': 'json',
        },
      }),
      inject: [ConfigService],
    }),
  ],
  providers: [ApiProjectService],
  exports: [ApiProjectService],
})
export class ApiServiceModule {}
