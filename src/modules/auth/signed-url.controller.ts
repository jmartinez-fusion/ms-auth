import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { SignedUrlService } from './signed-url.service';
import { AuthGuard } from '@nestjs/passport';
import { SignedUrlDto } from './dto/signed-url.dto';
import { ValidateUrlDto } from './dto/validate-url.dto';
import { AuthenticateByUrlSerializer } from '../../serializers/authenticate-by-url.serializer';

@Controller('signed-urls')
export class SignedUrlController {
  constructor(private readonly signedUrlService: SignedUrlService) {}

  @Post('generate')
  @UseGuards(AuthGuard())
  async generateUrl(@Body() signedUrlDto: SignedUrlDto) {
    const url = this.signedUrlService.generateUrl(
      signedUrlDto.userEmail,
      signedUrlDto.metadata,
    );
    return { url };
  }

  @Post('authenticate-by-url')
  async authenticateByUrl(@Body() validateUrlDto: ValidateUrlDto) {
    const userData =
      await this.signedUrlService.authenticateByUrl(validateUrlDto);

    const serializer = new AuthenticateByUrlSerializer();

    return serializer.respond(userData);
  }
}
