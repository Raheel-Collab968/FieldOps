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
import { JobsService } from './jobs.service';
import { CreateJobDto } from './dto/create-job.dto';
import { UpdateJobDto } from './dto/update-job.dto';
import { AuthGuard } from '../auth/auth.guard';
import { Roles } from '../auth/roles.decorator';
import { RolesGuard } from '../auth/roles.guard';
import type { Request } from 'express';
import { PaginationDto } from '../admin/dto/pagination.dto';
import { Role } from '../auth/user.type';

interface AuthRequest extends Request {
  user: {
    sub: string;
    email: string;
    role: string;
    name: string;
  };
}

@Controller('')
export class JobsController {
  constructor(private readonly jobsService: JobsService) {}

  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.CLIENT)
  @Post('jobs/create')
  create(@Body() createJobDto: CreateJobDto, @Req() req) {
    return this.jobsService.create(createJobDto, req.user.sub, req.user.name);
  }

  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.CLIENT)
  @Get('client/dashboard-data')
  dashboard(@Req() req) {
    return this.jobsService.dashboard(req.user.sub);
  }

@UseGuards(AuthGuard, RolesGuard)
@Roles(Role.CLIENT)
@Get('jobs/client/my-all-jobs')
async getClientJob(
  @Req() req: AuthRequest,
  @Query() dto: PaginationDto,
) {
  return await this.jobsService.getClientJob(req.user.sub, dto);
}

  @UseGuards(AuthGuard)
  @Get('jobs')
  findAll(@Query() dto: PaginationDto) {
    return this.jobsService.findAll(dto);
  }

  @UseGuards(AuthGuard)
  @Get('jobs/open')
  getOpenJobs(@Query() dto: PaginationDto) {
    return this.jobsService.getOpenJobs(dto);
  }

  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.CLIENT)
  @Get('jobs/client/:id')
  getClientJobById(@Param('id') id: string, @Req() req) {
    const jobs = this.jobsService.getClientJobById(id, req.user.sub);
    return jobs;
  }

  @UseGuards(AuthGuard)
  @Get('jobs/:id')
  findOne(@Param('id') id: string) {
    return this.jobsService.findOne(id);
  }

  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.CLIENT)
  @Patch('jobs/update-status/:id')
  updateStatus(@Param('id') id: string, @Req() req, @Body() dto: UpdateJobDto) {
    return this.jobsService.updateStatus(id, dto, req.user.sub, req.user.name);
  }

  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.CLIENT)
  @Patch('jobs/update-job/:id')
  update(@Param('id') id: string, @Body() updateJobDto: UpdateJobDto) {
    return this.jobsService.update(id, updateJobDto);
  }

  @UseGuards(AuthGuard)
  @Roles(Role.CLIENT)
  @Delete('jobs/cancel-job/:id')
  cancelMyJob(@Param('id') id: string, @Req() req) {
    return this.jobsService.cancelMyJob(id, req.user.sub, req.user.name);
  }

  @UseGuards(AuthGuard)
  @Roles(Role.ADMIN)
  @Delete('jobs/delete/:id')
  deleteJob(@Param('id') id: string) {
    return this.jobsService.deleteJob(id);
  }

  // // TECHNICIAN Controllers

  // @UseGuards(AuthGuard, RolesGuard)
  // @Roles(Role.TECHNICIAN)
  // @Get('technician/:id')
  // getTUserJobById(@Param('id') id: string, @Req() req) {
  //   const jobs = this.jobsService.getTUserJobById(id, req.user.sub);
  //   return jobs;
  // }

  // @UseGuards(AuthGuard, RolesGuard)
  // @Roles(Role.TECHNICIAN)
  // @Get('technician/my-all-jobs/:id')
  // getUserJob(@Req() req) {
  //   const jobs = this.jobsService.getUserJob(req.user.sub);
  //   return jobs;
  // }
}
