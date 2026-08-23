import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { PermissionsService } from './permissions.service';
import { CreatePermissionDto } from './dto/create-permission.dto';
import { UpdatePermissionDto } from './dto/update-permission.dto';
import { GrantModulePermissionDto } from './dto/grant-module-permission.dto';
import { CheckPermissionDto } from './dto/check-permission.dto';
import { AuthGuard } from '../auth/auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import type { Request } from 'express';
import { Role } from '../auth/user.type';

interface AuthRequest extends Request {
  user: {
    sub: string;
    email: string;
    role: string;
    name: string;
  };
}

@Controller('permissions')
export class PermissionsController {
  constructor(private readonly permissionsService: PermissionsService) {}

  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @Post('create')
  create(@Body() createPermissionDto: CreatePermissionDto) {
    return this.permissionsService.create(createPermissionDto);
  }

  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @Get()
  findAll() {
    return this.permissionsService.findAll();
  }

  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @Get('user/:userId')
  findByUser(@Param('userId') userId: string) {
    return this.permissionsService.findByUser(userId);
  }

  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.permissionsService.findOne(id);
  }

  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @Post('grant')
  grantModule(@Body() grantModulePermissionDto: GrantModulePermissionDto) {
    return this.permissionsService.grantModule(grantModulePermissionDto);
  }

  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @Delete('revoke/:userId/:module')
  revokeModule(
    @Param('userId') userId: string,
    @Param('module') module: string,
  ) {
    return this.permissionsService.revokeModule(userId, module);
  }

  @UseGuards(AuthGuard)
  @Post('check')
  check(
    @Body() checkPermissionDto: CheckPermissionDto,
    @Req() req: AuthRequest,
  ) {
    return this.permissionsService.check(
      req.user.sub,
      checkPermissionDto.module,
      checkPermissionDto.action,
    );
  }

  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updatePermissionDto: UpdatePermissionDto,
  ) {
    return this.permissionsService.update(id, updatePermissionDto);
  }

  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.permissionsService.remove(id);
  }
}
