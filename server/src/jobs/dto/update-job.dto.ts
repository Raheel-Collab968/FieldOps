import { PartialType } from '@nestjs/mapped-types';
import { CreateJobDto } from './create-job.dto';
import { IsBoolean, IsString } from 'class-validator';
import { JobStatus } from '../schema/job.schema';

export class UpdateJobDto extends PartialType(CreateJobDto) {
  @IsString()
  title!: string;

  @IsString()
  description!: string;

  @IsString()
  location!: string;

  @IsString()
  preferredDate?: Date;

  @IsBoolean()
  isActive!: boolean;

  @IsBoolean()
  status!: JobStatus;
}
