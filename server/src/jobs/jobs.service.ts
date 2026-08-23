import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
  UseGuards,
} from '@nestjs/common';
import { CreateJobDto } from './dto/create-job.dto';
import { UpdateJobDto } from './dto/update-job.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Job, JobStatus } from './schema/job.schema';
import { AuthGuard } from '../auth/auth.guard';
import { Roles } from '../auth/roles.decorator';
import { Role } from '../auth/user.type';
import { RolesGuard } from '../auth/roles.guard';
import { PaginationDto } from '../admin/dto/pagination.dto';
import { paginate } from '../admin/pagination-helper';

@Injectable()
export class JobsService {
  constructor(@InjectModel(Job.name) private jobModel: Model<Job>) {}

  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.CLIENT)
  async create(
    createJobDto: CreateJobDto,
    clientId: string,
    clientName: string,
  ) {
    try {
      const job = await this.jobModel.create({
        ...createJobDto,
        clientId,
        clientName,
        status: JobStatus.PENDING,
      });
      return job;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

 async dashboard(clientId: string) {
    try {
      const [
        total,
        pendingJob,
        acceptedJob,
        in_Progress,
        completed,
        recentVerifiedJobs,
        recentNotVerifiedJobs
      ] = await Promise.all([
        this.jobModel.countDocuments(),
        this.jobModel.countDocuments({ clientId: clientId, status: JobStatus.PENDING }),
        this.jobModel.countDocuments({ clientId: clientId, status: JobStatus.ACCEPTED }),
        this.jobModel.countDocuments({ clientId: clientId, status: JobStatus.IN_PROGRESS }),
        this.jobModel.countDocuments({ clientId: clientId, status: JobStatus.COMPLETED }),
        
        this.jobModel.find({ clientId: clientId, isVerified: true }).limit(5).lean(),
        this.jobModel.find({ clientId: clientId, isVerified: false }).limit(5).lean(),

      ]);

      return {
        message: 'Dashboard Data fetched successfully',
        data: {
          counts: {
            total,
            pendingJob,
            acceptedJob,
            in_Progress,
            completed
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
  // ── CLIENT: Get my jobs with pagination ──────────────
  async getClientJob(clientId: string, dto: PaginationDto) {
    const { page = 1, limit = 10, search, status } = dto;

    const skip = (page - 1) * limit;

    // const check = await this.jobModel.find({ clientId });
    
    const filter: any = {
      clientId,
      isDeleted: false,
    };

    if (status) filter.status = status;

    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { location: { $regex: search, $options: 'i' } },
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

  async getClientJobById(jobId: string, clientId: string) {
    const jobs = await this.jobModel
      .findOne({
        _id: jobId,
        clientId,
        isDeleted: false,
      })
      .select('applications')
      .sort({ createdAt: -1 });

    if (!jobs) throw new NotFoundException('Job not found');

    return jobs;
  }

  //   async getUserJob(userId: string) {
  //     const jobs = await this.jobModel.find({
  //       userId, isDeleted: false
  //     }).select('applications').sort({ createdAt: -1 });

  //   if (!jobs) {
  //   throw new NotFoundException('Job not found');
  // }

  //     return {
  //       total: jobs.length,
  //       jobs,
  //     };
  //   }

  // async getTUserJobById(jobId: string, userId: string) {
  //   const jobs = await this.jobModel.findOne({
  //     _id: jobId,
  //     userId,
  //     isDeleted: false,
  //   }).select('applications').sort({ createdAt: -1 });

  // if (!jobs) throw new NotFoundException('Job not found');

  //   return jobs;
  // }

  async updateStatus(
    id: string,
    dto: UpdateJobDto,
    clientId: string,
    clientName: string,
  ) {
    try {
      const job = await this.jobModel.findOne({
        _id: id,
        clientId,
        isDeleted: false,
      });
      if (!job) throw new NotFoundException('Job Not Found');

      Object.assign(job, dto);

      job.auditLog.push({
        action: 'JOB_UPDATED',
        actorName: clientName,
        timestamp: new Date(),
      });

      await job.save();

      return {
        message: 'Job Updated Successfully',
        job,
      };
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  async findAll(dto: PaginationDto) {
    try {
      const {
        page = 1,
        limit = 10,
        search,
        status,
        sortBy = 'createdAt',
        sortOrder = 'desc',
      } = dto;

      const skip = (page - 1) * limit;

      const filter: any = { isDeleted: false };

      if (status) {
        filter.status = status;
      }

      if (search) {
        filter.$or = [
          { title: { $regex: search, $options: 'i' } },
          { description: { $regex: search, $options: 'i' } },
          { location: { $regex: search, $options: 'i' } },
          { clientName: { $regex: search, $options: 'i' } },
        ];
      }

      const sort: any = {};
      sort[sortBy] = sortOrder === 'asc' ? 1 : -1;

      const [jobs, total] = await Promise.all([
        this.jobModel
          .find(filter)
          .sort(sort)
          .skip(skip)
          .limit(limit)
          .select('-auditLog')
          .lean(),

        this.jobModel.countDocuments(filter),
      ]);

      return paginate(jobs, total, page, limit);
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  // ── TECHNICIAN: Get open jobs with pagination ────────
  async getOpenJobs(dto: PaginationDto) {
    const { page = 1, limit = 10, search } = dto;
    const skip = (page - 1) * limit;

    const filter: any = {
      status: JobStatus.OPEN,
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

  async findOne(id: string) {
    try {
      const job = await this.jobModel.findById(id);
      return job;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  async update(id: string, updateJobDto: UpdateJobDto) {
    try {
      const pendingJob = await this.jobModel.findOne({ _id: id, status: JobStatus.PENDING });
      if (!pendingJob) {
        throw new NotFoundException('Pending job not found');
      }

      await this.jobModel.findByIdAndUpdate(id, updateJobDto, {
        new: true,
      });

      return {
        message: "Job Updated Successfully"
      };

    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  async deleteJob(id: string) {
    try {
      await this.jobModel.findByIdAndDelete(id);
      return {
        message: "Job Deleted Successfully"
      };
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  async cancelMyJob(jobId: string, clientId: string, clientName: string) {
    const job = await this.jobModel.findOne({
      _id: jobId,
      clientId,
      isDeleted: false,
    });

    if (!job) throw new NotFoundException('Job not found');

    // Cannot cancel if already in progress or done
    const blocked = [
      JobStatus.ASSIGNED,
      JobStatus.IN_PROGRESS,
      JobStatus.COMPLETED,
    ];

    if (blocked.includes(job.status)) {
      throw new ForbiddenException(
        `Cannot cancel. Job is already ${job.status}. Contact admin for help.`,
      );
    }

    job.status = JobStatus.CANCELLED;
    job.isDeleted = true;

    job.auditLog.push({
      action: 'JOB_CANCELLED',
      oldValue: job.status,
      newValue: 'CANCELLED',
      actorName: clientName,
      timestamp: new Date(),
    });

    await job.save();

    return { message: 'Job cancelled successfully.' };
  }
}
