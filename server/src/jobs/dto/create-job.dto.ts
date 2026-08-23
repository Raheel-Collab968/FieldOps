import { IsBoolean, IsString } from 'class-validator';
import { JobStatus } from '../schema/job.schema';

export class CreateJobDto {
  @IsString()
  title!: string;

  @IsString()
  description!: string;

  @IsString()
  location!: string;

  @IsString()
  preferredDate?: Date;

  // @IsBoolean()
  // isActive!: boolean;

  @IsBoolean()
  status!: JobStatus;
}
