import { Injectable, UnauthorizedException } from '@nestjs/common';
import { RegisterAuthDto } from './dto/create-auth.dto';
// import { UpdateAuthDto } from './dto/update-auth.dto';
import { UserService } from 'src/user/user.service';
import bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { LoginAuthDto } from './dto/login-auth.dto';
import { PaginationDto } from 'src/admin/dto/pagination.dto';
// import { UpdateAuthDto } from './dto/update-auth.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  async create(registerAuthDto: RegisterAuthDto) {
    const isEmailExist = await this.userService.verifyEmail(
      registerAuthDto.email,
    );
    if (isEmailExist) {
      throw new UnauthorizedException('Email Already exist');
    }

    const hash = await bcrypt.hash(registerAuthDto.password, 10);

    const user = await this.userService.createUser({
      ...registerAuthDto,
      password: hash,
    });

    const payload = {
      sub: user._id,
      email: user.email,
      role: user.role,
      name: user.name,
    };
    const token = await this.jwtService.signAsync(payload);

    return { access_token: token };
  }

  async loginUser(loginDto: LoginAuthDto) {
    const user = await this.userService.loginUser(loginDto.email);

    if (!user) {
      throw new UnauthorizedException('Invalid email');
    }

    const isPasswordMatched = await bcrypt.compare(
      loginDto.password,
      user.password,
    );

    if (!isPasswordMatched) {
      throw new UnauthorizedException('Invalid Password');
    }

    const payload = {
      sub: user._id,
      email: user.email,
      role: user.role,
      name: user.name,
    };
    const token = await this.jwtService.signAsync(payload);

    return { access_token: token };
  }

  async findAll(dto: PaginationDto) {
    return await this.userService.findAll(dto);
  }

   async userData(req) {
    return await this.userService.userData(req);
  }

  async findOne(id: string) {
    return await this.userService.findOne(id);
  }
  // async update(id: number, updateAuthDto: UpdateAuthDto) {
  //   return await this.userService.update(id, updateAuthDto);
  // }

  async remove(id: string) {
    await this.userService.remove(id);
    return {
      message: 'User Deleted Successfully',
    };
  }
}
