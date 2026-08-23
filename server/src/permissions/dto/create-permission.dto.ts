import { IsMongoId, IsObject, IsOptional, IsString } from 'class-validator';
import { ModulePermissionsDto } from './module-permissions.dto';

export class CreatePermissionDto {
  @IsMongoId()
  userId!: string;

  @IsString()
  userRole!: string;

  @IsOptional()
  @IsObject()
  permissions?: Record<string, ModulePermissionsDto>;
}
