import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type JobDocument = HydratedDocument<Job>;

export enum JobStatus {
  OPEN = 'OPEN',
  PENDING = 'PENDING',
  APPLIED = 'APPLIED',
  ACCEPTED = 'ACCEPTED',
  REJECTED = 'REJECTED',
  ASSIGNED = 'ASSIGNED',
  IN_PROGRESS = 'IN_PROGRESS',
  ON_HOLD = 'ON_HOLD',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
}

// Technician application embedded in job
@Schema({ timestamps: true })
export class JobApplication {
  @Prop({ type: Types.ObjectId, ref: 'Auth', required: true })
  technicianId!: Types.ObjectId;

  @Prop({ required: true })
  technicianName!: string;

  @Prop()
  coverNote?: string;

  @Prop({ default: 'PENDING' })
  status!: string; // PENDING | ACCEPTED | REJECTED
}

@Schema({ _id: false })
export class AuditEntry {
  @Prop({ required: true })
  action!: string;

  @Prop()
  oldValue?: string;

  @Prop()
  newValue?: string;

  @Prop()
  actorName!: string;

  @Prop({ default: () => new Date() })
  timestamp!: Date;
}

@Schema({ timestamps: true })
export class Job {
  @Prop({ type: Types.ObjectId, ref: 'Auth', required: true })
  clientId!: Types.ObjectId;

  @Prop({ required: true })
  clientName!: string;

  // Assigned technician (after admin picks)
  @Prop({ type: Types.ObjectId, ref: 'Auth' })
  technicianId?: Types.ObjectId;

  @Prop()
  technicianName?: string;

  @Prop({ required: true })
  title!: string;

  @Prop({ required: true })
  description!: string;

  @Prop({ required: true })
  location!: string;

  // @Prop({ required: true })
  preferredDate?: Date;

  @Prop({ default: false })
  isVerified!: boolean;

  @Prop({ enum: JobStatus, default: JobStatus.PENDING })
  status!: JobStatus;

  @Prop({ default: () => new Date() })
  timestamp!: Date;

  @Prop({ type: [JobApplication], default: [] })
  applications!: JobApplication[];

  // Full audit trail
  @Prop({ type: [AuditEntry], default: [] })
  auditLog!: AuditEntry[];

  @Prop({ default: false })
  isDeleted!: boolean;
}

export const JobSchema = SchemaFactory.createForClass(Job);
