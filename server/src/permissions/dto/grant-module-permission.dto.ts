import { Type } from 'class-transformer';
import { IsMongoId, IsString, ValidateNested } from 'class-validator';
import { ModulePermissionsDto } from './module-permissions.dto';

export class GrantModulePermissionDto {
  @IsMongoId()
  userId!: string;

  @IsString()
  userRole!: string;

  @IsString()
  module!: string;

  @ValidateNested()
  @Type(() => ModulePermissionsDto)
  permissions!: ModulePermissionsDto;
}
