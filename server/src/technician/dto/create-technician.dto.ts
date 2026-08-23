import { IsEnum, IsString } from 'class-validator';

export enum Status {
  PENDING = 'PENDING',
  ACCEPTED = 'ACCEPTED',
  REJECTED = 'REJECTED',
}

export class CreateTechnicianDto {
  @IsString()
  technicianName?: string;

  @IsString()
  coverNote?: string;

  @IsEnum(Status)
  status?: Status;
}

export class UpdateJobStatusDto {
  @IsString()
  status!: string;

  @IsString()
  action?: string;
}
