import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AdminModule } from './admin/admin.module';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { JobsModule } from './jobs/jobs.module';
import { TechnicianModule } from './technician/technician.module';
import { PermissionsModule } from './permissions/permissions.module';

@Module({
  imports: [
    AdminModule,
    ConfigModule.forRoot(),
    MongooseModule.forRoot(process.env.MONGODB_URL as string),
    AuthModule,
    UserModule,
    JobsModule,
    TechnicianModule,
    PermissionsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
