import { Module } from '@nestjs/common';
import { TechnicianService } from './technician.service';
import { TechnicianController } from './technician.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Job, JobSchema } from '../jobs/schema/job.schema';

@Module({
  imports: [MongooseModule.forFeature([{ name: Job.name, schema: JobSchema }])],
  controllers: [TechnicianController],
  providers: [TechnicianService],
})
export class TechnicianModule {}
