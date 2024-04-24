import { Body, Controller, Post } from '@nestjs/common';
import { NotificationService } from './notification.service';
import { NotificationDto } from './dto/notification.dto';

@Controller('notifications')
export class NotificationController {
  constructor(private readonly notifications: NotificationService) {}

  @Post('send-survey')
  sendSurvey(@Body() dto: NotificationDto) {
    this.notifications.sendSurvey(dto);
  }
}
