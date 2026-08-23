import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import {
  CreateTechnicianDto,
  UpdateJobStatusDto,
} from './dto/create-technician.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Job, JobStatus } from '../jobs/schema/job.schema';
import { Model, Types } from 'mongoose';
import { PaginationDto } from '../admin/dto/pagination.dto';
import { paginate } from '../admin/pagination-helper';

@Injectable()
export class TechnicianService {
  constructor(@InjectModel(Job.name) private jobModel: Model<Job>) {}

  async applyJob(
    id: string,
    dto: CreateTechnicianDto,
    technicianId: string,
    technicianName: string,
  ) {
    try {
      const job = await this.jobModel.findOne({
        _id: id,
        isDeleted: false,
        isVerified: true,
      });
      if (!job) throw new NotFoundException('Job not found');

      if (job.status === JobStatus.OPEN) {
        job.applications.push({
          technicianId: new Types.ObjectId(technicianId),
          technicianName,
          coverNote: dto?.coverNote,
          status: 'PENDING',
        });

        await job.save();

        return {
          message: 'Successfully Applied',
          job,
        };

      } else {
        throw new BadRequestException(
          'Job already assigned to another Technician',
        );
      }
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException(error);
    }
  }

  async getTUserJobById(jobId: string, userId: string) {
    try {
      const jobs = await this.jobModel
        .findOne({
          _id: jobId,
          technicianId: userId,
          isDeleted: false,
        })
        .select('applications')
        .sort({ createdAt: -1 });

      if (!jobs) throw new NotFoundException('Job not found');

      return {
        jobs,
        message: 'Job Fetched Successfully',
      };
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async getTAssignedJobById(jobId: string, userId: string) {
    try {
      const jobs = await this.jobModel
        .findOne({
          _id: jobId,
          technicianId: userId,
          status: JobStatus.ASSIGNED,
          isDeleted: false,
        })
        .select('applications')
        .sort({ createdAt: -1 });

      if (!jobs) throw new NotFoundException('Job not found');

      return {
        jobs,
        message: 'Job Fetched Successfully',
      };
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

   async dashboard(technicianId: string) {
      try {
        const [
          openJob,
          applied,
          acceptedJob,
          in_Progress,
          completed,
          recentVerifiedJobs,
          
        ] = await Promise.all([
          this.jobModel.countDocuments({ status: JobStatus.OPEN, isVerified: true, isDeleted: false }),
          this.jobModel.countDocuments({ 'applications.technicianId': technicianId, isDeleted: false }),
          this.jobModel.countDocuments({ 'applications.technicianId': technicianId, 'applications.status': 'ACCEPTED', isDeleted: false }),
          this.jobModel.countDocuments({ technicianId: technicianId, status: JobStatus.IN_PROGRESS, isDeleted: false }),
          this.jobModel.countDocuments({ technicianId: technicianId, status: JobStatus.COMPLETED, isDeleted: false }),
          
          this.jobModel.find({ status: JobStatus.OPEN, isVerified: true, isDeleted: false }).limit(5).lean(),
  
        ]);
  
        return {
          message: 'Dashboard Data fetched successfully',
          data: {
            counts: {
              openJob,
              applied,
              acceptedJob,
              in_Progress,
              completed
            },
            previews: {
              recentVerifiedJobs
            },
          },
        };
      } catch (error) {
        throw new InternalServerErrorException(error);
      }
    }

  async updateStatus(jobId: string, userId: string, dto: UpdateJobStatusDto) {
    try {
      const job = await this.jobModel.findOne({
        _id: jobId,
        'applications.technicianId': new Types.ObjectId(userId),
        isDeleted: false,
      });

      if (!job) throw new NotFoundException('Job not found');

      const oldStatus = job.status;
      job.status = dto.status as JobStatus;

      job.auditLog.push({
        action: dto.action || 'STATUS_UPDATE',
        oldValue: oldStatus,
        newValue: dto.status,
        actorName: userId,
        timestamp: new Date(),
      });

      await job.save();

      return {
        message: 'Job status updated successfully',
        job,
      };
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async getUserJob(userId: string, dto: PaginationDto) {
    const { page = 1, limit = 10, status, search } = dto;
    const skip = (page - 1) * limit;

    const filter: any = {
      'applications.technicianId': new Types.ObjectId(userId),
      isDeleted: false,
    };

    if (status) filter.status = status;

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
        .lean(),

      this.jobModel.countDocuments(filter),
    ]);

    return paginate(jobs, total, page, limit);
  }
}
