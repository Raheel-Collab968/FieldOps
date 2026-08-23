import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Role } from '../user.type';
import { Document } from 'mongoose';

export type AuthDocument = Auth & Document;

@Schema()
export class Auth {
  @Prop({ required: true })
  name!: string;

  @Prop({ required: true })
  email!: string;

  @Prop({ required: true })
  password!: string;

  @Prop({ default: Role.TECHNICIAN, required: true })
  role!: Role;

  @Prop({ required: true })
  phone?: number;

  @Prop({ default: true })
  isActive?: boolean;
}

export const AuthSchema = SchemaFactory.createForClass(Auth);
