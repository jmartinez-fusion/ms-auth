import { IsNotEmpty, IsString } from 'class-validator';

export class LoginUserData {
  @IsNotEmpty({ message: 'Credentials are not valid' })
  @IsString({ message: 'Credentials are not valid' })
  email: string;

  @IsNotEmpty({ message: 'Credentials are not valid' })
  @IsString({ message: 'Credentials are not valid' })
  password: string;
}
