import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { ApiBody, ApiTags } from '@nestjs/swagger';
import { LoginUserData, ChangePasswordData } from '../../data';
import { ValidateCodeData } from 'src/data/validate-code.data';
import { UserSerializer } from 'src/serializers/user.serializer';
import { UserService } from '../user/user.service';
import { AuthGuard } from '@nestjs/passport';
import { RecoverPasswordData } from '../../data/recover-password.data';

@Controller('auth')
@ApiTags('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private userService: UserService,
  ) {}

  @UseGuards()
  @Post('login')
  @HttpCode(HttpStatus.CREATED)
  @ApiBody({ type: LoginUserData })
  async loginUser(@Body() loginUserData: LoginUserData) {
    await this.authService.login(loginUserData);
  }

  @UseGuards()
  @Post('forgot-password')
  @ApiBody({ type: RecoverPasswordData })
  @HttpCode(HttpStatus.OK)
  async forgotPassword(@Body() dto: RecoverPasswordData) {
    await this.authService.recoverPassword(dto);
  }

  @UseGuards(AuthGuard())
  @Get('me')
  async getMe(@Req() req: any) {
    const { user, permissions } = await this.userService.findMe(req.user.id);

    const serializer = new UserSerializer();
    const additionalData = {
      permissions,
    };

    return serializer.respond(user, additionalData);
  }

  @UseGuards()
  @Post('validate-code')
  @ApiBody({ type: ValidateCodeData })
  async validateCode(@Body() validateCodeData: ValidateCodeData) {
    const { user, permissions, accessToken } =
      await this.authService.validateCode(validateCodeData);
    const serializer = new UserSerializer();
    const additionalData = {
      permissions,
      accessToken,
    };

    return serializer.respond(user, additionalData);
  }

  @UseGuards(AuthGuard())
  @Post('change-password')
  @ApiBody({ type: ChangePasswordData })
  async changePassword(
    @Body() changePasswordData: ChangePasswordData,
    @Req() req: any,
  ) {
    const { user, permissions, accessToken } =
      await this.authService.changePassword(changePasswordData, req.user.id);
    const serializer = new UserSerializer();
    const additionalData = {
      permissions,
      accessToken,
    };

    return serializer.respond(user, additionalData);
  }

  @UseGuards(AuthGuard())
  @Post('logout')
  async logout(@Req() req: any) {
    return await this.authService.logout(req.headers.authorization);
  }
}
