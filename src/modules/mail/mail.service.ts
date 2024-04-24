import { MailerService } from '@nestjs-modules/mailer';
import { Injectable, Logger } from '@nestjs/common';
import * as fs from 'fs';
import Handlebars from 'handlebars';
import { User } from '../user/entities/user.entity';
import { ConfigService } from '@nestjs/config';
import { ApiProjectService } from '../../api-service/api-project.service';

@Injectable()
export class MailService {
  private readonly templatePath = `${process.cwd()}/dist/templates`;

  constructor(
    private mailerService: MailerService,
    private apiProjectService: ApiProjectService,
    private readonly configService: ConfigService,
  ) {}

  public async createMetaUser(user: User, code: string) {
    const templateFile = `${this.templatePath}/create-user-meta.hbs`;
    const emailEncode = encodeURIComponent(user.email);
    const parameters = {
      name: user.fullName,
      logo: `${this.configService.get('META_SPA_URI')}/assets/logo.png`,
      link: `${this.configService.get(
        'META_SPA_URI',
      )}/auth/validate-session?email=${emailEncode}&action=creation`,
      code,
    };

    const template = this.getTemplate(templateFile, parameters);
    this.sendEmail(
      this.configService.get('MAIL_FROM_ADDRESS'),
      user.email,
      'Welcome to Meta',
      template,
    );
  }

  public async authenticateUserByCode(user: User, code: string) {
    const templateFile = `${this.templatePath}/authenticate-by-code.hbs`;
    const parameters = {
      name: user.fullName,
      logo: `${this.configService.get('META_SPA_URI')}/assets/logo.png`,
      code,
    };

    const template = this.getTemplate(templateFile, parameters);
    this.sendEmail(
      this.configService.get('MAIL_FROM_ADDRESS'),
      user.email,
      'Your Authentication Code is Ready!',
      template,
    );
  }

  public async surveyTopic(user: User, signedUrl: string, config: any) {
    const transport = {
      host: config.host,
      port: config.port,
      secure: true,
      auth: {
        user: config.username,
        pass: config.password,
      },
    };
    const mailer = new MailerService({ transport }, null);

    const templateFile = `${this.templatePath}/survey-topic.hbs`;
    const parameters = {
      name: user.fullName,
      logo: `${this.configService.get('META_SPA_URI')}/assets/logo.png`,
      link: signedUrl,
    };

    const template = this.getTemplate(templateFile, parameters);
    try {
      await mailer.sendMail({
        to: user.email,
        from: config.senderEmailAddress,
        subject: 'Survey process',
        html: template,
      });
    } catch (error) {
      Logger.error(error);
    }
  }

  public async createClientUser(user: User, logo: string, code: string) {
    const templateFile = `${this.templatePath}/create-user-client.hbs`;
    const emailEncode = encodeURIComponent(user.email);
    const parameters = {
      name: user.fullName,
      logo: `${this.configService.get('META_SPA_URI')}/assets/logo.png`,
      link: `${this.configService.get(
        'META_SPA_URI',
      )}/auth/validate-session?email=${emailEncode}&action=creation`,
      code,
    };

    const template = this.getTemplate(templateFile, parameters);
    this.sendEmail(
      this.configService.get('MAIL_FROM_ADDRESS'),
      user.email,
      'Welcome to Meta',
      template,
    );
  }

  public async recoverPassword(user: User, code: string) {
    const templateFile = `${this.templatePath}/recover-password.hbs`;
    const emailEncode = encodeURIComponent(user.email);
    const parameters = {
      name: user.fullName,
      logo: `${this.configService.get('META_SPA_URI')}/assets/logo.png`,
      link: `${this.configService.get(
        'META_SPA_URI',
      )}/auth/validate-session?email=${emailEncode}&action=change`,
      code,
    };

    const template = this.getTemplate(templateFile, parameters);
    this.sendEmail(
      this.configService.get('MAIL_FROM_ADDRESS'),
      user.email,
      'Recover Password',
      template,
    );
  }

  private sendEmail(
    from: string,
    to: string,
    subject: string,
    template: string,
  ): void {
    try {
      this.mailerService.sendMail({
        to,
        from,
        subject,
        html: template,
      });
    } catch (error) {
      Logger.error(error);
    }
  }

  private getTemplate(templateFile: string, templateParameters: any): any {
    const source = fs.readFileSync(templateFile);
    const template = Handlebars.compile(source.toString());
    return template(templateParameters);
  }

  async createCustomTransporter(projectId: string) {
    const config = await this.apiProjectService.configSettingProject(projectId);
    if (!config) return null;
    return config;
  }
}
