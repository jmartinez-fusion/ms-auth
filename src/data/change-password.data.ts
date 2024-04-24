import { IsNotEmpty, IsString, Matches } from 'class-validator';

export class ChangePasswordData {
  @IsNotEmpty({ message: 'Credentials are not valid' })
  @IsString({ message: 'Credentials are not valid' })
  @Matches(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>\-_/])[A-Za-z\d[!@#$%^&*(),.?":{}|<>\-_/]{8,}$/,
    {
      message: 'Credentials are not valid',
    },
  )
  newPassword: string;

  @IsNotEmpty({ message: 'Credentials are not valid' })
  @IsString({ message: 'Credentials are not valid' })
  @Matches(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>\-_/])[A-Za-z\d[!@#$%^&*(),.?":{}|<>\-_/]{8,}$/,
    {
      message: 'Credentials are not valid',
    },
  )
  confirmPassword: string;
}
