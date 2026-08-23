import { Module } from '@nestjs/common';
import { AdminService } from './admin.service';
import { AdminController } from './admin.controller';
import { UserModule } from 'src/user/user.module';
import { ConfigModule } from '@nestjs/config';
import { JobsModule } from 'src/jobs/jobs.module';
import { MongooseModule } from '@nestjs/mongoose';
import { Job, JobSchema } from 'src/jobs/schema/job.schema';
import { AuthModule } from 'src/auth/auth.module';
import { Auth, AuthSchema } from 'src/auth/schema/auth.schema';

@Module({
  imports: [
    UserModule,
    JobsModule,
    AuthModule,
    ConfigModule.forRoot(),
    MongooseModule.forFeature([{ name: Job.name, schema: JobSchema }]),
    MongooseModule.forFeature([{ name: Auth.name, schema: AuthSchema }]),
  ],
  controllers: [AdminController],
  providers: [AdminService],
})
export class AdminModule {}
