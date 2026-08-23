import {
  IsBoolean,
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsString,
  MinLength,
} from 'class-validator';
import { Role } from '../user.type';

export class RegisterAuthDto {
  @IsString()
  @IsNotEmpty({ message: 'Name is required' })
  name!: string;

  @IsEmail({}, { message: 'Please provide a valid email' })
  email!: string;

  @IsString()
  @MinLength(8, { message: 'Password must be at least 6 characters' })
  password!: string;

  @IsEnum(Role, { message: 'Role must be TECHNICIAN, or CLIENT' })
  role!: Role;

  @IsNumber()
  phone?: number;

  @IsBoolean()
  isActive?: boolean;
}
