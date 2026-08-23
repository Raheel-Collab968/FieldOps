import { Injectable, InternalServerErrorException, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Job, JobStatus } from 'src/jobs/schema/job.schema';
import { Model, Types } from 'mongoose';

import { Roles } from 'src/auth/roles.decorator';
import { Auth } from 'src/auth/schema/auth.schema';
import { PaginationDto } from './dto/pagination.dto';
import { paginate } from './pagination-helper';
import { Role } from 'src/auth/user.type';

@Injectable()
export class AdminService {
  constructor(
    @InjectModel(Job.name) private readonly jobModel: Model<Job>,
    @InjectModel(Auth.name) private readonly authModel: Model<Auth>,
  ) {}

 async nonVerifiedJob(dto: PaginationDto) {
    const { page = 1, limit = 10, search } = dto;
    const skip = (page - 1) * limit;

    const filter: any = {
      isVerified: false,
      isDeleted: false,
    };

    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { location: { $regex: search, $options: 'i' } },
        { jobType: { $regex: search, $options: 'i' } },
      ];
    }

    const [jobs, total] = await Promise.all([
      this.jobModel
        .find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .select('-applications -auditLog')
        .lean(),

      this.jobModel.countDocuments(filter),
    ]);

    return paginate(jobs, total, page, limit);
  }

  async verifyJobStatus(id: string) {
    try {
      const job = await this.jobModel.findOne({ _id: id, isVerified: false });
      if (!job) throw new NotFoundException('Job Not Found');

      job.isVerified = true;
      job.status = JobStatus.OPEN;

      await job.save();

      return { message: 'Job Verify Successfully' };
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  async dashboard() {
    try {
      const [
        verifiedJob,
        notVerifiedJob,
        clientCount,
        technicianCount,
        recentVerifiedJobs,
        recentNotVerifiedJobs,
      ] = await Promise.all([
        this.jobModel.countDocuments({ isVerified: true }),
        this.jobModel.countDocuments({ isVerified: false }),
        this.authModel.countDocuments({ role: Role.CLIENT }),
        this.authModel.countDocuments({ role: Role.TECHNICIAN }),
        
        this.jobModel.find({ isVerified: true }).limit(5).lean(),
        this.jobModel.find({ isVerified: false }).limit(5).lean(),

      ]);

      return {
        message: 'Dashboard Data fetched successfully',
        data: {
          counts: {
            verifiedJob,
            notVerifiedJob,
            clientCount,
            technicianCount
          },
          previews: {
            recentVerifiedJobs,
            recentNotVerifiedJobs
          },
        },
      };
    } catch (error) {
      console.log(error);
    }
  }

  async getAssignableJobs(dto: PaginationDto) {
    const { page = 1, limit = 10, search } = dto;
    const skip = (page - 1) * limit;

    const filter: any = {
      status: JobStatus.OPEN,
      isVerified: true,
      isDeleted: false,
    };

    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { location: { $regex: search, $options: 'i' } },
      ];
    }

    const [jobs, total] = await Promise.all([
      this.jobModel
        .find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .select('-auditLog')
        .lean(),

      this.jobModel.countDocuments(filter),
    ]);

    return paginate(jobs, total, page, limit);
  }

  async getJobApplicants(jobId: string) {
    try {
      const job = await this.jobModel.findOne({
        _id: jobId,
        isDeleted: false,
      }).select('title description location status applications clientName');

      if (!job) throw new NotFoundException('Job not found');

      return {
        message: 'Job applicants fetched successfully',
        job,
      };
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async assignJob(jobId: string, technicianId: string, adminName: string) {
    try {
      const job = await this.jobModel.findOne({
        _id: jobId,
        isVerified: true,
        isDeleted: false,
      });

      if (!job) throw new NotFoundException('Job not found');

      if (job.status !== JobStatus.OPEN) {
        throw new BadRequestException('Job is not open for assignment');
      }

      const application = job.applications.find(
        (app) => app.technicianId.toString() === technicianId,
      );

      if (!application) {
        throw new BadRequestException('Technician has not applied to this job');
      }

      job.technicianId = new Types.ObjectId(technicianId);
      job.technicianName = application.technicianName;
      job.status = JobStatus.ASSIGNED;

      job.applications.forEach((app) => {
        if (app.technicianId.toString() === technicianId) {
          app.status = 'ACCEPTED';
        } else {
          app.status = 'REJECTED';
        }
      });

      job.auditLog.push({
        action: 'ASSIGN_TECHNICIAN',
        oldValue: 'OPEN',
        newValue: `ASSIGNED to ${application.technicianName}`,
        actorName: adminName,
        timestamp: new Date(),
      });

      await job.save();

      return {
        message: `Job assigned to ${application.technicianName} successfully`,
        job,
      };
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async allUsers(dto: PaginationDto) {
    try {
      const page = Number(dto.page) || 1;
      const limit = Number(dto.limit) || 10;
      const { search, status } = dto;

      const skip = (page - 1) * limit;

      const filter: Record<string, any> = { isActive: true };

      if (status) {
        filter.status = status;
      }

      if (search) {
        const escapedSearch = search.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        filter.$or = [
          { name: { $regex: escapedSearch, $options: 'i' } },
          { email: { $regex: escapedSearch, $options: 'i' } },
          { phone: { $regex: escapedSearch, $options: 'i' } },
        ];
      }

      const [users, total] = await Promise.all([
        this.authModel
          .find(filter)
          .sort({ createdAt: -1 })
          .skip(skip)
          .limit(limit)
          .select('-password -refreshToken -auditLog -__v')
          .lean(),

        this.authModel.countDocuments(filter),
      ]);

      return paginate(users, total, page, limit);

    } catch (error) {
      throw new InternalServerErrorException('Error retrieving user list');
    }
  }
}
