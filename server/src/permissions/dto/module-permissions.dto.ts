import { IsBoolean, IsOptional } from 'class-validator';

export class ModulePermissionsDto {
  @IsOptional()
  @IsBoolean()
  canCreate?: boolean;

  @IsOptional()
  @IsBoolean()
  canEdit?: boolean;

  @IsOptional()
  @IsBoolean()
  canDelete?: boolean;

  @IsOptional()
  @IsBoolean()
  canUpdate?: boolean;

  @IsOptional()
  @IsBoolean()
  canView?: boolean;
}
