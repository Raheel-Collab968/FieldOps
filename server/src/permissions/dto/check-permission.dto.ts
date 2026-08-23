import { IsString } from 'class-validator';

export class CheckPermissionDto {
  @IsString()
  module!: string;

  @IsString()
  action!: string;
}
