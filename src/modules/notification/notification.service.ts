import { Injectable, Logger } from '@nestjs/common';
import { MailService } from '../mail/mail.service';
import { SignedUrlService } from '../auth/signed-url.service';
import { NotificationDto } from './dto/notification.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../user/entities/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class NotificationService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private mailService: MailService,
    private signedUrlService: SignedUrlService,
  ) {}

  async sendSurvey(data: NotificationDto) {
    const { projectId } = JSON.parse(JSON.stringify(data.metadata));
    const configSetting =
      await this.mailService.createCustomTransporter(projectId);
    if (!configSetting) {
      Logger.error(`Project configuration not found`);
      return null;
    }

    for (const userId of data.userIds) {
      const user = await this.userRepository.findOneOrFail({
        where: { id: userId },
      });
      const signedUrl = this.signedUrlService.generateUrl(
        user.email,
        data.metadata,
      );

      this.mailService.surveyTopic(user, signedUrl, configSetting);
    }
  }
}
