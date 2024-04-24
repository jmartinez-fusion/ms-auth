import { IsString } from 'class-validator';

export class UserProjectAssignmentDto {
  @IsString()
  userId: string;
}
