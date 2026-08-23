import {
  Controller,
  Get,
  Post,
  Body,
  UseGuards,
  Param,
  Query,
  // Patch,
  // Param,
  Delete,
  Req,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterAuthDto } from './dto/create-auth.dto';
import { AuthGuard } from './auth.guard';
import { LoginAuthDto } from './dto/login-auth.dto';
import { RolesGuard } from './roles.guard';
import { Roles } from './roles.decorator';
import { PaginationDto } from 'src/admin/dto/pagination.dto';
import { Role } from './user.type';
// import { UpdateAuthDto } from './dto/update-auth.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  async create(@Body() registerAuthDto: RegisterAuthDto) {
    const user = await this.authService.create(registerAuthDto);
    return user;
  }

  @Post('login')
  async login(@Body() loginDto: LoginAuthDto) {
    const token = await this.authService.loginUser(loginDto);
    return token;
  }

  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @Get('admin/all-users')
  findAll(@Query() dto: PaginationDto) {
    return this.authService.findAll(dto);
  }

  @UseGuards(AuthGuard)
  @Get('me')
  userData(@Req() req) {
    return this.authService.userData(req);
  }

  @UseGuards(AuthGuard, RolesGuard)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.authService.findOne(id);
  }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateAuthDto: UpdateAuthDto) {
  //   return this.authService.update(+id, updateAuthDto);
  // }

  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.authService.remove(id);
  }
}
