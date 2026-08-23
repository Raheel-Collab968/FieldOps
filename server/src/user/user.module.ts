import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Auth, AuthSchema } from 'src/auth/schema/auth.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Auth.name, schema: AuthSchema }]),
  ],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}
