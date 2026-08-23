import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
  Query,
} from '@nestjs/common';
import { AdminService } from './admin.service';
import { AuthGuard } from 'src/auth/auth.guard';
import { RolesGuard } from 'src/auth/roles.guard';
import { Roles } from 'src/auth/roles.decorator';
import { PaginationDto } from './dto/pagination.dto';
import { Role } from '../auth/user.type';

@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

@UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @Get('non-verified-job')
  nonVerifiedJob(@Query() dto: PaginationDto) {
    return this.adminService.nonVerifiedJob(dto);
  }

  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @Post('verify-job/:id')
  verifyJobStatus(@Param('id') id: string, @Req() req) {
    return this.adminService.verifyJobStatus(id);
  }

  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @Get('job-applicants/:id')
  getJobApplicants(@Param('id') id: string) {
    return this.adminService.getJobApplicants(id);
  }

  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @Get('assignable-jobs')
  getAssignableJobs(@Query() dto: PaginationDto) {
    return this.adminService.getAssignableJobs(dto);
  }

  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @Post('assign-job/:id')
  assignJob(
    @Param('id') id: string,
    @Body() body: { technicianId: string },
    @Req() req,
  ) {
    return this.adminService.assignJob(id, body.technicianId, req.user.name);
  }

  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @Get('dashboard-data')
  dashboard() {
    return this.adminService.dashboard();
  }

  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @Get('all-users')
  allUsers(@Query() dto: PaginationDto) {
    return this.adminService.allUsers(dto);
  }
}
