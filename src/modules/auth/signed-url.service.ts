import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import * as jwt from 'jsonwebtoken';
import { AuthService } from './auth.service';
import { ValidateUrlDto } from './dto/validate-url.dto';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class SignedUrlService {
  constructor(
    @Inject(AuthService)
    private readonly authService: AuthService,
    private readonly configService: ConfigService,
  ) {}

  private secretKey = this.configService.get('SIGNED_URL_SECRET');

  generateUrl(email: string, metadata: object) {
    metadata['userEmail'] = email;
    const payload = {
      metadata,
    };

    const token = jwt.sign(payload, this.secretKey, {
      expiresIn: this.configService.get('SIGNED_URL_EXPIRATION'),
    });

    return `${this.configService.get(
      'SIGNED_URL_REDIRECT_URI',
    )}?signature=${token}`;
  }

  async authenticateByUrl(validateUrlDto: ValidateUrlDto) {
    try {
      const urlParts = new URL(validateUrlDto.url);
      const data = urlParts.searchParams;
      const signature = data.get('signature');

      const tokenData = jwt.verify(signature, this.secretKey);

      const user = await this.authService.getUserByEmail(
        tokenData['metadata']['userEmail'],
      );

      const authenticatedUser = await this.authService.authenticate(user);

      return {
        userData: authenticatedUser,
        metadata: tokenData['metadata'],
      };
    } catch (error) {
      throw new UnauthorizedException();
    }
  }
}
