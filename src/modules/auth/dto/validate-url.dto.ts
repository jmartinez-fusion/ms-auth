import { IsString } from 'class-validator';

export class ValidateUrlDto {
  @IsString()
  url: string;
}
