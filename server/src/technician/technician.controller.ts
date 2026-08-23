import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Req,
  Query,
  UseGuards,
} from '@nestjs/common';
import { TechnicianService } from './technician.service';
import {
  CreateTechnicianDto,
  UpdateJobStatusDto,
} from './dto/create-technician.dto';
import { AuthGuard } from 'src/auth/auth.guard';
import { RolesGuard } from 'src/auth/roles.guard';
import { Role } from 'src/auth/user.type';
import { Roles } from 'src/auth/roles.decorator';
import { PaginationDto } from 'src/admin/dto/pagination.dto';

@Controller('technician')
export class TechnicianController {
  constructor(private readonly technicianService: TechnicianService) {}

  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.TECHNICIAN)
  @Post('apply/:id')
  applyJob(
    @Param('id') id: string,
    @Req() req,
    @Body() dto: CreateTechnicianDto,
  ) {
    return this.technicianService.applyJob(
      id,
      dto,
      req.user.sub,
      req.user.name,
    );
  }

  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.TECHNICIAN)
  @Get('dashboard-data')
  dashboard(@Req() req) {
    return this.technicianService.dashboard(req.user.sub);
  }

  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.TECHNICIAN)
  @Patch('update-job-status/:id')
  updateStatus(
    @Param('id') id: string,
    @Req() req,
    @Body() dto: UpdateJobStatusDto,
  ) {
    return this.technicianService.updateStatus(id, req.user.sub, dto);
  }

  // TECHNICIAN Controllers

  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.TECHNICIAN)
  @Get('assigned/:id')
  getTAssignedJobById(@Param('id') id: string, @Req() req) {
    const jobs = this.technicianService.getTAssignedJobById(id, req.user.sub);
    return jobs;
  }

  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.TECHNICIAN)
  @Get('applied')
  getTUserJobById(@Param('id') id: string, @Req() req) {
    const jobs = this.technicianService.getTUserJobById(id, req.user.sub);
    return jobs;
  }

  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.TECHNICIAN)
  @Get('my-all-jobs')
  async getUserJob(@Req() req, @Query() dto: PaginationDto) {
    return await this.technicianService.getUserJob(req.user.sub, dto);
  }
}
